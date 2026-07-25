import React, { useState } from "react";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Brain,
  Shield,
  Eye,
  FileText,
  Sparkles,
  Info,
  Layers,
  HelpCircle
} from "lucide-react";
import { FunctionalCapacityItem } from "./gutachtenTypes";

interface Phase4FunctionalCapacityViewProps {
  functionalCapacity: FunctionalCapacityItem[];
  onOpenDocEvidence: (docName: string, page: number) => void;
}

export default function Phase4FunctionalCapacityView({
  functionalCapacity,
  onOpenDocEvidence,
}: Phase4FunctionalCapacityViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showInferencesOnly, setShowInferencesOnly] = useState(false);

  const filteredItems = functionalCapacity.filter((item) => {
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    return matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#111217]/90 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
            <Activity className="text-cyan-400" size={18} />
            <span>Sozialmedizinische Leistungsbeurteilung &amp; Funktionseinschränkungen</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Transparente Gegenüberstellung von aktenfesten Fakten vs. KI-Schlussfolgerungen mit Angabe von Konfidenzwerten
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex gap-1 text-xs">
            {["all", "physical", "cognitive", "psychological", "social"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-cyan-500 text-slate-950 font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all"
                  ? "Alle 10 Dimensionen"
                  : cat === "physical"
                  ? "Körperlich"
                  : cat === "cognitive"
                  ? "Kognitiv"
                  : cat === "psychological"
                  ? "Psychisch"
                  : "Sozial"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Functional Capacity Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#111217]/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 group"
          >
            {/* Item Title & Status Badge */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">
                  {item.category.toUpperCase()} DIMENSION
                </span>
                <h4 className="text-sm font-bold text-white font-sans">{item.dimension}</h4>
              </div>

              <div className="text-right">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border block ${
                    item.status === "Normal"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : item.status.includes("Gering")
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : item.status.includes("Mäßig")
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                  Konfidenz: <strong className="text-cyan-300">{item.confidenceLevel}%</strong>
                </span>
              </div>
            </div>

            {/* Main Description */}
            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            {/* Split: Fact vs AI Inference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Documented Fact */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>Dokumentierte Aktenfakt</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-snug">{item.factualEvidence}</p>
              </div>

              {/* AI Inference */}
              <div className="bg-black/40 p-3 rounded-xl border border-cyan-500/20 space-y-1">
                <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>KI-Schlussfolgerung</span>
                </span>
                <p className="text-[11px] text-cyan-100/90 leading-snug">{item.aiInference}</p>
              </div>
            </div>

            {/* Cited Records */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] font-mono text-slate-400">
              <span>Belegte Aktennachweise:</span>
              <div className="flex gap-1 flex-wrap">
                {item.citedRecords.map((rec, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenDocEvidence("doc-5", rec.page)}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <FileText size={10} />
                    <span>S. {rec.page}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
