import React from 'react';
import {
  SlidersHorizontal,
  X,
  Cpu,
  Wifi,
  Volume2,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface RightControlPanelProps {
  onClose: () => void;
}

export const RightControlPanel: React.FC<RightControlPanelProps> = ({ onClose }) => {
  return (
    <aside className="fixed right-3 top-16 bottom-20 z-[95] w-72 md:w-80 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-violet-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col transition-all duration-300 overflow-hidden">
      {/* HEADER */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
        <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-extrabold flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          SYSTEM CONTROL & TELEMETRY
        </span>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          title="Schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* METRICS & CONTROLS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {/* LIVE SYSTEM METRICS */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
            LIVE SYSTEM METRICS
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>CPU LOAD</span>
              </div>
              <span className="text-sm font-bold text-white mt-1">14.2 %</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-violet-400 text-[10px]">
                <Wifi className="w-3.5 h-3.5" />
                <span>NETZWERK</span>
              </div>
              <span className="text-sm font-bold text-white mt-1">1.2 GB/s</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px]">
                <Volume2 className="w-3.5 h-3.5" />
                <span>AUDIO IN</span>
              </div>
              <span className="text-sm font-bold text-white mt-1">48 kHz</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
                <Clock className="w-3.5 h-3.5" />
                <span>LATENZ</span>
              </div>
              <span className="text-sm font-bold text-white mt-1">12 ms</span>
            </div>
          </div>
        </div>

        {/* QES SECURITY CERTIFICATE */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>eIDAS QES CERTIFICATE</span>
          </div>
          <p className="text-[10px] text-emerald-200/80 leading-relaxed">
            Gültig für Dr. med. A. Voss (Zulassungsnr: G-2026-7742-QES). BSI-zertifizierte HSM-Verschlüsselung aktiv.
          </p>
          <div className="text-[9px] font-mono text-emerald-400/90 truncate bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-500/20">
            SHA256: 8f9b2c3a4e5d6f7a8b9c0d1e2f3a4b5c
          </div>
        </div>

        {/* AWMF S2k LEITLINIEN ENGINE */}
        <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 space-y-2">
          <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
            <Zap className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>AWMF S2k LEITLINIEN CORE</span>
          </div>
          <div className="space-y-1 text-[10px] text-violet-200/90">
            <div className="flex justify-between border-b border-violet-500/20 pb-1">
              <span>AWMF Reg. 033/050 (Orthopädie)</span>
              <span className="text-cyan-400 font-bold">100% Match</span>
            </div>
            <div className="flex justify-between border-b border-violet-500/20 pb-1">
              <span>ECCO Guidelines 2026 (Kolitis)</span>
              <span className="text-cyan-400 font-bold">100% Match</span>
            </div>
            <div className="flex justify-between">
              <span>GOLD II COPD Richtlinie</span>
              <span className="text-cyan-400 font-bold">100% Match</span>
            </div>
          </div>
        </div>

        {/* NEURAL STREAM SIMULATION */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between font-bold uppercase text-[11px] text-cyan-400">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>S2k NEURAL STREAM</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="p-2 rounded-xl bg-black/60 font-mono text-[9px] text-cyan-300/80 leading-relaxed space-y-1 overflow-hidden">
            <div>&gt; [02:43:01] Neural consensus 99.2%</div>
            <div>&gt; [02:43:03] OCR parse MRT_LWS_14032024 ok</div>
            <div>&gt; [02:43:04] L4/L5 radiculopathy flagged</div>
            <div>&gt; [02:43:05] S2k citation index mapped</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
