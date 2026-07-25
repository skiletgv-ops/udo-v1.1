import React, { useState } from "react";
import {
  Brain,
  Activity,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles
} from "lucide-react";
import { SpecialtySummaryItem } from "./gutachtenTypes";

interface Phase3ClinicalSummaryViewProps {
  specialtySummaries: SpecialtySummaryItem[];
  onOpenDocEvidence: (docId: string, page: number) => void;
}

export default function Phase3ClinicalSummaryView({
  specialtySummaries,
  onOpenDocEvidence,
}: Phase3ClinicalSummaryViewProps) {
  const [activeSpecialtyId, setActiveSpecialtyId] = useState<string>("neurology");

  const activeSummary =
    specialtySummaries.find((s) => s.id === activeSpecialtyId) || specialtySummaries[0];

  const getIcon = (id: string) => {
    switch (id) {
      case "neurology":
        return Brain;
      case "orthopedics":
        return Activity;
      case "rehabilitation":
        return ShieldCheck;
      case "psychiatry":
        return HeartPulse;
      default:
        return Stethoscope;
    }
  };

  return (
    <div className="space-y-6">
      {/* Specialty Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {specialtySummaries.map((spec) => {
          const Icon = getIcon(spec.id);
          const isActive = activeSpecialtyId === spec.id;

          return (
            <button
              key={spec.id}
              onClick={() => setActiveSpecialtyId(spec.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]"
                  : "bg-[#111217]/80 border-white/10 hover:border-white/25 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-white/5 border border-white/10 text-cyan-400"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="truncate">
                <h4 className="text-xs font-bold truncate">{spec.title.split(" & ")[0]}</h4>
                <p className="text-[9px] font-mono text-slate-400 truncate">
                  {spec.diagnoses.length} Diagnosen
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Specialty Detailed Card */}
      {activeSummary && (
        <div className="p-6 rounded-3xl bg-[#111217]/90 border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider font-sans">
                  Strukturierte KI-Zusammenfassung: {activeSummary.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evidenzbasierte Synthese aus allen Krankenhaus-, Facharzt- &amp; Reha-Protokollen
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold self-start sm:self-auto">
              AWMF-Leitlinienkonform
            </span>
          </div>

          {/* Grid 1: Major Findings & Diagnoses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Major Findings */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <CheckCircle size={14} />
                <span>Wichtigste Klinische Befunde</span>
              </h4>

              <ul className="space-y-2 text-xs text-slate-200">
                {activeSummary.majorFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnoses */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Activity size={14} />
                <span>Fachbezogene Diagnosen (ICD-10)</span>
              </h4>

              <div className="space-y-2">
                {activeSummary.diagnoses.map((diag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{diag.name}</span>
                      <span className="text-[10px] font-mono text-cyan-300">
                        ICD-10 Code: {diag.code}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        diag.status === "acute"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : diag.status === "chronic"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {diag.status === "acute"
                        ? "Akut"
                        : diag.status === "chronic"
                        ? "Chronisch"
                        : "Konsolidiert"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid 2: Progression, Treatment Response & Unresolved Issues */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Krankheitsverlauf &amp; Dynamik
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeSummary.progression}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-teal-400 uppercase block">
                Therapieansprechen &amp; Erfolg
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeSummary.treatmentResponse}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-rose-400 uppercase block">
                Offene / Ungeklärte Fragen
              </span>
              <ul className="space-y-1 text-xs text-slate-200">
                {activeSummary.unresolvedIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-rose-200/90">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence References */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <FileText size={14} className="text-cyan-400" />
              <span>Verknüpfte Quellennachweise in der Patientenakte</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeSummary.evidenceReferences.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenDocEvidence(ref.docId, ref.page)}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300 mb-1">
                    <span className="truncate group-hover:underline">{ref.docName}</span>
                    <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-200 shrink-0">
                      Seite {ref.page}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-2">"{ref.excerpt}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
