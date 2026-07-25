import React, { useState } from 'react';
import {
  BrainCircuit,
  ChevronDown,
  ChevronLeft,
  X,
  Mic,
  FileText,
  Activity,
  Video,
  FolderOpen,
  FileEdit,
  BookOpen,
  BarChart3,
  Calendar,
  Key,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';

interface UdoModulePanelProps {
  activeTab: ActiveTab | null;
  onSelectTab: (tab: ActiveTab | null) => void;
  onClose: () => void;
  onDrBubbleTrigger?: (msg: string) => void;
}

export const UdoModulePanel: React.FC<UdoModulePanelProps> = ({
  activeTab,
  onSelectTab,
  onClose,
  onDrBubbleTrigger
}) => {
  const { isAdmin } = useRoleContext();
  const { pendingCount } = usePrescriptionContext();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    diagnostik: true,
    forensik: true,
    praxis: true
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const navCategories = [
    {
      id: 'diagnostik',
      title: 'MEDIZIN & DIAGNOSTIK',
      items: [
        { id: 'upload' as ActiveTab, label: 'Upload & Patient', icon: FolderOpen },
        { id: 'scan' as ActiveTab, label: 'KI-Agenten Scan', icon: Sparkles },
        { id: 'review' as ActiveTab, label: 'Befunde Review', icon: Activity },
        { id: 'gutachten' as ActiveTab, label: 'S2k Gutachten', icon: FileText },
        { id: 'consult' as ActiveTab, label: 'Voice & Consult', icon: Mic },
        { id: 'eeg' as ActiveTab, label: 'EEG Workspace', icon: Activity },
        { id: 'video' as ActiveTab, label: 'Video Analyse', icon: Video },
      ]
    },
    {
      id: 'forensik',
      title: 'DOKUMENTE & RECHT',
      items: [
        { id: 'documents' as ActiveTab, label: 'Dokumenten OCR', icon: FolderOpen },
        { id: 'gutachten' as ActiveTab, label: 'QES Gutachten', icon: FileEdit },
        ...(isAdmin
          ? [{ id: 'approvals' as ActiveTab, label: 'Genehmigungs-Queue', icon: ShieldCheck, badge: pendingCount }]
          : []),
      ]
    },
    {
      id: 'praxis',
      title: 'PRAXIS & MANAGEMENT',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Executive Board', icon: BarChart3 },
        { id: 'calendar' as ActiveTab, label: 'Terminkalender', icon: Calendar },
        { id: 'admin' as ActiveTab, label: 'Admin & Keys', icon: Key },
      ]
    }
  ];

  return (
    <aside className="fixed left-3 top-16 bottom-20 z-[95] w-72 md:w-80 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col transition-all duration-300 overflow-hidden">
      {/* HEADER */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          WORKSPACE NAVIGATOR
        </span>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          title="Schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ACCORDION CATEGORIES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
        {navCategories.map((cat) => {
          const isOpen = openCategories[cat.id] ?? true;
          return (
            <div key={cat.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer"
              >
                <span>{cat.title}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pl-1 space-y-1 border-l border-white/10 ml-2">
                  {cat.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          onSelectTab(item.id);
                        }}
                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl transition-all duration-200 border border-transparent cursor-pointer text-xs ${
                          isActive
                            ? 'text-cyan-300 bg-cyan-500/15 border-l-2 border-l-[#00D4AA] border-y-transparent border-r-transparent shadow-[0_0_16px_rgba(0,212,170,0.2)] font-semibold pl-3'
                            : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:shadow-[0_0_12px_rgba(0,212,170,0.15)]'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate font-medium flex-1">{item.label}</span>
                        {(item as any).badge !== undefined && (item as any).badge > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] font-bold animate-pulse">
                            {(item as any).badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* EMBEDDED U.D.O. MODULE CARD */}
        <div className="pt-2 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#111217] to-[#0d0e12] border border-cyan-500/20 shadow-[0_0_20px_rgba(0,212,170,0.1)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest block">
                  U.D.O. MODULE V4.0
                </span>
                <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                  NEURAL DIAGNOSTIC CORE
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,170,0.8)] animate-pulse" />
            </div>

            {/* ROBOT AVATAR WITH REACTIVE GLOW RING */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute -inset-3 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
              <div className="absolute -inset-0.5 rounded-full border border-cyan-500/20 shadow-[0_0_25px_rgba(0,212,170,0.2)]" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] border border-cyan-400/40 flex items-center justify-center shadow-inner">
                <BrainCircuit className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            {/* SPRACH-TEST BUTTON */}
            <button
              onClick={() => {
                if (onDrBubbleTrigger) {
                  onDrBubbleTrigger('U.D.O. S2k Voice Core bereit. Sprechen Sie jetzt...');
                }
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,212,170,0.3)] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Sprach-Test Starten</span>
            </button>

            {/* 4-KI-KONSENS MATRIX WITH VISUAL GAUGES */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase">
                <span>4-KI-KONSENS MATRIX</span>
                <span className="text-cyan-400">99.2%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Clara</span>
                    <span className="text-cyan-400">99.8%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full shadow-[0_0_6px_rgba(0,212,170,0.6)]"
                      style={{ width: '99.8%' }}
                    />
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Eric</span>
                    <span className="text-violet-400">99.4%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.6)]"
                      style={{ width: '99.4%' }}
                    />
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Marcel</span>
                    <span className="text-cyan-400">97.9%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full shadow-[0_0_6px_rgba(0,212,170,0.6)]"
                      style={{ width: '97.9%' }}
                    />
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Gratsiano</span>
                    <span className="text-violet-400">99.6%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.6)]"
                      style={{ width: '99.6%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onSelectTab('consult')}
                className="py-1.5 px-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Consult
              </button>
              <button
                onClick={() => onSelectTab('gutachten')}
                className="py-1.5 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,212,170,0.3)] text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Gutachten
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
