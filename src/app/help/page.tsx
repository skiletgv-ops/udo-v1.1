"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, BrainCircuit, Mic, Banknote, Radar, ShieldCheck, HelpCircle } from "lucide-react";

export interface HelpPageProps {
  onNavigateToPortal?: () => void;
}

export default function HelpPage({ onNavigateToPortal }: HelpPageProps) {
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

      </motion.div>
    </div>
  );
}
