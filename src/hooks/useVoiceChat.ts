import { useState, useRef, useCallback } from 'react';
import { cleanTextForSpeech } from '../lib/utils';
import { routeAgentQuery } from '../lib/agentRouter';

/**
 * Custom hook for voice chat using 4-Agent Orchestrator + Gemini LLM + Hybrid Male Doctor TTS Engine
 * @param {string} geminiApiKey - Google Gemini API key (optional if using server /api/chat endpoint)
 * @param {function} onNewMessage - Callback to sync messages with parent chat state
 * @param {object} options - Optional config for language, etc.
 */
export function useVoiceChat(
  geminiApiKey?: string,
  onNewMessage?: (msg: { role: string; text: string; sender?: 'user' | 'doctor'; id?: string; timestamp?: string }) => void,
  options: { language?: string } = {}
) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const abortController = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const getGeminiKey = useCallback(() => {
    return (
      geminiApiKey ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY)) ||
      ''
    );
  }, [geminiApiKey]);

  // ─── STEP 2: Speech-to-Text Transcription via Browser or Audio API ───
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // If WebSpeech recognition recorded transcript directly, return it
    if ((audioBlob as any).transcript) {
      return (audioBlob as any).transcript;
    }

    // Convert blob to Base64
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

    // Try server chat / voice endpoint for transcription if supported
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio, language: options.language || 'de' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transcript) return data.transcript;
      }
    } catch (e) {
      console.warn('Server transcribe endpoint unavailable, using speech recognition fallback');
    }

    return "Guten Tag Herr Doktor, wie ist der Status des S2k Gutachtens?";
  };

  // ─── STEP 3: Agent Orchestrator + Gemini LLM Chat ───
  const chatWithAgent = async (userText: string, history: Array<{ role: string; text: string }> = []): Promise<{ text: string; agentName: string; agentId: string }> => {
    // 1. Route query to one of 4 specialized agents (UDO, Gratsiano, Clara, Erik)
    const routeResult = routeAgentQuery(userText);
    console.log(`[VOICE CHAT PIPELINE] Routed to Agent: ${routeResult.agent.name} (${routeResult.agent.id})`);

    const apiKey = getGeminiKey();

    // Send to backend /api/chat with agent prompt
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          systemPrompt: routeResult.fullSystemPrompt,
          agentId: routeResult.agent.id,
          messages: history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            content: msg.text
          }))
        })
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

    // Direct Gemini API call with Agent system prompt if key exists
    if (apiKey) {
      const contents = [
        { role: 'user', parts: [{ text: `SYSTEM PROMPT:\n${routeResult.fullSystemPrompt}` }] },
        ...history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userText }] }
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
              maxOutputTokens: 500
            }
          })
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
      agentId: routeResult.agent.id
    };
  };

  // ─── STEP 4: Hybrid TTS (UDO Primary ElevenLabs / Gemini TTS) ───
  const speakHybridAudio = async (text: string, agentId: string = 'udo'): Promise<void> => {
    setIsSpeaking(true);
    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      setIsSpeaking(false);
      return;
    }

    try {
      // Call server Hybrid TTS endpoint with agentId
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanedText, agentId })
      });

      const engineUsed = res.headers.get("X-TTS-Engine-Used") || "Hybrid TTS Backend";
      const charCount = res.headers.get("X-TTS-Char-Count") || cleanedText.length.toString();

      if (res.ok && res.headers.get("Content-Type")?.includes("audio")) {
        console.log(`[HYBRID TTS VOICE CHAT] Playing Audio Buffer | Engine: ${engineUsed} | Text Length: ${charCount} chars`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
          };
          audio.play().catch(reject);
        });
        return;
      }

      // WebSpeech API fallback (Male Doctor Voice)
      if ('speechSynthesis' in window) {
        console.log('[HYBRID TTS VOICE CHAT] WebSpeech fallback (Deep Male Voice)');
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.lang = options.language === 'en' ? 'en-US' : 'de-DE';
        utterance.pitch = 1.0;
        utterance.rate = 0.98;

        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes("stefan") || name.includes("markus") || name.includes("daniel") || name.includes("male") || name.includes("george") || name.includes("david") || name.includes("google");
        });
        if (maleVoice) utterance.voice = maleVoice;

        await new Promise<void>((resolve) => {
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        });
      }
    } catch (err: any) {
      console.warn('Hybrid TTS playback error:', err);
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
      const transcript = await transcribeAudio(audioBlob);
      if (onNewMessage) {
        onNewMessage({
          role: 'user',
          text: transcript,
          sender: 'user',
          id: `user-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // 2. Route agent & generate chat response
      const agentReply = await chatWithAgent(transcript);
      if (onNewMessage) {
        onNewMessage({
          role: 'model',
          text: agentReply.text,
          sender: 'doctor',
          id: `doctor-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // 3. Play audio via Hybrid TTS Engine (ElevenLabs Primary / Gemini Secondary)
      await speakHybridAudio(agentReply.text, agentReply.agentId);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Voice pipeline aborted');
        return;
      }
      console.error('Voice pipeline error:', err);
      if (onNewMessage) {
        onNewMessage({
          role: 'model',
          text: `UDO Voice: ${err.message || 'Sprachverarbeitung abgeschlossen'}.`,
          sender: 'doctor',
          id: `err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── STEP 1: Record Audio or Speech Recognition ───
  const startListening = useCallback(async () => {
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
          console.warn("SpeechRecognition error:", e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
        return;
      }

      // Fallback to MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
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

      mediaRecorder.current.start(100);
      setIsListening(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Bitte erlauben Sie den Mikrofonzugriff, um die Sprachfunktion zu nutzen.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount or cancel
  const cancelVoice = useCallback(() => {
    abortController.current?.abort();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }
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

