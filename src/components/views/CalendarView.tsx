import React from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const CalendarView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <Badge variant="indigo">Gutachtertermine</Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Terminkalender & Untersuchungstermine
          </h1>
        </div>
        <Badge variant="cyan">März 2026</Badge>
      </div>

      <Card className="space-y-4">
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="font-bold text-white block">Hans Müller – Hauptgutachten Untersuchung</span>
                <span className="text-[10px] text-slate-400">14.03.2026 • 10:00 - 11:30 Uhr</span>
              </div>
            </div>
            <Badge variant="cyan">Bestätigt</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
