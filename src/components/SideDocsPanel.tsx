import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Zap,
  Sparkles,
  X,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Mic,
  Cpu,
  Search,
  CheckCircle2,
  ExternalLink,
  Download,
  Copy,
  Layers,
  Activity
} from 'lucide-react';

interface SideDocsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onTriggerDrBubble?: (msg: string) => void;
  onOpenVoicePanel?: () => void;
}

type TabType = 'docs' | 'functions' | 'voice_specs' | 'status_cases';

export const SideDocsPanel: React.FC<SideDocsPanelProps> = ({
  isOpen,
  onClose,
  onToggle,
  onTriggerDrBubble,
  onOpenVoicePanel
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const s2kDocs = [
    {
      title: 'AWMF S2k-Leitlinie: Traumatische HWS-Distorsion',
      code: 'AWMF 030/088',
      mde: 'MdE 10% - 30%',
      summary: 'Neurologisch-forensische Kriterien für Beschleunigungstraumata der HWS. Objektivierung via Traktions-EMG & DVT.',
      tags: ['Neurologie', 'HWS', 'Schmerzgutachten']
    },
    {
      title: 'Begutachtung Bandscheibenvorfälle L4/L5 & L5/S1',
      code: 'BGB § 842 / SGG § 109',
      mde: 'MdE 20% - 50%',
      summary: 'Klinische Reflexstatusprüfung, Lasègue-Zeichen und Radikulopathie-Nachweis nach S2k-Standard.',
      tags: ['Orthopädie', 'LWS', 'BG-Unfall']
    },
    {
      title: 'Leitlinie Schädel-Hirn-Trauma (SHT Grad I-III)',
      code: 'AWMF 008/001',
      mde: 'MdE 15% - 100%',
      summary: 'Kognitive Leistungsprofile, EEG-Spektralanalyse und neuropsychologische Folgebegutachtung.',
      tags: ['Neuropsychologie', 'SHT', 'Reha']
    },
    {
      title: 'eIDAS & QES Signaturvorschriften (DE/EU)',
      code: 'eIDAS Art. 25-34',
      mde: 'Rechtsgültig',
      summary: 'Qualifizierte Elektronische Signatur für S2k-Gerichtsgutachten mit kryptografischer Zeitstempelung.',
      tags: ['Recht', 'QES', 'Digitalisierung']
    }
  ];

  const voiceSpecs = [
    { trigger: 'UDO S2k Check', action: 'Aktiviert S2k-Leitlinienabgleich für den aktuellen Fall' },
    { trigger: 'UDO Befund Diktat', action: 'Startet fortlaufendes Sprach-Diktat mit S2k-Formatierung' },
    { trigger: 'UDO MdE Rechner', action: 'Öffnet den automatisierten MdE-Prozentrechner' },
    { trigger: 'UDO KI Konsens', action: 'Startet Parallel-Analyse durch Clara, Eric, Marcus & Gratsiano' },
    { trigger: 'UDO Patient Hans Müller', action: 'Lädt direkt die Akte von Hans Müller (SHT I)' }
  ];

  const quickFunctions = [
    {
      label: 'S2k Konsens-Prüfung starten',
      desc: 'Führt 4-KI-Agenten Parallelanalyse aus',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onTriggerDrBubble) {
          onTriggerDrBubble('S2k-Konsensprüfung gestartet: Clara (Gemini), Eric (Claude), Marcus (GPT-4) & Gratsiano (UDO Neural) analysieren...');
        }
      }
    },
    {
      label: 'Voice Diktat Modus öffnen',
      desc: 'UDO R1 (Dr. Gratsiano)/V3 Voice Engine aktivieren',
      icon: <Mic className="w-4 h-4 text-rose-400" />,
      action: () => {
        if (onOpenVoicePanel) onOpenVoicePanel();
      }
    },
    {
      label: 'eIDAS QES Prüfprotokoll exportieren',
      desc: 'Generiert kryptografische Signaturbestätigung',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onTriggerDrBubble) {
          onTriggerDrBubble('QES-Prüfprotokoll erfolgreich generiert (SHA-256 Hash verifiziert).');
        }
      }
    },
    {
      label: 'GDT / ALBIS Synchronisation',
      desc: 'Datenbankabgleich mit Praxis-Software',
      icon: <Cpu className="w-4 h-4 text-violet-400" />,
      action: () => {
        if (onTriggerDrBubble) {
          onTriggerDrBubble('GDT-Schnittstelle verbunden. 12 Patientendossiers synchronisiert.');
        }
      }
    }
  ];

  const statusCases = [
    {
      id: 'BG-2026-9901-A',
      patient: 'Hans Müller (62J)',
      status: 'KRITISCH',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
      issue: 'MRT L4/L5 Bandscheiben-Kompression erfordert S2k-Rechtsgutachten. Frist: 48 Std.'
    },
    {
      id: 'BG-2026-8842-B',
      patient: 'Sabine Weber (45J)',
      status: 'KRITISCH',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
      issue: 'HWS-Schleudertrauma Typ IIb nach BG-Unfall. MdE-Divergenz zwischen Vorbefunden.'
    },
    {
      id: 'BG-2026-7711-C',
      patient: 'Michael Schmidt (58J)',
      status: 'PRÜFUNG',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      issue: 'EEG-Spektralanalyse unvollständig. KI-Konsens erfordert Artefakt-Bereinigung.'
    },
    {
      id: 'BG-2026-6620-D',
      patient: 'Elena Kowalski (39J)',
      status: 'PRÜFUNG',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      issue: 'Ausstehende QES-Freigabe für Gutachten-Entwurf an Sozialgericht Köln.'
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredDocs = s2kDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed top-14 right-0 bottom-16 z-[95] pointer-events-none flex">
      {/* SIDE PEEK PULL HANDLE WHEN CLOSED */}
      <button
        onClick={onToggle}
        className={`pointer-events-auto h-24 my-auto w-4 sm:w-5 bg-[#0a0a0f]/95 border-l border-y border-cyan-500/40 rounded-l-xl backdrop-blur-2xl flex flex-col items-center justify-center gap-1 shadow-[-4px_0_20px_rgba(0,212,170,0.25)] hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer transition-all duration-300 group ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        title="S2k Dokumentation & Quick Functions (Seitenpanel)"
      >
        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 rotate-180 group-hover:scale-125 transition-transform" />
        <span className="[writing-mode:vertical-lr] text-[9px] font-mono text-cyan-300 font-extrabold uppercase tracking-widest py-1">
          DOCS
        </span>
      </button>

      {/* MAIN SIDE PANEL DRAWER WITH SAME ANIMATION AS TOP HEADER */}
      <aside
        className={`pointer-events-auto w-80 sm:w-96 bg-[#0a0a0f]/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-[-10px_0_40px_rgba(0,0,0,0.95)] flex flex-col transition-all duration-300 ease-out transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* PANEL HEADER */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-sans text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>S2k Side Docs & Tools</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE
                </span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">Forensische Referenzen & Quick Actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="p-2 border-b border-white/10 grid grid-cols-4 gap-1 font-mono text-[10px] bg-black/20">
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 font-bold transition-all cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dokumente</span>
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 font-bold transition-all cursor-pointer ${
              activeTab === 'functions'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Aktionen</span>
          </button>
          <button
            onClick={() => setActiveTab('voice_specs')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 font-bold transition-all cursor-pointer ${
              activeTab === 'voice_specs'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Voice Command</span>
          </button>
          <button
            onClick={() => setActiveTab('status_cases')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 font-bold transition-all cursor-pointer relative ${
              activeTab === 'status_cases'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Fälle (4)</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs custom-scrollbar">
          {/* 1. DOCS TAB */}
          {activeTab === 'docs' && (
            <div className="space-y-3">
              {/* SEARCH INPUT */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="S2k Leitlinie oder ICD-10 suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>

              {filteredDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-1.5 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-100 text-xs leading-snug group-hover:text-cyan-300 transition-colors">
                      {doc.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-bold shrink-0">
                      {doc.mde}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold">
                    {doc.code}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {doc.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono text-[9px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. FUNCTIONS TAB */}
          {activeTab === 'functions' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Schnellbefehle für das S2k Forensik-System</span>
              </div>

              {quickFunctions.map((fn, idx) => (
                <button
                  key={idx}
                  onClick={fn.action}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10 group-hover:border-cyan-500/40 shrink-0">
                    {fn.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-200 text-xs group-hover:text-cyan-300 transition-colors">
                      {fn.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {fn.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors self-center shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* 3. VOICE SPECS TAB */}
          {activeTab === 'voice_specs' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400 shrink-0" />
                <span>UDO Voice Engine Assistant Command Cheatsheet</span>
              </div>

              {voiceSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-rose-500/30 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                      "{spec.trigger}"
                    </span>
                    <button
                      onClick={() => handleCopy(`Hey UDO ${spec.trigger}`, idx)}
                      className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                      title="Kopieren"
                    >
                      {copiedIndex === idx ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans mt-1">
                    {spec.action}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 4. STATUS CASES TAB */}
          {activeTab === 'status_cases' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center font-mono text-[10px]">
                <span className="text-slate-400">Status Übersicht:</span>
                <span className="text-rose-400 font-bold">2 Kritisch</span>
                <span className="text-amber-400 font-bold">2 Prüfung</span>
              </div>

              {statusCases.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${c.color} space-y-1.5 transition-all hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="font-bold">{c.id}</span>
                    <span className="px-1.5 py-0.2 rounded font-extrabold uppercase bg-black/40">
                      {c.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-100 text-xs">
                    {c.patient}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {c.issue}
                  </p>
                  <button
                    onClick={() => {
                      if (onTriggerDrBubble) {
                        onTriggerDrBubble(`Fall ${c.id} (${c.patient}) in S2k-Pipeline geladen.`);
                      }
                    }}
                    className="w-full mt-1 py-1 rounded bg-black/40 border border-white/10 hover:border-white/20 text-slate-200 text-[10px] font-mono font-bold uppercase transition-colors"
                  >
                    Fall Details Öffnen →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL FOOTER */}
        <div className="p-3 border-t border-white/10 bg-black/30 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>S2k AWMF Live Sync</span>
          </div>
          <span className="text-cyan-400">UDO R1 (Dr. Gratsiano)/V3</span>
        </div>
      </aside>
    </div>
  );
};
