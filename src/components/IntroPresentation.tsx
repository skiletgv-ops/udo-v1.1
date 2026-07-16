import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Activity, Cpu } from "lucide-react";

interface IntroPresentationProps {
  onComplete: () => void;
}

export default function IntroPresentation({ onComplete }: IntroPresentationProps) {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState(0);

  const bootLogs = [
    "INITIATING SECURE SYSTEM CONSOLE...",
    "ESTABLISHING SECURE PORTAL BRIDGE [PORT: 3000]...",
    "SYNCHRONIZING WITH AWMF-S2k/S3 LEITLINIEN...",
    "ESTABLISHING DE-DE & EN-US TRANSLATION MATRICES...",
    "CALIBRATING COGNITIVE VOICE & WAKE-WORD SYSTEM...",
    "READY FOR CLINICAL COLLABORATION."
  ];

  useEffect(() => {
    // Increment progress bar smoothly over 5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 45); // ~4.5 seconds of progress, leaving half a second buffer

    // Advance boot logs
    const logInterval = setInterval(() => {
      setBootStage((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
    }, 800);

    // Complete intro at exactly 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020813] text-white z-[9999] flex flex-col items-center justify-between p-8 overflow-hidden select-none font-sans">
      {/* Cinematic Ambient Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Navy depth gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,27,59,0.5)_0%,rgba(2,8,19,1)_100%)]" />
        
        {/* Animated Gold Aura Top Left */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D4AF37] blur-[150px] pointer-events-none"
        />

        {/* Animated Patina Mint Aura Bottom Right */}
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -50, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#14b8a6] blur-[150px] pointer-events-none"
        />

        {/* Cinematic horizontal anamorphic lens flare accent */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent blur-[2px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Top Header - Status Matrix */}
      <div className="w-full max-w-6xl flex justify-between items-center relative z-10 font-mono text-[9px] text-slate-400 tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>System: Booting Diagnostic Core</span>
        </div>
        <div className="flex items-center gap-3">
          <span>PORTAL VER: 2.0.4</span>
          <span>LANG: DE_DE // EN_US</span>
        </div>
      </div>

      {/* Centerpiece - Cinematic Logo & Loading rings */}
      <div className="relative flex flex-col items-center justify-center max-w-xl text-center relative z-10 flex-1">
        
        {/* Cybernetic Spinning HUD Rings */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          
          {/* External Dotted Gold Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/35"
          />

          {/* Medium Solid Patina Ring with gaps */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-[#14b8a6]/25 border-t-[#14b8a6] border-b-[#14b8a6]"
          />

          {/* Inner pulse indicator */}
          <motion.div 
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-10 rounded-full bg-gradient-to-br from-[#10346b] to-[#040f24] border border-[#14b8a6]/40 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.25)]"
          >
            {/* Elegant SVG Mascot Logo inside */}
            <svg className="w-14 h-14 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4ZM12 18C9.33 18 4.67 19.33 4.67 22H19.33C19.33 19.33 14.67 18 12 18Z" fill="currentColor" fillOpacity="0.15"/>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 21V19C6 17.8954 6.89543 17 8 17H16C17.1046 17 18 17.8954 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 2V4" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 2H15" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
          
          {/* Sparkle Floating Details */}
          <div className="absolute top-0 right-2">
            <Sparkles className="text-[#D4AF37] animate-pulse w-4 h-4" />
          </div>
          <div className="absolute bottom-4 left-0">
            <Activity className="text-[#14b8a6] animate-pulse w-4.5 h-4.5" />
          </div>
        </div>

        {/* Staggered text entrances */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.25em] text-white uppercase leading-none font-sans flex items-center justify-center gap-1.5">
            U<span className="text-[#D4AF37]">.</span>D<span className="text-[#14b8a6]">.</span>O
          </h1>
          <p className="text-[10px] md:text-xs font-mono text-[#D4AF37] tracking-[0.4em] uppercase font-bold">
            Ultimate Diagnostic Operator
          </p>
          <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Live Terminal Log Feeds */}
        <div className="mt-8 h-8 flex items-center justify-center text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
          <AnimatePresence mode="wait">
            <motion.div
              key={bootStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#D4AF37]" />
              <span>{bootLogs[bootStage]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Footer Area with Progress Line & Skip action */}
      <div className="w-full max-w-6xl flex flex-col items-center gap-6 relative z-10 relative">
        
        {/* Progress Bar Container */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-full h-2 p-[2px] backdrop-blur-md relative overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#14b8a6] to-[#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Horizontal controls row */}
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-slate-400">
          <div>
            <span>INTELLIGENCE COGNITIVE SYSTEM • SECURED</span>
          </div>

          <div>
            {/* Elegant and subtle SKIP button */}
            <button
              onClick={onComplete}
              className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono uppercase tracking-[0.15em] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Überspringen</span>
              <span className="text-teal-400">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
