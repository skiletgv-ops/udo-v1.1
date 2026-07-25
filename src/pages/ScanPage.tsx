import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Activity,
  Microscope,
  Stethoscope,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AIAgent, Finding } from '../types';

interface ScanPageProps {
  agents: AIAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AIAgent[]>>;
  findings: Finding[];
  onFinishScan: () => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({
  agents,
  setAgents,
  findings,
  onFinishScan
}) => {
  const overallProgress =
    agents.length > 0
      ? Math.round(agents.reduce((acc, a) => acc + a.progress, 0) / agents.length)
      : 0;

  const isScanning = agents.some((a) => a.progress < 100);

  useEffect(() => {
    // Simulate parallel scan progression for all 4 agents
    const interval = setInterval(() => {
      setAgents((prevAgents) => {
        let anyIncomplete = false;
        const updated = prevAgents.map((agent) => {
          if (agent.progress < 100) {
            anyIncomplete = true;
            const inc = Math.floor(Math.random() * 15) + 10;
            const nextProg = Math.min(100, agent.progress + inc);
            return {
              ...agent,
              progress: nextProg,
              status: nextProg === 100 ? ('complete' as const) : ('scanning' as const)
            };
          }
          return agent;
        });

        if (!anyIncomplete) {
          clearInterval(interval);
        }

        return updated;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [setAgents]);

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Dr. Clara Voss':
        return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'Dr. Eric Thorne':
        return <Microscope className="w-5 h-5 text-violet-400" />;
      case 'Dr. Marcel Richter':
        return <Stethoscope className="w-5 h-5 text-cyan-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" pulse>
              Schritt 2 von 4
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Parallel Neural Consensus Protocol
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-3">
            <BrainCircuit className="w-7 h-7 text-cyan-400 animate-pulse" />
            <span>4-KI-Agenten S2k Analyse</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            4 spezialisierte KI-Fachärzte analysieren die Vorlageakten simultan nach AWMF-S2k-Richtlinien.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          onClick={onFinishScan}
          disabled={isScanning}
        >
          {isScanning ? 'ANALYSE LÄUFT...' : 'BEFUNDE ÜBERPRÜFEN'}
        </Button>
      </div>

      {/* OVERALL PROGRESS BANNER */}
      <Card glow={isScanning ? 'cyan' : 'emerald'} className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono font-bold">
          <span className="text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>S2k NEURAL PARALLEL SCAN PROGRESS</span>
          </span>
          <span className="text-white text-base font-extrabold">{overallProgress}%</span>
        </div>

        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-violet-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,212,170,0.6)]"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>5 Dokumente verarbeitet</span>
          <span>4-KI-Konsens: 99.2% Einstimmigkeit</span>
        </div>
      </Card>

      {/* 4 AGENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const isComplete = agent.progress === 100;
          return (
            <Card
              key={agent.id}
              glow={isComplete ? 'cyan' : 'none'}
              className="space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_10px_rgba(0,212,170,0.3)]"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#111217] border border-white/10">
                    {getAgentIcon(agent.name)}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white block text-sm">
                    {agent.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase block">
                    {agent.title}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-sans leading-tight h-8">
                {agent.specialty}
              </div>

              <div className="space-y-1.5 font-mono text-xs pt-1 border-t border-white/10">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Vertrauen:</span>
                  <span className="text-cyan-300 font-bold">{agent.confidence}%</span>
                </div>

                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,212,170,0.4)]"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1">
                  <span className="text-slate-400">Status:</span>
                  {isComplete ? (
                    <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3" />}>
                      ABGESCHLOSSEN
                    </Badge>
                  ) : (
                    <Badge variant="cyan" pulse>
                      SCANNT... ({agent.progress}%)
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* DISCOVERED FINDINGS SUMMARY */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Erkannte Befunde & Konsensbewertung ({findings.length})</span>
          </div>
          <Badge variant="cyan">AWMF S2k Konform</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {findings.map((f) => {
            const severityColors = {
              critical: 'rose' as const,
              high: 'amber' as const,
              medium: 'cyan' as const,
              low: 'emerald' as const
            };

            return (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-1.5 font-mono text-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-white text-xs font-sans">
                    {f.title}
                  </span>
                  <Badge variant={severityColors[f.severity]}>
                    {f.severity}
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {f.description}
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-white/5">
                  <span>Quelle: {f.sourceDocument}</span>
                  <span className="text-cyan-400 font-bold">{f.confidence}% KI-Konsens</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
