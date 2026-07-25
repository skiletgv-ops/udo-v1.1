import React from 'react';
import {
  BrainCircuit,
  Sparkles,
  FileText,
  Upload,
  Activity,
  Mic,
  ShieldCheck,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ActiveTab } from '../../types';

interface HauptraumCanvasProps {
  onSelectTab: (tab: ActiveTab) => void;
  onDrBubbleTrigger: (msg: string) => void;
}

export const HauptraumCanvas: React.FC<HauptraumCanvasProps> = ({
  onSelectTab,
  onDrBubbleTrigger
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in py-6">
      {/* HERO HERO TITLE BLOCK */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,212,170,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>S2k Neural Forensic Core V4.0</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          U.D.O. S2k Forensic Hub
        </h1>

        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Cinematic, gerichtsverwertbares KI-Gutachten-System nach AWMF-S2k-Richtlinien mit 4-Köpfigem KI-Konsens.
        </p>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <Button
            variant="primary"
            size="lg"
            icon={<Upload className="w-5 h-5" />}
            onClick={() => onSelectTab('upload')}
          >
            PATIENTENAKTE HOCHLADEN
          </Button>

          <Button
            variant="ghost"
            size="lg"
            icon={<FileText className="w-5 h-5 text-emerald-400" />}
            onClick={() => onSelectTab('gutachten')}
          >
            GUTACHTEN GENERIEREN
          </Button>
        </div>
      </div>

      {/* QUICK WORKSPACE TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card
          glow="cyan"
          onClick={() => onSelectTab('upload')}
          className="cursor-pointer space-y-3 hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <Badge variant="cyan">Schritt 1</Badge>
          </div>
          <h3 className="text-lg font-bold text-white">1. Akten-Upload & Stammdaten</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Patientendaten erfassen, MRT/CT Befunde, Histologie und Laborwerte hochladen.
          </p>
          <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-bold pt-2">
            <span>Akte Öffnen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card
          glow="violet"
          onClick={() => onSelectTab('scan')}
          className="cursor-pointer space-y-3 hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <Badge variant="violet">Schritt 2</Badge>
          </div>
          <h3 className="text-lg font-bold text-white">2. 4-KI-Agenten Scan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simultane Analyse durch Radiologie, Pathologie, Klinische & Forschungs-KI.
          </p>
          <div className="flex items-center gap-1 text-xs font-mono text-violet-400 font-bold pt-2">
            <span>Analyse Starten</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card
          glow="rose"
          onClick={() => onSelectTab('review')}
          className="cursor-pointer space-y-3 hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <Badge variant="rose">Schritt 3</Badge>
          </div>
          <h3 className="text-lg font-bold text-white">3. Befund-Bewertung</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pathologische Befunde validieren, ICD-10 Zuordnung und AWMF-Evidenz prüfen.
          </p>
          <div className="flex items-center gap-1 text-xs font-mono text-rose-400 font-bold pt-2">
            <span>Befunde Prüfen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </div>

      {/* S2K SYSTEM HIGHLIGHTS */}
      <Card className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 font-mono text-xs">
        <div className="p-2 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">KI-KONSENS</span>
          <div className="text-xl font-bold text-cyan-400">99.2%</div>
          <span className="text-[10px] text-slate-500">4-Köpfiges Ärzteteam</span>
        </div>

        <div className="p-2 md:pl-4 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">LEITLINIEN MATCH</span>
          <div className="text-xl font-bold text-violet-400">AWMF S2k</div>
          <span className="text-[10px] text-slate-500">Registernr: 033/050</span>
        </div>

        <div className="p-2 md:pl-4 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">QUALIFIZIERTE SIGNATUR</span>
          <div className="text-xl font-bold text-emerald-400">QES eIDAS</div>
          <span className="text-[10px] text-slate-500">BSI-Zertifiziert</span>
        </div>

        <div className="p-2 md:pl-4 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">RESPONSE TIME</span>
          <div className="text-xl font-bold text-cyan-400">&lt; 12 ms</div>
          <span className="text-[10px] text-slate-500">GPU Accelerated</span>
        </div>
      </Card>
    </div>
  );
};
