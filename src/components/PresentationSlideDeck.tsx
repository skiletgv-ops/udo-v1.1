import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Play,
  Clock,
  FileText,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Award,
  Zap,
  Sparkles,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  BarChart3,
  Check,
  Lock,
  Stethoscope,
  Terminal,
  ExternalLink,
  Presentation
} from 'lucide-react';
import TypewriterText from './ui/TypewriterText';
import SplineBackground from './SplineBackground';
import RobotMascot from './RobotMascot';
import { useGlobalSystem } from './GlobalSystemContext';

export default function PresentationSlideDeck() {
  const [mode, setMode] = useState<'page' | 'deck'>('page');
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 10;
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'hub' | 'gutachten' | 'scan'>('hub');

  const { language, setLanguage, robotState, robotBubble, handleRobotClick } = useGlobalSystem();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'deck') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'Escape') {
          setMode('page');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  return (
    <div className="min-h-screen bg-[#020813] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. PERSISTENT SPLINE 3D BACKGROUND */}
      <SplineBackground />

      {/* AMBIENT GRADIENT OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-500/10 blur-[180px] rounded-full" />
      </div>

      {/* 2. TOP SYSTEM NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020813]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-xs font-mono"
          >
            <ArrowLeft size={14} className="text-cyan-400" />
            <span>Startseite</span>
          </a>
          <span className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              UDO Präsentation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            title={language === 'de' ? "Sprache wechseln (EN)" : "Switch Language (DE)"}
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => setMode(mode === 'page' ? 'deck' : 'page')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
              mode === 'deck'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-[0_0_20px_rgba(45,212,191,0.5)]'
                : 'bg-white/5 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10'
            }`}
          >
            <Presentation size={15} />
            <span>{mode === 'page' ? (language === 'de' ? 'Folien-Modus' : 'Slide Mode') : (language === 'de' ? 'Scroll-Modus' : 'Scroll Mode')}</span>
          </button>
          <a
            href="/"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Schließen"
          >
            <X size={16} />
          </a>
        </div>
      </header>

      {/* RENDER MODE A: FULL PAGE SCROLLING PRESENTATION */}
      {mode === 'page' && (
        <div className="relative z-10 pt-20 pb-32 space-y-32">
          
          {/* SECTION 1: UNIFIED HERO EXPERIENCE */}
          <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-8 text-center pt-8">
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>S2k-Konforme Ärztliche Automatisierung</span>
            </motion.div>

            {/* MAIN HEADLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto"
            >
              UDO Forensic<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400">
                Clinical AI Engine
              </span>
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Rechtssichere Gutachten-Automatisierung, 4-Agenten-Prüfung und 10-Jahre Revisionssicherheit für Neurologie, Psychiatrie &amp; Facharztpraxen.
            </motion.p>

            {/* INTERACTIVE ROBOT HEAD MASCOT INTEGRATION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="my-10 relative cursor-pointer group"
              onClick={handleRobotClick}
            >
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500" />
              <RobotMascot
                state={robotState || 'HAPPY'}
                messageBubble={robotBubble || "Klicken Sie auf mich, um die KI-Diagnostik zu testen!"}
                onBubbleClick={handleRobotClick}
                size="lg"
                showBadge={false}
              />
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => setMode('deck')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-sans font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
              >
                <Presentation size={18} />
                <span>Interaktive Folien Starten</span>
              </button>

              <a
                href="/whitepaper"
                className="px-8 py-4 rounded-2xl bg-slate-900/80 border border-violet-500/40 hover:border-violet-400 text-violet-300 hover:text-white font-mono text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer backdrop-blur-xl"
              >
                <FileText size={18} />
                <span>System Whitepaper</span>
              </a>

              <a
                href="/"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
              >
                <ExternalLink size={18} />
                <span>Praxis Portal</span>
              </a>
            </motion.div>
          </section>


          {/* SECTION 2: PRESENTATION OVERVIEW */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 relative">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold block">
                  ÜBERSICHT &amp; ARCHITEKTUR
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Entlastung für Ärzte. Maximale Präzision.
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  UDO wurde speziell für die strengen Anforderungen deutscher Facharztpraxen und Gutachter entwickelt. Von der ersten Dokumenteneinlesung bis zur eIDAS-Qualifizierten Signatur.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">100% S2k &amp; DGUV Konform</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Einhaltung aktueller medizinischer Leitlinien und BK-Gesetz Vorgaben mit vollständiger Rückverfolgbarkeit.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">4-Agenten Validierung</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mehrstufiges Verifikationssystem prüft Anamnese, Medikation, ICD-10/11 Codes und rechtliche Plausibilität parallel.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">85% Zeitersparnis</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reduziert die Bearbeitungszeit komplexer Gutachten von durchschnittlich 2 Stunden auf unter 15 Minuten.
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* SECTION 3: FEATURES BENTO GRID */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-violet-400 font-bold block">
                KERNFUNKTIONEN
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Die Module im Überblick
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Large card */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-400/40 transition-all backdrop-blur-xl relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-6">
                  <Activity size={26} />
                </div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
                  Modul 01
                </span>
                <h3 className="text-2xl font-black text-white mb-3">
                  S2k Gutachten Generator &amp; Multi-OCR
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Automatische Aufbereitung unstrukturierter Arztbriefe, Befunde und Laborberichte. Extrahiert strukturierte Diagnosen, Medikationen und Anamnesen im Handumdrehen.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-mono">ICD-10/11 Matching</span>
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-mono">Anamnese Extraktion</span>
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-mono">2-Stufen-Freigabe</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-400/40 transition-all backdrop-blur-xl group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6">
                  <Stethoscope size={26} />
                </div>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold block mb-1">
                  Modul 02
                </span>
                <h3 className="text-2xl font-black text-white mb-3">
                  Voice Dictation &amp; AI Drafting
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Integrierte Diktatfunktion mit Echtzeit-Transkription und automatischer Erstellung von Befundentwürfen.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-teal-500/20 hover:border-teal-400/40 transition-all backdrop-blur-xl group">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-6">
                  <Lock size={26} />
                </div>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold block mb-1">
                  Modul 03
                </span>
                <h3 className="text-2xl font-black text-white mb-3">
                  10-Jahre DSGVO Audit Trail
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Lückenlose Revisionssicherheit mit unveränderlichem Audit-Log und gesetzkonformer Löschfrist-Überwachung.
                </p>
              </div>

              {/* Feature 4 - Large card */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-400/40 transition-all backdrop-blur-xl group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-6">
                  <CheckCircle2 size={26} />
                </div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                  Modul 04
                </span>
                <h3 className="text-2xl font-black text-white mb-3">
                  eIDAS Qualifizierte Elektronische Signatur (QES)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Rechtssichere digitale Signatur direkt aus dem System. Erfüllt alle gesetzlichen Standards der KV, DGUV und Gerichte.
                </p>
              </div>
            </div>
          </section>


          {/* SECTION 4: WORKFLOW PIPELINE */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold block">
                PRAXIS PROZESS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Der 4-Schritte Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Dokument Scan', desc: 'Arztbrief, Befund oder Foto hochladen oder direkt einscannen.' },
                { step: '02', title: '4-KI Analyse', desc: 'Parallele Strukturierung und Plausibilitätsprüfung in Echtzeit.' },
                { step: '03', title: 'Arzt Review', desc: 'Fachärztliche Prüfung an zwei definierten Kontrollpunkten.' },
                { step: '04', title: 'QES Signatur', desc: 'Finalisierung und rechtssicherer Export mit eIDAS Signatur.' }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 relative hover:border-cyan-500/40 transition-all">
                  <div className="text-3xl font-mono font-black text-cyan-400/40 mb-3">{item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>


          {/* SECTION 5: BENEFITS COMPARISON */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 font-bold block">
                  MEHRWERT
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">
                  Klassisch vs. UDO Praxis
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional */}
                <div className="p-6 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-4">
                  <div className="text-rose-400 font-bold font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert size={16} /> Standard Praxis-Ablauf
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">&times;</span>
                      15–20 Minuten manuelles Eintippen pro Akte
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">&times;</span>
                      Verzögerte Befundberichte und Mahnfristen
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">&times;</span>
                      Häufige Formfehler bei GOÄ / EBM Abrechnung
                    </li>
                  </ul>
                </div>

                {/* UDO */}
                <div className="p-6 rounded-2xl bg-emerald-950/10 border border-emerald-500/30 space-y-4">
                  <div className="text-emerald-400 font-bold font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={16} /> Mit UDO Automatisierung
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      Unter 2 Minuten pro vollständiger Befundaufbereitung
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      Sofortige eIDAS-konforme Signatur und Versand
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      Höhere Abrechnungssicherheit ohne Honorarverluste
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>


          {/* SECTION 6: SHOWCASE INTERACTIVE TABS */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold block">
                SYSTEM SHOWCASE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Die Benutzeroberfläche
              </h2>
            </div>

            <div className="flex justify-center gap-3">
              {[
                { id: 'hub', label: 'Hauptraum Hub' },
                { id: 'gutachten', label: 'S2k Gutachten Editor' },
                { id: 'scan', label: '4-KI-Agenten Monitor' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    activeShowcaseTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-lg'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl text-left min-h-[300px] flex items-center justify-center">
              {activeShowcaseTab === 'hub' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Zentraler Praxis Hub</span>
                    <span className="text-[10px] font-mono text-slate-500">Live Status: Aktiv</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Der Hauptraum Hub vereint alle Arbeitsbereiche: Patientenakte, Befundbewertung, EEG Signal Core und Revisions-Audit in einem hochsicheren Dashboard.
                  </p>
                </div>
              )}

              {activeShowcaseTab === 'gutachten' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-purple-400 uppercase font-bold">Gutachten Modul</span>
                    <span className="text-[10px] font-mono text-slate-500">S2k Version 2.1</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Strukturierter Editor mit automatischen Formulierungsvorschlägen, DGUV-Textbausteinen und integriertem ICD-10 Thesaurus.
                  </p>
                </div>
              )}

              {activeShowcaseTab === 'scan' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-teal-400 uppercase font-bold">AI Agenten Pipeline</span>
                    <span className="text-[10px] font-mono text-slate-500">4 Agenten Bereit</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Integrierter Scan-Monitor, der die Verifikationsschritte aller 4 Spezialagenten (Anamnese, Medikation, ICD, Recht) visuell transparent aufbereitet.
                  </p>
                </div>
              )}
            </div>
          </section>


          {/* SECTION 7: KEY STATISTICS */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { num: '85%', label: 'Zeitersparnis bei Gutachten' },
                { num: '100%', label: 'S2k & DGUV Konformität' },
                { num: '10 J.', label: 'DSGVO Revisionssicherheit' },
                { num: '< 2 Min', label: 'Durchschnittliche Scan-Dauer' }
              ].map((stat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 font-mono mb-2">
                    {stat.num}
                  </div>
                  <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* SECTION 8: FINAL CTA */}
          <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8 pt-8">
            <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0a1a] to-slate-950 border border-cyan-500/30 shadow-[0_0_80px_rgba(45,212,191,0.2)] space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Starten Sie jetzt mit UDO
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Testen Sie die Praxis-Automatisierung direkt im interaktiven Portal oder lesen Sie das vollständige System Whitepaper.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="/"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-sans font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Praxis Portal Öffnen &rarr;
                </a>
                <a
                  href="/whitepaper"
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  System Whitepaper
                </a>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* RENDER MODE B: FULLSCREEN INTERACTIVE SLIDE DECK */}
      {mode === 'deck' && (
        <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 pt-24 pb-8 max-w-5xl mx-auto w-full text-center">
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentSlide === 0 && (
                <motion.div
                  key="slide-0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold block">
                    Folie 1 / {totalSlides}
                  </span>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight">
                    UDO<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                      Automatisierung
                    </span><br />
                    für Ihre Praxis
                  </h1>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                    Weniger Papierkram. Mehr Zeit für Patienten. Mehr Sicherheit.
                  </p>
                </motion.div>
              )}

              {currentSlide === 1 && (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 w-full"
                >
                  <span className="text-xs font-mono tracking-[0.3em] uppercase text-rose-400 font-semibold block">
                    Folie 2 / {totalSlides}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                    Das Administrative Problem
                  </h2>
                  <p className="text-slate-300 max-w-xl mx-auto text-base">
                    Deutsche Facharztpraxen verbringen täglich bis zu 3 Stunden mit manueller Dokumentation, Abtippen von Befunden und Erstellen von Gutachten.
                  </p>
                </motion.div>
              )}

              {currentSlide >= 2 && (
                <motion.div
                  key={`slide-${currentSlide}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold block">
                    Folie {currentSlide + 1} / {totalSlides}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                    UDO System Modul {currentSlide - 1}
                  </h2>
                  <p className="text-slate-300 max-w-xl mx-auto text-base">
                    Detaillierte Spezifikation zur automatischen Befundverarbeitung, rechtssicheren Archivierung und eIDAS-Qualifizierten Signatur.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SLIDE NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <button
              onClick={prevSlide}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft size={16} /> Vorherige
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-lg hover:scale-105"
            >
              Nächste <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
