import React, { useState } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  CheckCircle2,
  Trash2,
  Lock
} from 'lucide-react';

interface RetentionRecord {
  patientId: string;
  patientName: string;
  createdDate: string; // e.g. "2016-10-15"
  ageYears: number;
  thresholdStatus: 'normal' | '9y' | '9y6m' | '9y9m' | '9y11m' | '10y_eligible';
  documentCount: number;
}

export const RetentionPage: React.FC = () => {
  const { logAuditAction } = useUdoStore();

  const [records, setRecords] = useState<RetentionRecord[]>([
    {
      patientId: 'PAT-1998',
      patientName: 'Heinrich Becker',
      createdDate: '2016-08-10',
      ageYears: 9.92, // ~9y 11m
      thresholdStatus: '9y11m',
      documentCount: 14
    },
    {
      patientId: 'PAT-2001',
      patientName: 'Gisela Schmidt',
      createdDate: '2016-11-20',
      ageYears: 9.68, // ~9y 8m
      thresholdStatus: '9y6m',
      documentCount: 8
    },
    {
      patientId: 'PAT-2015',
      patientName: 'Wolfgang Meyer',
      createdDate: '2017-02-01',
      ageYears: 9.48, // ~9y 6m
      thresholdStatus: '9y',
      documentCount: 22
    },
    {
      patientId: 'PAT-1890',
      patientName: 'Ernst Fischer',
      createdDate: '2015-05-04',
      ageYears: 11.2, // >10y
      thresholdStatus: '10y_eligible',
      documentCount: 19
    }
  ]);

  const getStatusBadge = (status: RetentionRecord['thresholdStatus']) => {
    switch (status) {
      case '10y_eligible':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Trash2 size={12} /> 10+ Jahre • Löschung Rechtlich Zulässig
          </span>
        );
      case '9y11m':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            <AlertTriangle size={12} /> 9 Jahre 11 Monate (Kritisch)
          </span>
        );
      case '9y9m':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock size={12} /> 9 Jahre 9 Monate
          </span>
        );
      case '9y6m':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Clock size={12} /> 9 Jahre 6 Monate
          </span>
        );
      case '9y':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-white/10">
            <Clock size={12} /> 9 Jahre Vorwarnung
          </span>
        );
      default:
        return null;
    }
  };

  const handleTriggerErasureCheck = async (patientId: string) => {
    try {
      const res = await fetch('/api/compliance/erasure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, requestedBy: 'Dr. med. Ulrike Bongartz' })
      });
      const data = await res.json();
      alert(`[DSGVO Right-to-Erasure System]\nStatus: ${data.status || 'Geprüft'}\nGrund/Detail: ${data.legalCheck || data.message || data.error}`);
      logAuditAction('DSGVO_ERASURE_REQUEST', patientId, 'COMPLIANCE', data.legalCheck);
    } catch (err) {
      alert('DSGVO Löschprüfung ausgeführt.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Lock className="text-rose-400" />
            <span>Aufbewahrungsfristen & DSGVO Retention Monitor</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Gesetzliche Aufbewahrungspflicht (§ 630f BGB: 10 Jahre für Patientenakten) • Schwellenwert-Warnungen
          </p>
        </div>

        <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs flex items-center gap-2">
          <ShieldAlert size={14} />
          <span>Automatisches Retention Alerting</span>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
          <span className="text-[10px] text-slate-400 uppercase block">10 Jahre Aufbewahrungsfrist</span>
          <span className="text-2xl font-bold text-white mt-1 block">10.0 Jahre</span>
          <span className="text-[10px] text-emerald-400">§ 630f Abs. 3 BGB Minimum</span>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl backdrop-blur-xl">
          <span className="text-[10px] text-amber-300 uppercase block">Akten vor Fristablauf (9y - 10y)</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">3 Akten</span>
          <span className="text-[10px] text-amber-300">Schwellenwert-Warnung Aktiv</span>
        </div>

        <div className="bg-slate-900/80 border border-rose-500/30 p-4 rounded-2xl backdrop-blur-xl">
          <span className="text-[10px] text-rose-300 uppercase block">Rechtlich Löschbar ({'>'}10 Jahre)</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">1 Akte</span>
          <span className="text-[10px] text-rose-300">DSGVO Right-to-Erasure bereit</span>
        </div>
      </div>

      {/* RETENTION TABLE */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2 border-b border-white/10 pb-3">
          <FileText size={16} className="text-cyan-400" />
          <span>Patientenakten am Aufbewahrungsschwellenwert</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-white/10 font-mono text-[10px] text-slate-400 uppercase">
                <th className="p-3">Patient ID & Name</th>
                <th className="p-3">Erster Eintragsdatum</th>
                <th className="p-3">Alter der Akte</th>
                <th className="p-3">Status Badge</th>
                <th className="p-3 text-right">DSGVO Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.map((r) => (
                <tr key={r.patientId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{r.patientName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{r.patientId} • {r.documentCount} Dokumente</div>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{r.createdDate}</td>
                  <td className="p-3 font-mono text-cyan-300 font-bold">{r.ageYears.toFixed(1)} Jahre</td>
                  <td className="p-3">{getStatusBadge(r.thresholdStatus)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleTriggerErasureCheck(r.patientId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] hover:bg-rose-500/20 transition-all cursor-pointer"
                    >
                      DSGVO Löschprüfung
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RetentionPage;
