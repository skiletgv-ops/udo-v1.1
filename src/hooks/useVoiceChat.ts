import { useState, useRef, useCallback } from 'react';
import Replicate from 'replicate';

/**
 * Custom hook for voice chat using Kimi-Audio (ASR + TTS) + Gemini (LLM)
 * @param {string} geminiApiKey - Google Gemini API key (optional if using server /api/chat endpoint)
 * @param {function} onNewMessage - Callback to sync messages with parent chat state
 * @param {object} options - Optional config for language, replicate token, etc.
 */
export function useVoiceChat(
  geminiApiKey?: string,
  onNewMessage?: (msg: { role: string; text: string; sender?: 'user' | 'doctor'; id?: string; timestamp?: string }) => void,
  options: { language?: string; replicateToken?: string } = {}
) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const abortController = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getReplicateToken = useCallback(() => {
    return (
      options.replicateToken ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_REPLICATE_API_TOKEN) ||
      (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN)) ||
      ''
    );
  }, [options.replicateToken]);

  const getGeminiKey = useCallback(() => {
    return (
      geminiApiKey ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY)) ||
      ''
    );
  }, [geminiApiKey]);

  // Helper: Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // ─── STEP 2: Kimi-Audio ASR (Speech-to-Text) ───
  const transcribeWithKimi = async (audioBlob: Blob): Promise<string> => {
    const base64Audio = await blobToBase64(audioBlob);
    const token = getReplicateToken();

    // If client token exists, run client-side Replicate
    if (token) {
      const replicate = new Replicate({ auth: token });
      const output: any = await replicate.run("zsxkib/kimi-audio-7b-instruct", {
        input: {
          audio: `data:audio/webm;base64,${base64Audio}`,
          prompt: "Transcribe the following audio accurately. Preserve punctuation.",
          task: "asr",
          language: options.language || "de"
        }
      });

      const transcript =
        output?.transcription ||
        output?.text ||
        (typeof output === 'string' ? output : JSON.stringify(output));

      if (!transcript || transcript.trim().length === 0) {
        throw new Error('Kimi-Audio returned empty transcription');
      }
      return transcript.trim();
    } else {
      // Fallback to server endpoint
      const res = await fetch('/api/kimi-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'asr',
          audioBase64: base64Audio,
          language: options.language || 'de'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Kimi-Audio ASR server error (${res.status})`);
      }

      const data = await res.json();
      if (!data.transcript || data.transcript.trim().length === 0) {
        throw new Error('Kimi-Audio returned empty transcription');
      }
      return data.transcript.trim();
    }
  };

  // ─── STEP 3: Gemini Chat ───
  const chatWithGemini = async (userText: string, history: Array<{ role: string; text: string }> = []): Promise<string> => {
    const apiKey = getGeminiKey();

    // Prefer server /api/chat endpoint if available
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          messages: history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            content: msg.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content || data.response) {
          return data.content || data.response;
        }
      }
    } catch (e) {
      console.warn('Server /api/chat fallback error, attempting direct Gemini API:', e);
    }

    // Direct Gemini API call if key is provided
    if (apiKey) {
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userText }] }
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048
            }
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${errorData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Entschuldigung, ich konnte keine Antwort generieren.';
    }

    throw new Error('Kein API-Schlüssel für Gemini verknüpft.');
  };

  // ─── STEP 4: Kimi-Audio TTS (Text-to-Speech) ───
  const speakWithKimi = async (text: string): Promise<void> => {
    setIsSpeaking(true);
    try {
      const token = getReplicateToken();
      let audioUrl: string | null = null;

      if (token) {
        const replicate = new Replicate({ auth: token });
        const output: any = await replicate.run("zsxkib/kimi-audio-7b-instruct", {
          input: {
            prompt: text,
            task: "tts",
            voice: "default",
            speed: 1.0
          }
        });

        audioUrl = output?.audio || (typeof output === 'string' ? output : null);
      } else {
        const res = await fetch('/api/kimi-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: 'tts',
            prompt: text
          })
        });

        if (res.ok) {
          const data = await res.json();
          audioUrl = data.audioUrl || null;
        }
      }

      if (!audioUrl) {
        // WebSpeech API fallback if TTS model returned no URL
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = options.language === 'en' ? 'en-US' : 'de-DE';
          await new Promise<void>((resolve) => {
            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();
            window.speechSynthesis.speak(utterance);
          });
          return;
        }
        throw new Error('Kimi-Audio TTS returned no audio');
      }

      // Play audio URL
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      abortController.current = new AbortController();

      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play().catch(reject);
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  // ─── MAIN PIPELINE ───
  const processAudioPipeline = async (audioBlob: Blob) => {
    setIsProcessing(true);
    abortController.current = new AbortController();
    try {
      // 1. Transcribe speech to text
      const transcript = await transcribeWithKimi(audioBlob);
      if (onNewMessage) {
        onNewMessage({
          role: 'user',
          text: transcript,
          sender: 'user',
          id: `user-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // 2. Get Gemini response
      const geminiResponse = await chatWithGemini(transcript);
      if (onNewMessage) {
        onNewMessage({
          role: 'model',
          text: geminiResponse,
          sender: 'doctor',
          id: `doctor-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // 3. Speak the response with Kimi-Audio TTS
      await speakWithKimi(geminiResponse);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Voice pipeline aborted');
        return;
      }
      console.error('Voice pipeline error:', err);
      if (onNewMessage) {
        onNewMessage({
          role: 'model',
          text: `Voice error: ${err.message || 'Sprachverarbeitung fehlgeschlagen'}. Bitte versuchen Sie es erneut.`,
          sender: 'doctor',
          id: `err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── STEP 1: Record Audio ───
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
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

      mediaRecorder.current.start(100); // Collect data every 100ms
      setIsListening(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Bitte erlauben Sie den Mikrofonzugriff, um die Sprachfunktion zu nutzen.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount or cancel
  const cancelVoice = useCallback(() => {
    abortController.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
    isProcessing
  };
}
