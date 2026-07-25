import React, { useState } from 'react';
import { LayoutGrid, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { TopSystemBar } from './TopSystemBar';
import { BottomDock } from './BottomDock';
import { UdoModulePanel } from './UdoModulePanel';
import { RightControlPanel } from './RightControlPanel';
import { ParticleBackground } from './ParticleBackground';
import { ActiveTab } from '../types';

interface NavigationShellProps {
  children: React.ReactNode;
  activeTab: ActiveTab | null;
  onSelectTab: (tab: ActiveTab | null) => void;
  activeModuleName?: string;
  drBubbleMessage?: string | null;
  onCloseDrBubble?: () => void;
  onDrBubbleTrigger?: (msg: string) => void;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({
  children,
  activeTab,
  onSelectTab,
  activeModuleName,
  drBubbleMessage,
  onCloseDrBubble,
  onDrBubbleTrigger
}) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 3D PARTICLE STARFIELD BACKGROUND */}
      <ParticleBackground />

      {/* TOP SYSTEM BAR */}
      <TopSystemBar
        activeModuleName={activeModuleName}
        onResetToMain={() => onSelectTab(null)}
        onDrBubbleTrigger={onDrBubbleTrigger}
        onSelectTab={onSelectTab}
      />

      {/* FLOATING LEFT TOGGLE BUTTON (WORKSPACE NAVIGATOR) */}
      <button
        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        className={`fixed left-3 top-20 z-[90] h-10 w-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto ${
          leftPanelOpen
            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(0,212,170,0.35)]'
            : 'hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,212,170,0.2)]'
        }`}
        title="Workspace Navigator umschalten"
      >
        <LayoutGrid className="w-5 h-5 text-cyan-400" />
      </button>

      {/* FLOATING RIGHT TOGGLE BUTTON (SYSTEM CONTROL) */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className={`fixed right-3 top-20 z-[90] h-10 w-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto ${
          rightPanelOpen
            ? 'bg-violet-500/20 border-violet-400/50 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.35)]'
            : 'hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]'
        }`}
        title="System Control umschalten"
      >
        <SlidersHorizontal className="w-5 h-5 text-violet-400" />
      </button>

      {/* LEFT SIDEBAR PANEL */}
      {leftPanelOpen && (
        <UdoModulePanel
          activeTab={activeTab}
          onSelectTab={(tab) => {
            onSelectTab(tab);
            setLeftPanelOpen(false);
          }}
          onClose={() => setLeftPanelOpen(false)}
          onDrBubbleTrigger={onDrBubbleTrigger}
        />
      )}

      {/* RIGHT SIDEBAR PANEL */}
      {rightPanelOpen && (
        <RightControlPanel onClose={() => setRightPanelOpen(false)} />
      )}

      {/* DR. BUBBLE ASSISTANT NOTIFICATION POPUP */}
      {drBubbleMessage && (
        <div className="fixed bottom-20 right-6 z-[110] max-w-sm bg-[#111217]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,212,170,0.3)] animate-fade-in flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,212,170,0.5)]">
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
          </div>
          <div className="flex-1 text-xs text-slate-200 font-sans leading-relaxed">
            <div className="font-mono text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider mb-0.5">
              U.D.O. Forensic Assistant
            </div>
            {drBubbleMessage}
          </div>
          <button
            onClick={onCloseDrBubble}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 pt-16 pb-20 relative z-10 min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      {/* BOTTOM COMMAND DOCK */}
      <BottomDock activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
};
