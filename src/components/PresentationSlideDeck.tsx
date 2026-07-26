import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, Play, Clock, FileText, ShieldAlert, CheckCircle2, ChevronRight, Award, Zap } from 'lucide-react';
import TypewriterText from './ui/TypewriterText';

export default function PresentationSlideDeck() {
  const [current, setCurrent] = useState(0);
  const total = 10;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        window.location.href = '/';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[100000] bg-[#020813] text-slate-100 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <div className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider hover:scale-105 transition-transform cursor-pointer">
            <TypewriterText text="UDO Präsentation für Ärzte" speed={40} />
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">&bull; Dr. med. Ulrike Bongartz &bull; Köln</span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 hover:scale-105 text-slate-400 text-xs font-mono tracking-wider transition-all duration-200"
        >
          <X size={16} />
          <span>Schließen</span>
        </a>
      </div>

      {/* Slide Canvas */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12 text-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {current === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold">
                Präsentation für Ärzte
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                UDO<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  <TypewriterText text="Automatisierung" speed={50} />
                </span><br />
                für Ihre Praxis
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Weniger Papierkram. Mehr Zeit für Patienten.<br />
                Mehr Sicherheit. Mehr Umsatz.
              </p>
              <div className="pt-8 text-xs font-mono text-slate-500">
                Dr. med. Ulrike Bongartz &bull; Neurologie &amp; Psychiatrie &bull; Köln
              </div>
            </motion.div>
          )}

          {current === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 w-full"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-rose-400 font-semibold">
                Das Problem
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Jeden Tag vergeuden Ärzte<br />
                <span className="text-rose-400 italic">Stunden</span> mit Verwaltung
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:scale-105 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-xl font-bold text-white">15 Minuten</div>
                  <div className="text-xs text-slate-400 mt-1">pro Patientenakte manuell eintippen</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:scale-105 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-xl font-bold text-white">2 Stunden</div>
                  <div className="text-xs text-slate-400 mt-1">pro Gutachten schreiben</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:scale-105 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">📲</div>
                  <div className="text-xl font-bold text-white">15%</div>
                  <div className="text-xs text-slate-400 mt-1">der Patienten erscheinen nicht</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:scale-105 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-xl font-bold text-white">3–5%</div>
                  <div className="text-xs text-slate-400 mt-1">Abrechnungsfehler kosten Geld</div>
                </div>
              </div>
            </motion.div>
          )}

          {current === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 w-full"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold">
                Die Lösung
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                UDO liest, prüft und<br />
                <span className="text-cyan-400">automatisch</span> strukturiert
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Sie scannen ein Dokument. Die Künstliche Intelligenz extrahiert alle Daten.<br />
                Ihr Team prüft es an zwei Kontrollpunkten. Sie unterschreiben mit einem Klick.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center hover:scale-105 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(102,252,241,0.25)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">📁</div>
                  <div className="text-base font-bold text-cyan-300">1. Einlesen</div>
                  <div className="text-xs text-slate-400 mt-1">Scan, Foto oder PDF</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center hover:scale-105 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(102,252,241,0.25)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-base font-bold text-cyan-300">2. KI-Extraktion</div>
                  <div className="text-xs text-slate-400 mt-1">Automatisch strukturiert</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center hover:scale-105 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(102,252,241,0.25)] transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-base font-bold text-cyan-300">3. Doppel-Prüfung</div>
                  <div className="text-xs text-slate-400 mt-1">WORK + ADMIN Kontrolle</div>
                </div>
              </div>
            </motion.div>
          )}

          {current === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-emerald-400 font-semibold">
                Zeitersparnis
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Pro Patientenakte</h2>
              <div className="text-7xl sm:text-9xl font-black text-cyan-400 tracking-tight my-4 hover:scale-105 transition-transform cursor-pointer">
                12 min
              </div>
              <div className="text-xl font-bold text-slate-300">weniger Verwaltungsaufwand</div>
              <p className="text-base text-slate-400 max-w-xl mx-auto">
                Bei 20 Patienten pro Tag sind das <strong className="text-cyan-300">4 Stunden</strong>, die Sie zurückgewinnen.<br />
                Pro Woche. Jede Woche.
              </p>
            </motion.div>
          )}

          {current === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400 font-semibold">
                Gutachten
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Gutachten in <span className="text-amber-400">30 Minuten</span><br />statt 2 Stunden
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Sie diktieren das Gutachten. UDO transkribiert und strukturiert es<br />
                in die korrekten rechtlichen Abschnitte. Sie prüfen und genehmigen.
              </p>
              <div className="flex items-center justify-center gap-8 pt-6">
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 w-44 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-5xl font-black text-rose-400">2h</div>
                  <div className="text-xs text-slate-400 mt-2">vor UDO</div>
                </div>
                <div className="text-2xl text-slate-600">&rarr;</div>
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-44 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-5xl font-black text-emerald-400">30m</div>
                  <div className="text-xs text-slate-400 mt-2">mit UDO</div>
                </div>
              </div>
            </motion.div>
          )}

          {current === 5 && (
            <motion.div
              key="slide-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-violet-400 font-semibold">
                Terminausfälle
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Weniger Ausfälle.<br /><span className="text-violet-400">Mehr Einnahmen.</span>
              </h2>
              <div className="text-6xl sm:text-8xl font-black text-violet-300 my-2 hover:scale-105 transition-transform cursor-pointer">
                1.500 €
              </div>
              <div className="text-lg font-bold text-slate-300">geschützter Umsatz pro Monat</div>
              <p className="text-base text-slate-400 max-w-xl mx-auto">
                Automatische SMS-Erinnerungen reduzieren No-Shows von 15% auf 5%.<br />
                Bei 150 € pro Termin sind das 10 gerettete Termine pro Monat.
              </p>
            </motion.div>
          )}

          {current === 6 && (
            <motion.div
              key="slide-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 w-full"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-teal-400 font-semibold">
                Sicherheit
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Nichts Ungeprüftes<br /><span className="text-teal-400">erreicht Ihren Schreibtisch</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left hover:scale-105 hover:border-teal-400/50 transition-all cursor-pointer">
                  <div className="text-sm font-bold text-teal-300 mb-1">👥 WORK prüft</div>
                  <div className="text-xs text-slate-400">MFA vergleicht Scan und extrahierte Daten</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left hover:scale-105 hover:border-teal-400/50 transition-all cursor-pointer">
                  <div className="text-sm font-bold text-teal-300 mb-1">🔒 ADMIN gibt frei</div>
                  <div className="text-xs text-slate-400">Praxismanager gibt erst frei, wenn alles stimmt</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left hover:scale-105 hover:border-teal-400/50 transition-all cursor-pointer">
                  <div className="text-sm font-bold text-teal-300 mb-1">📋 Audit-Trail</div>
                  <div className="text-xs text-slate-400">Jede Aktion protokolliert: Wer, Wann, Was</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left hover:scale-105 hover:border-teal-400/50 transition-all cursor-pointer">
                  <div className="text-sm font-bold text-teal-300 mb-1">🌐 Deutsche Server</div>
                  <div className="text-xs text-slate-400">Daten bleiben in Deutschland. DSGVO-konform.</div>
                </div>
              </div>
            </motion.div>
          )}

          {current === 7 && (
            <motion.div
              key="slide-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 w-full"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold">
                Vergleich
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Vor UDO vs. Mit UDO</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-xs font-mono text-rose-400 uppercase tracking-widest font-bold">Vor UDO</div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-rose-500">&bull;</span> 15 Minuten tippen pro Akte</li>
                    <li className="flex items-center gap-2"><span className="text-rose-500">&bull;</span> 2 Stunden pro Gutachten</li>
                    <li className="flex items-center gap-2"><span className="text-rose-500">&bull;</span> 15% Terminausfälle</li>
                    <li className="flex items-center gap-2"><span className="text-rose-500">&bull;</span> 3–5% Abrechnungsfehler</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Mit UDO</div>
                  <ul className="text-sm text-slate-200 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-emerald-400">&bull;</span> 45s + 2m Review</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400">&bull;</span> 30m mit Diktat</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400">&bull;</span> 5% mit Erinnerungen</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400">&bull;</span> &lt;0,3% nach Prüfung</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {current === 8 && (
            <motion.div
              key="slide-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 w-full"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold">
                Module
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Alles in <span className="text-cyan-400">einer</span> Plattform
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">📂 Dokumente</div>
                  <div className="text-xs text-slate-400 mt-1">Einlesen &amp; Extraktion</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">📈 Geräte</div>
                  <div className="text-xs text-slate-400 mt-1">EEG, EKG, Testberichte</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">📝 Anmeldung</div>
                  <div className="text-xs text-slate-400 mt-1">Digitale Formulare</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">⚠️ Triage</div>
                  <div className="text-xs text-slate-400 mt-1">Dringlichkeitsbewertung</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">🎙️ Diktat</div>
                  <div className="text-xs text-slate-400 mt-1">Sprache zu Gutachten</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center hover:scale-105 hover:border-cyan-400/50 transition-all cursor-pointer">
                  <div className="text-base font-bold text-white">💰 Abrechnung</div>
                  <div className="text-xs text-slate-400 mt-1">GOÄ/EBM Vorschläge</div>
                </div>
              </div>
            </motion.div>
          )}

          {current === 9 && (
            <motion.div
              key="slide-9"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-emerald-400 font-semibold">
                Nächster Schritt
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold text-white">
                4 Stunden pro Tag<br /><span className="text-emerald-400">zurückgewinnen</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-xl mx-auto">
                Testen Sie UDO mit synthetischen Daten.<br />
                Sehen Sie, wie es funktioniert — ohne Risiko.
              </p>
              <div className="pt-4">
                <a
                  href="/portal"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-sm hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(102,252,241,0.3)]"
                >
                  <span>Portal betreten</span>
                  <ArrowRight size={18} />
                </a>
              </div>
              <div className="text-xs font-mono text-slate-500 pt-4">
                Fragen? <a href="mailto:praxis@bongartz-koeln.de" className="text-cyan-400 underline hover:scale-105 inline-block transition-transform">praxis@bongartz-koeln.de</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav Controller */}
      <div className="relative z-10 p-6 flex items-center justify-center gap-6">
        <button
          onClick={prevSlide}
          className="w-11 h-11 rounded-full border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 hover:text-cyan-300 hover:scale-110 active:scale-95 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-5 py-2.5 rounded-full">
          <span className="text-cyan-400 font-bold">{current + 1}</span>
          <span>/</span>
          <span>{total}</span>
          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden ml-2">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="w-11 h-11 rounded-full border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 hover:text-cyan-300 hover:scale-110 active:scale-95 text-slate-400 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
