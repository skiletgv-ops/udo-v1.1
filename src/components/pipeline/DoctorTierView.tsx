import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Edit3,
  Stethoscope,
  Lock,
  History,
  AlertTriangle,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { ExtractedMedicalDocument } from '../../types/ingestionPipeline';
import { triggerAudioCue } from '../../services/audioFeedbackService';
import { DemoDataBadge } from './DemoDataBadge';
import { auditLogger } from '../../services/auditLogger';

interface DoctorTierViewProps {
  documents: ExtractedMedicalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ExtractedMedicalDocument[]>>;
  onOpenAuditHistory: (doc: ExtractedMedicalDocument) => void;
}

export const DoctorTierView: React.FC<DoctorTierViewProps> = ({
  documents,
  setDocuments,
  onOpenAuditHistory
}) => {
  const doctorApprovedQueue = documents.filter((d) => d.status === 'ADMIN_APPROVED' || d.status === 'DOCTOR_SIGNED' || d.currentRoleHandler === 'DOCTOR');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(doctorApprovedQueue[0]?.id || documents[0]?.id || null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || doctorApprovedQueue[0] || documents[0];

  const [clinicalNotes, setClinicalNotes] = useState(selectedDoc?.doctorNotes || selectedDoc?.clinicalFindingsText.value || '');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'GDT' | 'BDT' | 'CSV'>('GDT');
  const [generatedExportText, setGeneratedExportText] = useState('');

  const handleUpdateClinicalNotes = (text: string) => {
    setClinicalNotes(text);
    if (!selectedDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            doctorNotes: text
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: selectedDoc.id,
      patientName: `${selectedDoc.demographics.firstName.value} ${selectedDoc.demographics.lastName.value}`,
      userId: 'dr_voss',
      userName: 'Dr. med. A. Voss (Facharzt)',
      userRole: 'DOCTOR',
      action: 'DOCTOR_CLINICAL_EDIT',
      comment: 'Klinische Befundbewertung & Notizen durch Arzt ergänzt.'
    });
  };

  const handleDoctorSignAndBill = () => {
    if (!selectedDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            status: 'DOCTOR_SIGNED',
            doctorSignedAt: new Date().toLocaleString('de-DE'),
            doctorReviewerId: 'dr_voss'
          };
        }
        return doc;
      })
    );

    auditLogger.logEvent({
      documentId: selectedDoc.id,
      patientName: `${selectedDoc.demographics.firstName.value} ${selectedDoc.demographics.lastName.value}`,
      userId: 'dr_voss',
      userName: 'Dr. med. A. Voss (Facharzt)',
      userRole: 'DOCTOR',
      action: 'DOCTOR_SIGNED_AND_BILLED',
      comment: 'Ärztliche Abnahme & Freigabe zur ALBIS Abrechnung (QES Signatur).'
    });

    triggerAudioCue(
      'audit-complete',
      'Ärztliche Abnahme Erfolgreich',
      `Dokument für ${selectedDoc.demographics.lastName.value} wurde freigegeben und zur ALBIS Abrechnung gezeichnet.`
    );

    // Generate ALBIS-compatible GDT/BDT/CSV format string
    generateAlbisExportData(selectedDoc, 'GDT');
    setShowExportModal(true);
  };

  const generateAlbisExportData = (doc: ExtractedMedicalDocument, format: 'GDT' | 'BDT' | 'CSV') => {
    const demoHeader = doc.isSynthetic ? '=== ACHTUNG: DEMO DATA (isSynthetic: true) ===\n' : '';

    if (format === 'GDT') {
      const gdtText = `${demoHeader}01380006301
0148300${doc.demographics.patientId.value}
0103100${doc.demographics.lastName.value}
0103101${doc.demographics.firstName.value}
0103102${doc.demographics.birthDate.value}
0103103${doc.demographics.insuranceNumber.value}
0106200ICD10: ${doc.icd10Codes.value.map((c) => c.code).join(', ')}
0106201GOAE: ${doc.goaeBillingCodes.value.map((g) => `${g.code}:${g.priceEuro}EUR`).join('; ')}
0106202BEFUND: ${doc.doctorNotes || doc.clinicalFindingsText.value}
`;
      setGeneratedExportText(gdtText);
    } else if (format === 'BDT') {
      const bdtText = `${demoHeader}[BDT_EXPORT_ALBIS_2026]
Patient_ID=${doc.demographics.patientId.value}
Name=${doc.demographics.lastName.value}, ${doc.demographics.firstName.value}
DOB=${doc.demographics.birthDate.value}
VersicherungsNr=${doc.demographics.insuranceNumber.value}
Diagnosen=${doc.icd10Codes.value.map((c) => `${c.code}(${c.description})`).join('|')}
GOAE_Positionen=${doc.goaeBillingCodes.value.map((g) => `${g.code}=${g.priceEuro}`).join('|')}
Arzt_Signatur=Dr. med. A. Voss [QES Validated]
`;
      setGeneratedExportText(bdtText);
    } else {
      const csvText = `${demoHeader}PatientID,LastName,FirstName,DOB,Insurance,ICD10,GOAE_Codes,TotalEuro,Status,IsSynthetic
${doc.demographics.patientId.value},${doc.demographics.lastName.value},${doc.demographics.firstName.value},${doc.demographics.birthDate.value},${doc.demographics.insuranceNumber.value},"${doc.icd10Codes.value.map((c) => c.code).join(';')}", "${doc.goaeBillingCodes.value.map((g) => g.code).join(';')}", ${doc.goaeBillingCodes.value.reduce((acc, g) => acc + g.priceEuro, 0).toFixed(2)},DOCTOR_SIGNED,${doc.isSynthetic}`;
      setGeneratedExportText(csvText);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="p-4 rounded-2xl bg-[#0d0e15] border border-cyan-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 font-mono text-cyan-300 text-[10px] font-bold uppercase">
                TIER 3: DOCTOR Sign-Off (Ärztliche Abnahme)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Finale Stufe vor ALBIS Export & Abrechnung
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-1">
              Prüfung, Klinisches Refinement & "Approve & Bill"
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Arztfreigabe Queue:</span>
            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              {doctorApprovedQueue.length} Akten prüfbereit
            </span>
          </div>
        </div>

        {/* SELECTOR FOR DOCTOR QUEUE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {doctorApprovedQueue.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocId(doc.id);
                setClinicalNotes(doc.doctorNotes || doc.clinicalFindingsText.value || '');
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                selectedDoc?.id === doc.id
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,170,0.2)]'
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
                <span>DOB: {doc.demographics.birthDate.value}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLEAN DOCTOR CARD SHOWING ADMIN-APPROVED DATA */}
      {selectedDoc && (
        <div className="bg-[#0d0e15] border border-cyan-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    {selectedDoc.demographics.lastName.value}, {selectedDoc.demographics.firstName.value}
                  </h3>
                  {selectedDoc.isSynthetic && <DemoDataBadge size="sm" />}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Geb: {selectedDoc.demographics.birthDate.value} • KV/BG-Nr: {selectedDoc.demographics.insuranceNumber.value} • Kostenträger: {selectedDoc.demographics.insuranceProvider.value}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenAuditHistory(selectedDoc)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>Audit History</span>
            </button>
          </div>

          {/* READ-ONLY ADMIN APPROVED DEMOGRAPHICS & DIAGNOSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] text-cyan-400 block font-bold uppercase">
                ADMIN-Geprüfte Diagnosen (ICD-10-GM)
              </span>
              <div className="space-y-1.5">
                {selectedDoc.icd10Codes.value.map((c) => (
                  <div key={c.code} className="flex items-center justify-between bg-white/5 p-2 rounded">
                    <span className="text-cyan-300 font-bold">{c.code}</span>
                    <span className="text-slate-200 text-[11px]">{c.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] text-amber-400 block font-bold uppercase">
                ADMIN-Geprüfte Abrechnung (GOÄ / GNR)
              </span>
              <div className="space-y-1.5">
                {selectedDoc.goaeBillingCodes.value.map((g) => (
                  <div key={g.code} className="flex items-center justify-between bg-white/5 p-2 rounded">
                    <span className="text-amber-300 font-bold">{g.code} ({g.description})</span>
                    <span className="text-amber-400 font-bold">{g.priceEuro.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CLINICAL REFINEMENT & NOTES (DOCTOR EDITABLE FIELD) */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>Ärztliche Ergänzungen & Klinische Beurteilung (Refinement):</span>
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => handleUpdateClinicalNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-sans focus:border-cyan-500 focus:outline-none"
              placeholder="Fügen Sie ärztliche Beurteilungen oder spezifische Gutachten-Hinweise hinzu..."
            />
          </div>

          {/* DOCTOR ACTION BUTTONS */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Qualifizierte Elektronische Signatur (QES) für ALBIS-Schnittstelle vorbereitet</span>
            </div>

            <button
              onClick={handleDoctorSignAndBill}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Approve & Bill (ALBIS Daten-Export)</span>
            </button>
          </div>
        </div>
      )}

      {/* EXPORT DATA MODAL FOR ALBIS BDT/CSV/GDT */}
      {showExportModal && selectedDoc && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0d0e15] border border-emerald-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  ALBIS-Kompatible Exportdaten
                </h3>
                {selectedDoc.isSynthetic && <DemoDataBadge size="sm" />}
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Schließen
              </button>
            </div>

            {/* FORMAT TOGGLE BUTTONS */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Format:</span>
              {(['GDT', 'BDT', 'CSV'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    setExportFormat(fmt);
                    generateAlbisExportData(selectedDoc, fmt);
                  }}
                  className={`px-3 py-1 rounded-lg border font-bold transition-colors cursor-pointer ${
                    exportFormat === fmt
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* EXPORT PREVIEW TEXTAREA */}
            <pre className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-emerald-300 max-h-60 overflow-y-auto whitespace-pre-wrap select-all">
              {generatedExportText}
            </pre>

            {/* CONSTRAINT 1 DEMO DATA WARNING */}
            {selectedDoc.isSynthetic && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Dies ist ein synthetischer Testdatensatz (isSynthetic: true). Exportdaten sind ausschließlich für Demos und Test-Umgebungen vorgesehen.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedExportText);
                  alert('Exportdaten in die Zwischenablage kopiert!');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                In Zwischenablage kopieren
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
