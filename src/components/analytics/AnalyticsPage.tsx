import React from 'react';
import {
  TrendingUp,
  Clock,
  Euro,
  FileCheck2,
  Cpu,
  BarChart3,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const gutachtenPerMonth = [
    { month: 'Jan', count: 18 },
    { month: 'Feb', count: 22 },
    { month: 'Mär', count: 25 },
    { month: 'Apr', count: 21 },
    { month: 'Mai', count: 28 },
    { month: 'Jun', count: 32 },
    { month: 'Jul', count: 35 }
  ];

  const deviceUsage = [
    { device: 'EEG (Nihon Kohden)', count: 42, percent: 45, color: 'bg-cyan-400' },
    { device: 'EKG (Schiller)', count: 28, percent: 30, color: 'bg-violet-400' },
    { device: 'Cognitive (VTS-5)', count: 24, percent: 25, color: 'bg-emerald-400' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="text-cyan-400" />
            <span>Praxis Analytics & Gutachten-KPI Performance</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Echtzeit-Metriken für Durchlaufzeiten, Abrechnungsvolumen & Geräteauslastung
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2">
          <Calendar size={14} />
          <span>Zeitraum: Q3 2026</span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] text-slate-400 uppercase block">Gutachten Mtl. (Juli)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white">35</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={14} /> +24%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Ziel: 30 Gutachten / Monat</p>
        </div>

        <div className="bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] text-cyan-300 uppercase block">Ø Bearbeitungszeit</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-cyan-300">28.4h</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <Zap size={14} /> Target OK
            </span>
          </div>
          <p className="text-[10px] text-cyan-400 mt-2 font-bold">Ziel: {'<'} 48 Stunden</p>
        </div>

        <div className="bg-slate-900/80 border border-violet-500/30 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] text-violet-300 uppercase block">GOÄ Honorar-Pipeline</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-violet-300">18.450 €</span>
            <span className="text-xs font-bold text-violet-400">GOÄ / PKV</span>
          </div>
          <p className="text-[10px] text-violet-400 mt-2">Ø 527 € pro S2k-Gutachten</p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] text-emerald-300 uppercase block">Geräte-Importe</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-emerald-300">94</span>
            <span className="text-xs font-bold text-emerald-400">Sessions</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-2">Automatisch integriert</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART: GUTACHTEN COMPLETED PER MONTH */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <FileCheck2 size={16} className="text-cyan-400" />
              <span>Abgeschlossene Gutachten pro Monat</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">2026 Trend</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {gutachtenPerMonth.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-mono text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  style={{ height: `${(item.count / 40) * 100}%` }}
                  className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-lg group-hover:brightness-125 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                />
                <span className="text-[10px] font-mono text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DEVICE UTILIZATION METRICS */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Cpu size={16} className="text-violet-400" />
              <span>Geräteauslastung & Import-Frequenz</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Aktivierte Adaptern</span>
          </div>

          <div className="space-y-5 pt-2">
            {deviceUsage.map((d) => (
              <div key={d.device} className="space-y-1.5 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-bold">{d.device}</span>
                  <span className="text-cyan-300 font-bold">{d.count} Importe ({d.percent}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    style={{ width: `${d.percent}%` }}
                    className={`h-full ${d.color} shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between">
            <div>
              <span className="block text-white font-bold">Umsatzverteilung nach Abrechnungsart</span>
              <span className="text-[11px] text-slate-400">72% GOÄ (Privat/Gutachten) • 28% EBM (GKV)</span>
            </div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded-lg border border-cyan-500/40">
              GOÄ Fokus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
