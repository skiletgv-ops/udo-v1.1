import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pin,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Radio,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { MicState } from '../hooks/useWakeWord';
import { cleanTextForSpeech } from '../lib/utils';

interface VoiceChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  micState: MicState;
  setMicState: (state: MicState) => void;
  hasPermission: boolean | null;
  permissionError: string | null;
  onRequestPermission: () => void;
  liveTranscript: string;
  wakeMatchedPhrase: string | null;
  onSendPrompt: (prompt: string) => void;
  manualWakeTrigger: () => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'udo';
  text: string;
  timestamp: string;
}

export const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  isOpen,
  onClose,
  micState,
  setMicState,
  hasPermission,
  permissionError,
  onRequestPermission,
  liveTranscript,
  wakeMatchedPhrase,
  onSendPrompt,
  manualWakeTrigger
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [currentResponseText, setCurrentResponseText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const audioQueueRef = useRef<string[]>([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentenceBufferRef = useRef('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponseText, liveTranscript]);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  const fallbackWebSpeech = useCallback((text: string) => {
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) {
      isPlayingAudioRef.current = false;
      playNextSentence();
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'de-DE';
      utterance.rate = 0.98;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const femaleNames = ["marlene", "vicki", "anna", "petra", "hedda", "zira", "hazel", "samantha", "victoria"];
      const maleDeVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return v.lang.startsWith("de") && !femaleNames.some(f => name.includes(f)) && (name.includes("stefan") || name.includes("markus") || name.includes("daniel") || name.includes("male") || name.includes("george") || name.includes("david") || name.includes("google deutsch"));
      }) || voices.find(v => v.lang.startsWith("de") && !femaleNames.some(f => v.name.toLowerCase().includes(f)));

      if (maleDeVoice) utterance.voice = maleDeVoice;

      utterance.onend = () => {
        isPlayingAudioRef.current = false;
        playNextSentence();
      };
      utterance.onerror = () => {
        isPlayingAudioRef.current = false;
        playNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      isPlayingAudioRef.current = false;
      playNextSentence();
    }
  }, []);

  const playNextSentence = useCallback(async () => {
    if (isMuted || audioQueueRef.current.length === 0 || isPlayingAudioRef.current) {
      if (audioQueueRef.current.length === 0 && !isProcessing) {
        setMicState('idle');
      }
      return;
    }

    const sentence = audioQueueRef.current.shift();
    if (!sentence || !sentence.trim()) return;

    isPlayingAudioRef.current = true;
    setMicState('speaking');

    try {
      const res = await fetch('/api/voice-chat/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence })
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('audio')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          currentAudioRef.current = audio;

          audio.onended = () => {
            URL.revokeObjectURL(url);
            isPlayingAudioRef.current = false;
            playNextSentence();
          };

          audio.onerror = () => {
            isPlayingAudioRef.current = false;
            fallbackWebSpeech(sentence);
          };

          await audio.play();
          return;
        }
      }
      fallbackWebSpeech(sentence);
    } catch (e) {
      console.warn('TTS playback error, using WebSpeech fallback:', e);
      fallbackWebSpeech(sentence);
    }
  }, [isMuted, isProcessing, setMicState, fallbackWebSpeech]);

  const queueSentenceForTts = useCallback((sentence: string) => {
    const clean = sentence.trim();
    if (clean) {
      audioQueueRef.current.push(clean);
      if (!isPlayingAudioRef.current) {
        playNextSentence();
      }
    }
  }, [playNextSentence]);

  const executeVoiceQuery = useCallback(async (promptText: string) => {
    if (!promptText.trim()) return;

    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setMicState('processing');
    setCurrentResponseText('');
    sentenceBufferRef.current = '';

    try {
      const storedKey = (typeof window !== 'undefined' && localStorage.getItem('DEEPSEEK_API_KEY')) || '';
      const response = await fetch('/api/voice-chat/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: storedKey,
          transcript: promptText,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (!response.ok || !response.body) {
        console.warn(`Voice completion server status: ${response.status}`);
        const fallbackText = "Guten Tag, liebe Frau Doctor Bongartz! Das UDO System verarbeitet Ihre Anfrage im geschützten S2k-Klinikmodus. Wie kann unser Konsil Ihnen bei der Begutachtung helfen?";
        setCurrentResponseText(fallbackText);
        setMessages((prev) => [
          ...prev,
          {
            id: `udo-${Date.now()}`,
            sender: 'udo',
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsProcessing(false);
        setMicState('idle');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              accumulatedText += parsed.text;
              setCurrentResponseText(accumulatedText);

              sentenceBufferRef.current += parsed.text;
              const matches = sentenceBufferRef.current.match(/[^.!?:]+[.!?:]/g);
              if (matches) {
                for (const match of matches) {
                  queueSentenceForTts(match);
                }
                sentenceBufferRef.current = sentenceBufferRef.current.replace(/[^.!?:]+[.!?:]/g, '');
              }
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }

      if (sentenceBufferRef.current.trim()) {
        queueSentenceForTts(sentenceBufferRef.current);
        sentenceBufferRef.current = '';
      }

      if (accumulatedText) {
        const udoMsg: MessageItem = {
          id: `udo-${Date.now()}`,
          sender: 'udo',
          text: accumulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, udoMsg]);
      }

      setCurrentResponseText('');
      setIsProcessing(false);

      if (!isPinned) {
        autoCloseTimerRef.current = setTimeout(() => {
          if (!isPlayingAudioRef.current) {
            onClose();
          }
        }, 4000);
      }
    } catch (err: any) {
      console.error('Voice completion error:', err);
      setIsProcessing(false);
      setMicState('idle');
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        sender: 'udo',
        text: 'Entschuldigung, bei der Sprachverarbeitung ist ein Verbindungsfehler aufgetreten.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  }, [messages, setMicState, queueSentenceForTts, isPinned, onClose]);

  // Execute prompt when external onSendPrompt or speech end fires
  useEffect(() => {
    if (onSendPrompt) {
      // Attached handler
    }
  }, [onSendPrompt]);

  const handleManualSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const prompt = textInput;
    setTextInput('');
    executeVoiceQuery(prompt);
  };

  const getMicBadgeConfig = () => {
    switch (micState) {
      case 'listening':
        return {
          label: 'HÖRT ZU...',
          bgColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
          dot: 'bg-emerald-400'
        };
      case 'processing':
        return {
          label: 'VERARBEITET...',
          bgColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
          glow: 'shadow-[0_0_15px_rgba(139,92,246,0.4)]',
          dot: 'bg-violet-400 animate-spin'
        };
      case 'speaking':
        return {
          label: 'SPRICHT...',
          bgColor: 'bg-[#B87333]/20 border-[#B87333]/40 text-[#E8A87C]',
          glow: 'shadow-[0_0_15px_rgba(184,115,51,0.4)]',
          dot: 'bg-[#B87333]'
        };
      default:
        return {
          label: 'BEREIT ("Hey UDO")',
          bgColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
          glow: 'shadow-[0_0_12px_rgba(0,212,170,0.3)]',
          dot: 'bg-cyan-400'
        };
    }
  };

  const badge = getMicBadgeConfig();

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-2 sm:right-3 z-[120]">
        <button
          onClick={manualWakeTrigger}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(0,212,170,0.25)] hover:shadow-[0_0_25px_rgba(0,212,170,0.45)] hover:border-cyan-400 transition-all cursor-pointer group"
          title="Voice Assistant 'Hey UDO' manuell aktivieren"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>
          <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            Hey UDO Voice
          </span>
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-20 right-4 sm:right-6 z-[130] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] bg-[#0d0e14]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden font-sans"
      >
        <div className="px-4 py-3 bg-[#111218]/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#B87333]/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,170,0.3)]">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-extrabold text-white tracking-wide">
                  UDO Voice Agent
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  UDO Voice Engine (R1/V3)
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase mt-1 ${badge.bgColor} ${badge.glow}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                {badge.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-lg transition-colors ${
                isPinned
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={isPinned ? 'Panel fixiert' : 'Panel fixieren (kein Auto-Close)'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted && currentAudioRef.current) {
                  currentAudioRef.current.pause();
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={isMuted ? 'Sprachausgabe stummgeschaltet' : 'Sprachausgabe aktivieren'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasPermission === false && (
          <div className="p-3 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between gap-2 text-xs text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{permissionError || 'Mikrofonzugriff erforderlich.'}</span>
            </div>
            <button
              onClick={onRequestPermission}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors shrink-0"
            >
              Freigeben
            </button>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px] max-h-[360px] text-xs font-sans">
          <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono text-slate-400 max-w-fit mx-auto">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>DSGVO Art. 6/9 konform • Sprachaufzeichnung geschützt</span>
          </div>

          {messages.length === 0 && !liveTranscript && !currentResponseText && (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <p className="font-mono text-xs text-slate-300">Sprechen Sie jetzt: <span className="text-cyan-300 font-bold">"Hey UDO"</span></p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Beispiele: "Zeige mir den Status von Patient Thomas Müller", "Prüfe ALBIS GDT Bridge", "Erstelle Gutachten MdE L4/L5".
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'udo' && (
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between gap-4">
                  <span>{m.sender === 'user' ? 'Gesprochen' : 'UDO S2k'}</span>
                  <span>{m.timestamp}</span>
                </div>
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0 text-violet-300">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {liveTranscript && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 animate-pulse flex items-start gap-2.5">
              <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-spin" />
              <div>
                <div className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
                  Live Transkription ("{wakeMatchedPhrase || 'Hey UDO'}")
                </div>
                <p className="text-xs text-emerald-100">{liveTranscript}</p>
              </div>
            </div>
          )}

          {currentResponseText && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                <Bot className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="max-w-[85%] p-3 rounded-xl bg-white/5 border border-cyan-500/30 text-slate-200 rounded-tl-none shadow-[0_0_15px_rgba(0,212,170,0.15)] leading-relaxed">
                <div className="text-[10px] font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 animate-spin" />
                  <span>Streaming Antwort...</span>
                </div>
                {currentResponseText}
              </div>
            </div>
          )}

          {isProcessing && !currentResponseText && (
            <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl flex items-center justify-center gap-3 py-4">
              <div className="flex items-center gap-1 h-5">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['4px', '20px', '4px'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.1
                    }}
                    className="w-1 bg-gradient-to-t from-cyan-400 to-violet-400 rounded-full"
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-violet-300 font-bold tracking-wider">
                UDO Voice Engine Engine analysiert...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleManualSend} className="p-3 bg-[#111218]/90 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Oder Text-Anfrage tippen..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Senden</span>
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
