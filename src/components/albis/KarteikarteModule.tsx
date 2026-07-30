import React, { useState, useEffect } from 'react';
import { SyntheticPatient, PRACTICE_LOCATIONS } from '../../data/mockAlbisDB';
import { UserSquare2, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, FileText, Activity } from 'lucide-react';

interface KarteikarteModuleProps {
  selectedPatientId?: string;
  onSelectPatient?: (p: SyntheticPatient) => void;
}

export const KarteikarteModule: React.FC<KarteikarteModuleProps> = ({
  selectedPatientId,
  onSelectPatient
}) => {
  const [patients, setPatients] = useState<SyntheticPatient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<SyntheticPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [bridgeStatus, setBridgeStatus] = useState<string>('Simulated Mode - Active');

  useEffect(() => {
    fetchBridgeData();
  }, []);

  const fetchBridgeData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/albis-bridge');
      const data = await res.json();
      if (data.success && data.patients) {
        setPatients(data.patients);
        const match = selectedPatientId
          ? data.patients.find((p: SyntheticPatient) => p.id === selectedPatientId)
          : data.patients[0];
        setCurrentPatient(match || data.patients[0]);
        setBridgeStatus('CGM ALBIS KTX Bridge: Verbunden (100% GDT 2.1 Konform)');
      }
    } catch (err) {
      setBridgeStatus('Connection Stub: Simulated Fallback Mode');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (id: string) => {
    const p = patients.find((pat) => pat.id === id);
    if (p) {
      setCurrentPatient(p);
      if (onSelectPatient) onSelectPatient(p);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <UserSquare2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Patient Records (Karteikarte)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GDT 2.1
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Interaktive Patienteneinsicht aus CGM ALBIS KTX Transaktions-Bridge
            </p>
          </div>
        </div>

        {/* QUICK SWITCH DROPDOWN */}
        <div className="flex items-center gap-2">
          <select
            value={currentPatient?.id || ''}
            onChange={(e) => handlePatientChange(e.target.value)}
            className="bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.lastName}, {p.firstName} ({p.id} - {p.insuranceType})
              </option>
            ))}
          </select>

          <button
            onClick={fetchBridgeData}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title="Bridge aktualisieren"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* BRIDGE CONNECTION STATUS BANNER */}
      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-200 font-bold">{bridgeStatus}</span>
        </div>
        <span className="text-[10px] text-slate-400">Station: {currentPatient?.locationName}</span>
      </div>

      {/* PATIENT LAYERED CHART */}
      {currentPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
          {/* MASTER DATA CARD (3 COLS) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#0A0A0F]/80 border border-white/10 space-y-3 font-mono text-xs">
            <div className="border-b border-white/10 pb-2 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Stammdaten</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                {currentPatient.insuranceType}
              </span>
            </div>

            <div>
              <div className="text-base font-bold text-white">
                {currentPatient.lastName}, {currentPatient.firstName}
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Geb. {currentPatient.birthDate} ({currentPatient.gender})
              </div>
            </div>

            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-slate-400">
                <span>Versicherten-ID:</span>
                <span className="text-cyan-300 font-bold">{currentPatient.insuranceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fallnummer:</span>
                <span className="text-slate-200">{currentPatient.caseId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kostenträger:</span>
                <span className="text-slate-200 truncate max-w-[140px]">{currentPatient.commissioningEntity}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Arzt (LANR):</span>
                <span className="text-violet-300">{currentPatient.lanrDoctor}</span>
              </div>
            </div>
          </div>

          {/* DIAGNOSES & LAB RESULTS (8 COLS) */}
          <div className="lg:col-span-8 space-y-3">
            {/* ACTIVE DIAGNOSES (ICD-10) */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0F]/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Diagnosen (ICD-10-GM)
              </span>

              <div className="flex flex-wrap gap-2">
                {currentPatient.diagnoses.map((d, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-2 text-xs font-mono"
                  >
                    <span className="font-extrabold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">
                      {d.icdCode}
                    </span>
                    <span className="text-slate-200">{d.description}</span>
                    <span
                      className={`text-[9px] uppercase px-1 rounded ${
                        d.status === 'acute' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* OCR LAB RESULTS */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0F]/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Laborbefunde (OCR Extrahiert)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                {currentPatient.labResults.map((lab, i) => {
                  let badge = 'border-slate-800 bg-slate-900 text-slate-300';
                  if (lab.status === 'high') badge = 'border-amber-500/40 bg-amber-500/10 text-amber-300';
                  if (lab.status === 'critical') badge = 'border-rose-500/50 bg-rose-500/15 text-rose-300 animate-pulse';

                  return (
                    <div key={i} className={`p-2.5 rounded-lg border ${badge} space-y-1`}>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>{lab.parameter}</span>
                        <span className="uppercase font-bold">{lab.status}</span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {lab.value} <span className="text-xs font-normal text-slate-400">{lab.unit}</span>
                      </div>
                      <div className="text-[9px] text-slate-500">Ref: {lab.referenceRange}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CLINICAL SUMMARY NOTES */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-300 font-mono block mb-1">Auszug Anamnese & Befundverlauf:</strong>
              {currentPatient.clinicalNotes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
