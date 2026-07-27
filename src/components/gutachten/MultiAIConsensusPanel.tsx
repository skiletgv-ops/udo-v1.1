import React from "react";
import { Sparkles, Brain, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ConsensusModelOutput } from "./gutachtenTypes";

interface MultiAIConsensusPanelProps {
  consensusOutputs: ConsensusModelOutput[];
}

export default function MultiAIConsensusPanel({
  consensusOutputs,
}: MultiAIConsensusPanelProps) {
  return (
    <div className="bg-[#111217]/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wider font-sans flex items-center gap-2">
              <span>UDO Multi-Modell KI-Konsens (4 KI-Modelle)</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                100% KONSENS ERREICHT
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Unabhängige Parallel-Beurteilung durch Med-Gemini, Claude 3.5, GPT-4o und UDO-R1 (Dr. Gratsiano)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline">
          Ø Konfidenz: 96.5%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {consensusOutputs.map((model) => (
          <div
            key={model.modelId}
            className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 flex flex-col justify-between hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${model.avatarColor}`} />
                  {model.modelName}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {model.confidenceScore}%
                </span>
              </div>

              <span className="text-[10px] font-mono text-cyan-300 uppercase block font-bold">
                {model.findingTitle}
              </span>

              <p className="text-[11px] text-slate-300 leading-snug line-clamp-4 font-sans">
                {model.assessmentText}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} />
                Stimmt mit Konsens überein
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
