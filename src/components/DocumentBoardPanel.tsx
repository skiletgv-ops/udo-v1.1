import React, { useState } from "react";
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Shield, 
  FileCheck,
  Star,
  Tag
} from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  category: "gutachten" | "awmf" | "befund" | "discharge" | "legal";
  patientName?: string;
  date: string;
  size: string;
  status: "verified" | "pending" | "archived";
  isFavorite?: boolean;
  tags: string[];
}

const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "S2k Leitlinie Traumatische Hirnschädigung (AWMF 008/001)",
    category: "awmf",
    date: "2026-06-15",
    size: "4.2 MB",
    status: "verified",
    isFavorite: true,
    tags: ["AWMF", "S2k", "Neurotrauma"]
  },
  {
    id: "doc-2",
    title: "MdE-Neubewertung BG-Gutachten - Pat. M. Schmidt",
    category: "gutachten",
    patientName: "Michael Schmidt",
    date: "2026-07-20",
    size: "1.8 MB",
    status: "verified",
    isFavorite: true,
    tags: ["MdE 30%", "S2k Standard", "Finalized"]
  },
  {
    id: "doc-3",
    title: "Neurologischer Konsilbefund - Pat. E. Weber",
    category: "befund",
    patientName: "Erika Weber",
    date: "2026-07-21",
    size: "850 KB",
    status: "pending",
    tags: ["EEG", "Spike-Wave", "Konsil"]
  },
  {
    id: "doc-4",
    title: "Klinischer Entlassungsbericht - BG Klinikum Köln",
    category: "discharge",
    patientName: "Hans Müller",
    date: "2026-07-18",
    size: "2.4 MB",
    status: "verified",
    tags: ["Stationär", "Reha-Plan"]
  },
  {
    id: "doc-5",
    title: "DGUV Richtlinien zur MdE-Einschätzung bei HNO-Schäden",
    category: "legal",
    date: "2026-05-10",
    size: "3.1 MB",
    status: "archived",
    tags: ["DGUV", "Rechtsprechung"]
  }
];

export default function DocumentBoardPanel() {
  const [documents, setDocuments] = useState<DocumentItem[]>(SAMPLE_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[0]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev =>
      prev.map(doc => doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc)
    );
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.patientName && doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full w-full space-y-5 text-slate-100 font-sans">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-white/10 rounded-2xl p-3 px-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dokumente, AWMF Leitlinien, Patienten oder Tags suchen..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Alle" },
            { id: "gutachten", label: "Gutachten" },
            { id: "awmf", label: "AWMF" },
            { id: "befund", label: "Befunde" },
            { id: "discharge", label: "Berichte" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Document List + Inspector Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[420px]">
        
        {/* Document Cards Column */}
        <div className="lg:col-span-7 flex flex-col space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc?.id === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? "bg-slate-900/90 border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                    : "bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    doc.category === "gutachten" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                    doc.category === "awmf" ? "bg-teal-500/10 border-teal-500/30 text-teal-400" :
                    doc.category === "befund" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" :
                    "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}>
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-teal-300">
                        {doc.title}
                      </h4>
                    </div>

                    {doc.patientName && (
                      <p className="text-[11px] text-teal-300/80 font-mono mt-0.5">
                        Patient: {doc.patientName}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {doc.date}
                      </span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <div className="flex items-center gap-1 ml-2">
                        {doc.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFavorite(doc.id, e)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Bookmark / Favorite"
                >
                  <Star size={16} className={doc.isFavorite ? "fill-amber-400 text-amber-400" : ""} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Document Inspector Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          {selectedDoc ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileCheck size={14} /> DOKUMENTEN-DETAIL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  {selectedDoc.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-white leading-snug">
                  {selectedDoc.title}
                </h3>
                {selectedDoc.patientName && (
                  <p className="text-xs text-teal-400 font-mono mt-1">
                    Patientenakte: {selectedDoc.patientName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] block">KATEGORIE</span>
                  <span className="text-slate-200 font-bold uppercase">{selectedDoc.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DATUM</span>
                  <span className="text-slate-200 font-bold">{selectedDoc.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DATEIGRÖSSE</span>
                  <span className="text-slate-200 font-bold">{selectedDoc.size}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">SCHUTZSTUFE</span>
                  <span className="text-emerald-400 font-bold">DSGVO / S2k</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">METADATEN TAGS</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.tags.map(t => (
                    <span key={t} className="px-2 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] cursor-pointer">
                  <Eye size={15} /> Vorschau & Befundanalyse
                </button>
                <button className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-white/10 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Download size={15} /> Exportieren (PDF/JSON)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
              Kein Dokument ausgewählt
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
