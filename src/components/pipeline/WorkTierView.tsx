import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Send,
  History,
  Info,
  Edit2,
  Scan,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ExtractedMedicalDocument, ConfidenceScore } from '../../types/ingestionPipeline';
import { DemoDataBadge } from './DemoDataBadge';
import { auditLogger } from '../../services/auditLogger';
import { processDocumentExtraction } from '../../services/documentExtractionService';

interface WorkTierViewProps {
  documents: ExtractedMedicalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ExtractedMedicalDocument[]>>;
  onOpenAuditHistory: (doc: ExtractedMedicalDocument) => void;
  activeDocIndex: number;
  setActiveDocIndex: (idx: number) => void;
}

export const WorkTierView: React.FC<WorkTierViewProps> = ({
  documents,
  setDocuments,
  onOpenAuditHistory,
  activeDocIndex,
  setActiveDocIndex
}) => {
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDoc = documents[activeDocIndex] || documents[0];

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingUpload(true);

    try {
      const file = files[0];
      const newDoc = await processDocumentExtraction(file, {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        isSynthetic: true // DEFAULT TO SYNTHETIC FLAG PER CONSTRAINT 1
      });

      auditLogger.logEvent({
        documentId: newDoc.id,
        patientName: `${newDoc.demographics.firstName.value} ${newDoc.demographics.lastName.value}`,
        userId: 'mfa_sabine',
        userName: 'Schwester Sabine (MFA)',
        userRole: 'WORK',
        action: 'DOCUMENT_INGESTED',
        comment: `Dokument ${newDoc.fileName} erfolgreich hochgeladen und per OCR/Gemini verarbeitet.`
      });

      setDocuments((prev) => [newDoc, ...prev]);
      setActiveDocIndex(0);
    } catch (err) {
      console.error('Document ingestion error:', err);
    } finally {
      setIsProcessingUpload(false);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {confidence}% HOCH
        </span>
      );
    } else if (confidence >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/40 text-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          {confidence}% MITTEL
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 border border-rose-500/40 text-rose-300 animate-pulse">
          <XCircle className="w-3 h-3 text-rose-400" />
          {confidence}% KRITISCH
        </span>
      );
    }
  };

  const handleUpdateDemographicField = (key: keyof typeof currentDoc.demographics, newValue: string) => {
    if (!currentDoc) return;
    const oldVal = currentDoc.demographics[key].value;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === currentDoc.id) {
          return {
            ...doc,
            demographics: {
              ...doc.demographics,
              [key]: {
                ...doc.demographics[key],
                value: newValue as any,
                status: 'corrected',
                workValue: newValue as any
              }
            }
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: currentDoc.id,
      patientName: `${currentDoc.demographics.firstName.value} ${currentDoc.demographics.lastName.value}`,
      userId: 'mfa_sabine',
      userName: 'Schwester Sabine (MFA)',
      userRole: 'WORK',
      action: 'FIELD_CORRECTED',
      fieldName: key,
      beforeValue: String(oldVal),
      afterValue: newValue,
      comment: 'Korrektur im WORK Intake durch MFA.'
    });
  };

  const handleConfirmField = (fieldName: string) => {
    if (!currentDoc) return;
    auditLogger.logEvent({
      documentId: currentDoc.id,
      patientName: `${currentDoc.demographics.firstName.value} ${currentDoc.demographics.lastName.value}`,
      userId: 'mfa_sabine',
      userName: 'Schwester Sabine (MFA)',
      userRole: 'WORK',
      action: 'FIELD_CONFIRMED',
      fieldName,
      comment: 'Feld im WORK Intake bestätigt.'
    });
  };

  const handleSubmitToAdmin = () => {
    if (!currentDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === currentDoc.id) {
          return {
            ...doc,
            status: 'WORK_REVIEWED',
            currentRoleHandler: 'ADMIN',
            workReviewedAt: new Date().toLocaleString('de-DE'),
            workReviewerId: 'mfa_sabine'
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: currentDoc.id,
      patientName: `${currentDoc.demographics.firstName.value} ${currentDoc.demographics.lastName.value}`,
      userId: 'mfa_sabine',
      userName: 'Schwester Sabine (MFA)',
      userRole: 'WORK',
      action: 'WORK_SUBMITTED',
      comment: 'Dokument von WORK an ADMIN-Prüfqueue weitergeleitet.'
    });
  };

  return (
    <div className="space-y-6">
      {/* TOP BAR: INGESTION DROPZONE & HARDWARE INTEGRATION STATUS */}
      <div className="p-4 rounded-2xl bg-[#0d0e15] border border-cyan-500/20 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 font-mono text-cyan-300 text-[10px] font-bold uppercase">
                TIER 1: WORK (MFA Intake)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Stufe 1 von 3 der Prüfkette
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-1">
              Dokumenten-Erfassung & KI-Extraktionskontrolle
            </h2>
          </div>

          {/* FOLLOW-UP HARDWARE INTEGRATION BADGES */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-slate-400">
            <span className="text-slate-500">Hardware & Protokolle:</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 opacity-70" title="Follow-Up: TWAIN / WIA Flachbett- & Einzugsscanner Anbindung">
              TWAIN/WIA Scanner [In Vorbereitung]
            </span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 opacity-70" title="Follow-Up: Automatische Postfach-Abfrage">
              IMAP Polling [In Vorbereitung]
            </span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 opacity-70" title="Follow-Up: Fax-Empfang zu PDF">
              Fax-zu-PDF [In Vorbereitung]
            </span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 opacity-70" title="Follow-Up: eGK Versichertenkarte">
              eGK Chipkarte [In Vorbereitung]
            </span>
          </div>
        </div>

        {/* DRAG AND DROP UPLOADER & PHOTO INPUT */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
          className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
            dragOver
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-white/15 bg-white/5 hover:border-cyan-500/40 hover:bg-white/10'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept="image/*,application/pdf"
          />

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              {isProcessingUpload ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {isProcessingUpload
                ? 'OCR & Gemini KI-Extraktion läuft...'
                : 'Arztbrief, D-Bericht oder Befund-PDF hier ablegen oder Fotos vom Tablet hochladen'}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Unterstützt PDF, JPG, PNG • Automatische Zuordnung der ICD-10 & GOÄ Codes
            </p>
          </div>
        </div>
      </div>

      {/* BATCH QUEUE BAR & NAVIGATION */}
      {documents.length > 0 && (
        <div className="p-3 bg-[#0d0e15] border border-cyan-500/20 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Arbeitsqueue (MFA Intake):</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              Dokument {activeDocIndex + 1} von {documents.length}
            </span>
            {currentDoc.isSynthetic && <DemoDataBadge size="sm" />}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDocIndex(Math.max(0, activeDocIndex - 1))}
              disabled={activeDocIndex === 0}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDocIndex(Math.min(documents.length - 1, activeDocIndex + 1))}
              disabled={activeDocIndex === documents.length - 1}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuditHistory(currentDoc)}
              className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>
          </div>
        </div>
      )}

      {/* SPLIT SCREEN REVIEW UI (LEFT SCAN PREVIEW / RIGHT EXTRACTED FORM) */}
      {currentDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
          {/* LEFT PANE: ORIGINAL SCAN PREVIEW */}
          <div className="lg:col-span-5 bg-[#0d0e15] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Original Scan: {currentDoc.fileName}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{currentDoc.fileSize}</span>
            </div>

            {/* RAW OCR TEXT OR SCAN PREVIEW CONTAINER */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-4 max-h-[520px] overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold border-b border-white/10 pb-2 mb-3">
                <span className="flex items-center gap-1">
                  <Scan className="w-3 h-3" /> Tesseract OCR / Gemini Ingestion Text
                </span>
                <span>ID: {currentDoc.id}</span>
              </div>
              {currentDoc.rawOcrText}
            </div>
          </div>

          {/* RIGHT PANE: EXTRACTED FORM WITH COLOR-CODED CONFIDENCE */}
          <div className="lg:col-span-7 bg-[#0d0e15] border border-cyan-500/30 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Extrahierte ALBIS-Strukturdaten
                  </h3>
                  {currentDoc.isSynthetic && <DemoDataBadge size="sm" />}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  MFA-Prüfung: Bitte markieren oder korrigieren Sie auffällige Felder
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  {currentDoc.status}
                </span>
              </div>
            </div>

            {/* DEMOGRAPHICS FIELDS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                1. Stammdaten (Patient / Kostenträger)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-slate-400">Vorname</label>
                    {getConfidenceBadge(currentDoc.demographics.firstName.confidence)}
                  </div>
                  <input
                    type="text"
                    value={currentDoc.demographics.firstName.value}
                    onChange={(e) => handleUpdateDemographicField('firstName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-slate-400">Nachname</label>
                    {getConfidenceBadge(currentDoc.demographics.lastName.confidence)}
                  </div>
                  <input
                    type="text"
                    value={currentDoc.demographics.lastName.value}
                    onChange={(e) => handleUpdateDemographicField('lastName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-slate-400">Geburtsdatum</label>
                    {getConfidenceBadge(currentDoc.demographics.birthDate.confidence)}
                  </div>
                  <input
                    type="text"
                    value={currentDoc.demographics.birthDate.value}
                    onChange={(e) => handleUpdateDemographicField('birthDate', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-slate-400">KV-Nummer / BG-Nr.</label>
                    {getConfidenceBadge(currentDoc.demographics.insuranceNumber.confidence)}
                  </div>
                  <input
                    type="text"
                    value={currentDoc.demographics.insuranceNumber.value}
                    onChange={(e) => handleUpdateDemographicField('insuranceNumber', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ICD-10 DIAGNOSES */}
            <div className="space-y-3 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  2. Medizinische Diagnosen (ICD-10-GM)
                </h4>
                {getConfidenceBadge(currentDoc.icd10Codes.confidence)}
              </div>

              <div className="space-y-2">
                {currentDoc.icd10Codes.value.map((icd, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                        {icd.code}
                      </span>
                      <span className="text-slate-200">{icd.description}</span>
                    </div>
                    <button
                      onClick={() => handleConfirmField(`icd10_${icd.code}`)}
                      className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] cursor-pointer"
                    >
                      Bestätigen
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GOÄ / GNR BILLING CODES */}
            <div className="space-y-3 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  3. Abrechnungspositionen (GOÄ / GNR)
                </h4>
                {getConfidenceBadge(currentDoc.goaeBillingCodes.confidence)}
              </div>

              <div className="space-y-2">
                {currentDoc.goaeBillingCodes.value.map((goae, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        {goae.code}
                      </span>
                      <span className="text-slate-200">{goae.description}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-amber-400 font-bold">{goae.priceEuro.toFixed(2)} €</span>
                      <button
                        onClick={() => handleConfirmField(`goae_${goae.code}`)}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] cursor-pointer"
                      >
                        Bestätigen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT TO ADMIN AUDIT ACTION */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nach der WORK-Prüfung geht die Akte an die ADMIN-Genehmigung</span>
              </div>

              <button
                onClick={handleSubmitToAdmin}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_25px_rgba(0,212,170,0.5)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Absenden an ADMIN Audit (Stufe 2)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
