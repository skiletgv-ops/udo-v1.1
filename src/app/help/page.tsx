"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Cpu,
  BrainCircuit,
  Mic,
  Banknote,
  Radar,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Lock,
  WifiOff,
  Database,
  Key
} from "lucide-react";

export interface HelpPageProps {
  onNavigateToPortal?: () => void;
}

interface FaqItem {
  icon: React.ReactNode;
  questionDe: string;
  questionEn: string;
  answerDe: string;
  answerEn: string;
}

export default function HelpPage({ onNavigateToPortal }: HelpPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList: FaqItem[] = [
    {
      icon: <WifiOff className="w-4 h-4" />,
      questionDe: "Wie funktioniert der Offline-Modus in UDO V2?",
      questionEn: "How does Offline Mode work in UDO V2?",
      answerDe: "UDO V2 nutzt lokale Browser-APIs (Web Speech API) sowie eine On-Device Meta-Cognitive Engine bzw. lokale Ollama (phi3)-Instanzen. Diktate, Gutachten-Synthesen und GOÄ-Analysen funktionieren zu 100% ohne aktive Internetverbindung.",
      answerEn: "UDO V2 utilizes local browser APIs (Web Speech API) and an on-device Meta-Cognitive Engine or local Ollama (phi3) instances. Voice dictation, medical report synthesis, and GOÄ billing analysis function 100% offline without an active internet connection."
    },
    {
      icon: <Lock className="w-4 h-4" />,
      questionDe: "Wie garantiert UDO V2 Datenschutz und DSGVO-Konformität?",
      questionEn: "How does UDO V2 guarantee data privacy and GDPR compliance?",
      answerDe: "Sämtliche Patientendaten, Audioaufnahmen und klinische Berichte verbleiben ausschließlich im lokalen Speicher (Browser-LocalStorage) Ihres Endgeräts. Es werden keine Daten an externe Drittanbieter-Clouds gesendet oder für KI-Modelltraining verwendet.",
      answerEn: "All patient records, audio clips, and clinical reports remain strictly within your device's browser LocalStorage. Zero data is transmitted to external cloud servers or used for AI training."
    },
    {
      icon: <Cpu className="w-4 h-4" />,
      questionDe: "Was passiert bei Ausfall von Online-KI-Diensten?",
      questionEn: "What happens if cloud AI services are unreachable?",
      answerDe: "UDO V2 schaltet bei Serverfehlern oder Quota-Limits automatisch und nahtlos auf den integrierten lokalen Meta-Router um. Ihre Begutachtungen und Diktate werden ohne Unterbrechung lokal fortgesetzt.",
      answerEn: "In case of server errors or cloud quota limits, UDO V2 automatically and seamlessly switches to the built-in local Meta-Router. Your medical evaluations and dictations continue locally without interruption."
    },
    {
      icon: <Key className="w-4 h-4" />,
      questionDe: "Kann ich meinen eigenen Gemini API-Schlüssel nutzen?",
      questionEn: "Can I use my own Gemini API key for online features?",
      answerDe: "Ja! Sie können im UDO Chat oder in den Einstellungen Ihren eigenen Gemini API-Key hinterlegen. Dieser Schlüssel wird vertraulich im lokalen Speicher hinterlegt und ermöglicht direkte Cloud-Echtzeitsynthesen.",
      answerEn: "Yes! You can enter your personal Gemini API key in the UDO Chat or Settings panel. The key is securely held in local storage and unlocks direct online real-time syntheses."
    },
    {
      icon: <Database className="w-4 h-4" />,
      questionDe: "Wie kann ich meine gespeicherten Daten exportieren oder löschen?",
      questionEn: "How can I export or clear my saved data?",
      answerDe: "Sie können über das Dashboard mit einem Klick vollständige PDF-Klinikberichte exportieren oder über die Einstellungen alle lokalen Daten (LocalStorage) mit einem Klick rückstandslos bereinigen.",
      answerEn: "You can export full PDF clinical reports with one click from the dashboard or purge all local browser storage completely via the Settings panel."
    }
  ];

  const handleBackToCore = () => {
    if (onNavigateToPortal) {
      onNavigateToPortal();
    }
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_center,rgba(6,182,212,0.06),transparent)] pointer-events-none" />
      
      {/* Main Glassmorphism Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl w-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.12)] relative z-10 my-auto"
      >
        
        {/* Top-Left Back Button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBackToCore}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-all bg-slate-950/80 border border-cyan-800/60 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Core</span>
          </motion.button>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 bg-cyan-950/50 border border-cyan-800/40 px-3 py-1.5 rounded-full">
            <HelpCircle size={14} className="text-cyan-400 animate-pulse" />
            <span>Bilingual User Guide (DE / EN)</span>
          </div>
        </div>

        {/* Title Header */}
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6 tracking-tight">
          UDO V2 User Guide & System Architecture
        </h1>

        {/* Section 1: System Architecture (Grid of 2 Cards) */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-cyan-300 tracking-wide font-mono">
              System Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Card - German */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
                  🇩🇪 Deutsch (Systemarchitektur)
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                  100% DSGVO-Konform
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                UDO V2 basiert auf Next.js 15, der Web Speech API sowie einer lokalen <strong>Ollama (phi3)</strong> Anbindung für medizinische Sprachverarbeitung. Sämtliche Berichte und Finanzeinsparungen werden in <code>LocalStorage</code> verarbeitet. <strong>Daten verlassen niemals das Gerät.</strong>
              </p>
            </motion.div>

            {/* Right Card - English */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
                  🇬🇧 English (System Architecture)
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                  100% On-Device / Local
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                UDO V2 is built with Next.js 15, Web Speech API, and a local <strong>Ollama (phi3)</strong> engine for medical voice dictation. All report tallies and CFO savings are persisted in <code>LocalStorage</code>. <strong>Zero external cloud data transmission.</strong>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Core Capabilities (Grid of 4 Cards with Framer-Motion Hover Animations) */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-cyan-300 tracking-wide font-mono">
              Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Ambient Voice Dictation */}
            <motion.div 
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-base">Ambient Voice Dictation</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">
                  <strong>DE:</strong> Echtzeit-Spracherkennung (de-DE) für Freihand-Befundung in der Praxis.<br />
                  <strong>EN:</strong> Real-time German voice recognition for hands-free clinical documentation.
                </p>
              </div>
            </motion.div>

            {/* Card 2: AI Gutachten Engine */}
            <motion.div 
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-base">AI Gutachten Engine</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">
                  <strong>DE:</strong> Automatische Synthese von S2k-Leitlinien & BG-Gutachten via Ollama.<br />
                  <strong>EN:</strong> Automatic synthesis of S2k medical guidelines and medical reports.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Practice CFO (Revenue Finder) */}
            <motion.div 
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-base">Practice CFO (Revenue Finder)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">
                  <strong>DE:</strong> Identifiziert vergessene GOÄ/EBM Abrechnungspositionen automatisch.<br />
                  <strong>EN:</strong> Automatically identifies unbilled medical services and uncaptured billing codes.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Emergency Triage Radar */}
            <motion.div 
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                    <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-base">Emergency Triage Radar</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">
                  <strong>DE:</strong> Echtzeit-Radarüberwachung mit roter Priorisierung kritischer Fälle.<br />
                  <strong>EN:</strong> Real-time radar tracking with red alerts for critical triage patient status.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Quick Start Guide (Steps 1 to 4) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-cyan-300 tracking-wide font-mono">
              Quick Start Guide
            </h2>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
            <ol className="space-y-4 font-sans text-sm text-slate-200">
              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-mono font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <span className="font-bold text-white block">Install & Run Local Ollama</span>
                  <span className="text-slate-400 text-xs">
                    Start local LLM instance with <code>ollama run phi3</code> or <code>ollama run llama3</code> listening on port <code>11434</code>.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-mono font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <span className="font-bold text-white block">Open Dashboard & Activate Holo-Core</span>
                  <span className="text-slate-400 text-xs">
                    Navigate to the main dashboard or <strong>UDO V2 (DEMO)</strong> and click <strong>&quot;🎤 START LISTENING&quot;</strong> or <strong>&quot;ACTIVATE HOLO-CORE&quot;</strong>.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-mono font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <span className="font-bold text-white block">Dictate German Clinical Findings</span>
                  <span className="text-slate-400 text-xs">
                    Speak German into the microphone. UDO V2 processes speech in real-time and requests S2k synthesis.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-mono font-bold text-xs shrink-0">
                  4
                </span>
                <div>
                  <span className="font-bold text-white block">Review Revenue Ticker & Triage Alerts</span>
                  <span className="text-slate-400 text-xs">
                    Watch the CFO node calculate recovered practice revenue in real time while the Triage Radar flags critical cases.
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 4: Frequently Asked Questions (Collapsible FAQ) */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-cyan-300 tracking-wide font-mono">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-cyan-400/80 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              Offline Mode & Data Privacy
            </span>
          </div>

          <div className="space-y-3 font-sans">
            {faqList.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-slate-950/90 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                      : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 md:p-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <div
                        className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                          isOpen
                            ? "bg-cyan-950 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {faq.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm md:text-base text-slate-100 flex items-center gap-2">
                          {faq.questionDe}
                        </h3>
                        <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                          {faq.questionEn}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 shrink-0 ml-2"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-800/80 bg-slate-900/40"
                      >
                        <div className="p-4 md:p-5 text-xs md:text-sm text-slate-300 space-y-3 leading-relaxed">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                              🇩🇪 DEUTSCH
                            </span>
                            <p>{faq.answerDe}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                              🇬🇧 ENGLISH
                            </span>
                            <p className="text-slate-300/90">{faq.answerEn}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </motion.div>
    </div>
  );
}
