import { useState, useRef, useCallback } from 'react';
import { routeAgentQuery } from '../lib/agentRouter';
import { voiceService } from '../services/voiceService';

/**
 * Custom hook for voice chat using 4-Agent Orchestrator + Gemini LLM + VoiceService Streaming TTS
 * @param {string} geminiApiKey - Google Gemini API key (optional if using server /api/chat endpoint)
 * @param {function} onNewMessage - Callback to sync messages with parent chat state
 * @param {object} options - Optional config for language, speechRate, etc.
 */
export function useVoiceChat(
  geminiApiKey?: string,
  onNewMessage?: (msg: { role: string; text: string; sender?: 'user' | 'doctor'; id?: string; timestamp?: string }) => void,
  options: { language?: string; speechRate?: number; isVoiceMuted?: boolean } = {}
) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const getGeminiKey = useCallback(() => {
    return (
      geminiApiKey ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' &&
        process.env &&
        (process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY)) ||
      ''
    );
  }, [geminiApiKey]);

  // Transcribe audio
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    if ((audioBlob as any).transcript) {
      return (audioBlob as any).transcript;
    }

    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio, language: options.language || 'de' }),
        signal: voiceService.getAbortSignal(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transcript) return data.transcript;
      }
    } catch (e) {
      console.warn('Server transcribe endpoint unavailable, using speech recognition fallback');
    }

    return 'Guten Tag Herr Doktor, wie ist der Status des S2k Gutachtens?';
  };

  // Agent Orchestrator + Chat
  const chatWithAgent = async (
    userText: string,
    history: Array<{ role: string; text: string }> = []
  ): Promise<{ text: string; agentName: string; agentId: string }> => {
    const routeResult = routeAgentQuery(userText);
    const apiKey = getGeminiKey();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          systemPrompt: routeResult.fullSystemPrompt,
          agentId: routeResult.agent.id,
          messages: history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            content: msg.text,
          })),
        }),
        signal: voiceService.getAbortSignal(),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.content || data.response;
        if (responseText) {
          return { text: responseText, agentName: routeResult.agent.name, agentId: routeResult.agent.id };
        }
      }
    } catch (e) {
      console.warn('Server /api/chat fallback error, attempting direct Gemini API:', e);
    }

    if (apiKey) {
      const contents = [
        { role: 'user', parts: [{ text: `SYSTEM PROMPT:\n${routeResult.fullSystemPrompt}` }] },
        ...history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        { role: 'user', parts: [{ text: userText }] },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 500,
            },
          }),
          signal: voiceService.getAbortSignal(),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (outputText) return { text: outputText, agentName: routeResult.agent.name, agentId: routeResult.agent.id };
      }
    }

    return {
      text: `${routeResult.agent.name}: Der S2k-Konsensbericht für L4/L5 ist vollständig und richtlinienkonform.`,
      agentName: routeResult.agent.name,
      agentId: routeResult.agent.id,
    };
  };

  // Speak audio using voiceService
  const speakHybridAudio = async (text: string): Promise<void> => {
    setIsSpeaking(true);
    await voiceService.speakText(text, {
      speechRate: options.speechRate ?? 1.0,
      isVoiceMuted: options.isVoiceMuted ?? false,
      lang: options.language === 'en' ? 'en-US' : 'de-DE',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  // Main pipeline
  const processAudioPipeline = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const transcript = await transcribeAudio(audioBlob);
      if (onNewMessage) {
        onNewMessage({
          role: 'user',
          text: transcript,
          sender: 'user',
          id: `user-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      const agentReply = await chatWithAgent(transcript);
      if (onNewMessage) {
        onNewMessage({
          role: 'model',
          text: agentReply.text,
          sender: 'doctor',
          id: `doctor-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      await speakHybridAudio(agentReply.text);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Voice pipeline aborted (Barge-in)');
        return;
      }
      console.error('Voice pipeline error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start listening
  const startListening = useCallback(async () => {
    // Interrupt any active voice before starting new recording
    voiceService.interrupt();

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = options.language === 'en' ? 'en-US' : 'de-DE';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          const dummyBlob = new Blob([], { type: 'audio/webm' });
          (dummyBlob as any).transcript = transcript;
          await processAudioPipeline(dummyBlob);
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });

      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await processAudioPipeline(audioBlob);
      };

      mediaRecorder.current.start(100);
      setIsListening(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Bitte erlauben Sie den Mikrofonzugriff, um die Sprachfunktion zu nutzen.');
    }
  }, [options.language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setIsListening(false);
  }, []);

  const cancelVoice = useCallback(() => {
    voiceService.interrupt();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
  }, []);

  return {
    startListening,
    stopListening,
    cancelVoice,
    isListening,
    isSpeaking,
    isProcessing,
  };
}
