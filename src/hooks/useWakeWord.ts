import { useState, useEffect, useRef, useCallback } from 'react';

export type MicState = 'idle' | 'listening' | 'processing' | 'speaking';

interface UseWakeWordOptions {
  onWakeWordDetected?: (capturedPrompt: string) => void;
  onTranscriptUpdate?: (interimTranscript: string) => void;
  onSpeechEnd?: (finalPrompt: string) => void;
  silenceTimeoutMs?: number;
}

export function useWakeWord({
  onWakeWordDetected,
  onTranscriptUpdate,
  onSpeechEnd,
  silenceTimeoutMs = 1800
}: UseWakeWordOptions = {}) {
  const [micState, setMicState] = useState<MicState>('idle');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isWakeActive, setIsWakeActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [wakeMatchedPhrase, setWakeMatchedPhrase] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postWakeBufferRef = useRef<string>('');
  const isWakeActiveRef = useRef<boolean>(false);

  isWakeActiveRef.current = isWakeActive;

  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setPermissionError(null);
      return true;
    } catch (err: any) {
      console.warn('Microphone permission denied or error:', err);
      setHasPermission(false);
      setPermissionError('Mikrofonzugriff verweigert. Bitte in den Browser-Einstellungen freigeben.');
      return false;
    }
  }, []);

  const checkWakeWord = (text: string): { matched: boolean; postWakeText: string; phrase: string } => {
    const lower = text.toLowerCase();
    const wakePhrases = [
      'hey udo',
      'hey you do',
      'hallo udo',
      'hi udo',
      'a udo',
      'hey u.d.o.',
      'udo'
    ];

    for (const phrase of wakePhrases) {
      const idx = lower.indexOf(phrase);
      if (idx !== -1) {
        const postText = text.slice(idx + phrase.length).trim();
        return { matched: true, postWakeText: postText, phrase };
      }
    }
    return { matched: false, postWakeText: '', phrase: '' };
  };

  const triggerSpeechComplete = useCallback((finalText: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const prompt = finalText.trim();
    if (prompt) {
      setMicState('processing');
      if (onSpeechEnd) {
        onSpeechEnd(prompt);
      }
    } else {
      setIsWakeActive(false);
      setLiveTranscript('');
      setMicState('idle');
    }
  }, [onSpeechEnd]);

  const startRecognition = useCallback(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setPermissionError('Browser unterstützt Web Speech API nicht (Empfohlen: Chrome/Edge).');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'de-DE';

      recognition.onresult = (event: any) => {
        let fullInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          fullInterim += event.results[i][0].transcript;
        }

        const trimmed = fullInterim.trim();

        if (!isWakeActiveRef.current) {
          const { matched, postWakeText, phrase } = checkWakeWord(trimmed);
          if (matched) {
            setIsWakeActive(true);
            setWakeMatchedPhrase(phrase);
            setMicState('listening');
            postWakeBufferRef.current = postWakeText;
            setLiveTranscript(postWakeText);

            if (onWakeWordDetected) {
              onWakeWordDetected(postWakeText);
            }

            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (postWakeText.length > 0) {
              silenceTimerRef.current = setTimeout(() => {
                triggerSpeechComplete(postWakeBufferRef.current);
              }, silenceTimeoutMs);
            }
          }
        } else {
          const { matched, postWakeText } = checkWakeWord(trimmed);
          const currentPostText = matched ? postWakeText : trimmed;

          postWakeBufferRef.current = currentPostText;
          setLiveTranscript(currentPostText);

          if (onTranscriptUpdate) {
            onTranscriptUpdate(currentPostText);
          }

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          if (currentPostText.length > 0) {
            silenceTimerRef.current = setTimeout(() => {
              triggerSpeechComplete(postWakeBufferRef.current);
            }, silenceTimeoutMs);
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('SpeechRecognition error:', event.error);
        }
      };

      recognition.onend = () => {
        setTimeout(() => {
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          } catch (e) {}
        }, 300);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
    }
  }, [onWakeWordDetected, onTranscriptUpdate, silenceTimeoutMs, triggerSpeechComplete]);

  const manualWakeTrigger = useCallback(() => {
    setIsWakeActive(true);
    setWakeMatchedPhrase('Manuelle Aktivierung');
    setMicState('listening');
    postWakeBufferRef.current = '';
    setLiveTranscript('');
    if (onWakeWordDetected) {
      onWakeWordDetected('');
    }
  }, [onWakeWordDetected]);

  const resetToListening = useCallback(() => {
    setIsWakeActive(false);
    setLiveTranscript('');
    postWakeBufferRef.current = '';
    setWakeMatchedPhrase(null);
    setMicState('idle');
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  useEffect(() => {
    requestMicPermission().then((granted) => {
      if (granted) {
        startRecognition();
      }
    });

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  return {
    micState,
    setMicState,
    hasPermission,
    permissionError,
    requestMicPermission,
    isWakeActive,
    liveTranscript,
    wakeMatchedPhrase,
    manualWakeTrigger,
    triggerSpeechComplete,
    resetToListening
  };
}
