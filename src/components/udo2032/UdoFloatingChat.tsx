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
  CheckCircle2
} from 'lucide-react';
import { routeUdoPrompt } from '../../services/udoMetaRouter';

export function UdoFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'auto' | 'gemini' | 'claude' | 'openai' | 'deepseek'>('auto');
  const [taskType, setTaskType] = useState<'general' | 'medical' | 'legal' | 'code' | 'finance'>('general');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      if (ttsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.result.replace(/#/g, ''));
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
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
            AUTO
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
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-slate-400">Gemini • Claude • OpenAI • DeepSeek</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  ttsEnabled
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Voice Speech Output"
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
                  placeholder="Ask UDO 2032 anything..."
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
