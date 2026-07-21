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
import { useGlobalSystem } from "./GlobalSystemContext";
import SynapseBackground from "./ui/synapse-background";

interface IntroPresentationProps {
  onComplete: () => void;
}

export default function IntroPresentation({ onComplete }: IntroPresentationProps) {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [preLaunchActive, setPreLaunchActive] = useState(false);
  const [preLaunchProgress, setPreLaunchProgress] = useState(0);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [typedReminder, setTypedReminder] = useState("");

  const { language, setLanguage } = useGlobalSystem();

  useEffect(() => {
    if (!isBooted) return;
    const text = language === "de" ? "Neu: Lese das Benutzerhandbuch auf Seite 6! 📖" : "New: Read User Manual on Page 6! 📖";
    let i = 0;
    let isDeleting = false;
    let timer = 100;
    let loop: NodeJS.Timeout;

    const tick = () => {
      setTypedReminder(text.substring(0, i));
      if (!isDeleting) {
        i++;
        if (i > text.length) {
          isDeleting = true;
          timer = 2000; // Pause at full text
        } else {
          timer = 100;
        }
      } else {
        i--;
        if (i === 0) {
          isDeleting = false;
          timer = 500; // Pause at empty
        } else {
          timer = 40; // Delete faster
        }
      }
      loop = setTimeout(tick, timer);
    };

    loop = setTimeout(tick, timer);
    return () => clearTimeout(loop);
  }, [isBooted, language]);

  const bootLogs = [
    "INITIATING SECURE SYSTEM CONSOLE...",
    "ESTABLISHING SECURE PORTAL BRIDGE [PORT: 3000]...",
    "SYNCHRONIZING WITH AWMF-S2k/S3 LEITLINIEN...",
    "ESTABLISHING DE-DE & EN-US TRANSLATION MATRICES...",
    "CALIBRATING COGNITIVE VOICE & WAKE-WORD SYSTEM...",
    "READY FOR CLINICAL COLLABORATION."
  ];

  const t = {
    de: {
      statusSecure: "System sicher & bereit",
      statusBooting: "System: Diagnose-Kern bootet",
      portalVer: "PORTAL VER: 2.1.0",
      skip: "Booten überspringen",
      verifiedPartner: "Verifizierter Partner",
      fachärztin: "FACHÄRZTIN FÜR NEUROLOGIE & EXPERTIN",
      verPartner: "Verifizierungspartner • U.D.O.",
      guidelineCore: "Richtlinien-Modul",
      guidelineCoreDetail: "Deutscher S2k-Standard",
      guidelineSub: "Lendenwirbelsäule L4/L5 & L5/S1",
      consensusJury: "Konsens-Jury",
      consensusJuryDetail: "4 AI Neuro-Experten",
      consensusSub: "Gemeinsame forensische Abstimmung",
      sphereTitle: "U.D.O. Sphäre",
      sphereDesc: "Whitepaper öffnen",
      enterPortal: "Portal betreten",
      authNode: "Autorisierter medizinischer Zugangsknoten",
      regulatory: "© 2026 U.D.O. PLATTFORM • SICHERER DSGVO-KNOTEN",
      qesStatus: "QES-Signaturen Aktiv",
      hostedGerman: "In deutscher Cloud Run Registry gehostet",
      closeWhitepaper: "Whitepaper schließen",
    },
    en: {
      statusSecure: "System Secure & Ready",
      statusBooting: "System: Booting Diagnostic Core",
      portalVer: "PORTAL VER: 2.1.0",
      skip: "Skip Loading",
      verifiedPartner: "Verified Partner",
      fachärztin: "NEUROLOGY EXPert SPECIALIST",
      verPartner: "Verification Partner • U.D.O.",
      guidelineCore: "Guideline Core",
      guidelineCoreDetail: "S2k German Standard",
      guidelineSub: "Lumbar spine segments L4/L5 & L5/S1",
      consensusJury: "Consensus Jury",
      consensusJuryDetail: "4 AI Neuro Experts",
      consensusSub: "Joint forensic voting consensus",
      sphereTitle: "U.D.O. Sphere",
      sphereDesc: "Open Whitepaper",
      enterPortal: "Enter Clinical Portal",
      authNode: "Authorized Medical Access Node",
      regulatory: "© 2026 U.D.O. PLATFORM • SECURE GDPR NODE",
      qesStatus: "QES Signatures Active",
      hostedGerman: "Hosted in German Cloud Run Registry",
      closeWhitepaper: "Close Whitepaper",
    }
  };

  const currentLang = language === "de" ? "de" : "en";

  // Boot sequence effects
  useEffect(() => {
    if (isBooted || preLaunchActive) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPreLaunchActive(true); // Direct to Pre-Launch screen instead of fully loaded landing
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
  }, [isBooted, preLaunchActive]);

  // Pre-Launch Credibility Indexing Effects
  useEffect(() => {
    if (!preLaunchActive) return;

    const interval = setInterval(() => {
      setPreLaunchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBooted(true);
            setPreLaunchActive(false);
          }, 800);
          return 100;
        }
        return prev + 1.8; // Smooth, high-fidelity loaded sequence
      });
    }, 30);

    return () => clearInterval(interval);
  }, [preLaunchActive]);

  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (err) {
      console.warn("Click sound failed:", err);
    }
  };

  const handleSkipBoot = () => {
    playClickSound();
    setProgress(100);
    setPreLaunchActive(true);
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
    <SynapseBackground 
      lineColor={0x0ea5e9} 
      particleColor={0x38bdf8} 
      pulseColor={0xd946ef} 
      connectionDistance={75} 
      particleCount={3000}
      className="fixed inset-0 bg-[#020813] text-white z-[9999] overflow-hidden select-none font-sans min-h-screen"
    >
      <div className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden p-6 flex flex-col items-center justify-between min-h-screen bg-black/35 backdrop-blur-none">
        
        {/* Cinematic Ambient Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
        <div className="w-full max-w-6xl flex justify-between items-center relative z-10 font-mono text-[11px] text-slate-300 tracking-[0.15em] uppercase pt-3 pb-3 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${isBooted ? "bg-emerald-400" : "bg-teal-400 animate-pulse"} flex items-center justify-center`}>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            </span>
            <span className="font-extrabold text-white">{isBooted ? t[currentLang].statusSecure : t[currentLang].statusBooting}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">{t[currentLang].portalVer}</span>
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => {
                  playClickSound();
                  setLanguage("de");
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider font-extrabold cursor-pointer transition-all ${
                  language === "de"
                    ? "bg-teal-400 text-slate-950 font-black shadow-lg scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                DE
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setLanguage("en");
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider font-extrabold cursor-pointer transition-all ${
                  language === "en"
                    ? "bg-teal-400 text-slate-950 font-black shadow-lg scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* STAGE CONTAINER */}
        <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center relative z-10 py-6 my-auto">
          <AnimatePresence mode="wait">
            {!isBooted && !preLaunchActive ? (
              
              /* ==========================================
                 PHASE 1: SECURE BOOT VERIFICATION
                 ========================================== */
              <motion.div
                key="booting"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15 }}
                transition={{ type: "spring", damping: 18, stiffness: 140 }}
                className="flex flex-col items-center justify-center text-center space-y-8 max-w-xl bg-slate-950/40 p-10 border border-white/5 rounded-[40px] backdrop-blur-md shadow-2xl"
              >
                {/* Spinning Loader HUD */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/40"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border-2 border-teal-500/30 border-t-teal-400 border-b-teal-400"
                  />
                  <div className="absolute inset-8 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Cpu className="w-14 h-14 text-[#D4AF37] animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-white uppercase leading-none font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    U<span className="text-[#D4AF37]">.</span>D<span className="text-teal-400">.</span>O
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-[#D4AF37] tracking-[0.35em] uppercase font-black">
                    Ultimate Diagnostic Operator
                  </p>
                </div>

                {/* Terminal Logs */}
                <div className="h-10 flex items-center justify-center text-xs sm:text-sm font-mono text-teal-300 font-bold uppercase tracking-wider bg-black/40 px-6 py-2.5 rounded-2xl border border-white/5 min-w-[320px]">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-4.5 h-4.5 animate-pulse text-[#D4AF37]" />
                    <span>{bootLogs[bootStage]}</span>
                  </div>
                </div>

                {/* Progress and Skip */}
                <div className="w-full max-w-sm space-y-5 pt-4">
                  <div className="w-full bg-slate-900/90 border border-white/10 rounded-full h-2.5 p-[2px] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-teal-400 to-cyan-400 transition-all duration-75" style={{ width: `${progress}%` }} />
                  </div>
                  <button
                    onClick={handleSkipBoot}
                    onMouseEnter={playClickSound}
                    className="px-6 py-3 rounded-2xl border border-white/15 hover:border-teal-400/50 bg-white/5 hover:bg-slate-900 text-white font-mono text-xs uppercase tracking-widest font-black cursor-pointer transition-all duration-300 shadow-md hover:shadow-teal-500/20 active:scale-95 mx-auto block"
                  >
                    {t[currentLang].skip} &rarr;
                  </button>
                </div>
              </motion.div>

            ) : preLaunchActive ? (
              
              /* ==========================================
                 PHASE 1.5: PRE-LAUNCH CREDIBILITY INDEXING
                 ========================================== */
              <motion.div
                key="pre-launch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl flex flex-col items-center justify-center space-y-10 py-4 pointer-events-auto"
              >
                {/* Title Section */}
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-mono font-black text-teal-400 tracking-[0.35em] uppercase block animate-pulse">
                    INTEGRITY VERIFICATION PROTOCOL ACTIVE
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">
                    Indexing Clinical Credibility Metrics
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mx-auto">
                    Loading clinical-grade guideline databases, physician licensing registers, and AI consensus jury nodes.
                  </p>
                </div>

                {/* Grid of 3 Premium Glassmorphic Cards (Floating, Staggered, with breathing glow) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                  
                  {/* Card 1: Medical Expert Validation */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative flex flex-col p-6 bg-slate-950/45 backdrop-blur-xl border border-teal-500/20 hover:border-teal-400/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden"
                  >
                    {/* Breathing glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-cyan-500/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                          <Award size={24} className="animate-pulse" />
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-teal-500/20 text-teal-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Licensed
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block">Medical Expert</span>
                        <h4 className="text-lg font-black text-white uppercase tracking-wide">Ulrike Bongartz</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Fachärztin für Neurologie and chief verification partner, ensuring top-tier medical and forensic integrity.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-teal-400">
                        <span>NODE VERIFIED</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2: Guideline Core */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="relative flex flex-col p-6 bg-slate-950/45 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden"
                  >
                    {/* Breathing glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-teal-500/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <BookOpen size={24} className="animate-pulse" />
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          S2K Standard
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block">Guideline Database</span>
                        <h4 className="text-lg font-black text-white uppercase tracking-wide">AWMF Consensus</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Fully compliant with German S2k & S3 orthopedic and neurologic directives for lumbar segments L4-S1.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-cyan-400">
                        <span>GUIDELINE SYNCED</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3: AI Consensus Jury */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="relative flex flex-col p-6 bg-slate-950/45 backdrop-blur-xl border border-violet-500/20 hover:border-violet-400/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden"
                  >
                    {/* Breathing glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-fuchsia-500/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                          <Cpu size={24} className="animate-pulse" />
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Quad Core
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block">AI Consensus Hub</span>
                        <h4 className="text-lg font-black text-white uppercase tracking-wide">4 Expert Jury</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Automated cross-agent verification model evaluating findings with neural forensic clinical voting.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-violet-400">
                        <span>JURY ONLINE</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                    </div>
                  </motion.div>

                </div>

                {/* Progress bar & skip */}
                <div className="w-full max-w-md space-y-4 px-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    <span>Synchronizing registry credentials...</span>
                    <span>{Math.round(preLaunchProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-900/90 border border-white/10 rounded-full h-2.5 p-[2px] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500 transition-all duration-75" 
                      style={{ width: `${preLaunchProgress}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        setIsBooted(true);
                        setPreLaunchActive(false);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-sans font-black tracking-widest text-xs uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Skip to Dashboard</span>
                      <ChevronRight size={14} className="stroke-[3px]" />
                    </button>
                  </div>
                </div>

              </motion.div>

            ) : (

              /* ==========================================
                 PHASE 2: INTERACTIVE MEDICAL GATEWAY WELCOME SCREEN
                 ========================================== */
              <motion.div
                key="gateway"
                initial={{ opacity: 0, scale: 0.75, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 140 }}
                className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl px-4"
              >
                {/* LEFT SIDE: Brand Header & Medical Partner Badge */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                  
                  {/* PROFESSIONAL MEDICAL CARD */}
                  <div className="p-8 md:p-10 bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.85)] group max-w-lg w-full relative">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-black tracking-widest">
                      <CheckCircle size={12} /> {t[currentLang].verifiedPartner}
                    </div>
 
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
                      <div className="relative shrink-0 flex items-center justify-center p-4 bg-slate-900/95 border border-[#39FF14]/30 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.15)]">
                        {/* Spine and Caduceus Vector Illustration from Logo */}
                        <svg viewBox="0 0 120 280" className="w-14 h-28 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <line x1="60" y1="10" x2="60" y2="270" stroke="#39FF14" strokeWidth="8" />
                          <path d="M 40,50 C 5,80 5,120 60,150 C 115,180 115,220 40,250" stroke="#39FF14" strokeWidth="9" />
                        </svg>
                      </div>
 
                      <div className="flex flex-col text-center md:text-left justify-center min-h-[110px]">
                        <span className="text-xs font-black tracking-[0.35em] text-teal-400 font-mono">DR. MED.</span>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide leading-none uppercase mt-1.5 font-sans">
                          Ulrike Bongartz
                        </h1>
                        <div className="h-[1px] bg-white/10 my-3.5 w-full" />
                        <span className="text-sm font-mono tracking-[0.15em] text-slate-200 uppercase font-bold block">
                          {t[currentLang].fachärztin}
                        </span>
                        <span className="text-xs font-mono text-teal-400 font-black uppercase mt-1.5 block tracking-wider">
                          {t[currentLang].verPartner}
                        </span>
                      </div>
                    </div>
                  </div>
 
                  {/* Micro info parameters blocks */}
                  <div className="hidden md:grid grid-cols-2 gap-5 w-full max-w-lg text-left font-mono">
                    <motion.div 
                      animate={{ 
                        boxShadow: ["0 0 15px rgba(45,212,191,0.1)", "0 0 25px rgba(34,211,238,0.25)", "0 0 15px rgba(45,212,191,0.1)"],
                        borderColor: ["rgba(45,212,191,0.2)", "rgba(34,211,238,0.5)", "rgba(45,212,191,0.2)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="p-5 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border rounded-[24px] transition-all"
                    >
                      <span className="text-[10px] text-teal-400 font-extrabold block uppercase tracking-widest">{t[currentLang].guidelineCore}</span>
                      <span className="text-sm text-white font-black block uppercase mt-1.5">{t[currentLang].guidelineCoreDetail}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed font-semibold">{t[currentLang].guidelineSub}</span>
                    </motion.div>
                    <motion.div 
                      animate={{ 
                        boxShadow: ["0 0 15px rgba(212,175,55,0.1)", "0 0 25px rgba(52,211,153,0.25)", "0 0 15px rgba(212,175,55,0.1)"],
                        borderColor: ["rgba(212,175,55,0.2)", "rgba(52,211,153,0.5)", "rgba(212,175,55,0.2)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="p-5 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border rounded-[24px] transition-all"
                    >
                      <span className="text-[10px] text-[#D4AF37] font-extrabold block uppercase tracking-widest">{t[currentLang].consensusJury}</span>
                      <span className="text-sm text-white font-black block uppercase mt-1.5">{t[currentLang].consensusJuryDetail}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed font-semibold">{t[currentLang].consensusSub}</span>
                    </motion.div>
                  </div>

                  {/* INSTITUTIONAL COOPERATIVE PARTNERS - APPLE/DELOITTE GRADE LOGO GRID */}
                  <div className="w-full max-w-lg space-y-3 pt-2">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 block text-center lg:text-left">
                      Clinical-Grade Institutional Verification Partners
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="px-4 py-2.5 bg-slate-950/70 border border-white/5 rounded-xl flex flex-col items-center justify-center hover:border-teal-500/30 transition-all group/logo cursor-default">
                        <span className="text-[11px] font-extrabold text-teal-300 font-mono tracking-wider group-hover/logo:text-white transition-colors">AWMF</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center mt-0.5">S2k Leitlinie</span>
                      </div>
                      <div className="px-4 py-2.5 bg-slate-950/70 border border-white/5 rounded-xl flex flex-col items-center justify-center hover:border-teal-500/30 transition-all group/logo cursor-default">
                        <span className="text-[11px] font-extrabold text-teal-300 font-mono tracking-wider group-hover/logo:text-white transition-colors">DGUV</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center mt-0.5">BK-Gesetz</span>
                      </div>
                      <div className="px-4 py-2.5 bg-slate-950/70 border border-white/5 rounded-xl flex flex-col items-center justify-center hover:border-teal-500/30 transition-all group/logo cursor-default">
                        <span className="text-[11px] font-extrabold text-teal-300 font-mono tracking-wider group-hover/logo:text-white transition-colors">eIDAS</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center mt-0.5">QES Signatures</span>
                      </div>
                    </div>
                  </div>
 
                </div>
 
                {/* RIGHT SIDE: Interactive U.D.O. Sphere & Main Action Trigger */}
                <div className="flex flex-col items-center justify-center space-y-10 select-none">
                  
                  {/* GLOWING REVOLVING SPHERE SYSTEM */}
                  <div className="relative flex flex-col items-center justify-center pointer-events-auto">
                    
                    {/* Outer Orbit Rings */}
                    <div className="absolute w-72 h-72 rounded-full border border-teal-500/10 animate-pulse pointer-events-none" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute w-80 h-80 rounded-full border border-teal-500/5 pointer-events-none"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-teal-500/10 pointer-events-none"
                    />
 
                    {/* Ground Holo Base Reflection */}
                    <div className="absolute bottom-[-20px] w-48 h-6 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />
 
                    {/* SPHERE SPATIAL BUTTON TARGET */}
                    <motion.button
                      onClick={() => {
                        playInnovationChime();
                        setShowWhitepaper(true);
                      }}
                      onMouseEnter={playClickSound}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        y: [0, -8, 0],
                        boxShadow: [
                          "0 0 45px rgba(20,184,166,0.25)",
                          "0 0 80px rgba(20,184,166,0.55)",
                          "0 0 45px rgba(20,184,166,0.25)"
                        ]
                      }}
                      transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative w-56 h-56 rounded-full bg-slate-950/45 border border-white/20 hover:border-teal-400/80 p-5 backdrop-blur-2xl transition-all duration-500 flex flex-col items-center justify-center gap-3 cursor-pointer group overflow-hidden z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                    >
                      {/* Interactive Radar Scanning Ring (Ripples) */}
                      <div className="absolute inset-0 rounded-full border-2 border-teal-400/10 animate-[ping_3s_infinite]" />
                      <div className="absolute inset-4 rounded-full border border-cyan-400/5 animate-[ping_4s_infinite_1s]" />

                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent opacity-50 group-hover:opacity-100 animate-bounce" />
                      
                      {/* Concentric rotating orbits inside */}
                      <div className="absolute inset-2 rounded-full border border-teal-500/25 animate-spin" style={{ animationDuration: "10s" }} />
                      <div className="absolute inset-4 rounded-full border border-dashed border-teal-500/20 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
                      <div className="absolute inset-8 rounded-full border border-double border-teal-500/10 animate-spin" style={{ animationDuration: "16s" }} />
 
                      {/* Central Orb Core with continuous soft pulsing and scale animation */}
                      <motion.div 
                        animate={{
                          scale: [1, 1.06, 1],
                          borderColor: ["rgba(45,212,191,0.4)", "rgba(34,211,238,0.8)", "rgba(45,212,191,0.4)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500/30 via-teal-500/10 to-cyan-500/35 border flex items-center justify-center shadow-inner group-hover:border-teal-400/90 transition-all"
                      >
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.35),transparent_70%)] animate-pulse" />
                        <BookOpen size={36} className="text-teal-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                      </motion.div>
 
                      <div className="z-10 text-center space-y-1">
                        <span className="text-xs font-mono font-black text-teal-400 tracking-wider block uppercase group-hover:text-white transition-colors">
                          UDO Whitepaper
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-slate-300 uppercase block font-extrabold">
                          ⚠️ Read carefully before use
                        </span>
                        {typedReminder && (
                          <div className="text-[8px] font-mono text-emerald-400 animate-pulse tracking-wide h-4 flex items-center justify-center font-bold">
                            {typedReminder}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  </div>
 
                  {/* CORE ENTER PORTAL CALL-TO-ACTION */}
                  <div className="flex flex-col items-center gap-4 w-full">
                    <motion.button
                      onClick={() => {
                        playInnovationChime();
                        onComplete();
                      }}
                      onMouseEnter={playClickSound}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      animate={{
                        boxShadow: [
                          "0 0 25px rgba(20,184,166,0.35)",
                          "0 0 45px rgba(20,184,166,0.65)",
                          "0 0 25px rgba(20,184,166,0.35)"
                        ],
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                        backgroundImage: "linear-gradient(135deg, #2dd4bf, #22d3ee, #34d399, #2dd4bf)"
                      }}
                      className="px-10 py-5 w-72 rounded-2xl text-slate-950 font-sans font-black text-sm tracking-[0.2em] uppercase cursor-pointer transition-all flex items-center justify-center gap-3.5 shadow-lg"
                    >
                      <span>{t[currentLang].enterPortal}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight size={18} className="stroke-[3.5px]" />
                      </motion.div>
                    </motion.button>
 
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">
                      {t[currentLang].authNode}
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
            <span>{t[currentLang].regulatory}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase">
            <span>{t[currentLang].qesStatus}</span>
            <span>•</span>
            <span>{t[currentLang].hostedGerman}</span>
          </div>
        </div>

        {/* FULL SCREEN WHITEPAPER OVERLAY MODAL */}
        <AnimatePresence>
          {showWhitepaper && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.75, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 130 }}
              className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[10000] overflow-y-auto p-6 md:p-12 flex items-start justify-center"
            >
              <div className="max-w-5xl mx-auto space-y-6 relative w-full pt-4">
                
                {/* Back / Close button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowWhitepaper(false);
                    }}
                    onMouseEnter={playClickSound}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    <X size={16} />
                    <span>{t[currentLang].closeWhitepaper}</span>
                  </button>
                </div>

                {/* Render Whitepaper Component */}
                <SystemWhitepaper />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SynapseBackground>
  );
}
