import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  BookOpen, 
  Cpu, 
  X, 
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Info,
  PanelsTopLeft,
  FlaskConical,
  HelpCircle
} from "lucide-react";
import SystemWhitepaper from "./SystemWhitepaper";
import { useGlobalSystem } from "./GlobalSystemContext";
import SynapseBackground from "./ui/synapse-background";
import SplineBackground from "./SplineBackground";
import RobotMascot from "./RobotMascot";
import { StatusBar } from "./StatusBar";
import { GradientButton } from "./ui/gradient-button";

interface IntroPresentationProps {
  onComplete: () => void;
  onOpenWhitepaper?: () => void;
  onOpenWorkspace?: () => void;
  onOpenAlbisTest?: () => void;
  onOpenUdoV2?: () => void;
}

export default function IntroPresentation({ onComplete, onOpenWhitepaper, onOpenWorkspace, onOpenAlbisTest, onOpenUdoV2 }: IntroPresentationProps) {
  const [progress, setProgress] = useState(100);
  const [bootStage, setBootStage] = useState(5);
  const [isBooted, setIsBooted] = useState(true);
  const [preLaunchActive, setPreLaunchActive] = useState(false);
  const [preLaunchProgress, setPreLaunchProgress] = useState(100);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const [typedReminder, setTypedReminder] = useState("");
  const [chatDismissed, setChatDismissed] = useState(false);

  const { language, setLanguage, robotState, robotBubble, handleRobotClick } = useGlobalSystem();

  useEffect(() => {
    if (!isBooted) return;
    const text = language === "de" ? "Neu: Lese das Benutzerhandbuch! 📖" : "New: Read User Manual! 📖";
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
          timer = 2000;
        } else {
          timer = 100;
        }
      } else {
        i--;
        if (i === 0) {
          isDeleting = false;
          timer = 500;
        } else {
          timer = 40;
        }
      }
      loop = setTimeout(tick, timer);
    };

    loop = setTimeout(tick, timer);
    return () => clearTimeout(loop);
  }, [isBooted, language]);

  const playClickSound = (highPitch = false) => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(highPitch ? 880 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio fallback
    }
  };

  const playInnovationChime = (doublePulse = false) => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  };

  const handleSkipBoot = () => {
    playClickSound();
    setProgress(100);
    setBootStage(5);
    setIsBooted(true);
    setPreLaunchActive(false);
  };

  const currentLang = language === 'de' ? 'de' : 'en';

  const t = {
    de: {
      statusSecure: "System sicher & bereit",
      statusBooting: "System: Diagnose-Kern bootet",
      portalVer: "PORTAL VER: 2.1.0",
      skip: "Booten überspringen",
      verifiedPartner: "Verifizierter Partner",
      fachärztin: "FACHÄRZTIN FÜR NEUROLOGIE",
      verPartner: "Verifizierungspartner • UDO",
      guidelineCore: "Richtlinien-Modul",
      guidelineCoreDetail: "Deutscher S2k-Standard",
      guidelineSub: "Lendenwirbelsäule L4/L5 & L5/S1",
      consensusJury: "Konsens-Jury",
      consensusJuryDetail: "4 AI Neuro-Experten",
      consensusSub: "Gemeinsame forensische Abstimmung",
      sphereTitle: "UDO Sphäre",
      sphereDesc: "Whitepaper öffnen",
      enterPortal: "ENTER PORTAL",
      authNode: "Autorisierter medizinischer Zugangsknoten",
      closeWhitepaper: "Whitepaper Schließen",
      regulatory: "MEDIZINPRODUKT-KLASSE I (MDR) • AES-256 S2K KLINIK-KRYPTOGRAPHIE",
      qesStatus: "QES eIDAS KONFORM",
      hostedGerman: "DEUTSCHER SERVER-STANDORT (DSGVO)"
    },
    en: {
      statusSecure: "System secure & ready",
      statusBooting: "System: Diagnostic core booting",
      portalVer: "PORTAL VER: 2.1.0",
      skip: "Skip booting",
      verifiedPartner: "Verified Partner",
      fachärztin: "NEUROLOGY SPECIALIST",
      verPartner: "Verification Partner • UDO",
      guidelineCore: "Guideline Core",
      guidelineCoreDetail: "German S2k Standard",
      guidelineSub: "Lumbar segments L4/L5 & L5/S1",
      consensusJury: "Consensus Jury",
      consensusJuryDetail: "4 AI Neuro Experts",
      consensusSub: "Joint forensic clinical vote",
      sphereTitle: "UDO Sphere",
      sphereDesc: "Open Whitepaper",
      enterPortal: "ENTER PORTAL",
      authNode: "Authorized medical access node",
      closeWhitepaper: "Close Whitepaper",
      regulatory: "MEDICAL DEVICE CLASS I (MDR) • AES-256 S2K CLINICAL CRYPTOGRAPHY",
      qesStatus: "QES eIDAS COMPLIANT",
      hostedGerman: "GERMAN SERVER LOCATION (GDPR)"
    }
  };

  const handleOpenWhitepaperView = () => {
    if (onOpenWhitepaper) {
      onOpenWhitepaper();
    } else {
      setShowWhitepaper(true);
    }
  };

  return (
    <SynapseBackground 
      lineColor={0x0ea5e9} 
      particleColor={0x38bdf8} 
      pulseColor={0xd946ef} 
      connectionDistance={75} 
      particleCount={1500}
      className="fixed inset-0 bg-[#020813] text-white z-0 overflow-hidden select-none font-sans min-h-screen"
    >
      {/* Z-0: 3D SPLINE CANVAS (Full Viewport with pointer-events-auto for cursor tracking) */}
      <SplineBackground />

      {/* Z-10: AMBIENT VIGNETTE / GRAIN OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020813]/60 via-transparent to-[#020813]/80 pointer-events-none" />

      {/* Z-20: OVERLAY UI LAYER (wrapper is pointer-events-none; children have pointer-events-auto) */}
      <div className="absolute inset-0 z-20 overflow-hidden p-4 sm:p-6 flex flex-col justify-between pointer-events-none min-h-screen">
        
        {/* SHARED STATUS BAR */}
        <StatusBar isBooted={isBooted} className="pointer-events-auto relative z-30" />

        {/* MAIN INTERACTIVE STAGE AREA */}
        <div className="flex-1 relative w-full max-w-7xl mx-auto flex flex-col items-center justify-end pb-4 sm:pb-8 pointer-events-none">
          <AnimatePresence mode="wait">
            {!isBooted ? (
              /* BOOT STAGE UI */
              <motion.div
                key="boot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full max-w-md p-6 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto space-y-4 text-center my-auto"
              >
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Booting System Core...</span>
                </div>
                <div className="w-full bg-slate-900 border border-white/10 rounded-full h-2 p-[2px]">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>
                <button
                  onClick={handleSkipBoot}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 hover:border-cyan-400/50 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  {t[currentLang].skip} &rarr;
                </button>
              </motion.div>

            ) : preLaunchActive ? (
              /* PRE-LAUNCH CREDIBILITY INDEXING */
              <motion.div
                key="pre-launch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full max-w-3xl p-6 bg-slate-950/80 backdrop-blur-xl border border-teal-500/30 rounded-3xl shadow-2xl pointer-events-auto my-auto space-y-6 text-center"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-black text-teal-400 tracking-widest uppercase block animate-pulse">
                    INTEGRITY VERIFICATION ACTIVE
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                    Indexing Clinical Credibility Metrics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] font-mono text-teal-400 font-bold uppercase block">Medical Expert</span>
                    <h4 className="text-sm font-bold text-white uppercase">Ulrike Bongartz</h4>
                    <p className="text-[10px] text-slate-400">Fachärztin für Neurologie</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">Guideline Core</span>
                    <h4 className="text-sm font-bold text-white uppercase">AWMF Consensus</h4>
                    <p className="text-[10px] text-slate-400">German S2k Standard</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-1">
                    <span className="text-[9px] font-mono text-violet-400 font-bold uppercase block">AI Jury</span>
                    <h4 className="text-sm font-bold text-white uppercase">4 Expert Nodes</h4>
                    <p className="text-[10px] text-slate-400">Quad Core Verification</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setIsBooted(true);
                    setPreLaunchActive(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-sans font-black text-xs uppercase tracking-widest cursor-pointer"
                >
                  Skip to Portal &rarr;
                </button>
              </motion.div>

            ) : (
              /* LANDING SCREEN OVERLAY ELEMENTS */
              <motion.div
                key="gateway"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full flex flex-col justify-between items-center pointer-events-none relative"
              >
                {/* FLOATING ROBOT MASCOT (UPPER RIGHT / TOP-RIGHT FLOAT - DISMISSABLE ON CLICK) */}
                <AnimatePresence>
                  {!chatDismissed && (
                    <motion.div
                      key="robot-mascot-unit"
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-6 z-30 pointer-events-auto"
                    >
                      <div 
                        className="hover:scale-105 transition-transform duration-300 cursor-pointer" 
                        onClick={() => {
                          handleRobotClick();
                          setChatDismissed(true);
                        }}
                        title="Klicken zum Schließen / Click to dismiss"
                      >
                        <RobotMascot
                          state={robotState || "IDLE"}
                          messageBubble={robotBubble}
                          onBubbleClick={() => {
                            handleRobotClick();
                            setChatDismissed(true);
                          }}
                          size="md"
                          showBadge={false}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FLOATING WHITEPAPER & TRON NEON UDO V2 BUTTONS */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-6 z-30 pointer-events-auto flex flex-col gap-2.5">
                  <GradientButton
                    variant="whitepaper"
                    onClick={() => {
                      playInnovationChime(true);
                      handleOpenWhitepaperView();
                    }}
                    onMouseEnter={() => playClickSound(false)}
                    className="gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <span>UDO WHITEPAPER</span>
                    <BookOpen className="w-4 h-4" />
                  </GradientButton>

                  {/* TRON NEON ENTRY BUTTON FOR /app/udo-v2/page.tsx - DOWN OF WHITEPAPER */}
                  <button
                    onClick={() => {
                      playClickSound(true);
                      if (onOpenUdoV2) {
                        onOpenUdoV2();
                      } else if (typeof window !== "undefined") {
                        window.history.pushState({}, '', '/udo-v2');
                        window.dispatchEvent(new Event('popstate'));
                      }
                    }}
                    onMouseEnter={() => playClickSound(false)}
                    className="gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer rounded-[11px] min-w-[132px] inline-flex items-center justify-center text-cyan-300 bg-slate-950/90 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6),inset_0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.95),inset_0_0_20px_rgba(6,182,212,0.5)] hover:border-cyan-300 hover:text-white transition-all active:scale-95"
                  >
                    <span>UDO V2 DASHBOARD</span>
                    <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </button>

                  {/* HELP BUTTON */}
                  <button
                    onClick={() => {
                      playClickSound(true);
                      if (typeof window !== "undefined") {
                        window.history.pushState({}, '', '/help');
                        window.dispatchEvent(new Event('popstate'));
                      }
                    }}
                    onMouseEnter={() => playClickSound(false)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-300 transition-all backdrop-blur-sm hover:text-white hover:border-cyan-400/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer uppercase font-mono font-bold"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>HELP</span>
                  </button>
                </div>

                {/* FIXED BOTTOM-LEFT RADIO BUTTON MODE SELECTOR (OPPOSITE OF WORKSPACE & ALBIS TEST ON THE RIGHT) */}
                <div className="fixed bottom-6 left-6 z-50 pointer-events-auto flex items-center gap-2 p-2.5 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl font-mono text-xs text-slate-300">
                  <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider px-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    SELECT:
                  </span>

                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all active:scale-95">
                    <input
                      type="radio"
                      name="system-mode-radio-left"
                      value="workspace"
                      onChange={() => {
                        playClickSound(true);
                        if (onOpenWorkspace) {
                          onOpenWorkspace();
                        }
                      }}
                      className="accent-indigo-500 cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="font-bold text-indigo-300">Workspace</span>
                  </label>

                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-cyan-500/30 cursor-pointer transition-all active:scale-95">
                    <input
                      type="radio"
                      name="system-mode-radio-left"
                      value="albis"
                      onChange={() => {
                        playClickSound(true);
                        if (onOpenAlbisTest) {
                          onOpenAlbisTest();
                        } else if (typeof window !== "undefined") {
                          window.history.pushState({}, '', '/albis-test');
                          window.dispatchEvent(new Event('popstate'));
                        }
                      }}
                      className="accent-cyan-400 cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="font-bold text-cyan-300">ALBIS Test</span>
                  </label>
                </div>

                {/* FIXED BOTTOM-RIGHT WORKSPACE & ALBIS TEST BUTTON CLUSTER */}
                <div className="fixed bottom-6 right-6 z-50 pointer-events-auto flex gap-3">
                  <GradientButton
                    variant="default"
                    onClick={() => {
                      playClickSound(true);
                      if (onOpenWorkspace) {
                        onOpenWorkspace();
                      }
                    }}
                    className="gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border border-white/20 bg-slate-950/80 backdrop-blur-md hover:border-indigo-400 text-slate-200 hover:text-white shadow-lg transition-all cursor-pointer min-w-[110px]"
                  >
                    <PanelsTopLeft className="w-3.5 h-3.5 text-indigo-400" />
                    <span>WORKSPACE</span>
                  </GradientButton>

                  <GradientButton
                    variant="variant"
                    onClick={() => {
                      playClickSound(true);
                      if (onOpenAlbisTest) {
                        onOpenAlbisTest();
                      } else if (typeof window !== "undefined") {
                        window.history.pushState({}, '', '/albis-test');
                        window.dispatchEvent(new Event('popstate'));
                      }
                    }}
                    className="!min-w-0 !px-5 !py-2.5 text-sm gap-2 font-mono font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                  >
                    <FlaskConical className="w-4 h-4 text-cyan-300" />
                    <span>ALBIS TEST</span>
                  </GradientButton>
                </div>

                {/* LOWER-MIDDLE ZONE: SHRUNK CARD & ENTER PORTAL CTA */}
                {/* Positioned at top-[56vh] / lower half so top 50% face region stays 100% unobstructed */}
                <div className="mt-auto pt-[45vh] sm:pt-[50vh] flex flex-col items-center gap-4 w-full max-w-[360px] pointer-events-auto relative z-30">
                  
                  {/* SHRUNK & COMPACT PROFESSIONAL PROFILE CARD (Max width ~360px, padding p-5) */}
                  <div className="w-full p-5 bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col space-y-3 relative group">
                    
                    {/* VERIFIED BADGE */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-mono uppercase font-black tracking-widest">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t[currentLang].verifiedPartner}</span>
                      </div>
                      <span className="text-[9px] font-mono text-teal-400 font-extrabold uppercase tracking-wider">
                        UDO S2K
                      </span>
                    </div>

                    {/* DOCTOR INFO */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 p-2.5 bg-slate-900 border border-[#39FF14]/40 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.15)]">
                        <svg viewBox="0 0 120 280" className="w-8 h-14 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <line x1="60" y1="10" x2="60" y2="270" stroke="#39FF14" strokeWidth="8" />
                          <path d="M 40,50 C 5,80 5,120 60,150 C 115,180 115,220 40,250" stroke="#39FF14" strokeWidth="9" />
                        </svg>
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-mono font-black text-teal-400 tracking-widest">DR. MED.</span>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase leading-tight font-sans">
                          Ulrike Bongartz
                        </h1>
                        <span className="text-[11px] font-mono text-slate-300 uppercase font-semibold mt-0.5">
                          {t[currentLang].fachärztin}
                        </span>
                      </div>
                    </div>

                    {/* COMPACT INSTITUTIONAL VERIFICATION STRIP (AWMF / DGUV / eIDAS) */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                      <div className="flex-1 py-1.5 px-2 bg-slate-900/90 border border-white/10 rounded-lg text-center font-mono">
                        <span className="text-[10px] font-bold text-teal-300 block leading-none">AWMF</span>
                        <span className="text-[7.5px] text-slate-400 block mt-0.5 uppercase">S2k Std.</span>
                      </div>
                      <div className="flex-1 py-1.5 px-2 bg-slate-900/90 border border-white/10 rounded-lg text-center font-mono">
                        <span className="text-[10px] font-bold text-teal-300 block leading-none">DGUV</span>
                        <span className="text-[7.5px] text-slate-400 block mt-0.5 uppercase">BK-Gesetz</span>
                      </div>
                      <div className="flex-1 py-1.5 px-2 bg-slate-900/90 border border-white/10 rounded-lg text-center font-mono">
                        <span className="text-[10px] font-bold text-teal-300 block leading-none">eIDAS</span>
                        <span className="text-[7.5px] text-slate-400 block mt-0.5 uppercase">QES Sign</span>
                      </div>
                      <button
                        onClick={() => setShowPartnerDetails(!showPartnerDetails)}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-cyan-400/40 rounded-lg text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
                        title="Detailierte Partner-Parameter anzeigen"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* COLLAPSIBLE EXTENDED DETAILS */}
                    <AnimatePresence>
                      {showPartnerDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 space-y-1.5 text-[10px] font-mono text-slate-300 text-left border-t border-white/10 overflow-hidden"
                        >
                          <div className="flex justify-between">
                            <span className="text-teal-400 font-bold">GUIDELINE:</span>
                            <span>AWMF S2k L4-S1 Standard</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-400 font-bold">CONSENSUS:</span>
                            <span>4 AI Neuro-Experts Panel</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RESTYLED CTA BUTTON USING GradientButton */}
                  <div className="w-full flex flex-col items-center gap-2">
                    <GradientButton
                      variant="variant"
                      onClick={() => {
                        playInnovationChime(true);
                        onComplete();
                      }}
                      className="w-full py-4 text-sm tracking-[0.2em] font-black uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(70,147,150,0.4)]"
                    >
                      <span>{t[currentLang].enterPortal}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3px]" />
                    </GradientButton>

                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold block text-center">
                      {t[currentLang].authNode}
                    </span>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <footer className="w-full max-w-6xl mx-auto pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono text-slate-500 tracking-wider pointer-events-auto relative z-30">
          <div>
            <span>{t[currentLang].regulatory}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 sm:mt-0 uppercase">
            <span>{t[currentLang].qesStatus}</span>
            <span>•</span>
            <span>{t[currentLang].hostedGerman}</span>
          </div>
        </footer>

        {/* FULL SCREEN WHITEPAPER OVERLAY MODAL */}
        <AnimatePresence>
          {showWhitepaper && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#020813] z-[100000] overflow-y-auto p-4 sm:p-6 md:p-10 pointer-events-auto"
            >
              <div className="max-w-5xl mx-auto space-y-6 relative w-full pt-2 pb-20">
                <div className="flex justify-end sticky top-0 z-50 pt-2 pb-4 bg-[#020813] border-b border-white/10">
                  <button
                    onClick={() => {
                      playClickSound(true);
                      setShowWhitepaper(false);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:scale-105 text-teal-300 font-mono text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>{t[currentLang].closeWhitepaper}</span>
                  </button>
                </div>
                <SystemWhitepaper />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SynapseBackground>
  );
}
