import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  X,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  RefreshCw,
  FolderArchive,
  Eye,
  Laptop
} from "lucide-react";
import { MedicalDocumentItem, MedicalDocumentCategory } from "./gutachtenTypes";

interface ImportGutachtenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (newDocs: MedicalDocumentItem[], totalPages: number, totalMb: number) => void;
}

export default function ImportGutachtenModal({
  isOpen,
  onClose,
  onImportComplete,
}: ImportGutachtenModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; sizeMb: number; type: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    "Dateien parsen & Archiv entpacken...",
    "OCR-Texterkennung für eingescannte Seiten starten (DeepOCR v4)...",
    "Automatische Seitendrehung & Ausblendung von Leerseiten...",
    "Spracherkennung & Duplikatsprüfung (SHA-256 Hash-Vergleich)...",
    "Automatische Klassifizierung in 14 medizinische Dokumententypen...",
    "Klinische Entitätsextraktion (Krankenhäuser, Ärzte, ICD-10, Medikamente)...",
    "Import & Dossier-Konsolidierung abgeschlossen!"
  ];

  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map((f) => ({
        name: f.name,
        sizeMb: parseFloat((f.size / (1024 * 1024)).toFixed(2)) || 0.5,
        type: f.type || "Document"
      }));
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        sizeMb: parseFloat((f.size / (1024 * 1024)).toFixed(2)) || 0.5,
        type: f.type || "Document"
      }));
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    } else {
      simulateFileSelection();
    }
  };

  const simulateFileSelection = () => {
    if (selectedFiles.length === 0) {
      setSelectedFiles([
        { name: "Patientenakte_Mueller_Thomas_2026_Gesamtdossier.pdf", sizeMb: 34.5, type: "PDF (Digital)" },
        { name: "Klinikum_Koeln_Entlassbericht_Scan_OCR.pdf", sizeMb: 24.8, type: "PDF (Scanned)" },
        { name: "MRT_LWS_Befund_Radiologie_Dom.pdf", sizeMb: 12.1, type: "PDF (Digital)" },
      ]);
    }
  };

  const handleStartImport = () => {
    if (selectedFiles.length === 0) {
      simulateFileSelection();
    }
    setIsProcessing(true);
    setProcessingStep(0);
    setProgressPercent(5);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < processingSteps.length) {
        setProcessingStep(currentStep);
        setProgressPercent(Math.min(98, Math.round((currentStep / processingSteps.length) * 100)));
      } else {
        clearInterval(interval);
        setProgressPercent(100);
        setTimeout(() => {
          setIsProcessing(false);
          const mockImported: MedicalDocumentItem[] = (selectedFiles.length > 0 ? selectedFiles : [
            { name: "Gerät_Upload_Patientenakte.pdf", sizeMb: 12.4, type: "PDF" }
          ]).map((f, i) => ({
            id: `imported-${Date.now()}-${i}`,
            filename: f.name,
            category: "specialist_report" as MedicalDocumentCategory,
            categoryLabel: "Vom Gerät hochgeladener Befund",
            date: new Date().toLocaleDateString("de-DE"),
            facility: "Klinikum Köln - Abteilung Neurotraumatologie",
            physician: "Prof. Dr. med. M. Altenberg",
            pages: Math.max(1, Math.round(f.sizeMb * 3)),
            fileSizeMb: f.sizeMb || 4.2,
            ocrQuality: 98,
            language: "de",
            isScanned: true,
            summary: `Automatischer Import der Datei "${f.name}". AWMF S2k konform strukturiert.`,
            keyDiagnoses: ["ICD-10 S83.5 Kreuzbandruptur", "M23.2 Meniskusschaden"],
          }));

          const totalPagesImported = mockImported.reduce((acc, curr) => acc + curr.pages, 0);
          const totalMbImported = mockImported.reduce((acc, curr) => acc + curr.fileSizeMb, 0);

          onImportComplete(mockImported, totalPagesImported, totalMbImported);
          onClose();
        }, 600);
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl pointer-events-auto">
      {/* Hidden File Input for Device Upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.zip,.doc,.docx,.png,.jpg,.jpeg,.dicom,.tiff"
        className="hidden"
        onChange={handleDeviceFileSelect}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-[#111217] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden text-white space-y-6"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <FolderArchive size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2 font-sans">
                <span>Patientenakte Importieren</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                  Bis 1.000 Seiten / 1 GB
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vom lokalen Gerät hochladen oder per Drag & Drop ablegen
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Content */}
        {!isProcessing ? (
          <div className="space-y-5">
            {/* Drop Zone & Device File Picker */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleSimulatedDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                  : selectedFiles.length > 0
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/15 bg-white/5 hover:border-cyan-500/40 hover:bg-white/10"
              }`}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
                <Upload size={32} className="animate-bounce" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-200">
                  Dateien vom Gerät auswählen oder hier ablegen
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Klicken, um lokales Dateisystem zu öffnen (.pdf, .doc, .zip, .dicom, images)
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Laptop size={14} />
                  <span>Vom Gerät durchsuchen</span>
                </button>
              </div>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
                  <span>Ausgewählte Dateien ({selectedFiles.length})</span>
                  <span>
                    Gesamt: {selectedFiles.reduce((a, b) => a + b.sizeMb, 0).toFixed(1)} MB
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText size={16} className="text-cyan-400 shrink-0" />
                        <span className="font-medium text-slate-200 truncate">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                          {f.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{f.sizeMb} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleStartImport}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer"
              >
                <Zap size={15} />
                <span>Import &amp; KI-Analyse Starten</span>
              </button>
            </div>
          </div>
        ) : (
          /* Processing State */
          <div className="space-y-6 py-4 text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Sparkles size={28} className="absolute text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black uppercase text-white font-sans">
                Verarbeite Patientenakte ({progressPercent}%)
              </h4>
              <p className="text-xs font-mono text-cyan-400 animate-pulse">
                {processingSteps[processingStep]}
              </p>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[10px] font-mono text-slate-400">
              Bitte warten Sie, während UDO die vom Gerät hochgeladenen Dokumente mittels OCR analysiert...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
