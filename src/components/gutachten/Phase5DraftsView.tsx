import React, { useState } from "react";
import {
  FileCheck,
  Star,
  CheckCircle,
  Eye,
  Columns,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Award
} from "lucide-react";
import { GutachtenDraftVariant } from "./gutachtenTypes";

interface Phase5DraftsViewProps {
  draftVariants: GutachtenDraftVariant[];
  selectedDraftId: string;
  onSelectDraft: (id: GutachtenDraftVariant["id"]) => void;
  onProceedToReview: () => void;
}

export default function Phase5DraftsView({
  draftVariants,
  selectedDraftId,
  onSelectDraft,
  onProceedToReview,
}: Phase5DraftsViewProps) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareDraftA, setCompareDraftA] = useState<GutachtenDraftVariant["id"]>("detailed_expert");
  const [compareDraftB, setCompareDraftB] = useState<GutachtenDraftVariant["id"]>("insurance_oriented");

  const activeDraft =
    draftVariants.find((d) => d.id === selectedDraftId) || draftVariants[0];

  const draftA = draftVariants.find((d) => d.id === compareDraftA) || draftVariants[0];
  const draftB = draftVariants.find((d) => d.id === compareDraftB) || draftVariants[1];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#111217]/90 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
            <FileCheck className="text-cyan-400" size={18} />
            <span>Phase 5 — 4 Vollständige Gutachten-Entwurfsvarianten</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Wählen Sie die am besten geeignete Fassung aus. Die KI empfiehlt die Variante mit der höchsten Evidenzabdeckung.
          </p>
        </div>

        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Columns size={15} className="text-cyan-400" />
          <span>Vergleichsansicht (Side-by-Side)</span>
        </button>
      </div>

      {/* Grid of 4 Draft Variant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {draftVariants.map((variant) => {
          const isSelected = selectedDraftId === variant.id;

          return (
            <div
              key={variant.id}
              onClick={() => onSelectDraft(variant.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-5 group ${
                isSelected
                  ? "bg-gradient-to-b from-cyan-500/15 via-[#111217] to-[#111217] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-[1.01]"
                  : "bg-[#111217]/80 border-white/10 hover:border-white/25 hover:bg-white/5"
              }`}
            >
              {/* AI Recommendation Badge */}
              {variant.isRecommended && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={12} className="fill-slate-950" />
                  <span>KI-Empfehlung (Score {variant.completenessScore}%)</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="pr-20">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                    {variant.pageEstimate}
                  </span>
                  <h4 className="text-base font-black text-white font-sans mt-0.5">
                    {variant.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{variant.subtitle}</p>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">
                      Vollständigkeit
                    </span>
                    <span className="text-sm font-black text-cyan-400 font-mono">
                      {variant.completenessScore}%
                    </span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">
                      Evidenzabdeckung
                    </span>
                    <span className="text-sm font-black text-teal-400 font-mono">
                      {variant.evidenceCoverageScore}%
                    </span>
                  </div>
                </div>

                {/* Section Preview */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs text-slate-300">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Enthaltene Hauptabschnitte ({variant.sections.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {variant.sections.map((sec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300"
                      >
                        {sec.title.split(" ")[0]} {sec.title.split(" ")[1] || ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-mono text-slate-400">
                  {isSelected ? "✓ Als Aktive Fassung Gewählt" : "Klicken zum Auswählen"}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDraft(variant.id);
                    onProceedToReview();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <span>In Phase 6 Übernehmen</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side by Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl pointer-events-auto">
          <div className="w-full max-w-6xl bg-[#111217] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Columns className="text-cyan-400" size={24} />
                <h3 className="text-base font-black uppercase text-white font-sans">
                  Entwurfs-Vergleich Side-by-Side
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold uppercase cursor-pointer"
              >
                Schließen
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-mono text-cyan-400 uppercase block mb-1">
                  Variante A Wählen:
                </label>
                <select
                  value={compareDraftA}
                  onChange={(e) => setCompareDraftA(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {draftVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-cyan-400 uppercase block mb-1">
                  Variante B Wählen:
                </label>
                <select
                  value={compareDraftB}
                  onChange={(e) => setCompareDraftB(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {draftVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side by Side Text Columns */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4 text-xs">
                <h4 className="font-bold text-cyan-400 text-sm border-b border-white/10 pb-2">
                  {draftA.title}
                </h4>
                {draftA.sections.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <h5 className="font-bold text-white uppercase text-[11px]">{s.title}</h5>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>

              <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4 text-xs">
                <h4 className="font-bold text-cyan-400 text-sm border-b border-white/10 pb-2">
                  {draftB.title}
                </h4>
                {draftB.sections.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <h5 className="font-bold text-white uppercase text-[11px]">{s.title}</h5>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
