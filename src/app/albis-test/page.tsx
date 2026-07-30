"use client";

import React, { useState } from "react";
import {
  UserSquare2,
  Users,
  CalendarClock,
  Network,
  BarChart3,
  FileScan,
  Pill,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  FlaskConical,
  Bot,
  Presentation,
  ShieldAlert,
  Building2,
  Sparkles
} from "lucide-react";
import StatusBar from "../../components/StatusBar";

import { KarteikarteModule } from "../../components/albis/KarteikarteModule";
import { WaitingRoomModule } from "../../components/albis/WaitingRoomModule";
import { AiGutachtenModule } from "../../components/albis/AiGutachtenModule";
import { PracticeCockpitModule } from "../../components/albis/PracticeCockpitModule";
import { TelematicsModule } from "../../components/albis/TelematicsModule";
import { MobileScribeModule } from "../../components/albis/MobileScribeModule";
import { IntelligentTriageModule } from "../../components/albis/IntelligentTriageModule";
import { MvzEcosystemModule } from "../../components/albis/MvzEcosystemModule";
import { GdprGuardianModule } from "../../components/albis/GdprGuardianModule";
import { ConciergeAiModule } from "../../components/albis/ConciergeAiModule";
import { GlobalWhitepaperModule } from "../../components/albis/GlobalWhitepaperModule";

export interface AlbisModule {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: "live" | "in-progress" | "completed";
  icon: React.ComponentType<{ className?: string; size?: number }>;
  component: React.FC;
}

export const MODULE_LIST: readonly AlbisModule[] = [
  {
    id: "karteikarte",
    phase: "Phase 1",
    title: "Patient Records (Karteikarte)",
    description: "Multi-layered GDT 2.1 chart viewer with live ALBIS bridge sync.",
    icon: UserSquare2,
    status: "live",
    component: KarteikarteModule
  },
  {
    id: "waiting-room",
    phase: "Phase 2",
    title: "Waiting Room Check-in Queue",
    description: "Interactive drag-and-drop queue management with no-show alerts.",
    icon: Users,
    status: "live",
    component: WaitingRoomModule
  },
  {
    id: "ai-gutachten",
    phase: "Phase 3",
    title: "AI Gutachten & GOÄ Billing",
    description: "Automated medical report drafting with S2k compliance & GOÄ codes.",
    icon: FileScan,
    status: "live",
    component: AiGutachtenModule
  },
  {
    id: "analytics",
    phase: "Phase 4",
    title: "Predictive Practice Cockpit",
    description: "Linear regression 30-day revenue forecast & LANR breakdown.",
    icon: BarChart3,
    status: "live",
    component: PracticeCockpitModule
  },
  {
    id: "telematics",
    phase: "Phase 5",
    title: "Autonomous Telematics (TI 2.0)",
    description: "KIM & Konnektor stub for eRezept, eAU, eArztbrief & ePA.",
    icon: Network,
    status: "live",
    component: TelematicsModule
  },
  {
    id: "mobile-scribe",
    phase: "Phase 6",
    title: "Voice-Driven Mobile Scribe",
    description: "Real-time voice dictation with AI medical term cleanup.",
    icon: Smartphone,
    status: "live",
    component: MobileScribeModule
  },
  {
    id: "triage",
    phase: "Phase 7",
    title: "Intelligent Triage & Prior Auth",
    description: "NLP emergency scanner & auto-generated Kostenübernahme PDF.",
    icon: ShieldAlert,
    status: "live",
    component: IntelligentTriageModule
  },
  {
    id: "mvz",
    phase: "Phase 8",
    title: "MVZ & Multi-Practice Network",
    description: "5 location switcher (Berlin, Munich, etc.) & masked patient lookup.",
    icon: Building2,
    status: "live",
    component: MvzEcosystemModule
  },
  {
    id: "gdpr",
    phase: "Phase 9",
    title: "Proactive GDPR Guardian",
    description: "Proximity auto-lock, Art. 15 JSON export & DSGVO audit PDF.",
    icon: ShieldCheck,
    status: "live",
    component: GdprGuardianModule
  },
  {
    id: "concierge",
    phase: "Phase 10",
    title: "Concierge AI Practice Assistant",
    description: "Automated workflow execution, SMS reminder dispatcher & chatbot.",
    icon: Bot,
    status: "live",
    component: ConciergeAiModule
  },
  {
    id: "whitepaper",
    phase: "Phase 11",
    title: "Global Whitepaper & Investor Deck",
    description: "Dynamic capability matrix from whitepaperConfig.json & slide deck.",
    icon: Presentation,
    status: "completed",
    component: GlobalWhitepaperModule
  }
];

interface AlbisTestPageProps {
  onNavigateToPortal?: () => void;
}

export default function AlbisTestPage({ onNavigateToPortal }: AlbisTestPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>("karteikarte");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleBack = () => {
    if (onNavigateToPortal) {
      onNavigateToPortal();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 p-4 sm:p-6 pb-24 relative font-sans">
      {/* TOP NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 max-w-7xl mx-auto border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono font-bold cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>PORTAL</span>
          </button>

          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-cyan-400 inline-block" />
              <span>UDO Medical OS v1.1 - The Future Clinic (Phases 1 - 11)</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Unified German Practice Operating System • Synchronized with whitepaperConfig.json
            </p>
          </div>
        </div>

        <div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1.5">
            <Sparkles size={12} /> ALL 11 PHASES LIVE & FUNCTIONAL
          </span>
        </div>
      </div>

      {/* QUICK SELECTOR TAB RIBBON */}
      <div className="max-w-7xl mx-auto mb-6 flex overflow-x-auto gap-2 pb-2 font-mono text-xs scrollbar-none">
        {MODULE_LIST.map((mod) => {
          const Icon = mod.icon;
          const isActive = expandedId === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setExpandedId(mod.id)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{mod.phase}: {mod.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE MODULE CONTAINER OR ALL MODULES ACCORDION */}
      <main className="max-w-7xl mx-auto space-y-6">
        {MODULE_LIST.map((mod) => {
          const Icon = mod.icon;
          const isExpanded = expandedId === mod.id;
          const ModuleComponent = mod.component;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-[#0a0f1d] border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(mod.id)}
                className="w-full text-left p-4 sm:p-5 focus:outline-none hover:bg-slate-800/30 transition-colors cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border ${isExpanded ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' : 'bg-slate-800/50 text-slate-400 border-white/5'}`}>
                    <Icon size={22} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        {mod.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {mod.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-cyan-400 font-bold shrink-0 self-center">
                  {isExpanded ? '▼ Einklappen' : '▶ Öffnen'}
                </div>
              </button>

              {/* LIVE COMPONENT INLINE */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-cyan-500/20 bg-[#080d19] animate-in fade-in duration-300">
                  <ModuleComponent />
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* FLOATING CONCIERGE AI FAB ASSISTANT */}
      <ConciergeAiModule />

      {/* BOTTOM STATUS BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-6 py-2">
        <StatusBar isBooted={true} onBack={handleBack} backLabel="Portal" />
      </div>
    </div>
  );
}
