import React from 'react';
import { BarChart3, TrendingUp, Users, FileCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const DashboardView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <Badge variant="violet" pulse>Praxis & Forensik Overview</Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Executive Board & KPIs
          </h1>
        </div>
        <Badge variant="cyan">März 2026 Active</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">GUTACHTEN ERSTELLT</span>
          <div className="text-2xl font-bold text-cyan-400">42</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% diesen Monat
          </span>
        </Card>

        <Card className="space-y-2 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">KI-KONSENS RATE</span>
          <div className="text-2xl font-bold text-violet-400">99.2%</div>
          <span className="text-[10px] text-slate-400">Einstimmigkeit AWMF</span>
        </Card>

        <Card className="space-y-2 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">OFFENE PRÜFUNGEN</span>
          <div className="text-2xl font-bold text-amber-400">3</div>
          <span className="text-[10px] text-amber-400">QES Signatur ausstehend</span>
        </Card>

        <Card className="space-y-2 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">DURCHSCHNITT MdE</span>
          <div className="text-2xl font-bold text-emerald-400">28.5%</div>
          <span className="text-[10px] text-slate-400">Sozialgericht BG Bau</span>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-sm font-bold text-white uppercase font-mono">
            Aktuelle Gutachten-Fälle
          </span>
          <Badge variant="cyan">5 Aktive Akten</Badge>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
            <div>
              <span className="font-bold text-white block">Hans Müller (BG-2026-9901-A)</span>
              <span className="text-[10px] text-slate-400">MRT LWS, CT Thorax, Histologie</span>
            </div>
            <Badge variant="cyan">In Bearbeitung</Badge>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
            <div>
              <span className="font-bold text-white block">Erika Schmidt (BG-2026-8812-B)</span>
              <span className="text-[10px] text-slate-400">Gonalgie rechts, Gonarthrose</span>
            </div>
            <Badge variant="emerald">Signiert (QES)</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
