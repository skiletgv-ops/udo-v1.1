"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Layers, HelpCircle, Presentation } from "lucide-react";
import { UdoPresentationModal } from "../../components/udo2032/UdoPresentationModal";
import RobotMascot from "../../components/RobotMascot";

export interface UdoV2PageProps {
  onNavigateToPortal?: () => void;
}

export default function UdoV2Page({ onNavigateToPortal }: UdoV2PageProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const handleToggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const handleGoBack = () => {
    if (onNavigateToPortal) {
      onNavigateToPortal();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleNavigateWhitepaper = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/whitepaper");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleNavigateUdoV2Demo = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/udo-v2-demo");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleNavigateHelp = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/help");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Navigation Bar */}
      <header className="flex items-center justify-between mb-6 z-10">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Zurück / Main Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigateUdoV2Demo}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 bg-slate-900/90 border-2 border-cyan-500/80 rounded-lg px-3.5 py-2 hover:bg-slate-800 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_10px_rgba(6,182,212,0.2)] cursor-pointer"
          >
            <Layers size={14} className="text-cyan-400 animate-pulse" />
            <span>UDO V2 (DEMO)</span>
          </button>

          {/* GREEN PRESENTATION BUTTON - BETWEEN DASHBOARD AND WHITEPAPER */}
          <button
            onClick={() => setIsPresentationOpen(true)}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-slate-900/90 border-2 border-emerald-500/80 rounded-lg px-3.5 py-2 hover:bg-slate-800 hover:border-emerald-400 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.4),inset_0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <Presentation size={14} className="text-emerald-400 animate-pulse" />
            <span>PRESENTATION</span>
          </button>

          <button
            onClick={handleNavigateWhitepaper}
            className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all shadow-sm"
          >
            <BookOpen size={14} className="text-cyan-400" />
            <span>HOLO-SPEC</span>
          </button>

          <button
            onClick={handleNavigateHelp}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-300 transition-all backdrop-blur-sm cursor-pointer hover:text-white hover:border-cyan-400/50"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>HELP</span>
          </button>
        </div>
      </header>

      {/* Top Section: Top-Left AI Brain & Top-Right Draggable Robot Mascot with Chat Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 z-10 items-center">
        {/* 1. Top-Left: Green glowing dot + AI Brain Online */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 rounded-xl px-5 py-4 shadow-lg shadow-emerald-950/20 backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
            <span className="absolute w-6 h-6 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          </div>
          <div>
            <span className="font-semibold text-emerald-400 tracking-wide text-base md:text-lg block">
              AI Brain Online
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">UDO Neural Engine v2.0 Active</span>
          </div>
        </div>

        {/* 2. Top-Right: Draggable Robot Mascot & Guide Chat Bubble */}
        <div className="flex items-center justify-end bg-slate-900/80 border border-cyan-500/30 rounded-xl px-5 py-3 shadow-lg shadow-cyan-950/20 backdrop-blur-md relative min-h-[100px]">
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.15}
            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            whileHover={{ scale: 1.05 }}
            className="cursor-grab active:cursor-grabbing flex items-center gap-3"
          >
            <RobotMascot
              state="IDLE"
              messageBubble="Welcome to the UDO Central System! Press the giant voice button below to start listening, or drag me anywhere!"
              size="sm"
            />
          </motion.div>
        </div>
      </div>

      {/* Main Center Area: Huge, blank dark screen with giant button */}
      <main className="flex-1 min-h-[420px] md:min-h-[520px] bg-slate-900/40 border border-slate-800/80 rounded-2xl relative flex items-center justify-center p-6 shadow-2xl backdrop-blur-sm z-10 mb-6">
        <button
          onClick={handleToggleListening}
          className={`px-10 py-7 rounded-3xl font-bold text-2xl md:text-3xl transition-all duration-300 flex items-center gap-4 cursor-pointer border-2 shadow-2xl active:scale-95 ${
            isListening
              ? "bg-red-950/80 text-red-200 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse"
              : "bg-slate-900 hover:bg-slate-800 text-white border-indigo-500/50 shadow-[0_0_35px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]"
          }`}
        >
          <span>🎤</span>
          <span>{isListening ? "Listening Active..." : "Start Listening"}</span>
        </button>
      </main>

      {/* Bottom Section: Bottom-Right Circle with 3 names (1 glowing red) */}
      <footer className="flex justify-end z-10">
        {/* 4. Bottom-Right: Small circle with 3 names and one name glowing red */}
        <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-slate-900/95 border-2 border-slate-800 shadow-2xl shadow-black flex flex-col justify-center items-center p-4 text-center backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 z-10">
            Agents Status
          </span>
          <div className="flex flex-col gap-1.5 z-10">
            <span className="text-slate-300 font-medium text-sm">
              Gratsiano
            </span>
            <span className="text-slate-300 font-medium text-sm">
              Clara
            </span>
            <span className="text-red-500 font-bold text-base tracking-wide drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse">
              Erik
            </span>
          </div>
        </div>
      </footer>

      {/* UDO PRESENTATION MODAL */}
      <UdoPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
