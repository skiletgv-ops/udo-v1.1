import React from 'react';
import { Clock, FileText, TrendingDown, AlertCircle, CheckCircle2, Zap, ArrowRight, Activity } from 'lucide-react';

export const QuickStatsWidget: React.FC = () => {
  const pendingCount = 7;
  const avgTimeMinutes = 14.2;
  const conventionalTimeMinutes = 120.0;
  const timeSavingsPercent = Math.round(((conventionalTimeMinutes - avgTimeMinutes) / conventionalTimeMinutes) * 100);

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4 font-sans text-slate-200">
      {/* WIDGET HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Quick-Stats: Gutachten-Performance</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Echtzeit-Analyse der ausstehenden S2k-Fälle & Bearbeitungszeiten
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 size={12} /> 98.4% On-Time
          </span>
        </div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STAT 1: AUSSTEHENDE GUTACHTEN */}
        <div className="p-4 rounded-xl bg-[#0A0A0F]/80 border border-white/10 space-y-3 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Ausstehende Gutachten</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              1 Eilfall
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Fälle in aktiver Bearbeitung
            </span>
          </div>

          {/* STATUS BREAKDOWN STACK */}
          <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Vorbefund-Extraktion (OCR)
              </span>
              <span className="font-bold text-cyan-300">3 Fälle</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-400" /> 4-KI-Konsens-Analyse
              </span>
              <span className="font-bold text-violet-300">2 Fälle</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Arzt-Gegenzeichnung (QES)
              </span>
              <span className="font-bold text-emerald-300">2 Fälle</span>
            </div>
          </div>
        </div>

        {/* STAT 2: DURCHSCHNITTLICHE BEARBEITUNGSZEIT */}
        <div className="p-4 rounded-xl bg-[#0A0A0F]/80 border border-white/10 space-y-3 relative overflow-hidden group hover:border-violet-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Ø Bearbeitungszeit</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <TrendingDown size={12} /> -{timeSavingsPercent}% Zeitersparnis
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-violet-300 font-mono tracking-tight">
              {avgTimeMinutes}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Minuten pro Gutachten
            </span>
          </div>

          {/* VISUAL TIME COMPARISON BAR */}
          <div className="space-y-1.5 pt-2 border-t border-white/10 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>UDO S2k (14.2 min) vs. Konventionell (120 min)</span>
              <span className="text-emerald-400 font-bold">-105.8 min</span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(avgTimeMinutes / conventionalTimeMinutes) * 100}%` }}
                className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full"
              />
              <div
                style={{ width: `${100 - (avgTimeMinutes / conventionalTimeMinutes) * 100}%` }}
                className="bg-slate-700/50 h-full"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
              <span>Automatisierte S2k Pipeline</span>
              <span className="text-cyan-400 font-semibold">Ø 14.2 min • Target {'<'} 20 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
