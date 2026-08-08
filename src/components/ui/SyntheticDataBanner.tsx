import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SyntheticDataBanner: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 border-b border-amber-500/30 text-slate-300 text-[11px] font-mono py-1.5 px-3 flex flex-wrap items-center justify-between gap-2 shadow-md z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-semibold tracking-wider uppercase text-[10px]">
          <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
          SYNTHETIC DEMONSTRATION DATA — NOT A REAL PATIENT
        </span>
        <span className="hidden md:inline text-slate-400">|</span>
        <span className="hidden md:inline text-slate-300">
          UDO 2032 System Architecture v2.4
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="font-semibold text-[10px]">ENGINEERING: READY</span>
        </div>

        <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span className="font-semibold text-[10px]">REGULATORY: NOT CE CERTIFIED</span>
        </div>
      </div>
    </div>
  );
};
