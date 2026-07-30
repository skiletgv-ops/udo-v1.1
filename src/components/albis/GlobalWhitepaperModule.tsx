import React, { useState } from 'react';
import whitepaperData from '../../data/whitepaperConfig.json';
import { Presentation, Download, CheckCircle2, Play, ChevronLeft, ChevronRight, FileText, Sparkles, X } from 'lucide-react';
import jsPDF from 'jspdf';

export const GlobalWhitepaperModule: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const downloadWhitepaperPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('UDO MEDICAL OS V1.1 - WHITE PAPER & CAPABILITY MATRIX', 14, 20);

    doc.setFontSize(10);
    doc.text(`Version: ${whitepaperData.version} | Datum: ${whitepaperData.lastUpdated}`, 14, 28);
    doc.text(`Zusammenfassung: ${whitepaperData.summary}`, 14, 34, { maxWidth: 175 });

    doc.line(14, 46, 196, 46);

    doc.setFontSize(12);
    doc.text('LEISTUNGSMATRIX & IMPLEMENTIERUNGSSTATUS (PHASEN 1-11)', 14, 54);

    let y = 64;
    whitepaperData.phases.forEach((p) => {
      doc.setFontSize(10);
      doc.text(`${p.phase}: ${p.name}`, 14, y);
      doc.text(`Status: ${p.status.toUpperCase()} | Version: ${p.releaseVersion} | Date: ${p.releaseDate}`, 14, y + 5);
      doc.setFontSize(9);
      doc.text(`Specs: ${p.description}`, 14, y + 10, { maxWidth: 170 });

      y += 18;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`UDO_Medical_OS_Whitepaper_${whitepaperData.version}.pdf`);
  };

  const activePhase = whitepaperData.phases[currentSlideIndex];

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Presentation size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Global Whitepaper & Presentation Generator</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PHASEN 1-11 LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Dynamisch aus whitepaperConfig.json gerenderte Leistungsmatrix & Investor-Präsentationsmodus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoMode(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Play size={14} />
            <span>Start Investor Demo</span>
          </button>

          <button
            onClick={downloadWhitepaperPdf}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-slate-200 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CAPABILITY MATRIX TABLE */}
      <div className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-2 font-mono text-xs">
        <div className="grid grid-cols-12 text-[10px] text-slate-500 border-b border-white/10 pb-2 uppercase font-bold">
          <span className="col-span-3">Phase & Modulname</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Version</span>
          <span className="col-span-5">Spezifikation / Capabilities</span>
        </div>

        {whitepaperData.phases.map((p) => (
          <div key={p.id} className="grid grid-cols-12 items-center py-2.5 border-b border-white/5 text-slate-300">
            <div className="col-span-3">
              <span className="text-[10px] text-cyan-300 font-bold block">{p.phase}</span>
              <span className="font-bold text-white text-xs">{p.name}</span>
            </div>

            <div className="col-span-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                <CheckCircle2 size={10} /> {p.status.toUpperCase()}
              </span>
            </div>

            <div className="col-span-2 text-slate-400 text-[11px]">{p.releaseVersion} ({p.releaseDate})</div>

            <div className="col-span-5 text-[11px] text-slate-300 leading-relaxed">{p.description}</div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN INVESTOR DEMO SLIDESHOW MODAL */}
      {isDemoMode && (
        <div className="fixed inset-0 z-50 bg-[#050811]/95 backdrop-blur-xl p-6 sm:p-12 flex flex-col justify-between font-sans text-slate-100">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-cyan-400 animate-spin" />
              <div>
                <h1 className="text-xl font-bold text-white font-mono">UDO Medical OS v1.1 - Investor Presentation</h1>
                <p className="text-xs text-slate-400 font-mono">Autonomes medizinisches Betriebssystem für Praxen & MVZ</p>
              </div>
            </div>

            <button
              onClick={() => setIsDemoMode(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* SLIDE CONTENT */}
          <div className="max-w-4xl mx-auto space-y-6 text-center py-10 font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
              {activePhase.phase} • RELEASE {activePhase.releaseVersion}
            </span>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">{activePhase.name}</h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              {activePhase.description}
            </p>

            <div className="pt-4 flex justify-center gap-4 text-xs">
              <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Status: {activePhase.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Datum: {activePhase.releaseDate}
              </span>
            </div>
          </div>

          {/* SLIDE CONTROLS */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Vorherige Folie
            </button>

            <span>
              Folie {currentSlideIndex + 1} von {whitepaperData.phases.length}
            </span>

            <button
              disabled={currentSlideIndex === whitepaperData.phases.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(whitepaperData.phases.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-30"
            >
              Nächste Folie <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
