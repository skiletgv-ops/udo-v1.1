import React from 'react';
import { X, ShieldCheck, Clock, User, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuditLogEntry } from '../../types/ingestionPipeline';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  patientName: string;
  logs: AuditLogEntry[];
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  documentId,
  patientName,
  logs
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0d0e15] border border-cyan-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header - NEUTRAL COPY PER CONSTRAINT 2 */}
        <div className="px-6 py-4 bg-[#12131c] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Änderungsprotokoll
                <span className="text-xs font-mono font-normal text-slate-400">({patientName})</span>
              </h2>
              {/* NEUTRAL FACTUAL COPY WITHOUT LEGAL COMPLIANCE CLAIMS */}
              <p className="text-xs text-slate-400 font-mono">
                Lückenloses Änderungsprotokoll mit Zeitstempeln und Prüfer-ID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - List of audit logs */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 font-sans text-xs">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>Bisher keine manuellen Feldkorrekturen oder Statusänderungen protokolliert.</span>
            </div>
          ) : (
            <div className="relative border-l-2 border-cyan-500/30 ml-4 space-y-6 pl-6 py-2">
              {logs.map((log) => (
                <div key={log.id} className="relative group">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0d0e15] ring-4 ring-cyan-500/20" />
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold">
                        <User className="w-3.5 h-3.5" />
                        <span>{log.userName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 border border-cyan-500/30 text-cyan-200">
                          {log.userRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      {log.action === 'FIELD_CORRECTED' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                      {log.action === 'ADMIN_APPROVED' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {log.action === 'DOCTOR_SIGNED_AND_BILLED' && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                      <span>Aktion: {log.action.replace(/_/g, ' ')}</span>
                      {log.fieldName && (
                        <span className="font-mono text-xs text-cyan-300">[{log.fieldName}]</span>
                      )}
                    </div>

                    {(log.beforeValue || log.afterValue) && (
                      <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="text-slate-400">
                          <span className="text-[9px] text-rose-400 block uppercase font-bold">Vorher (AI / Initial)</span>
                          <span className="line-through text-rose-300/80">{log.beforeValue || '—'}</span>
                        </div>
                        <div className="text-slate-200">
                          <span className="text-[9px] text-emerald-400 block uppercase font-bold">Nachher (Korrigiert)</span>
                          <span className="text-emerald-300">{log.afterValue || '—'}</span>
                        </div>
                      </div>
                    )}

                    {log.comment && (
                      <div className="text-slate-300 bg-white/5 p-2 rounded border border-white/5 text-[11px] font-sans">
                        <span className="text-slate-400 font-mono text-[10px] block">Prüfvermerk:</span>
                        "{log.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#12131c] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
