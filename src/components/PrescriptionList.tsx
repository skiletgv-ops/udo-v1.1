import React, { useState } from 'react';
import { Pill, Plus, Clock, CheckCircle2, XCircle, FileEdit, Send, Check, X, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { useRoleContext } from '../context/RoleContext';
import { PrescriptionModal } from './PrescriptionModal';

interface PrescriptionListProps {
  patientId?: string;
  patientName?: string;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  patientId = 'SYN-90412',
  patientName = 'Hans Müller',
}) => {
  const { prescriptions, submitForApproval, approvePrescription, rejectPrescription } = usePrescriptionContext();
  const { role, user, isAdmin } = useRoleContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter prescriptions for this patient
  const patientPrescriptions = prescriptions.filter(
    (p) =>
      p.patientId === patientId ||
      p.patientName.toLowerCase() === patientName.toLowerCase() ||
      patientName.toLowerCase().includes('müller')
  );

  const handleConfirmReject = (id: string) => {
    rejectPrescription(id, rejectionReason || 'Nicht indiziert nach AWMF-Leitlinie', user?.name || 'Admin');
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <>
      <Card glow="cyan" className="space-y-4">
        {/* SECTION HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-wide font-sans uppercase">
                REZEPTE & MEDIKATION
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Zwei-Stufen Genehmigungsprozess ({patientPrescriptions.length} verzeichnet)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B87333]/20 to-amber-500/20 border border-[#B87333]/40 text-[#E8A87C] hover:border-[#B87333] hover:text-white hover:shadow-[0_0_15px_rgba(184,115,51,0.3)] transition-all font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <Plus className="w-4 h-4 text-[#E8A87C]" />
            <span>Neues Rezept</span>
          </button>
        </div>

        {/* PRESCRIPTIONS LIST */}
        <div className="space-y-3">
          {patientPrescriptions.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-slate-400 font-mono text-xs">
              Keine Rezepte für diesen Patienten erfasst.
            </div>
          ) : (
            patientPrescriptions.map((rx) => {
              return (
                <div
                  key={rx.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 font-sans relative group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    {/* MEDICATION INFO */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Pill className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            💊 {rx.medication}
                          </span>
                          <span className="font-mono text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {rx.dosage}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                          <span>Häufigkeit: <strong className="text-slate-200">{rx.frequency}</strong></span>
                          <span>•</span>
                          <span>Dauer: <strong className="text-slate-200">{rx.duration}</strong></span>
                        </div>
                        {rx.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-1 font-sans">
                            "{rx.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* STATUS BADGES */}
                    <div className="flex items-center gap-2">
                      {rx.status === 'draft' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                          <FileEdit className="w-3.5 h-3.5" />
                          ENTWURF 📝
                        </span>
                      )}

                      {rx.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          AUSSTEHEND ⏳
                        </span>
                      )}

                      {rx.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          GENEHMIGT ✓
                        </span>
                      )}

                      {rx.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ABGELEHNT ✕
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DETAILS & ACTIONS FOOTER */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                    <div>
                      {rx.status === 'draft' && (
                        <span>Erstellt: {rx.createdAt} von {rx.prescribedBy === 'admin' ? 'Prof. Dr. Bongartz' : 'Dr. Voss'}</span>
                      )}
                      {rx.status === 'pending' && (
                        <span>Eingereicht: {rx.createdAt} zur Chefarzt-Freigabe</span>
                      )}
                      {rx.status === 'approved' && (
                        <span className="text-emerald-400/90">
                          Genehmigt: {rx.approvedAt || rx.createdAt} von {rx.approvedBy || 'Admin'}
                        </span>
                      )}
                      {rx.status === 'rejected' && (
                        <span className="text-rose-400/90">
                          Abgelehnt am {rx.approvedAt || rx.createdAt} {rx.rejectionReason ? `(${rx.rejectionReason})` : ''}
                        </span>
                      )}
                    </div>

                    {/* ACTION BUTTONS DEPENDING ON ROLE AND STATUS */}
                    <div className="flex items-center gap-2">
                      {/* DRAFT ITEMS ACTIONS (For both Main and Admin) */}
                      {rx.status === 'draft' && (
                        <button
                          onClick={() => submitForApproval(rx.id)}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Einreichen</span>
                        </button>
                      )}

                      {/* ADMIN EXCLUSIVE ACTIONS FOR PENDING ITEMS */}
                      {rx.status === 'pending' && isAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approvePrescription(rx.id, user?.name || 'Admin')}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Genehmigen ✓</span>
                          </button>

                          <button
                            onClick={() => setRejectingId(rx.id)}
                            className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Ablehnen</span>
                          </button>
                        </div>
                      )}

                      {/* MAIN ACCOUNT READONLY WARNING FOR PENDING ITEMS */}
                      {rx.status === 'pending' && !isAdmin && (
                        <span className="text-[10px] text-cyan-400/70 font-mono italic">
                          Wartet auf Chefärztin-Freigabe (Nur Lesezugriff)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REJECTION REASON PROMPT INPUT (When Admin clicks Ablehnen) */}
                  {rejectingId === rx.id && (
                    <div className="p-3 mt-2 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-2 animate-fade-in">
                      <div className="text-xs font-bold text-rose-300 font-mono flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>Ablehnungsgrund eingeben (Optional):</span>
                      </div>
                      <input
                        type="text"
                        placeholder="z.B. Wechselwirkung mit Pantoprazol oder Kontraindikation..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full bg-[#181920] border border-rose-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:border-rose-400 font-sans"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-2.5 py-1 rounded bg-white/5 text-slate-400 text-xs hover:text-white"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={() => handleConfirmReject(rx.id)}
                          className="px-3 py-1 rounded bg-rose-500 text-white font-bold text-xs hover:bg-rose-600"
                        >
                          Endgültig Ablehnen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* PRESCRIPTION FORM MODAL */}
      <PrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        patientName={patientName}
      />
    </>
  );
};
