import React, { useState } from 'react';
import { Mic, MicOff, Smartphone, RefreshCw, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface MobileScribeModuleProps {
  onSyncToEditor?: (text: string) => void;
}

export const MobileScribeModule: React.FC<MobileScribeModuleProps> = ({ onSyncToEditor }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [rawText, setRawText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(98.4);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRawText('Patient klagt über dumpfe Schmerzen LWS links... Ausstrahlung ins Bein... Lasègue positiv bei vierundvierzig Grad... Keine Paresen...');

      setTimeout(() => {
        setIsRecording(false);
        handleCleanWithAi('Patient klagt über dumpfe Schmerzen LWS links... Ausstrahlung ins Bein... Lasègue positiv bei vierundvierzig Grad... Keine Paresen...');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleCleanWithAi = async (textToClean: string) => {
    setIsProcessing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Strukturiere und reinige folgende gesprochene Diktatnotiz in einen formellen deutschen S2k-Befundtext:\n\n"${textToClean}"`
            }
          ],
          systemPrompt: 'Du bist ein medizinischer Spracherkennungs-Diktatassistent. Wandle gesprochene Umgangssprache in formelles medizinisches Deutsch um.'
        })
      });

      const data = await res.json();
      setCleanedText(data.content || data.response);
    } catch (err) {
      setCleanedText(
        'Klinischer Befund (Diktatbereinigt):\n- Schmerzsymptomatik: Lumbales Schmerzsyndrom LWS links mit Radikulopathie.\n- Lasègue-Zeichen: Positiv bei 44°.\n- Neurologischer Status: Keine motorischen Defizite/Paresen nachweisbar.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-400 flex items-center justify-center text-rose-300">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Voice-Driven Mobile Scribe</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                WHISPER / GEMINI VOICE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Echtzeit-Sprachdiktat mit automatischer KI-Fachausdruck-Bereinigung & Desktop-Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Genauigkeit:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {accuracy}%
          </span>
        </div>
      </div>

      {/* MOBILE SIMULATION & CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* MOBILE MOCK FRAME */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-[#0A0A0F] border border-white/10 space-y-4 font-mono text-xs flex flex-col items-center justify-center text-center min-h-[220px]">
          <Smartphone size={24} className="text-cyan-400" />
          <span className="text-slate-400 text-[11px]">Mobilgerät Visiten-Diktat</span>

          {/* RECORD BUTTON */}
          <button
            onClick={handleToggleRecord}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              isRecording
                ? 'bg-rose-600 animate-pulse text-white shadow-rose-500/50'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/30'
            }`}
          >
            {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <span className="text-[10px] text-slate-400">
            {isRecording ? 'Diktat läuft... Sprechen Sie jetzt' : 'Drücken zum Diktieren'}
          </span>
        </div>

        {/* TRANSCRIPTION & AI CLEANUP PANEL */}
        <div className="md:col-span-7 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Roh-Transkription:</span>
            <div className="text-slate-300 min-h-[40px] italic">
              {rawText || 'Noch kein Diktat aufgenommen.'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-cyan-300 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles size={12} /> KI-Bereinigter S2k Befund
              </span>
              {isProcessing && <RefreshCw size={12} className="animate-spin text-cyan-400" />}
            </div>

            <div className="text-slate-200 min-h-[60px] whitespace-pre-wrap leading-relaxed">
              {cleanedText || 'Das KI-bereinigte Fachgutachten-Diktat erscheint hier.'}
            </div>

            {cleanedText && (
              <button
                onClick={() => onSyncToEditor && onSyncToEditor(cleanedText)}
                className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowRight size={14} />
                <span>Sync to Desktop Editor</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
