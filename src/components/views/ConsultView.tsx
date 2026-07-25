import React, { useState } from 'react';
import { Mic, Send, Bot, User, Sparkles, Volume2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const ConsultView: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'udo',
      text: 'Guten Tag, Herr Dr. Altenberg. Die S2k-Pipeline hat für Hans Müller (BG-2026-9901-A) den Befund Bandscheibenvorfall L4/L5 mit Radikulopathie bestätigt. Möchten Sie zusätzliche Evidenzen aus den AWMF-Leitlinien abrufen?',
      time: '02:43'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: 'user', text: input, time: '02:44' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'udo',
          text: `Verstanden. Basierend auf AWMF S2k-Leitlinie 033/050 beträgt die empfohlene MdE für L4/L5 mit Wurzelsyndrom 30%.`,
          time: '02:44'
        }
      ]);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <Badge variant="cyan" pulse>Live Neural Voice & Chat</Badge>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
            U.D.O. S2k Consultation Core
          </h1>
        </div>
        <Button variant="ghost" size="sm" icon={<Volume2 className="w-4 h-4 text-cyan-400" />}>
          Voice Mode On
        </Button>
      </div>

      <Card glow="cyan" className="h-[480px] flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto space-y-3 font-sans text-xs pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  m.sender === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,212,170,0.4)]'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-violet-600/20 border-violet-500/30 text-slate-100'
                    : 'bg-white/5 border-white/10 text-slate-200'
                }`}
              >
                {m.text}
                <span className="block text-[9px] font-mono text-slate-400 mt-1">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Frage an das KI-Konsil stellen..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-500/50"
          />
          <Button variant="primary" size="sm" icon={<Send className="w-4 h-4" />} onClick={handleSend}>
            Senden
          </Button>
        </div>
      </Card>
    </div>
  );
};
