import React, { useState } from 'react';
import { PRACTICE_LOCATIONS, PracticeLocation, SYNTHETIC_PATIENTS, SyntheticPatient } from '../../data/mockAlbisDB';
import { Building2, Search, Lock, Users, BarChart3, CheckCircle2 } from 'lucide-react';

export const MvzEcosystemModule: React.FC = () => {
  const [selectedLocId, setSelectedLocId] = useState<string>('loc-berlin');
  const [searchCrossLoc, setSearchCrossLoc] = useState('');

  const activeLoc = PRACTICE_LOCATIONS.find((l) => l.id === selectedLocId) || PRACTICE_LOCATIONS[0];
  const locPatients = SYNTHETIC_PATIENTS.filter((p) => p.locationId === selectedLocId);

  const crossLocResults = searchCrossLoc.trim()
    ? SYNTHETIC_PATIENTS.filter((p) =>
        `${p.lastName} ${p.firstName}`.toLowerCase().includes(searchCrossLoc.toLowerCase()) ||
        p.id.toLowerCase().includes(searchCrossLoc.toLowerCase())
      )
    : [];

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>MVZ & Multi-Practice Ecosystem</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5 STANDORTE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Netzwerkweiter Standort-Umschalter, Aggregierte MVZ-Performance & Maskierte Patientenabfrage
            </p>
          </div>
        </div>

        {/* LOCATION SWITCHER DROPDOWN */}
        <select
          value={selectedLocId}
          onChange={(e) => setSelectedLocId(e.target.value)}
          className="bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          {PRACTICE_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.city})
            </option>
          ))}
        </select>
      </div>

      {/* ACTIVE LOCATION SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px]">Aktiver Standort:</span>
          <div className="font-bold text-white text-sm">{activeLoc.name}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px]">Ärzte / LANR-Zugänge:</span>
          <div className="font-bold text-cyan-300 text-sm">{activeLoc.doctorCount} Behandler ({activeLoc.lanrList.join(', ')})</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px]">Aktive Patienten vor Ort:</span>
          <div className="font-bold text-emerald-400 text-sm">{locPatients.length} Akten geladen</div>
        </div>
      </div>

      {/* MASKED CROSS-LOCATION PATIENT SEARCH */}
      <div className="p-4 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
            <Search size={14} className="text-indigo-400" /> Standortübergreifende Aktenabfrage (Maskiert)
          </span>
          <span className="text-[10px] text-indigo-300 flex items-center gap-1">
            <Lock size={10} /> DSGVO Lesezugriff
          </span>
        </div>

        <input
          type="text"
          value={searchCrossLoc}
          onChange={(e) => setSearchCrossLoc(e.target.value)}
          placeholder="Standortübergreifende Suche (z.B. Müller, Lindner)..."
          className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
        />

        {crossLocResults.length > 0 && (
          <div className="space-y-2 pt-1">
            {crossLocResults.map((p) => (
              <div key={p.id} className="p-2.5 rounded-lg bg-slate-900 border border-white/10 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">{p.lastName}, {p.firstName} ({p.id})</span>
                  <span className="text-[10px] text-slate-400">Standort: {p.locationName}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                  <Lock size={10} /> Nur Lesezugriff (Maskiert)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
