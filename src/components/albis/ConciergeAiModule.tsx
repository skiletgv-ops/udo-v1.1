import React, { useState } from 'react';
import { Bot, MessageSquare, Send, Bell, CheckCircle2, X } from 'lucide-react';

export const ConciergeAiModule: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Guten Tag, Frau Dr. Bongartz! Ich bin Ihr Praxis-Concierge AI. Ich habe Ihren morgigen Kalender analysiert: 8 Termine sind eingetragen. Soll ich SMS-Erinnerungen an alle Patienten senden?'
    }
  ]);
  const [input, setInput] = useState('');
  const [actionDone, setActionDone] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let aiReply = 'Verstanden. Ich habe die Aktion ausgeführt und den Status im Log vermerkt.';
      if (userText.toLowerCase().includes('ja') || userText.toLowerCase().includes('sms')) {
        aiReply = '✅ SMS-Erinnerungen für morgen (8 Patienten) wurden via Telematik-SMS Dienst eingeplant.';
        setActionDone(true);
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 800);
  };

  return (
    <>
      {/* FLOATING FAB BUTTON IN BOTTOM-RIGHT CORNER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer transition-all hover:scale-105"
        title="Future Clinic Concierge AI"
      >
        <Bot size={28} />
      </button>

      {/* CHATBOT POPUP PANEL */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0d1322] border border-cyan-500/40 shadow-2xl p-4 space-y-3 font-sans text-xs text-slate-200">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-cyan-400" />
              <span className="font-bold text-white font-mono">Concierge AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* CHAT MESSAGES STREAM */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 font-mono text-[11px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white ml-auto max-w-[80%]'
                    : 'bg-slate-900 border border-white/10 text-slate-200 max-w-[90%]'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="flex gap-1.5 pt-1 overflow-x-auto text-[10px] font-mono">
            <button
              onClick={() => {
                setInput('Ja, SMS Erinnerungen senden');
              }}
              className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900 cursor-pointer shrink-0"
            >
              SMS Erinnerungen senden
            </button>
            <button
              onClick={() => {
                setInput('Bestandsprüfung Rezepte');
              }}
              className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 cursor-pointer shrink-0"
            >
              Rezeptbestand
            </button>
          </div>

          {/* INPUT BAR */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Frage an Concierge AI..."
              className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
