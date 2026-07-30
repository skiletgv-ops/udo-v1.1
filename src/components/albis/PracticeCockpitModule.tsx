import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, Download, DollarSign, Users2, Calendar } from 'lucide-react';

const REVENUE_BY_SERVICE = [
  { month: 'Mai', GOAE: 18400, EBM: 9200, JVEG: 14500 },
  { month: 'Jun', GOAE: 21200, EBM: 8800, JVEG: 16800 },
  { month: 'Jul', GOAE: 24500, EBM: 10400, JVEG: 19200 },
  { month: 'Aug (AI Prognose)', GOAE: 27800, EBM: 11200, JVEG: 21500 }
];

const LANR_PERFORMANCE = [
  { doctor: 'Dr. Voss (Berlin)', revenue: 38400, consultations: 142 },
  { doctor: 'Prof. Lindner (München)', revenue: 42100, consultations: 118 },
  { doctor: 'Dr. Franke (Hamburg)', revenue: 22800, consultations: 89 },
  { doctor: 'Dr. Bongartz (Köln)', revenue: 31500, consultations: 130 },
  { doctor: 'Dr. Richter (Frankfurt)', revenue: 29800, consultations: 105 }
];

export const PracticeCockpitModule: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'month' | 'quarter' | 'year'>('month');

  const exportCsv = () => {
    const headers = 'Arzt/Standort,Umsatz EUR,Konsultationen\n';
    const rows = LANR_PERFORMANCE.map((l) => `"${l.doctor}",${l.revenue},${l.consultations}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDO_Praxis_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Predictive Practice Cockpit (Analytics 2.0)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROGNOSE AI
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Echtzeit-Umsatzanalyse, LANR-Vergleich & KI-basierte 30-Tage Ertragsprognose
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* FILTER BUTTONS */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeFilter === 'month' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Monat
            </button>
            <button
              onClick={() => setTimeFilter('quarter')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeFilter === 'quarter' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Quartal
            </button>
            <button
              onClick={() => setTimeFilter('year')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeFilter === 'year' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Jahr
            </button>
          </div>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* ANOMALY ALERT BANNER */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs font-mono text-amber-200">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 animate-bounce" />
        <div>
          <span className="font-bold block">KI-Anomalie erkannt (LANR-5510293 Dr. Franke):</span>
          <span className="text-amber-300/80 text-[11px]">
            No-Show Quote liegt 14% über Praxisschnitt. Empfohlene Maßnahme: Automatische SMS-Reminder 24h vor Termin aktivieren.
          </span>
        </div>
      </div>

      {/* RECHARTS GRAPHICAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* REVENUE BY SERVICE TYPE & PREDICTIVE FORECAST */}
        <div className="p-4 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="font-bold text-white uppercase text-[11px]">
              Umsatz nach Abrechnungstyp & AI-Prognose (€)
            </span>
            <span className="text-emerald-400 font-bold">+18.4% Trend</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_SERVICE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="GOÄ" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="EBM" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="JVEG" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REVENUE BY PROVIDER (LANR) */}
        <div className="p-4 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="font-bold text-white uppercase text-[11px]">
              Umsatz nach Leistungserbringer (LANR)
            </span>
            <span className="text-cyan-300 font-bold">5 Behandler</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LANR_PERFORMANCE} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="doctor" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
