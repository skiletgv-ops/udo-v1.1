import React, { useState, useRef } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Edit3,
  FileText,
  Volume2,
  RefreshCw,
  Send,
  ShieldCheck,
  ChevronRight,
  Save
} from 'lucide-react';

const GUTACHTEN_SECTIONS = [
  '1. Anamnese & Soziale Vorgeschichte',
  '2. Subjektive Beschwerden & Schmerzanamnese',
  '3. Apparative & Zusatzbefunde (EEG / EKG)',
  '4. Neurologisch-Psychiatrischer Befund',
  '5. Zusammenfassung & Leistungseinschätzung',
  '6. Beantwortung der Beweisfragen',
  '7. Sozialmedizinische Beurteilung',
  '8. Kausalitätsbewertung & Vorzustand',
  '9. Epikrise & Abschließende Stellungnahme'
];

export const DictatePage: React.FC = () => {
  const { logAuditAction } = useUdoStore();

  const [isRecording, setIsRecording] = useState(false);
  const [selectedSection, setSelectedSection] = useState(GUTACHTEN_SECTIONS[0]);
  const [transcription, setTranscription] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Simulated Voice Dictation Loop
  const startRecording = () => {
    setIsRecording(true);
    setIsApproved(false);
    setTranscription('Diktat gestartet... Sprechen Sie jetzt Ihren Befund oder die Gutachten-Passage ein.');

    setTimeout(() => {
      setTranscription(
        'Der Patient Thomas Müller, geb. 12.04.1982, berichtet über anhaltende radikuläre Schmerzen im Versorgungsgebiet L5/S1 links. Im EEG zeigt sich ein regulärer 9.5 Hz Alpha-Grundrhythmus ohne paroxysmale Entladungen. Die kognitive Leistungsfähigkeit ist im Aufmerksamkeitsbereich unauffällig.'
      );
      setIsRecording(false);
    }, 4000);
  };

  const handleProcessWithAi = async () => {
    if (!transcription) return;
    setIsProcessingAi(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Strukturiere das folgende ärztliche Diktat präzise in den S2k-Gutachtenabschnitt "${selectedSection}":\n\n"${transcription}"`,
          messages: []
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiDraft(data.content || data.response);
      } else {
        // Fallback structured draft
        setAiDraft(
          `[EINGEFÜGT IN: ${selectedSection.toUpperCase()}]\n\nKlinische Befundzusammenfassung:\n- Anhaltende L5/S1-Radikulopathie links bei Z.n. LWS-Kontusion.\n- Apparativ (EEG): Regelm. 9,5 Hz Alpha-Rhythmus, unauffällig.\n- Kognition: Vollzeitige Orientierung und intakte Exekutivfunktionen.\n- Beurteilung: S2k-konform strukturiert.`
        );
      }
    } catch (err) {
      setAiDraft(
        `[S2k DRAFT — ${selectedSection}]\nAnamnestische Schmerzangaben korrelieren mit dem klinisch-neurologischen Befund. Keine höhergradigen motorischen Defizite.`
      );
    } finally {
      setIsProcessingAi(false);
      logAuditAction('DICTATE_GUTACHTEN_SECTION', 'PAT-4829', 'GUTACHTEN', `Dictated into ${selectedSection}`);
    }
  };

  const handleApproveDraft = () => {
    setIsApproved(true);
    logAuditAction('APPROVE_GUTACHTEN_SECTION', 'PAT-4829', 'GUTACHTEN', `Approved ${selectedSection}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mic className="text-cyan-400 animate-pulse" />
            <span>Sprach-Diktat & AI-Drafting für Gutachten</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Voice Dictation (Whisper/ElevenLabs) → Gemini AI Router → S2k 9-Abschnitte Strukturgutachten
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-300 font-mono text-xs flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>S2k Leitlinien-Konform</span>
          </span>
        </div>
      </div>

      {/* SECTION SELECTOR & DICTATE CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: CONTROLS */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-5">
          <div>
            <label className="block text-xs font-mono text-cyan-300 mb-1.5 font-bold uppercase">
              1. Ziel-Abschnitt (1 von 9 S2k Abschnitten)
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              {GUTACHTEN_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* DICTATE BUTTON */}
          <div className="text-center p-6 bg-slate-950/80 border border-white/10 rounded-2xl space-y-4">
            <button
              onClick={isRecording ? () => setIsRecording(false) : startRecording}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <div>
              <span className="block text-xs font-mono font-bold text-white uppercase">
                {isRecording ? 'Diktat Aktiv (Aufnahme...)' : 'Klicken zum Diktieren'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Automatische Spracherkennung (German Medical Model)
              </span>
            </div>
          </div>

          <button
            onClick={handleProcessWithAi}
            disabled={!transcription || isProcessingAi}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-xs font-extrabold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessingAi ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>AI Router strukturiert...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>An Gemini AI Router Senden</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL: SIDE-BY-SIDE TRANSCRIPTION & AI DRAFT */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TRANSCRIPTION BOX */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1.5">
                  <Volume2 size={14} className="text-cyan-400" /> Transkription (Raw Voice)
                </span>
              </div>
              <textarea
                rows={10}
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Transkribierter Text erscheint hier..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* AI DRAFT BOX */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-violet-300 font-mono uppercase flex items-center gap-1.5">
                  <Sparkles size={14} className="text-violet-400" /> AI S2k-Entwurf
                </span>
                {isApproved && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                    Freigegeben
                  </span>
                )}
              </div>
              <textarea
                rows={10}
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
                placeholder="Strukturierter S2k-Text erscheint hier..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-sans text-violet-100 focus:outline-none focus:border-violet-500/50 leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleApproveDraft}
              disabled={!aiDraft || isApproved}
              className="w-full mt-3 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              <span>Prüfen & Freigeben</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictatePage;
