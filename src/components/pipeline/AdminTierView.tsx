import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  History,
  AlertTriangle,
  ArrowRight,
  FileText,
  UserCheck,
  MessageSquare,
  Search,
  Zap,
  Info
} from 'lucide-react';
import { ExtractedMedicalDocument } from '../../types/ingestionPipeline';
import { DemoDataBadge } from './DemoDataBadge';
import { auditLogger } from '../../services/auditLogger';

interface AdminTierViewProps {
  documents: ExtractedMedicalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ExtractedMedicalDocument[]>>;
  onOpenAuditHistory: (doc: ExtractedMedicalDocument) => void;
}

export const AdminTierView: React.FC<AdminTierViewProps> = ({
  documents,
  setDocuments,
  onOpenAuditHistory
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'FLAGGED' | 'LOW_CONFIDENCE' | 'BILLING_CRITICAL'>('ALL');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [adminComment, setAdminComment] = useState('');

  // Queue of items available for ADMIN or passed through WORK
  const adminQueue = documents.filter((d) =>
    filterMode === 'ALL'
      ? true
      : filterMode === 'FLAGGED'
      ? d.demographics.firstName.status === 'flagged' || d.icd10Codes.status === 'flagged'
      : filterMode === 'LOW_CONFIDENCE'
      ? d.icd10Codes.confidence < 85
      : true
  );

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || adminQueue[0] || documents[0];

  const handleApproveAndPassToDoctor = () => {
    if (!selectedDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            status: 'ADMIN_APPROVED',
            currentRoleHandler: 'DOCTOR',
            adminApprovedAt: new Date().toLocaleString('de-DE'),
            adminReviewerId: 'admin_bongartz',
            adminReviewNotes: adminComment || 'ADMIN-Audit freigegeben ohne Beanstandungen.'
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: selectedDoc.id,
      patientName: `${selectedDoc.demographics.firstName.value} ${selectedDoc.demographics.lastName.value}`,
      userId: 'admin_bongartz',
      userName: 'Prof. Dr. med. E. Bongartz (ADMIN)',
      userRole: 'ADMIN',
      action: 'ADMIN_APPROVED',
      comment: adminComment || 'Freigabe im ADMIN Audit. Akte an Arzt zur Signatur übermittelt.'
    });

    setAdminComment('');
  };

  const handleSendBackToWork = () => {
    if (!selectedDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            status: 'PENDING_WORK',
            currentRoleHandler: 'WORK',
            rejectionReason: adminComment || 'Zur erneuten MFA-Prüfung zurückgewiesen.'
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: selectedDoc.id,
      patientName: `${selectedDoc.demographics.firstName.value} ${selectedDoc.demographics.lastName.value}`,
      userId: 'admin_bongartz',
      userName: 'Prof. Dr. med. E. Bongartz (ADMIN)',
      userRole: 'ADMIN',
      action: 'ADMIN_SENT_BACK',
      comment: adminComment || 'An WORK Intake zurückgesendet.'
    });

    setAdminComment('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER CHIPS */}
      <div className="p-4 rounded-2xl bg-[#0d0e15] border border-copper-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 font-mono text-amber-300 text-[10px] font-bold uppercase">
                TIER 2: ADMIN Audit (Praxis-Management)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Stufe 2 von 3 der Prüfkette
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-1">
              Administrative QS & Multi-Stufen Diff Kontrolle
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Filter Queue:</span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {(['ALL', 'FLAGGED', 'LOW_CONFIDENCE', 'BILLING_CRITICAL'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    filterMode === mode
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DOCUMENT QUEUE SELECTOR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {adminQueue.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                selectedDoc?.id === doc.id
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs truncate">
                  {doc.demographics.firstName.value} {doc.demographics.lastName.value}
                </span>
                {doc.isSynthetic && <DemoDataBadge size="sm" />}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Case: {doc.caseId}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-STAGE SIDE-BY-SIDE DIFF VIEW (AI OUTPUT -> WORK CORRECTION -> ADMIN FINAL) */}
      {selectedDoc && (
        <div className="bg-[#0d0e15] border border-amber-500/30 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  3-Stufen Revisions-Vergleich: {selectedDoc.demographics.firstName.value} {selectedDoc.demographics.lastName.value}
                </h3>
                {selectedDoc.isSynthetic && <DemoDataBadge size="sm" />}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Transparente Nachverfolgung: Vergleicht die KI-Extraktion mit den MFA-Anpassungen vor der Ärztlichen Freigabe
              </p>
            </div>

            <button
              onClick={() => onOpenAuditHistory(selectedDoc)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>Vollständiges Protokoll</span>
            </button>
          </div>

          {/* SIDE BY SIDE DIFF COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* STAGE 1: AI RAW OUTPUT */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-cyan-400 font-bold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> STUFE 1: KI-Rohdaten
                </span>
                <span className="text-[10px] text-slate-500">Tesseract/Gemini</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Patient:</span>
                  <span>{selectedDoc.demographics.firstName.originalAiValue || selectedDoc.demographics.firstName.value} {selectedDoc.demographics.lastName.value}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ICD-10 KI-Score:</span>
                  <span className="text-cyan-300 font-bold">{selectedDoc.icd10Codes.confidence}% Vertrauen</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Diagnosen:</span>
                  {selectedDoc.icd10Codes.value.map((c) => (
                    <div key={c.code} className="text-slate-400 text-[10px]">
                      • {c.code}: {c.description}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STAGE 2: WORK MFA CORRECTION */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 text-amber-300 font-bold">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> STUFE 2: WORK (MFA)
                </span>
                <span className="text-[10px] text-amber-400">Prüfer: MFA Sabine</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-200">
                <div>
                  <span className="text-amber-400/70 block text-[10px]">MFA Prüfstatus:</span>
                  <span className="font-bold text-amber-200">{selectedDoc.status}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block text-[10px]">Stammdaten Korrektur:</span>
                  <span>{selectedDoc.demographics.firstName.workValue ? `Angepasst auf: ${selectedDoc.demographics.firstName.workValue}` : 'Keine manuellen Einwände'}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block text-[10px]">Abrechnung (GOÄ):</span>
                  {selectedDoc.goaeBillingCodes.value.map((g) => (
                    <div key={g.code} className="text-slate-300 text-[10px]">
                      • {g.code} ({g.priceEuro.toFixed(2)} €)
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STAGE 3: ADMIN FINAL VERSION */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 text-emerald-300 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> STUFE 3: ADMIN Final
                </span>
                <span className="text-[10px] text-emerald-400">Prof. Bongartz</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-100">
                <div>
                  <span className="text-emerald-400/70 block text-[10px]">Endgültiger Status:</span>
                  <span className="font-bold text-emerald-300">{selectedDoc.status === 'ADMIN_APPROVED' ? 'Freigegeben für Arzt' : 'Bereit zur Signatur'}</span>
                </div>
                <div>
                  <span className="text-emerald-400/70 block text-[10px]">Kostenträger:</span>
                  <span>{selectedDoc.demographics.insuranceProvider.value}</span>
                </div>
                <div>
                  <span className="text-emerald-400/70 block text-[10px]">Gesamtbetrag Abrechnung:</span>
                  <span className="text-emerald-300 font-bold">
                    {selectedDoc.goaeBillingCodes.value.reduce((acc, g) => acc + g.priceEuro, 0).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN AUDIT ACTION PANEL & COMMENT */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <label className="text-xs font-mono text-slate-300 block">
              Prüfvermerk / Anmerkung an Arzt oder WORK-Team:
            </label>
            <input
              type="text"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="z.B. GOÄ-Sätze und BG-Abrechnung mit DGUV Vorgaben abgeglichen."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={handleSendBackToWork}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Zurück an WORK senden</span>
              </button>

              <button
                onClick={handleApproveAndPassToDoctor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ADMIN-Freigabe & An Arzt (Stufe 3)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
