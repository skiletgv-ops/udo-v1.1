import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Cpu,
  Sparkles,
  Zap,
  Key,
  Check,
  Globe,
  Lock,
  Play
} from 'lucide-react';
import { routeUdoPrompt } from '../../services/udoMetaRouter';
import { speakWithJonasVoice, stopJonasVoice, findJonasHumanoidVoice } from '../../utils/udoVoiceSynth';

export function UdoFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'auto' | 'gemini' | 'claude' | 'openai' | 'deepseek'>('auto');
  const [taskType, setTaskType] = useState<'general' | 'medical' | 'legal' | 'code' | 'finance'>('general');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // API Key & Realtime Mode State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'udo';
    text: string;
    provider?: string;
    confidence?: number;
    timestamp: string;
  }>>([
    {
      sender: 'udo',
      text: 'Guten Tag! Ich bin der UDO 2032 Meta-Cognitive KI-Assistent. Sämtliche 30 Systemdienste stehen bereit. Wie kann ich Sie heute unterstützen?',
      provider: 'Meta-Cognitive Auto Router',
      confidence: 99,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('GEMINI_API_KEY') || localStorage.getItem('UDO_API_KEY') || '';
      if (storedKey) {
        setGeminiKey(storedKey);
        setKeySaved(true);
        setIsOnlineMode(true);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim()) {
        localStorage.setItem('GEMINI_API_KEY', geminiKey.trim());
        localStorage.setItem('UDO_API_KEY', geminiKey.trim());
        setKeySaved(true);
        setIsOnlineMode(true);
        setTestSuccess(true);
      } else {
        localStorage.removeItem('GEMINI_API_KEY');
        localStorage.removeItem('UDO_API_KEY');
        setKeySaved(false);
        setIsOnlineMode(false);
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
        body: JSON.stringify({ prompt: 'Ping API Test Connection', taskType: 'general' })
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

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, timestamp: timeStr }
    ]);

    setLoading(true);

    try {
      const response = await routeUdoPrompt({
        prompt: userText,
        taskType,
        preferredProvider: selectedModel
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'udo',
          text: response.result,
          provider: response.providerUsed,
          confidence: response.confidenceScore,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Speak using Jonas Humanoid Voice Engine
      if (ttsEnabled) {
        speakWithJonasVoice(response.result, {
          lang: 'de',
          pitch: 0.95,
          rate: 0.96
        });
      }
    } catch (err) {
      console.error('Floating Chat Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Spracherkennung in diesem Browser nicht unterstützt.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setPrompt((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] hover:scale-105 transition-all cursor-pointer"
        >
          <div className="relative">
            <Cpu className="w-5 h-5 text-cyan-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <span>UDO 2032 AI CHAT</span>
          <span className="text-[10px] bg-slate-950/60 border border-cyan-400/40 px-2 py-0.5 rounded-full text-cyan-300">
            {isOnlineMode ? 'ONLINE' : 'JONAS'}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'w-80 h-16' : 'w-96 md:w-[420px] h-[540px]'
          }`}
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Sparkles size={16} className="animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h3 className="text-xs font-bold font-mono text-cyan-300 tracking-wider flex items-center gap-2">
                  UDO META-ROUTER AI
                  {isOnlineMode ? (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono flex items-center gap-1">
                      <Globe size={10} /> LIVE API
                    </span>
                  ) : (
                    <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono">
                      JONAS VOICE
                    </span>
                  )}
                </h3>
                <p className="text-[10px] font-mono text-slate-400">German Jonas Voice • Gemini 2.5</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* API Key Modal Toggle */}
              <button
                onClick={() => setShowApiKeyModal(!showApiKeyModal)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  showApiKeyModal || keySaved
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="API Key Settings / Realtime Mode"
              >
                <Key size={14} />
              </button>

              <button
                onClick={() => {
                  const nextState = !ttsEnabled;
                  setTtsEnabled(nextState);
                  if (!nextState) stopJonasVoice();
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  ttsEnabled
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={ttsEnabled ? 'Humanoid JONAS Voice: Active' : 'Voice Output Muted'}
              >
                {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* API Key Config Modal / Drawer */}
              {showApiKeyModal && (
                <div className="p-4 bg-slate-900 border-b border-cyan-500/30 text-xs space-y-3 font-mono animate-fadeIn">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Key size={14} /> API Key & Live Online Agent Setup
                    </span>
                    <span className="text-[10px] text-slate-400">Gemini 2.5 Realtime</span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    Fügen Sie Ihren eigenen <strong>Gemini API-Schlüssel</strong> ein, um Echtzeit-Dialoge und KI-Stimmgenerierung online zu aktivieren.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase">Gemini API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={geminiKey}
                        onChange={(e) => {
                          setGeminiKey(e.target.value);
                          setTestSuccess(null);
                        }}
                        placeholder="AIzaSy..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={handleSaveApiKey}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={12} /> Speichern
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <button
                      onClick={handleTestKey}
                      disabled={testingKey || !geminiKey.trim()}
                      className="text-[10px] bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {testingKey ? <Zap size={10} className="animate-spin" /> : <Play size={10} />}
                      <span>Verbindung testen</span>
                    </button>

                    {testSuccess === true && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        ✓ API Key Aktiv & Verbunden
                      </span>
                    )}
                    {testSuccess === false && (
                      <span className="text-[10px] text-rose-400 font-bold">
                        ✗ Schlüssel ungültig oder Offline
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Settings / Category Selector Bar */}
              <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">MODEL:</span>
                  <select
                    value={selectedModel}
                    onChange={(e: any) => setSelectedModel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-cyan-400 focus:outline-none focus:border-cyan-500 text-[10px]"
                  >
                    <option value="auto">Auto Meta-Router</option>
                    <option value="gemini">Gemini 2.5 Flash</option>
                    <option value="claude">Claude 3.5 Sonnet</option>
                    <option value="openai">GPT-4o</option>
                    <option value="deepseek">DeepSeek V3</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-slate-500">TASK:</span>
                  <select
                    value={taskType}
                    onChange={(e: any) => setTaskType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-cyan-400 focus:outline-none focus:border-cyan-500 text-[10px]"
                  >
                    <option value="general">General</option>
                    <option value="medical">Medical / Gutachten</option>
                    <option value="legal">Legal & Contract</option>
                    <option value="code">Code & Cyber</option>
                    <option value="finance">Finance & CFO</option>
                  </select>
                </div>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 font-sans leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1 text-[9px] font-mono text-slate-500">
                      <span>{msg.timestamp}</span>
                      {msg.provider && (
                        <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                          {msg.provider}
                        </span>
                      )}
                      {msg.confidence && (
                        <span className="text-emerald-400">
                          {msg.confidence}% Conf
                        </span>
                      )}
                      {msg.sender === 'udo' && (
                        <button
                          onClick={() => speakWithJonasVoice(msg.text, { lang: 'de', pitch: 0.95, rate: 0.96 })}
                          className="hover:text-cyan-300 text-slate-400 transition-colors ml-1 cursor-pointer"
                          title="Play Voice"
                        >
                          <Volume2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-slate-900/80 p-3 rounded-2xl border border-cyan-500/30 w-fit">
                    <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                    <span>Meta-Cognitive Router analyzing query...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Control Area */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-400'
                  }`}
                  title="Speech to Text Dictation"
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Frag UDO 2032 etwas (z.B. Welches Datum ist heute?)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono"
                />

                <button
                  onClick={handleSend}
                  disabled={loading || !prompt.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

