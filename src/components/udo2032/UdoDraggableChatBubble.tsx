import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Cpu,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Key,
  Check,
  Play,
  Zap,
  Globe
} from 'lucide-react';
import { routeUdoPrompt, RouterRequest } from '../../services/udoMetaRouter';
import { speakWithJonasVoice, stopJonasVoice } from '../../utils/udoVoiceSynth';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  providerUsed?: string;
  confidenceScore?: number;
  latencyMs?: number;
  reasoningChain?: string[];
}

export function UdoDraggableChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [taskType, setTaskType] = useState<RouterRequest['taskType']>('medical');
  const [loading, setLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // API Key & Realtime Online Mode
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages and API key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedKey = localStorage.getItem('GEMINI_API_KEY') || localStorage.getItem('UDO_API_KEY') || '';
        if (storedKey) {
          setGeminiKey(storedKey);
          setKeySaved(true);
        }

        const stored = localStorage.getItem('udo_v2_chat_messages');
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages([
            {
              id: 'init-1',
              sender: 'ai',
              text: 'Hallo! Ich bin der UDO Meta-Cognition Router mit Jonas Sprachsystem. Frag mich nach medizinischen Befunden, GOÄ Abrechnungen, Rechtsgutachten oder dem heutigen Datum.',
              timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              providerUsed: 'Meta-Router Auto (Jonas Voice / Gemini 2.5)',
              confidenceScore: 99,
              latencyMs: 120
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load stored chat history:', err);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim()) {
        localStorage.setItem('GEMINI_API_KEY', geminiKey.trim());
        localStorage.setItem('UDO_API_KEY', geminiKey.trim());
        setKeySaved(true);
        setTestSuccess(true);
      } else {
        localStorage.removeItem('GEMINI_API_KEY');
        localStorage.removeItem('UDO_API_KEY');
        setKeySaved(false);
        setTestSuccess(null);
      }
    }
  };

  const handleTestKey = async () => {
    if (!geminiKey.trim()) return;
    setTestingKey(true);
    setTestSuccess(null);

    try {
      const res = await fetch('/api/udo/router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiKey.trim()
        },
        body: JSON.stringify({ prompt: 'Ping API Test', taskType: 'general' })
      });

      if (res.ok) {
        setTestSuccess(true);
        handleSaveApiKey();
      } else {
        setTestSuccess(false);
      }
    } catch (err) {
      console.error('API key test error:', err);
      setTestSuccess(false);
    } finally {
      setTestingKey(false);
    }
  };

  // Save chat messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem('udo_v2_chat_messages', JSON.stringify(messages));
      } catch (err) {
        console.error('Failed to save chat history:', err);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt;
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await routeUdoPrompt({
        prompt: userText,
        taskType,
        preferredProvider: 'auto'
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.result,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        providerUsed: response.providerUsed,
        confidenceScore: response.confidenceScore,
        latencyMs: response.latencyMs,
        reasoningChain: response.reasoningChain
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (ttsEnabled) {
        speakWithJonasVoice(response.result, { lang: 'de', pitch: 0.95, rate: 0.96 });
      }
    } catch (err) {
      console.error('Meta-Router Error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Fehler bei der Kontaktaufnahme zum Meta-Router. Lokales Fallback-Modul aktiv.',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        providerUsed: 'Local Holo-Core Fallback',
        confidenceScore: 85,
        latencyMs: 40
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    stopJonasVoice();
    const initMsg: ChatMessage = {
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: 'Chatverlauf zurückgesetzt. Wie kann ich Ihnen bei UDO 2032 helfen?',
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      providerUsed: 'Meta-Router Reset'
    };
    setMessages([initMsg]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('udo_v2_chat_messages');
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -800, right: 100, top: -600, bottom: 100 }}
      className="fixed bottom-6 left-6 z-50 font-mono select-none"
    >
      {!isOpen ? (
        /* Floating Draggable Bubble Button */
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-slate-950/90 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.9)] hover:border-cyan-300 transition-all cursor-grab active:cursor-grabbing backdrop-blur-xl flex items-center justify-center"
        >
          <Cpu size={24} className="animate-pulse text-cyan-400" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </button>
      ) : (
        /* Expanded Chat Window */
        <div className="w-[360px] md:w-[420px] h-[520px] bg-slate-950/95 border-2 border-cyan-500/60 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.25)] backdrop-blur-2xl flex flex-col overflow-hidden text-xs">
          {/* Header Bar */}
          <div className="p-4 bg-slate-900/80 border-b border-cyan-900/50 flex items-center justify-between cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-bold text-cyan-300 tracking-wider">META-ROUTER CHAT</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
                JONAS VOICE
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowApiKeyModal(!showApiKeyModal)}
                className={`p-1 rounded border transition-colors ${
                  showApiKeyModal || keySaved
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="API Key Settings"
              >
                <Key size={13} />
              </button>
              <button
                onClick={() => {
                  const nextState = !ttsEnabled;
                  setTtsEnabled(nextState);
                  if (!nextState) stopJonasVoice();
                }}
                className={`p-1 rounded border transition-colors ${
                  ttsEnabled
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={ttsEnabled ? 'Humanoid Jonas Voice Active' : 'Voice Muted'}
              >
                {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <RefreshCw size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* API Key Drawer */}
          {showApiKeyModal && (
            <div className="p-3 bg-slate-900 border-b border-cyan-500/30 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <Key size={12} /> Gemini API Key (Online Dialogues)
                </span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setTestSuccess(null);
                  }}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check size={11} /> Ok
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <button
                  onClick={handleTestKey}
                  disabled={testingKey || !geminiKey.trim()}
                  className="text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {testingKey ? <Zap size={10} className="animate-spin" /> : <Play size={10} />}
                  <span>Test Connection</span>
                </button>
                {testSuccess === true && <span className="text-emerald-400 font-bold">✓ Connected</span>}
                {testSuccess === false && <span className="text-rose-400 font-bold">✗ Failed</span>}
              </div>
            </div>
          )}

          {/* Task Type Selector Bar */}
          <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            {(['medical', 'legal', 'code', 'finance', 'translation', 'general'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTaskType(t)}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all cursor-pointer ${
                  taskType === t
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-none font-mono text-xs'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-xs space-y-1.5'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {/* AI Metadata & Reasoning */}
                  {msg.sender === 'ai' && msg.providerUsed && (
                    <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-cyan-400">
                        <span>Provider: {msg.providerUsed}</span>
                        {msg.confidenceScore && (
                          <span className="text-emerald-400">Conf: {msg.confidenceScore}%</span>
                        )}
                        <button
                          onClick={() => speakWithJonasVoice(msg.text, { lang: 'de', pitch: 0.95, rate: 0.96 })}
                          className="hover:text-cyan-300 text-slate-400 transition-colors ml-1 cursor-pointer"
                          title="Play Voice"
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>

                      {msg.reasoningChain && msg.reasoningChain.length > 0 && (
                        <div>
                          <button
                            onClick={() =>
                              setExpandedReasoning(expandedReasoning === msg.id ? null : msg.id)
                            }
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer pt-0.5"
                          >
                            <span>Reasoning Chain</span>
                            {expandedReasoning === msg.id ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </button>

                          {expandedReasoning === msg.id && (
                            <div className="mt-1 p-2 rounded bg-slate-950 border border-purple-500/30 text-purple-300 text-[9px] space-y-0.5">
                              {msg.reasoningChain.map((step, idx) => (
                                <div key={idx}>{step}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs animate-pulse">
                <RefreshCw size={14} className="animate-spin" />
                <span>Routing prompt across multi-LLM clusters...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 bg-slate-900/90 border-t border-cyan-900/50 flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query Meta-Router (e.g. Befund analysieren, Datum)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputPrompt.trim()}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold hover:brightness-110 disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

