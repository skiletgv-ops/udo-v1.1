import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Filter,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileSearch,
  BookOpen
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Finding } from '../types';

interface ReviewPageProps {
  findings: Finding[];
  setFindings: React.Dispatch<React.SetStateAction<Finding[]>>;
  onGenerateGutachten: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  findings,
  setFindings,
  onGenerateGutachten
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Alle');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(findings[0] || null);

  const categories = ['Alle', 'Bildgebung', 'Diagnose', 'Symptom', 'Medikation', 'Labor'];

  const filteredFindings = findings.filter((f) => {
    if (activeFilter === 'Alle') return true;
    return f.category === activeFilter;
  });

  const toggleConfirm = (id: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, confirmed: true, contested: false };
        }
        return f;
      })
    );
  };

  const toggleContest = (id: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, confirmed: false, contested: true };
        }
        return f;
      })
    );
  };

  const confirmedCount = findings.filter((f) => f.confirmed !== false).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" pulse>
              Schritt 3 von 4
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              S2k Validation & Clinical Audit
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Befundbewertung & Facharzt-Validierung
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Überprüfen Sie die automatisch identifizierten pathologischen Befunde und bestätigen Sie deren Relevanz.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<FileText className="w-5 h-5" />}
          onClick={onGenerateGutachten}
        >
          S2k-GUTACHTEN GENERIEREN ({confirmedCount} Bestätigt)
        </Button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0 uppercase mr-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,212,170,0.4)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FINDINGS LIST */}
        <div className="lg:col-span-7 space-y-3">
          {filteredFindings.map((f) => {
            const isSelected = selectedFinding?.id === f.id;
            const isConfirmed = f.confirmed !== false && !f.contested;
            const isContested = f.contested === true;

            const severityBadgeColor = {
              critical: 'rose' as const,
              high: 'amber' as const,
              medium: 'cyan' as const,
              low: 'emerald' as const
            }[f.severity];

            return (
              <Card
                key={f.id}
                glow={isSelected ? 'cyan' : 'none'}
                onClick={() => setSelectedFinding(f)}
                className={`cursor-pointer transition-all space-y-2.5 ${
                  isSelected ? 'border-cyan-400 bg-cyan-500/10' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {f.category}
                    </span>
                    {f.icdCode && (
                      <span className="text-[10px] font-mono text-violet-300 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                        ICD: {f.icdCode}
                      </span>
                    )}
                  </div>
                  <Badge variant={severityBadgeColor}>
                    {f.severity}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-white font-sans">
                  {f.title}
                </h3>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {f.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10 font-mono text-[11px]">
                  <span className="text-slate-400 truncate">
                    Quelle: {f.sourceDocument} (S. {f.pageNumber})
                  </span>

                  {/* CONFIRM / CONTEST ACTIONS */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleConfirm(f.id);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase flex items-center gap-1 transition-all cursor-pointer ${
                        isConfirmed
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Bestätigt
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleContest(f.id);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase flex items-center gap-1 transition-all cursor-pointer ${
                        isContested
                          ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/30'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Anfechten
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* RIGHT COLUMN: INSPECTOR & S2k CITATION PANEL */}
        <div className="lg:col-span-5">
          {selectedFinding ? (
            <Card glow="violet" className="space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-xs font-mono">
                  <FileSearch className="w-4 h-4" />
                  <span>S2k-Inspektor & Quellennachweis</span>
                </div>
                <Badge variant="cyan">{selectedFinding.confidence}% Konsens</Badge>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Befund-Bezeichnung
                  </span>
                  <p className="font-bold text-white text-sm">
                    {selectedFinding.title}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Pathologische Beschreibung
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                    {selectedFinding.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-violet-300">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>AWMF S2k Leitlinie Zuordnung</span>
                  </div>
                  <p className="text-[10px] text-violet-200/90 leading-relaxed">
                    Referenziert AWMF-Registernummer 033/050 (Orthopädisch-unfallchirurgische Begutachtung) sowie ICD-10 Code {selectedFinding.icdCode || 'M51.1'}.
                  </p>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-400 border-t border-white/10 pt-2">
                  <div className="flex justify-between">
                    <span>Dokument:</span>
                    <span className="text-white font-bold">{selectedFinding.sourceDocument}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seitennummer:</span>
                    <span className="text-white font-bold">Seite {selectedFinding.pageNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Erfassungsdatum:</span>
                    <span className="text-white font-bold">{selectedFinding.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 text-slate-400 font-mono text-xs">
              Wählen Sie einen Befund links aus, um den Quellennachweis zu prüfen.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
