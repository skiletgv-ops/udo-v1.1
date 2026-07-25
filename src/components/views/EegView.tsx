import React from 'react';
import { Activity, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const EegView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <Badge variant="violet" pulse>EEG Signal Processing</Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            EEG Signal Analysis & Waveform Canvas
          </h1>
        </div>
        <Badge variant="cyan">Sampling 500 Hz</Badge>
      </div>

      <Card glow="violet" className="p-6 space-y-4">
        <div className="flex justify-between items-center font-mono text-xs text-slate-300 border-b border-white/10 pb-3">
          <span className="font-bold text-violet-400 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            LIVE KANÄLE (F3, F4, C3, C4, P3, P4, O1, O2)
          </span>
          <span>Alpha Rhythmus: 10.2 Hz</span>
        </div>

        {/* SIMULATED WAVEFORM CANVAS */}
        <div className="h-64 bg-black/60 rounded-xl border border-violet-500/30 p-4 font-mono text-[10px] text-cyan-400 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse pointer-events-none" />
          <div className="border-b border-white/10 pb-1 flex justify-between">
            <span>F3-C3: 12.4 uV</span>
            <span className="text-emerald-400">Normal Sync</span>
          </div>
          <div className="border-b border-white/10 pb-1 flex justify-between">
            <span>F4-C4: 11.8 uV</span>
            <span className="text-emerald-400">Normal Sync</span>
          </div>
          <div className="border-b border-white/10 pb-1 flex justify-between">
            <span>P3-O1: 18.2 uV</span>
            <span className="text-violet-400">Alpha Spike</span>
          </div>
          <div className="flex justify-between">
            <span>P4-O2: 17.9 uV</span>
            <span className="text-violet-400">Alpha Spike</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
