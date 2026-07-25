import React from "react";
import { motion } from "motion/react";
import {
  X,
  FileText,
  Eye,
  CheckCircle,
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
  Printer
} from "lucide-react";
import { MedicalDocumentItem } from "./gutachtenTypes";

interface EvidenceViewerModalProps {
  isOpen: boolean;
  docId: string | null;
  pageNumber: number;
  documents: MedicalDocumentItem[];
  onClose: () => void;
}

export default function EvidenceViewerModal({
  isOpen,
  docId,
  pageNumber,
  documents,
  onClose,
}: EvidenceViewerModalProps) {
  if (!isOpen || !docId) return null;

  const doc = documents.find((d) => d.id === docId) || documents[0];

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#111217] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden text-white space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white uppercase font-sans flex items-center gap-2">
                <span>Quellennachweis &amp; Evidenzschnitt</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                  Seite {pageNumber} von {doc.pages}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{doc.filename}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Institution</span>
            <span className="font-bold text-slate-200">{doc.facility}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Arzt / Autor</span>
            <span className="font-bold text-slate-200">{doc.physician}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Datum &amp; Typ</span>
            <span className="font-bold text-cyan-300">{doc.date} ({doc.categoryLabel})</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">OCR Qualität</span>
            <span className="font-bold text-emerald-400">{doc.ocrQuality}% Präzision</span>
          </div>
        </div>

        {/* Simulated PDF Viewer Display Canvas */}
        <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-white/10 pb-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <FileText size={14} />
              DIGITALES AKTEN-FACSIMILE (BGHM DOKUMENTENARCHIV)
            </span>
            <span>SEITE {pageNumber} / {doc.pages}</span>
          </div>

          {/* Rendered PDF Facsimile Excerpt Box */}
          <div className="p-6 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-sm space-y-3 shadow-lg relative border-l-8 border-cyan-500">
            <div className="flex justify-between text-xs font-sans text-slate-500 border-b border-slate-200 pb-2">
              <span>{doc.facility}</span>
              <span>Datum: {doc.date}</span>
            </div>

            <p className="font-bold text-slate-950 font-sans">
              Betrifft: Medizinische Dokumentation &amp; Befundbericht Patient Thomas Müller
            </p>

            <p className="bg-amber-100 p-3 rounded border-l-4 border-amber-500 font-medium text-slate-900">
              "{doc.summary}"
            </p>

            <p className="text-xs text-slate-700">
              Die klinische Symptomatik zeigt eine eindeutige Korrelation zwischen dem
              akuten Traumabefund und der verbliebenen funktionellen Beeinträchtigung im LWS-Segment L4/L5.
            </p>

            {/* Simulated Physician Stamp */}
            <div className="pt-4 flex justify-between items-end text-xs font-sans text-slate-600 border-t border-slate-200">
              <div>
                <p className="font-bold">{doc.physician}</p>
                <p className="text-[10px]">Facharzt für Neurochirurgie &amp; Spezielle Schmerztherapie</p>
              </div>

              <div className="p-2 border-2 border-blue-600/40 rounded text-[10px] font-mono text-blue-800 uppercase rotate-[-3deg]">
                ✓ Digital Verifiziert (SHA-256)
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center border-t border-white/10 pt-4 text-xs font-mono">
          <span className="text-slate-400">UDO Evidence Linker v4.2</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
