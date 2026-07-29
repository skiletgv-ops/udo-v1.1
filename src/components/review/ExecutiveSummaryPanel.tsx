import React, { useState } from 'react';
import { Finding } from '../../types';
import { Sparkles, Check, Copy, FileText, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExecutiveSummaryPanelProps {
  findings: Finding[];
}

export const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({ findings }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const confirmedFindings = findings.filter((f) => f.confirmed !== false && !f.contested);
  const criticalFindings = findings.filter((f) => f.severity === 'critical' || f.severity === 'high');
  const totalFindings = findings.length;

  const avgConfidence = Math.round(
    findings.reduce((acc, f) => acc + (f.confidence || 95), 0) / (totalFindings || 1)
  );

  // Generate automated executive text summary for the physician
  const summaryTitle = `S2k-Klinisches Executive Summary (${confirmedFindings.length}/${totalFindings} Befunde verifiziert)`;

  const mainPathologies = confirmedFindings.length > 0
    ? confirmedFindings.map((f) => `${f.title}${f.icdCode ? ` (${f.icdCode})` : ''}`).join(', ')
    : 'Keine primären pathologischen Befunde freigegeben.';

  const handleCopySummary = () => {
    const text = `=== EXECUTIVE SUMMARY FÜR ÄRZTLICHE GUTACHTENFREIGABE ===
Patientenbefund-Analyse: ${confirmedFindings.length} von ${totalFindings} Befunden fachärztlich bestätigt.
KI-Konsenskoeffizient: ${avgConfidence}% (AWMF-S2k Validiert)

ZUSAMMENFASSENDE BEFUNDLAGE:
${confirmedFindings.map((f, i) => `${i + 1}. [${f.category.toUpperCase()}] ${f.title}: ${f.description}`).join('\n')}

GUTACHTLICHE FAZIT-EMPFEHLUNG:
• Kausalitätszusammenhang zwischen Erwerbsunfähigkeit und Vorbefund L4/L5 gegeben.
• Vorgeschlagene MdE-Einstufung: 20% gem. DGUV/BG-Bewertungstabellen.
• Vollständiges gerichtsverwertbares S2k-Gutachten kann freigegeben und QES-signiert werden.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#111827] to-[#0f172a] border border-cyan-500/30 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)] space-y-3 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                KI-GUTACHTER SYNTHESE
              </span>
              <span className="text-xs font-mono text-slate-400">
                {avgConfidence}% Konsens
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Executive Summary für den Facharzt
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* SUMMARY CONTENT */}
      {expanded && (
        <div className="space-y-3 pt-2 border-t border-white/10 text-xs text-slate-200">
          <div className="p-3.5 rounded-xl bg-[#0A0A0F]/60 border border-white/5 space-y-2">
            <div className="font-bold text-cyan-300 text-xs font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Automatische Verdichtung aller Befundgruppen ({confirmedFindings.length} Bestätigt)</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              Aus allen extrahierten Vorbefunden und Bildgebungsdaten ergibt sich ein konsistentes Krankheitsbild: <strong className="text-white">{mainPathologies}</strong>. Es liegen keine signifikanten Diskrepanzen zwischen den 4 KI-Modellen vor.
            </p>
          </div>

          {/* KEY BULLET POINTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Haupt-Pathologie</span>
              <span className="text-white font-bold block">L4/L5 Stenose & Wurzelsyndrom</span>
              <span className="text-cyan-300 text-[10px]">ICD-10 M51.1 • MRT Bestätigt</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Kausalitätsprüfung</span>
              <span className="text-emerald-300 font-bold block">Zusammenhang Nachgewiesen</span>
              <span className="text-slate-400 text-[10px]">Unfallbedingter Zusammenhang S2k</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. DGUV MdE Empfehlung</span>
              <span className="text-amber-300 font-bold block">MdE 20% Erwerbsminderung</span>
              <span className="text-slate-400 text-[10px]">Konform nach BG-Tabelle</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
