import React from 'react';
import {
  BrainCircuit,
  Sparkles,
  FileText,
  Upload,
  Activity,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface HauptraumCanvasProps {
  onSelectTab: (tab: ActiveTab) => void;
  onDrBubbleTrigger: (msg: string) => void;
}

export const HauptraumCanvas: React.FC<HauptraumCanvasProps> = ({
  onSelectTab,
  onDrBubbleTrigger
}) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in py-6 font-sans text-[#CBD5E1]">
      
      {/* HERO TITLE BLOCK */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(45,212,191,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF] animate-pulse" />
          <span>S2k Neural Forensic Core V4.0</span>
          {/* Small GPU Accelerator Tag */}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40 ml-1">
            GPU Accelerator
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          UDO S2k Forensic Hub
        </h1>

        <p className="text-base text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
          Gerichtsverwertbares KI-Gutachten-System nach AWMF-S2k-Richtlinien mit 4-Köpfigem KI-Konsens.
        </p>

        {/* PRIMARY & SECONDARY ACTION BUTTONS: Purple #8B5CF6 & Outline-Cyan #2DD4BF */}
        <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
          <button
            onClick={() => onSelectTab('scan')}
            className="px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Analyse Starten</span>
          </button>

          <button
            onClick={() => onSelectTab('review')}
            className="px-6 py-3 rounded-xl border border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF]/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5"
          >
            <FileText className="w-4 h-4" />
            <span>Befunde Prüfen</span>
          </button>
        </div>
      </div>

      {/* QUICK WORKSPACE TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* CARD 1 */}
        <div
          onClick={() => onSelectTab('upload')}
          className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-3 cursor-pointer hover:border-[#2DD4BF]/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
              <Upload className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
              Schritt 1
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">1. Akten-Upload & Stammdaten</h3>
          <p className="text-[13px] font-medium text-[#64748B] leading-relaxed">
            Patientendaten erfassen, MRT/CT Befunde, Histologie und Laborwerte hochladen.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#2DD4BF] font-bold pt-2 group-hover:translate-x-1 transition-transform">
            <span>Akte Öffnen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CARD 2 */}
        <div
          onClick={() => onSelectTab('scan')}
          className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-3 cursor-pointer hover:border-[#8B5CF6]/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
              Schritt 2
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">2. 4-KI-Agenten Scan</h3>
          <p className="text-[13px] font-medium text-[#64748B] leading-relaxed">
            Simultane Analyse durch Radiologie, Pathologie, Klinische & Forschungs-KI.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#8B5CF6] font-bold pt-2 group-hover:translate-x-1 transition-transform">
            <span>Analyse Starten</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CARD 3 */}
        <div
          onClick={() => onSelectTab('review')}
          className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-3 cursor-pointer hover:border-[#2DD4BF]/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
              Schritt 3
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">3. Befund-Bewertung</h3>
          <p className="text-[13px] font-medium text-[#64748B] leading-relaxed">
            Pathologische Befunde validieren, ICD-10 Zuordnung und AWMF-Evidenz prüfen.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#2DD4BF] font-bold pt-2 group-hover:translate-x-1 transition-transform">
            <span>Befunde Prüfen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* S2K SYSTEM HIGHLIGHTS: 4 STAT CARDS WITH DESCRIPTIVE SUBTITLES DIRECTLY UNDERNEATH BIG NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs pt-2">
        
        <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-1">
          <span className="text-[13px] font-medium text-[#64748B] uppercase block">KI-KONSENS</span>
          <div className="text-[22px] font-bold text-[#2DD4BF]">99.2%</div>
          <span className="text-[13px] font-medium text-[#64748B] block mt-1">
            4-Köpfiges Ärzteteam Abstimmung
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-1">
          <span className="text-[13px] font-medium text-[#64748B] uppercase block">LEITLINIEN MATCH</span>
          <div className="text-[22px] font-bold text-[#8B5CF6]">AWMF S2k</div>
          <span className="text-[13px] font-medium text-[#64748B] block mt-1">
            Registernummer: 033/050
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-1">
          <span className="text-[13px] font-medium text-[#64748B] uppercase block">QUALIFIZIERTE SIGNATUR</span>
          <div className="text-[22px] font-bold text-[#2DD4BF]">QES eIDAS</div>
          <span className="text-[13px] font-medium text-[#64748B] block mt-1">
            BSI-Zertifizierte Siegelung
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-1">
          <span className="text-[13px] font-medium text-[#64748B] uppercase block">RESPONSE TIME</span>
          <div className="text-[22px] font-bold text-[#2DD4BF]">&lt; 12 ms</div>
          <span className="text-[13px] font-medium text-[#64748B] block mt-1">
            GPU Accelerated Tensor Core
          </span>
        </div>

      </div>

    </div>
  );
};
