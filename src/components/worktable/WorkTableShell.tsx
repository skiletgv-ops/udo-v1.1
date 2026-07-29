import React from 'react';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import { StatusBar } from '../StatusBar';
import SynapseBackground from '../ui/synapse-background';

export interface WorkTableShellProps {
  children?: React.ReactNode;
  onNavigateToPortal?: () => void;
}

export const WorkTableShell: React.FC<WorkTableShellProps> = ({
  children,
  onNavigateToPortal
}) => {
  return (
    <SynapseBackground
      lineColor={0x0ea5e9}
      particleColor={0x38bdf8}
      pulseColor={0xd946ef}
      connectionDistance={75}
      particleCount={1200}
      className="fixed inset-0 bg-[#020813] text-white overflow-hidden font-sans min-h-screen"
    >
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
        {/* SHARED STATUS BAR WITH BACK BUTTON */}
        <StatusBar
          onBack={onNavigateToPortal}
          backLabel="Portal"
          className="shrink-0"
        />

        {/* MAIN WORKTABLE CANVAS AREA */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {children ? (
            children
          ) : (
            /* CENTERED EMPTY-STATE MODULE */
            <div className="w-full max-w-md p-8 md:p-10 rounded-[28px] bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center text-center space-y-5 animate-fade-in pointer-events-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,212,170,0.2)]">
                <LayoutGrid className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold block">
                  SYSTEM MODULE SPACE
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">
                  Work Table — nothing here yet
                </h1>
                <p className="text-xs font-mono text-slate-400 leading-relaxed max-w-sm mx-auto pt-1">
                  This is where case tools and modules will live.
                </p>
              </div>

              {onNavigateToPortal && (
                <button
                  onClick={onNavigateToPortal}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Return to Portal</span>
                </button>
              )}
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="w-full max-w-6xl mx-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
          <span>UDO WORKTABLE MODULE ENGINE</span>
          <span>READY FOR EXPANSION</span>
        </footer>
      </div>
    </SynapseBackground>
  );
};

export default WorkTableShell;
