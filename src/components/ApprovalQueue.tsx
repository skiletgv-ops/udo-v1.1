import React, { useState } from 'react';
import { ShieldCheck, Clock, Check, X, Search, Pill, UserCheck, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { useRoleContext } from '../context/RoleContext';

export const ApprovalQueue: React.FC = () => {
  const { prescriptions, approvePrescription, rejectPrescription, pendingCount } = usePrescriptionContext();
  const { isAdmin, user } = useRoleContext();

  const [search, setSearch] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Get all pending prescriptions across all patients
  const pendingPrescriptions = prescriptions.filter((p) => p.status === 'pending');

  const filteredPending = pendingPrescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.medication.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmReject = (id: string) => {
    rejectPrescription(id, rejectionReason || 'Nicht indiziert nach AWMF-Leitlinie', user?.name || 'Admin');
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in pb-16">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Chefärztliche Freigabe</Badge>
            <div className="flex items-center gap-1.5 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-md px-2.5 py-1 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 font-bold">{pendingCount} REZEPTE AUSSTEHEND</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#E8A87C]" />
            Genehmigungs-Queue (Chefärztin)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Zentrale Prüfungsinstanz für alle eingereichten Rezeptanforderungen der Assistenz- und Fachärzte.
          </p>
        </div>

        {/* SEARCH FILTER */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Patient oder Medikament filtern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
          />
        </div>
      </div>

      {/* QUEUE TABLE CARD */}
      <Card glow="amber" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#E8A87C] font-bold uppercase">
            <UserCheck className="w-4 h-4" />
            <span>Offene Freigabe-Anträge ({filteredPending.length})</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Angemeldet als: <span className="text-rose-300 font-bold">{user?.name}</span> ({user?.title})
          </div>
        </div>

        {filteredPending.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">Keine ausstehenden Rezept-Anforderungen</p>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
              Alle eingereichten Rezepte wurden bearbeitet oder befinden sich noch im Entwurfsstadium der Fachärzte.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Medikament</th>
                  <th className="py-3 px-4">Dosierung & Häufigkeit</th>
                  <th className="py-3 px-4">Verschrieben von</th>
                  <th className="py-3 px-4">Datum</th>
                  <th className="py-3 px-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPending.map((rx) => (
                  <React.Fragment key={rx.id}>
                    <tr className="hover:bg-white/5 transition-colors font-sans">
                      {/* PATIENT */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{rx.patientName}</div>
                        <div className="font-mono text-[10px] text-cyan-400">{rx.patientId}</div>
                      </td>

                      {/* MEDICATION */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{rx.medication}</span>
                        </div>
                        {rx.notes && (
                          <div className="text-[11px] text-slate-400 italic mt-0.5 max-w-xs">
                            "{rx.notes}"
                          </div>
                        )}
                      </td>

                      {/* DOSAGE & FREQUENCY */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-white font-bold">{rx.dosage}</div>
                        <div className="text-[10px] text-slate-400">{rx.frequency} ({rx.duration})</div>
                      </td>

                      {/* PRESCRIBED BY */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                          {rx.prescribedBy === 'admin' ? 'Prof. Dr. Bongartz' : 'Dr. med. A. Voss'}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {rx.createdAt}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approvePrescription(rx.id, user?.name || 'Admin')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                          >
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Genehmigen</span>
                          </button>

                          <button
                            onClick={() => setRejectingId(rx.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500 hover:text-white font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4 text-rose-300" />
                            <span>Ablehnen</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* REJECTION REASON EXPANDABLE ROW */}
                    {rejectingId === rx.id && (
                      <tr className="bg-rose-500/10 border-t border-b border-rose-500/30">
                        <td colSpan={6} className="p-4">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                            <input
                              type="text"
                              placeholder="Ablehnungsgrund für das Rezept angeben (z.B. AWMF Kontraindikation)..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="flex-1 bg-[#181920] border border-rose-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:border-rose-400 font-sans"
                            />
                            <button
                              onClick={() => setRejectingId(null)}
                              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white font-mono text-xs"
                            >
                              Abbrechen
                            </button>
                            <button
                              onClick={() => handleConfirmReject(rx.id)}
                              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-mono font-bold text-xs hover:bg-rose-600 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                            >
                              Rezept Ablehnen
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
