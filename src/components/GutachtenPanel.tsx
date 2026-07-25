import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Printer,
  Sparkles,
  Database,
  ShieldCheck,
  HelpCircle,
  Settings,
  Cpu,
  Edit3,
  CheckCircle,
  Users,
  Layers,
  X,
  Minus,
  FileCheck,
  AlertTriangle,
  Download,
  Upload,
  User,
  Building,
  Calendar,
  Eye,
  RefreshCw,
  FolderArchive
} from "lucide-react";
import { useGlobalSystem } from "./GlobalSystemContext";

// Import local Gutachten Types & Data
import {
  PhaseNumber,
  PipelineStatus,
  MedicalDocumentItem,
  TimelineEventItem,
  SpecialtySummaryItem,
  FunctionalCapacityItem,
  GutachtenDraftVariant,
  QualityControlItem,
  ConsensusModelOutput,
  PatientDossier
} from "./gutachten/gutachtenTypes";

import {
  initialPatientDossier,
  initialTimelineEvents,
  initialSpecialtySummaries,
  initialFunctionalCapacity,
  initialDraftVariants,
  initialQualityControlItems,
  initialConsensusOutputs
} from "./gutachten/mockGutachtenData";

// Import Sub-Components
import PipelinePhaseStepper from "./gutachten/PipelinePhaseStepper";
import QualityControlBanner from "./gutachten/QualityControlBanner";
import MultiAIConsensusPanel from "./gutachten/MultiAIConsensusPanel";
import Phase1DocumentAnalysisView from "./gutachten/Phase1DocumentAnalysisView";
import Phase2MedicalTimelineView from "./gutachten/Phase2MedicalTimelineView";
import Phase3ClinicalSummaryView from "./gutachten/Phase3ClinicalSummaryView";
import Phase4FunctionalCapacityView from "./gutachten/Phase4FunctionalCapacityView";
import Phase5DraftsView from "./gutachten/Phase5DraftsView";
import Phase6ReviewEditorView from "./gutachten/Phase6ReviewEditorView";
import ImportGutachtenModal from "./gutachten/ImportGutachtenModal";
import EvidenceViewerModal from "./gutachten/EvidenceViewerModal";
import ExportReportModal from "./gutachten/ExportReportModal";

interface GutachtenPanelProps {
  onRobotStateChange?: (state: any) => void;
  onMinimize?: () => void;
}

export default function GutachtenPanel({
  onRobotStateChange,
  onMinimize,
}: GutachtenPanelProps) {
  const { language, activePatient } = useGlobalSystem();

  // Primary State Objects for Gutachten Workflow
  const [patientDossier, setPatientDossier] = useState<PatientDossier>(initialPatientDossier);
  const [currentPhase, setCurrentPhase] = useState<PhaseNumber>(1);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>("ready");
  const [phaseProgress, setPhaseProgress] = useState<Record<PhaseNumber, number>>({
    1: 100,
    2: 100,
    3: 100,
    4: 100,
    5: 100,
    6: 80,
  });

  // Data collections for each phase
  const [documents, setDocuments] = useState<MedicalDocumentItem[]>(patientDossier.uploadedDocuments);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEventItem[]>(initialTimelineEvents);
  const [specialtySummaries, setSpecialtySummaries] = useState<SpecialtySummaryItem[]>(initialSpecialtySummaries);
  const [functionalCapacity, setFunctionalCapacity] = useState<FunctionalCapacityItem[]>(initialFunctionalCapacity);
  const [draftVariants, setDraftVariants] = useState<GutachtenDraftVariant[]>(initialDraftVariants);
  const [selectedDraftId, setSelectedDraftId] = useState<string>("detailed_expert");
  const [qcItems, setQcItems] = useState<QualityControlItem[]>(initialQualityControlItems);
  const [consensusOutputs, setConsensusOutputs] = useState<ConsensusModelOutput[]>(initialConsensusOutputs);

  // Modals & Overlay States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [evidenceViewerState, setEvidenceViewerState] = useState<{
    isOpen: boolean;
    docId: string | null;
    pageNumber: number;
  }>({
    isOpen: false,
    docId: null,
    pageNumber: 1,
  });

  // Handle Pipeline Controls
  const handleTogglePipelineStatus = () => {
    if (pipelineStatus === "running") {
      setPipelineStatus("paused");
    } else {
      setPipelineStatus("running");
      // Simulate progress advancement
      setTimeout(() => {
        setPipelineStatus("ready");
      }, 2500);
    }
  };

  const handleRegeneratePhase = (phase: PhaseNumber) => {
    setPipelineStatus("running");
    setPhaseProgress((prev) => ({ ...prev, [phase]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        setPhaseProgress((prev) => ({ ...prev, [phase]: 100 }));
        setPipelineStatus("ready");
      } else {
        setPhaseProgress((prev) => ({ ...prev, [phase]: progress }));
      }
    }, 400);
  };

  const handleImportComplete = (newDocs: MedicalDocumentItem[], addedPages: number, addedMb: number) => {
    setDocuments((prev) => [...newDocs, ...prev]);
    setPatientDossier((prev) => ({
      ...prev,
      totalPages: prev.totalPages + addedPages,
      totalSizeMb: parseFloat((prev.totalSizeMb + addedMb).toFixed(1)),
      uploadedDocuments: [...newDocs, ...prev.uploadedDocuments],
    }));
  };

  const handleOpenDocEvidence = (docId: string, page: number) => {
    setEvidenceViewerState({
      isOpen: true,
      docId,
      pageNumber: page,
    });
  };

  const activeDraft =
    draftVariants.find((d) => d.id === selectedDraftId) || draftVariants[0];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 space-y-6 text-white font-sans">
      {/* Patient Header & Dossier Identification Bar */}
      <div className="p-5 rounded-3xl glass-surface bg-[#111217]/90 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Glow Accent */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-black text-xl shadow-inner shrink-0">
            {patientDossier.firstName[0]}
            {patientDossier.lastName[0]}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black tracking-tight text-white font-sans">
                {patientDossier.firstName} {patientDossier.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] font-bold">
                Az: {patientDossier.caseId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15 font-mono text-[11px]">
                Geb. {patientDossier.birthDate}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building size={13} className="text-cyan-400" />
                {patientDossier.commissioningEntity}
              </span>
              <span>Unfalltag: {patientDossier.accidentDate}</span>
              <span className="text-teal-300 font-bold">
                {patientDossier.totalPages} Seiten ({patientDossier.totalSizeMb} MB Dossier)
              </span>
            </div>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,170,0.4)] hover:shadow-[0_0_30px_rgba(0,212,170,0.6)] transition-all cursor-pointer"
          >
            <FolderArchive size={16} />
            <span>Patientenakte Importieren</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,170,0.3)]"
          >
            <Download size={16} />
            <span>Gutachten Exportieren</span>
          </button>
        </div>
      </div>

      {/* 6-Phase Pipeline Stepper */}
      <PipelinePhaseStepper
        currentPhase={currentPhase}
        pipelineStatus={pipelineStatus}
        phaseProgress={phaseProgress}
        onSelectPhase={(phase) => setCurrentPhase(phase)}
        onTogglePipelineStatus={handleTogglePipelineStatus}
        onRegeneratePhase={handleRegeneratePhase}
      />

      {/* Automated Quality Control Banner */}
      <QualityControlBanner
        qcItems={qcItems}
        onResolveItem={(id) =>
          setQcItems(qcItems.map((q) => (q.id === id ? { ...q, isResolved: true } : q)))
        }
      />

      {/* Active Phase Content View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {currentPhase === 1 && (
            <Phase1DocumentAnalysisView
              documents={documents}
              onOpenDocEvidence={handleOpenDocEvidence}
              onImportMoreClick={() => setIsImportModalOpen(true)}
            />
          )}

          {currentPhase === 2 && (
            <Phase2MedicalTimelineView
              timelineEvents={timelineEvents}
              onOpenDocEvidence={handleOpenDocEvidence}
              onUpdateTimelineEvents={(updated) => setTimelineEvents(updated)}
            />
          )}

          {currentPhase === 3 && (
            <Phase3ClinicalSummaryView
              specialtySummaries={specialtySummaries}
              onOpenDocEvidence={handleOpenDocEvidence}
            />
          )}

          {currentPhase === 4 && (
            <Phase4FunctionalCapacityView
              functionalCapacity={functionalCapacity}
              onOpenDocEvidence={(docName, page) => handleOpenDocEvidence("doc-5", page)}
            />
          )}

          {currentPhase === 5 && (
            <Phase5DraftsView
              draftVariants={draftVariants}
              selectedDraftId={selectedDraftId}
              onSelectDraft={(id) => setSelectedDraftId(id)}
              onProceedToReview={() => setCurrentPhase(6)}
            />
          )}

          {currentPhase === 6 && (
            <Phase6ReviewEditorView
              activeDraft={activeDraft}
              onOpenDocEvidence={handleOpenDocEvidence}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Multi-AI Consensus Panel */}
      <MultiAIConsensusPanel consensusOutputs={consensusOutputs} />

      {/* Modals */}
      <ImportGutachtenModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      <EvidenceViewerModal
        isOpen={evidenceViewerState.isOpen}
        docId={evidenceViewerState.docId}
        pageNumber={evidenceViewerState.pageNumber}
        documents={documents}
        onClose={() =>
          setEvidenceViewerState({ isOpen: false, docId: null, pageNumber: 1 })
        }
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeDraft={activeDraft}
        patientDossier={patientDossier}
      />
    </div>
  );
}
