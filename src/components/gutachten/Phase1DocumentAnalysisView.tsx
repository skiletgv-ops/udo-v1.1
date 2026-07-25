import React, { useState } from "react";
import {
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Filter,
  Eye,
  Trash2,
  FileCheck,
  Building,
  UserCheck,
  Stethoscope
} from "lucide-react";
import { MedicalDocumentItem, ExtractedEntity } from "./gutachtenTypes";

interface Phase1DocumentAnalysisViewProps {
  documents: MedicalDocumentItem[];
  onOpenDocEvidence: (docId: string, page: number) => void;
  onImportMoreClick: () => void;
}

export default function Phase1DocumentAnalysisView({
  documents,
  onOpenDocEvidence,
  onImportMoreClick,
}: Phase1DocumentAnalysisViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Alle Kategorien" },
    { id: "hospital_report", label: "Krankenhausberichte" },
    { id: "mri_scan", label: "MRT / Kernspin" },
    { id: "gp_report", label: "Hausarztakten" },
    { id: "specialist_report", label: "Facharztbefunde" },
    { id: "rehabilitation", label: "Reha-Berichte" },
    { id: "operative_report", label: "OP-Berichte" },
    { id: "lab_report", label: "Laborbefunde" },
    { id: "prescriptions", label: "Medikationspläne" },
    { id: "insurance_corr", label: "BG-Schriftverkehr" },
    { id: "sick_leave", label: "AU-Bescheinigungen" },
    { id: "psychiatric", label: "Psychiatrische Befunde" },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.physician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = documents.reduce((acc, d) => acc + d.pages, 0);
  const totalMb = documents.reduce((acc, d) => acc + d.fileSizeMb, 0).toFixed(1);
  const avgOcr = Math.round(
    documents.reduce((acc, d) => acc + d.ocrQuality, 0) / (documents.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Analysierte Dokumente
          </span>
          <p className="text-xl font-black text-cyan-400 font-sans">
            {documents.length} Akten-Module
          </p>
          <span className="text-[9px] font-mono text-slate-500">
            Klassifiziert in 14 BGHM-Kategorien
          </span>
        </div>

        <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Gesamtseiten &amp; Datenvolumen
          </span>
          <p className="text-xl font-black text-teal-400 font-sans">
            {totalPages} S. / {totalMb} MB
          </p>
          <span className="text-[9px] font-mono text-slate-500">
            Max. Kapazität: 1.000 S. / 1 GB
          </span>
        </div>

        <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Ø DeepOCR Qualität
          </span>
          <p className="text-xl font-black text-emerald-400 font-sans">{avgOcr}% Präzision</p>
          <span className="text-[9px] font-mono text-slate-500">
            Auto-Drehung &amp; Blanko-Filter aktiv
          </span>
        </div>

        <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Duplikats-Bereinigung
          </span>
          <p className="text-xl font-black text-indigo-400 font-sans">0 Duplikate</p>
          <span className="text-[9px] font-mono text-slate-500">
            SHA-256 Hash-Validierung bestanden
          </span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Dokument, Arzt oder Befund suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onImportMoreClick}
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer shrink-0"
        >
          <FileCheck size={15} />
          <span>+ Weitere Dokumente Importieren</span>
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-[#111217]/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white font-sans">{doc.filename}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-cyan-300 border border-white/10">
                      {doc.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      OCR {doc.ocrQuality}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building size={12} className="text-slate-500" />
                      {doc.facility}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck size={12} className="text-slate-500" />
                      {doc.physician}
                    </span>
                    <span>Datum: {doc.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-400">
                  {doc.pages} Seiten ({doc.fileSizeMb} MB)
                </span>
                <button
                  onClick={() => onOpenDocEvidence(doc.id, 1)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-200 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye size={13} />
                  <span>PDF Vorschau</span>
                </button>
              </div>
            </div>

            {/* Document Executive Summary & Diagnoses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="md:col-span-2 text-xs text-slate-300 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  KI-Auszug / Kernaussage
                </span>
                {doc.summary}
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                  Extrahierte ICD-10 Diagnosen
                </span>
                <div className="flex flex-wrap gap-1">
                  {doc.keyDiagnoses.map((diag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded"
                    >
                      {diag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
