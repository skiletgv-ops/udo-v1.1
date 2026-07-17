import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Terminal, 
  Activity, 
  Cpu, 
  BookOpen, 
  Award, 
  Shield, 
  X, 
  Lock, 
  Globe, 
  CheckCircle,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import SystemWhitepaper from "./SystemWhitepaper";

interface IntroPresentationProps {
  onComplete: () => void;
}

export default function IntroPresentation({ onComplete }: IntroPresentationProps) {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [showWhitepaper, setShowWhitepaper] = useState(false);

  const bootLogs = [
    "INITIATING SECURE SYSTEM CONSOLE...",
    "ESTABLISHING SECURE PORTAL BRIDGE [PORT: 3000]...",
    "SYNCHRONIZING WITH AWMF-S2k/S3 LEITLINIEN...",
    "ESTABLISHING DE-DE & EN-US TRANSLATION MATRICES...",
    "CALIBRATING COGNITIVE VOICE & WAKE-WORD SYSTEM...",
    "READY FOR CLINICAL COLLABORATION."
  ];

  // Boot sequence effects
  useEffect(() => {
    if (isBooted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBooted(true);
          return 100;
        }
        return prev + 2; // Fast, elegant load (~1.25s)
      });
    }, 20);

    const logInterval = setInterval(() => {
      setBootStage((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
    }, 250);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [isBooted]);

  const handleSkipBoot = () => {
    setProgress(100);
    setIsBooted(true);
  };

  const playInnovationChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.55); // E5
      
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(493.88, ctx.currentTime); // B4
      osc2.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.55); // B5
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.4);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (err) {
      console.warn("Chime playback failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020813] text-white z-[9999] flex flex-col items-center justify-between p-6 overflow-y-auto overflow-x-hidden select-none font-sans min-h-screen">
      
      {/* Cinematic Ambient Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,27,59,0.45)_0%,rgba(2,8,19,1)_100%)]" />
        
        {/* Animated Gold Aura Top Left */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.22, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#D4AF37] blur-[160px] pointer-events-none"
        />

        {/* Animated Patina Mint Aura Bottom Right */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.12, 0.22, 0.12],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#14b8a6] blur-[160px] pointer-events-none"
        />

        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/15 to-transparent blur-[1px]" />
      </div>

      {/* TOP HEADER STATUS LINE */}
      <div className="w-full max-w-6xl flex justify-between items-center relative z-10 font-mono text-[9px] text-slate-400 tracking-[0.2em] uppercase pt-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isBooted ? "bg-emerald-400" : "bg-teal-400 animate-pulse"}`} />
          <span>{isBooted ? "System Secure & Ready" : "System: Booting Diagnostic Core"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>PORTAL VER: 2.1.0</span>
          <span>LANG: DE_DE // EN_US</span>
        </div>
      </div>

      {/* STAGE CONTAINER */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center relative z-10 py-6 my-auto">
        <AnimatePresence mode="wait">
          {!isBooted ? (
            
            /* ==========================================
               PHASE 1: SECURE BOOT VERIFICATION
               ========================================== */
            <motion.div
              key="booting"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center space-y-8 max-w-xl"
            >
              {/* Spinning Loader HUD */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full border border-teal-500/25 border-t-teal-400 border-b-teal-400"
                />
                <div className="absolute inset-6 rounded-full bg-slate-900/90 border border-white/5 flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-[#D4AF37] animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-[0.25em] text-white uppercase leading-none font-sans">
                  U<span className="text-[#D4AF37]">.</span>D<span className="text-teal-400">.</span>O
                </h1>
                <p className="text-[10px] font-mono text-[#D4AF37] tracking-[0.35em] uppercase font-bold">
                  Ultimate Diagnostic Operator
                </p>
              </div>

              {/* Terminal Logs */}
              <div className="h-8 flex items-center justify-center text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                  <span>{bootLogs[bootStage]}</span>
                </div>
              </div>

              {/* Progress and Skip */}
              <div className="w-full max-w-xs space-y-4 pt-4">
                <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-1.5 p-[1px] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-teal-400 transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>
                <button
                  onClick={handleSkipBoot}
                  className="px-4 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-all mx-auto block"
                >
                  Skip Loading &rarr;
                </button>
              </div>
            </motion.div>

          ) : (

            /* ==========================================
               PHASE 2: INTERACTIVE MEDICAL GATEWAY WELCOME SCREEN
               ========================================== */
            <motion.div
              key="gateway"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 max-w-4xl"
            >
              {/* LEFT SIDE: Brand Header & Medical Partner Badge */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                
                {/* PROFESSIONAL MEDICAL CARD */}
                <div className="p-6 md:p-8 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] group max-w-md w-full relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono uppercase font-black tracking-widest">
                    <CheckCircle size={10} /> Verified Partner
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                    <div className="relative shrink-0 flex items-center justify-center p-3 bg-slate-900/90 border border-white/10 rounded-2xl">
                      {/* Spine and Caduceus Vector Illustration from Logo */}
                      <svg viewBox="0 0 120 280" className="w-12 h-24 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                        <line x1="60" y1="10" x2="60" y2="270" stroke="#a3e635" strokeWidth="8" />
                        <path d="M 40,50 C 5,80 5,120 60,150 C 115,180 115,220 40,250" stroke="#86efac" strokeWidth="9" />
                      </svg>
                    </div>

                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-[10px] font-black tracking-[0.35em] text-teal-400 font-mono">DR. MED.</span>
                      <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide leading-none uppercase mt-0.5 font-sans">
                        Ulrike Bongartz
                      </h1>
                      <div className="h-[1px] bg-white/10 my-2.5 w-full" />
                      <span className="text-[11px] font-mono tracking-[0.15em] text-slate-300 uppercase font-bold block">
                        FACHÄRZTIN FÜR NEUROLOGIE
                      </span>
                      <span className="text-[10px] font-mono text-teal-400 font-black uppercase mt-1 block tracking-wider">
                        Verifizierungspartner • U.D.O.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro info parameters blocks */}
                <div className="hidden md:grid grid-cols-2 gap-4 w-full max-w-md text-left font-mono">
                  <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                    <span className="text-[9px] text-teal-400 font-bold block uppercase tracking-wider">Guideline Core</span>
                    <span className="text-[11px] text-white font-black block uppercase mt-0.5">S2k German Standard</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5">Lumbar spine segments L4/L5 & L5/S1</span>
                  </div>
                  <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                    <span className="text-[9px] text-[#D4AF37] font-bold block uppercase tracking-wider">Consensus Jury</span>
                    <span className="text-[11px] text-white font-black block uppercase mt-0.5">4 AI Neuro Experts</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5">Joint forensic voting consensus</span>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE: Interactive U.D.O. Sphere & Main Action Trigger */}
              <div className="flex flex-col items-center justify-center space-y-8 select-none">
                
                {/* GLOWING REVOLVING SPHERE SYSTEM */}
                <div className="relative flex flex-col items-center justify-center pointer-events-auto">
                  
                  {/* Outer Orbit Ring */}
                  <div className="absolute w-64 h-64 rounded-full border border-teal-500/10 animate-pulse pointer-events-none" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-72 h-72 rounded-full border border-teal-500/5 pointer-events-none"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute w-80 h-80 rounded-full border border-dashed border-teal-500/10 pointer-events-none"
                  />

                  {/* Ground Holo Base Reflection */}
                  <div className="absolute bottom-[-15px] w-40 h-5 bg-teal-400/15 rounded-full blur-xl pointer-events-none" />

                  {/* SPHERE SPATIAL BUTTON TARGET */}
                  <motion.button
                    onClick={() => {
                      playInnovationChime();
                      setShowWhitepaper(true);
                    }}
                    whileHover={{ scale: 1.05, translateY: -4 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative w-48 h-48 rounded-full bg-gradient-to-br from-[#061834]/80 to-[#020815]/95 border border-teal-400/30 hover:border-teal-400 p-4 shadow-[0_0_50px_rgba(20,184,166,0.18)] hover:shadow-[0_0_70px_rgba(20,184,166,0.4)] transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer group overflow-hidden z-10"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent opacity-0 group-hover:opacity-100 animate-bounce" />
                    
                    {/* Concentric rotating orbits inside */}
                    <div className="absolute inset-2 rounded-full border border-teal-500/15 animate-spin" style={{ animationDuration: "14s" }} />
                    <div className="absolute inset-4 rounded-full border border-dashed border-teal-500/10 animate-spin" style={{ animationDuration: "9s", animationDirection: "reverse" }} />

                    {/* Central Orb Core */}
                    <div className="relative w-22 h-22 rounded-full bg-gradient-to-tr from-teal-500/20 via-teal-500/5 to-cyan-500/25 border border-teal-400/30 flex items-center justify-center shadow-inner group-hover:border-teal-400/60 transition-all">
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.25),transparent_70%)] animate-pulse" />
                      <BookOpen size={30} className="text-teal-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    </div>

                    <div className="z-10 text-center">
                      <span className="text-[10px] font-mono font-black text-teal-400 tracking-wider block uppercase group-hover:text-white transition-colors">
                        U.D.O. Sphere
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-slate-300 uppercase block font-semibold mt-0.5">
                        Open Whitepaper
                      </span>
                    </div>
                  </motion.button>
                </div>

                {/* CORE ENTER PORTAL CALL-TO-ACTION */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <motion.button
                    onClick={() => {
                      playInnovationChime();
                      onComplete();
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 w-64 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-sans font-black text-xs tracking-[0.2em] uppercase cursor-pointer hover:shadow-[0_10px_35px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enter Clinical Portal</span>
                    <ArrowRight size={14} className="stroke-[3px]" />
                  </motion.button>

                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                    Authorized Medical Access Node
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER & REGULATORY STANDARDS */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center text-[9px] font-mono text-slate-500 tracking-wider relative z-10 border-t border-white/5 pt-4">
        <div>
          <span>© 2026 U.D.O. PLATFORM • SECURE DISGVO NODE</span>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase">
          <span>QES Signatures Active</span>
          <span>•</span>
          <span>Hosted in German Cloud Run Registry</span>
        </div>
      </div>

      {/* FULL SCREEN WHITEPAPER OVERLAY MODAL */}
      <AnimatePresence>
        {showWhitepaper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[10000] overflow-y-auto p-6 md:p-12"
          >
            <div className="max-w-5xl mx-auto space-y-6 relative">
              
              {/* Back / Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowWhitepaper(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                >
                  <X size={14} />
                  <span>Close Whitepaper</span>
                </button>
              </div>

              {/* Render Whitepaper Component */}
              <SystemWhitepaper />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
