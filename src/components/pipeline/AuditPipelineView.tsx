import React, { useState } from 'react';
import {
  FileCheck2,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Database,
  History,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { ExtractedMedicalDocument, AuditLogEntry } from '../../types/ingestionPipeline';
import { generateInitialSyntheticDataset } from '../../utils/syntheticPatientGenerator';
import { WorkTierView } from './WorkTierView';
import { AdminTierView } from './AdminTierView';
import { DoctorTierView } from './DoctorTierView';
import { AuditHistoryModal } from './AuditHistoryModal';
import { auditLogger } from '../../services/auditLogger';
import { DemoDataBadge } from './DemoDataBadge';

export const AuditPipelineView: React.FC = () => {
  const [documents, setDocuments] = useState<ExtractedMedicalDocument[]>(() =>
    generateInitialSyntheticDataset()
  );

  const [activeTier, setActiveTier] = useState<'WORK' | 'ADMIN' | 'DOCTOR'>('WORK');
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  const [selectedAuditDoc, setSelectedAuditDoc] = useState<ExtractedMedicalDocument | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const handleOpenAuditHistory = (doc: ExtractedMedicalDocument) => {
    setSelectedAuditDoc(doc);
    setAuditLogs(auditLogger.getLogsForDocument(doc.id));
  };

  const handleResetSyntheticDataset = () => {
    const newDataset = generateInitialSyntheticDataset();
    setDocuments(newDataset);
    setActiveDocIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in font-sans">
      {/* PAGE TITLE BAR & TIER SELECTOR */}
      <div className="p-5 rounded-2xl bg-[#0d0e15] border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wide">
                ALBIS INTEGRATION & AUDIT PIPELINE
              </span>
              <DemoDataBadge size="sm" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <FileCheck2 className="w-7 h-7 text-cyan-400" />
              Drei-Stufen Audit Pipeline
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Intake (WORK) → QS & Multi-Diff (ADMIN) → Ärztliche Abnahme & ALBIS-Export (DOCTOR)
            </p>
          </div>

          <button
            onClick={handleResetSyntheticDataset}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center"
            title="Setzt die synthetischen Testdaten (isSynthetic: true) auf den Initialzustand zurück"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo-Daten zurücksetzen</span>
          </button>
        </div>

        {/* THREE TIER TABS SWITCHER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <button
            onClick={() => setActiveTier('WORK')}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeTier === 'WORK'
                ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(0,212,170,0.25)] text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeTier === 'WORK' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/5 text-slate-400'
              }`}>
                1
              </div>
              <div className="text-left">
                <span className="font-extrabold block text-sm">STUFE 1: WORK</span>
                <span className="text-[10px] text-slate-400">MFA Intake & KI-Check</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
              {documents.filter((d) => d.currentRoleHandler === 'WORK' || d.status === 'PENDING_WORK').length} Akten
            </span>
          </button>

          <button
            onClick={() => setActiveTier('ADMIN')}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeTier === 'ADMIN'
                ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeTier === 'ADMIN' ? 'bg-amber-500/30 text-amber-300' : 'bg-white/5 text-slate-400'
              }`}>
                2
              </div>
              <div className="text-left">
                <span className="font-extrabold block text-sm">STUFE 2: ADMIN</span>
                <span className="text-[10px] text-slate-400">QS & Multi-Diff Control</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              {documents.filter((d) => d.currentRoleHandler === 'ADMIN' || d.status === 'WORK_REVIEWED').length} Akten
            </span>
          </button>

          <button
            onClick={() => setActiveTier('DOCTOR')}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeTier === 'DOCTOR'
                ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                activeTier === 'DOCTOR' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-slate-400'
              }`}>
                3
              </div>
              <div className="text-left">
                <span className="font-extrabold block text-sm">STUFE 3: DOCTOR</span>
                <span className="text-[10px] text-slate-400">Arzt Signatur & ALBIS</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              {documents.filter((d) => d.currentRoleHandler === 'DOCTOR' || d.status === 'ADMIN_APPROVED').length} Akten
            </span>
          </button>
        </div>
      </div>

      {/* RENDER CURRENT ACTIVE TIER VIEW */}
      {activeTier === 'WORK' && (
        <WorkTierView
          documents={documents}
          setDocuments={setDocuments}
          onOpenAuditHistory={handleOpenAuditHistory}
          activeDocIndex={activeDocIndex}
          setActiveDocIndex={setActiveDocIndex}
        />
      )}

      {activeTier === 'ADMIN' && (
        <AdminTierView
          documents={documents}
          setDocuments={setDocuments}
          onOpenAuditHistory={handleOpenAuditHistory}
        />
      )}

      {activeTier === 'DOCTOR' && (
        <DoctorTierView
          documents={documents}
          setDocuments={setDocuments}
          onOpenAuditHistory={handleOpenAuditHistory}
        />
      )}

      {/* AUDIT LOG MODAL */}
      {selectedAuditDoc && (
        <AuditHistoryModal
          isOpen={Boolean(selectedAuditDoc)}
          onClose={() => setSelectedAuditDoc(null)}
          documentId={selectedAuditDoc.id}
          patientName={`${selectedAuditDoc.demographics.firstName.value} ${selectedAuditDoc.demographics.lastName.value}`}
          logs={auditLogs}
        />
      )}
    </div>
  );
};
