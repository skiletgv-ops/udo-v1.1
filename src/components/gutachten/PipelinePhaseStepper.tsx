import React from "react";
import { motion } from "motion/react";
import {
  FileSearch,
  Clock,
  Stethoscope,
  Activity,
  FileCheck,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  LucideIcon
} from "lucide-react";
import { PhaseNumber, PipelineStatus } from "./gutachtenTypes";

interface PipelinePhaseStepperProps {
  currentPhase: PhaseNumber;
  pipelineStatus: PipelineStatus;
  phaseProgress: Record<PhaseNumber, number>;
  onSelectPhase: (phase: PhaseNumber) => void;
  onTogglePipelineStatus: () => void;
  onRegeneratePhase: (phase: PhaseNumber) => void;
}

export default function PipelinePhaseStepper({
  currentPhase,
  pipelineStatus,
  phaseProgress,
  onSelectPhase,
  onTogglePipelineStatus,
  onRegeneratePhase,
}: PipelinePhaseStepperProps) {
  const phases: Array<{
    id: PhaseNumber;
    title: string;
    subtitle: string;
    icon: LucideIcon;
  }> = [
    {
      id: 1,
      title: "Phase 1 — Dokumenten-Analyse",
      subtitle: "OCR & Klassifikation",
      icon: FileSearch,
    },
    {
      id: 2,
      title: "Phase 2 — Chronologischer Verlauf",
      subtitle: "Medizinische Timeline",
      icon: Clock,
    },
    {
      id: 3,
      title: "Phase 3 — Klinische Zusammenfassung",
      subtitle: "Fachbereichs-Gliederung",
      icon: Stethoscope,
    },
    {
      id: 4,
      title: "Phase 4 — Leistungsbeurteilung",
      subtitle: "Funktionale Kapazität",
      icon: Activity,
    },
    {
      id: 5,
      title: "Phase 5 — Entwurfs-Generierung",
      subtitle: "4 Gutachten-Varianten",
      icon: FileCheck,
    },
    {
      id: 6,
      title: "Phase 6 — Review & Bearbeitung",
      subtitle: "Feinschliff & Export",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-[#111217]/90 border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Sparkles size={20} className={pipelineStatus === "running" ? "animate-spin" : ""} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2 font-sans">
              <span>UDO 6-Phasen KI-Verarbeitungspipeline</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  pipelineStatus === "running"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse"
                    : pipelineStatus === "paused"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {pipelineStatus === "running"
                  ? "● PIPELINE LÄUFT"
                  : pipelineStatus === "paused"
                  ? "⏸ PAUSIERT"
                  : "✓ VOLLSTÄNDIG BEREIT"}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Automatische Orchestrierung von Dokumentenanalyse bis zum unterschriftsreifen Obergutachten
            </p>
          </div>
        </div>

        {/* Pipeline Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onTogglePipelineStatus}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
              pipelineStatus === "running"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            }`}
          >
            {pipelineStatus === "running" ? (
              <>
                <Pause size={13} />
                <span>Pausieren</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span>Fortsetzen</span>
              </>
            )}
          </button>

          <button
            onClick={() => onRegeneratePhase(currentPhase)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Aktuelle Phase neu generieren"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Phase Neu Generieren</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Phase Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {phases.map((phase) => {
          const IconComponent = phase.icon;
          const isActive = currentPhase === phase.id;
          const isCompleted = phaseProgress[phase.id] >= 100;
          const progress = phaseProgress[phase.id] || 0;

          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? "bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-[#00D4AA] shadow-[0_0_20px_rgba(0,212,170,0.4)] scale-[1.02]"
                  : isCompleted
                  ? "bg-white/5 border-emerald-500/30 hover:border-emerald-500/60 text-slate-200"
                  : "bg-black/30 border-white/10 hover:border-white/25 text-slate-400"
              }`}
            >
              {/* Progress Line */}
              <div
                className={`absolute top-0 left-0 h-1 transition-all duration-500 ${
                  isCompleted
                    ? "bg-emerald-400"
                    : isActive
                    ? "bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    : "bg-slate-700"
                }`}
                style={{ width: `${progress}%` }}
              />

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-cyan-500/30 text-cyan-300"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  Phase {phase.id}
                </span>

                {isCompleted ? (
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                ) : (
                  <IconComponent
                    size={14}
                    className={isActive ? "text-cyan-400" : "text-slate-500"}
                  />
                )}
              </div>

              <div>
                <h4
                  className={`text-xs font-bold leading-snug truncate ${
                    isActive
                      ? "text-white font-extrabold"
                      : isCompleted
                      ? "text-slate-200"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {phase.title.split(" — ")[1] || phase.title}
                </h4>
                <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                  {phase.subtitle}
                </p>
              </div>

              {/* Progress Percentage Badge */}
              <div className="mt-2 text-[9px] font-mono flex justify-between items-center text-slate-400">
                <span>{isCompleted ? "Fertig" : isActive ? "Aktiv" : "Ausstehend"}</span>
                <span className={isActive ? "text-cyan-400 font-bold" : ""}>{progress}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
