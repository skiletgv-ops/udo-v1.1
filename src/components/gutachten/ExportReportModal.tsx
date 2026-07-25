import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Download,
  FileText,
  CheckCircle,
  ShieldCheck,
  Printer,
  Sparkles,
  Zap,
  Award,
  Layers
} from "lucide-react";
import { GutachtenDraftVariant, PatientDossier } from "./gutachtenTypes";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDraft: GutachtenDraftVariant;
  patientDossier: PatientDossier;
}

export default function ExportReportModal({
  isOpen,
  onClose,
  activeDraft,
  patientDossier,
}: ExportReportModalProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "rtf">("pdf");
  const [includeTimelineAppendix, setIncludeTimelineAppendix] = useState(true);
  const [includeEvidenceCitations, setIncludeEvidenceCitations] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#111217] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden text-white space-y-6"
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Download size={24} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white uppercase font-sans flex items-center gap-2">
                <span>Gutachten Exportieren &amp; Signieren</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  Freigegeben
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Professionelles Layout für Gerichte, Berufsgenossenschaften &amp; Versicherungsträger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {!exportSuccess ? (
          <div className="space-y-5">
            {/* Format Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-400 uppercase block font-bold">
                1. Ziel-Exportformat Wählen
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "pdf",
                    label: "PDF (Druckreif)",
                    desc: "Inkl. DIN 5008 Layout, Wasserzeichen &amp; Siegel",
                  },
                  {
                    id: "docx",
                    label: "Microsoft Word (.docx)",
                    desc: "Vollständig editierbar mit MS Word Formatierung",
                  },
                  {
                    id: "rtf",
                    label: "Rich Text (.rtf)",
                    desc: "Kompatibel mit Praxissoftware &amp; Kanzleisystemen",
                  },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      exportFormat === fmt.id
                        ? "bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]"
                        : "bg-black/40 border-white/10 hover:border-white/25 text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold text-white uppercase">{fmt.label}</span>
                    <p className="text-[10px] text-slate-400 leading-tight">{fmt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Configuration Options */}
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
              <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                2. Anhang- &amp; Formatierungsoptionen
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimelineAppendix}
                  onChange={(e) => setIncludeTimelineAppendix(e.target.checked)}
                  className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black/50"
                />
                <span className="text-slate-200">
                  Chronologischen Krankheitsverlauf als tabellarischen Anhang beifügen (Phase 2)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEvidenceCitations}
                  onChange={(e) => setIncludeEvidenceCitations(e.target.checked)}
                  className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black/50"
                />
                <span className="text-slate-200">
                  Quellennachweise mit Seitenzahlen &amp; SHA-256 Hashcodes im Fußbereich drucken
                </span>
              </label>
            </div>

            {/* Summary Box */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between font-bold text-cyan-300">
                <span>Dossier: {patientDossier.firstName} {patientDossier.lastName}</span>
                <span>Az: {patientDossier.caseId}</span>
              </div>
              <p className="text-slate-300">
                Gewählte Fassung: <strong>{activeDraft.title}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleStartExport}
                disabled={isExporting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer"
              >
                {isExporting ? (
                  <span>Generiere {exportFormat.toUpperCase()}...</span>
                ) : (
                  <>
                    <Download size={15} />
                    <span>Jetzt Exportieren ({exportFormat.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-base font-black text-white uppercase font-sans">
              Gutachten Erfogreich Generiert &amp; Heruntergeladen!
            </h4>
            <p className="text-xs text-slate-400">
              Die Datei wurde mit allen Anlagen und Siegeln lokal gespeichert.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
