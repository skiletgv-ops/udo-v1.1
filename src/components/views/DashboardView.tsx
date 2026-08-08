import React, { useState } from 'react';
import { QuickStatsWidget } from '../dashboard/QuickStatsWidget';
import {
  ShieldCheck,
  Zap,
  Lock,
  TrendingDown,
  BrainCircuit,
  Activity,
  Microscope,
  Stethoscope,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Wifi,
  Clock,
  Award,
  FileText,
  Upload,
  Layers,
  Terminal,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'audit'>('overview');

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in font-sans text-[#CBD5E1]">
      
      {/* HEADER SECTION: Left Administrator Mrs. Ulrike Bongartz Profile & Credentials, Right SYSTEM SECURE Badge */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-[#334155] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border-2 border-violet-400 flex items-center justify-center text-violet-300 shadow-[0_0_25px_rgba(139,92,246,0.3)]">
              <Award className="w-8 h-8 text-violet-300" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 border-2 border-[#0A0A0F] shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/50 uppercase tracking-wider">
                Administrator
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 uppercase tracking-wider">
                AWMF-S2k Certified Forensic Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Frau Dr. med. Ulrike Bongartz
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-200 mt-1">
              Praxisinhaberin & Leitung S2k-Forensik • Senior Medical Administrator
            </p>
          </div>
        </div>

        {/* Top Right "SYSTEM SECURE" Badge */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto relative z-10">
          <div className="px-4 py-2 rounded-xl bg-teal-400/20 border-2 border-teal-400 text-teal-200 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400" />
            </span>
            <span>UDO S2K ACTIVE</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-violet-500/20 border-2 border-violet-400 text-violet-200 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            PORTAL V2.1
          </div>
        </div>
      </div>

      {/* ZONE 2: MAIN CONTENT TOP ROW - 4 HIGH-LEVEL METRIC CARDS IN A 12-COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* STAT 1: 99.8% */}
        <div className="p-5.5 rounded-2xl bg-[#0f172a] border border-[#334155] shadow-xl flex flex-col justify-between space-y-3 hover:border-cyan-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Clinical Compliance
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">
              99.8%
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-snug">
              AWMF S2k Guideline Compliance
            </p>
          </div>
          <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-mono text-cyan-300 font-bold">
            <span>LEITLINIEN MATCH</span>
            <span>L4/L5 & L5/S1</span>
          </div>
        </div>

        {/* STAT 2: 0.85s */}
        <div className="p-5.5 rounded-2xl bg-[#0f172a] border border-[#334155] shadow-xl flex flex-col justify-between space-y-3 hover:border-violet-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Consensus Speed
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400 flex items-center justify-center text-violet-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-violet-300 font-mono tracking-tight">
              0.85s
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-snug">
              Multi-Agent Consensus Speed
            </p>
          </div>
          <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-mono text-violet-300 font-bold">
            <span>INFERENCE TIME</span>
            <span>Parallel Quad-Core</span>
          </div>
        </div>

        {/* STAT 3: 100% */}
        <div className="p-5.5 rounded-2xl bg-[#0f172a] border border-[#334155] shadow-xl flex flex-col justify-between space-y-3 hover:border-teal-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Forensic Safety
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              100%
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-snug">
              Forensic Audit Safety Rate
            </p>
          </div>
          <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-mono text-teal-300 font-bold">
            <span>AUDIT VERIFIED</span>
            <span>eIDAS QES Pass</span>
          </div>
        </div>

        {/* STAT 4: 82% */}
        <div className="p-5.5 rounded-2xl bg-[#0f172a] border border-[#334155] shadow-xl flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Cost Reduction
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
              82%
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-snug">
              Practice Cost & Admin Reduction
            </p>
          </div>
          <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
            <span>SAVINGS INDEX</span>
            <span>BG Bau & Sozialgericht</span>
          </div>
        </div>

      </div>

      {/* QUICK-STATS WIDGET */}
      <QuickStatsWidget />

      {/* ZONE 3 & ZONE 4: MIDDLE SECTION (12-COLUMN GRID) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 COLUMNS): WORKFLOW & AI SCAN & CASES */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* WORKFLOW HUB & ACTIVE DOSSIER CARD */}
          <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Patienten-Akte & S2k Workflow
                </h2>
                <p className="text-[13px] font-medium text-[#64748B]">
                  Dossier: Hans Müller (BG-2026-9901-A) • AOK Nordost
                </p>
              </div>

              {/* Action buttons: Primary Purple, Secondary Outline-Cyan, GPU Accelerator small tag */}
              <div className="flex items-center gap-3 flex-wrap">
                <button className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Analyse Starten</span>
                </button>

                <button className="px-5 py-2.5 rounded-xl border border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF]/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Befunde Prüfen</span>
                </button>

                {/* GPU Accelerator Small Tag */}
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 uppercase">
                  GPU Accelerator
                </span>
              </div>
            </div>

            {/* Active Dossier details & Flagged findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <span className="text-[13px] font-medium text-[#64748B] block font-mono">
                  PATIENTEN STAMMDATEN
                </span>
                <div className="text-base font-bold text-white">Hans Müller</div>
                <div className="text-[13px] font-medium text-[#CBD5E1]">
                  Geb. 14.05.1968 • Aktenzeichen: BG-2026-9901-A
                </div>
                <div className="text-[13px] font-medium text-[#64748B]">
                  Auftraggeber: BG Bau / Sozialgericht Berlin
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <span className="text-[13px] font-medium text-[#64748B] block font-mono">
                  KRITISCHE BEFUNDE
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#FB923C]/10 text-[#FB923C] border border-[#FB923C]/30">
                    L4/L5 radiculopathy flagged
                  </span>
                </div>
                <p className="text-[13px] font-medium text-[#CBD5E1] leading-relaxed">
                  Bandscheibenvorfall L4/L5 rechts mit Nervenwurzelkompression. Verengung Neuroforamen ca. 65%.
                </p>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-2">
              <span className="text-[13px] font-medium text-[#64748B] uppercase tracking-wider font-mono block">
                Zugehörige Vorlage-Dokumente
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0A0A0F]/40 border border-[#1E293B] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2DD4BF]" />
                    <span className="text-white font-bold">MRT_LWS_14032024.pdf</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">4.2 MB</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0A0F]/40 border border-[#1E293B] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="text-white font-bold">CT_Thorax_02022024.pdf</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">12.8 MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-KI-AGENTEN SCAN CARD */}
          <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  4-KI-Agenten S2k Parallel Scan
                </h2>
                <p className="text-[13px] font-medium text-[#64748B]">
                  Simultane neuronale Analyse nach AWMF S2k Richtlinien
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 uppercase">
                Consensus 99.8%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Agent 1 */}
              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Dr. Clara Voss</span>
                      <span className="text-[11px] font-mono text-[#64748B]">Radiologie KI</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2DD4BF]">99.8%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2DD4BF] h-full w-[99.8%]" />
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                      <Microscope className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Dr. Eric Thorne</span>
                      <span className="text-[11px] font-mono text-[#64748B]">Pathologie KI</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8B5CF6]">99.4%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#8B5CF6] h-full w-[99.4%]" />
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Dr. Marcel Richter</span>
                      <span className="text-[11px] font-mono text-[#64748B]">Klinische KI</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2DD4BF]">97.9%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2DD4BF] h-full w-[97.9%]" />
                </div>
              </div>

              {/* Agent 4 */}
              <div className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Dr. Gratsiano Silva</span>
                      <span className="text-[11px] font-mono text-[#64748B]">Forschungs KI</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8B5CF6]">99.6%</span>
                </div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#8B5CF6] h-full w-[99.6%]" />
                </div>
              </div>
            </div>
          </div>

          {/* AKTUELLE GUTACHTEN-FÄLLE CARD */}
          <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Aktuelle Gutachten-Fälle
              </h2>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                5 Aktive Akten
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Hans Müller (BG-2026-9901-A)</span>
                  <span className="text-[11px] text-[#64748B]">MRT LWS, CT Thorax, Histologie</span>
                </div>
                <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  In Bearbeitung
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Erika Schmidt (BG-2026-8812-B)</span>
                  <span className="text-[11px] text-[#64748B]">Gonalgie rechts, Gonarthrose</span>
                </div>
                <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  Signiert (QES)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Dr. med. A. Voss (Chief Examiner)</span>
                  <span className="text-[11px] text-[#64748B]">QES Signaturverifizierung freigegeben</span>
                </div>
                <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  AWMF S2k Konform
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 COLUMNS): S2K NEURAL STREAM LIVE LOGS & SYSTEM METRICS / eIDAS TILE */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* S2K NEURAL STREAM (LIVE LOGS) CARD */}
          <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8B5CF6]" />
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  S2k Neural Stream
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#2DD4BF] font-bold uppercase">
                LIVE LOGS
              </span>
            </div>

            {/* Live Log Stream Items */}
            <div className="space-y-2.5 font-mono text-xs max-h-[380px] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#8B5CF6]">11:42:05</span>
                  <span>AWMF S2k Core</span>
                </div>
                <p className="text-white font-medium">AWMF S2k Rule Engine Active</p>
                <div className="text-[10px] text-[#2DD4BF] truncate">
                  Registernr: 033/050 • L4/L5 Consensus
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#FB923C]">11:42:01</span>
                  <span>Finding Alert</span>
                </div>
                <p className="text-white font-medium">L4/L5 radiculopathy flagged</p>
                <div className="text-[10px] text-[#64748B]">
                  Confidence: 99.8% • Diskusprotrusion
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#2DD4BF]">11:41:55</span>
                  <span>Crypto Hash</span>
                </div>
                <p className="text-white font-medium truncate">SHA256: 8f9b2c3a7d4e1f82c9e</p>
                <div className="text-[10px] text-[#2DD4BF]">Audit Trail Signed</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#2DD4BF]">11:41:48</span>
                  <span>eIDAS QES Seal</span>
                </div>
                <p className="text-white font-medium">eIDAS QES Seal Verified</p>
                <div className="text-[10px] text-[#64748B]">Pass Rate: 100% • BSI Cert</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#8B5CF6]">11:41:30</span>
                  <span>Agent Voting</span>
                </div>
                <p className="text-white font-medium">Consensus Voting: 4/4 Unanimous</p>
                <div className="text-[10px] text-[#8B5CF6]">Dr. Clara, Eric, Marcel, Gratsiano</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#2DD4BF]">11:41:12</span>
                  <span>Radiologie Tensor</span>
                </div>
                <p className="text-white font-medium">Dr. Clara Voss: MRT-Tensor sync</p>
                <div className="text-[10px] text-[#64748B]">MRT_LWS_14032024.pdf processed</div>
              </div>
            </div>
          </div>

          {/* ZONE 4: SYSTEM METRICS & eIDAS CERTIFICATE COMPACT TILE DIRECTLY BELOW LIVE LOGS */}
          <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#8B5CF6]" />
                <span>System Metrics & eIDAS</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                ACTIVE
              </span>
            </div>

            {/* System Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B]">
                <span className="text-[11px] text-[#64748B] block font-medium">CPU</span>
                <span className="text-sm font-bold text-[#2DD4BF]">18%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B]">
                <span className="text-[11px] text-[#64748B] block font-medium">NETWORK</span>
                <span className="text-sm font-bold text-[#8B5CF6]">1.2 Gb/s</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0A0A0F]/60 border border-[#1E293B]">
                <span className="text-[11px] text-[#64748B] block font-medium">LATENCY</span>
                <span className="text-sm font-bold text-[#2DD4BF]">11 ms</span>
              </div>
            </div>

            {/* eIDAS Certificate Tile */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0F]/80 border border-[#2DD4BF]/30 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  eIDAS Certificate
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2DD4BF]/20 text-[#2DD4BF]">
                  VALID
                </span>
              </div>
              <div className="text-[11px] text-[#CBD5E1] truncate">
                SHA256: 8f9b2c3a7d4e1f82c9e
              </div>
              <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-1 border-t border-[#1E293B]">
                <span>BSI-Zertifiziert</span>
                <span className="text-[#2DD4BF]">Qualifizierte eIDAS Signatur</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
