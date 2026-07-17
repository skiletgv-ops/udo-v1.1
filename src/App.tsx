import React, { useState, useEffect } from "react";
import ParticleSphereBackground from "./components/ParticleSphereBackground";
import PhaseWorkflow from "./components/PhaseWorkflow";
import CologneChatbot from "./components/CologneChatbot";
import GutachtenPanel from "./components/GutachtenPanel";
import PracticeUpgrades from "./components/PracticeUpgrades";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import VideoAnalysePortal from "./components/VideoAnalysePortal";
import IntroPresentation from "./components/IntroPresentation";
import { Patient } from "./types";
import { useGlobalSystem } from "./components/GlobalSystemContext";
import { motion, AnimatePresence } from "motion/react";
import { FUNCTIONS_CARDS } from "./data/functionsData";
import FunctionDetailPage from "./components/functions/FunctionPages";
import { SplineSceneBasic } from "./components/ui/demo";
import SystemWhitepaper from "./components/SystemWhitepaper";
import AccessibilityWidget from "./components/AccessibilityWidget";

// @ts-ignore
import udoIcon from "./assets/images/udo_futuristic_icon_1783906054468.jpg";
import { 
  Clock, 
  Info, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Video, 
  LineChart, 
  X, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Layers, 
  Cpu, 
  Grid,
  Mic,
  Upload,
  Loader2,
  Check,
  BookOpen
} from "lucide-react";



export default function App() {
  const {
    activeView,
    setActiveView,
    robotState,
    setRobotState,
    robotBubble,
    setRobotBubble,
    activePatient,
    setActivePatient,
    systemTime,
    isMaximized,
    setIsMaximized,
    isMasterMenuOpen,
    setIsMasterMenuOpen,
    handleRobotClick,
    handleRobotStateChange,
    handleQuickModuleJump,
    language,
    setLanguage,
    globalForceActiveListening,
    fontScale,
    colorblindMode
  } = useGlobalSystem();

  // Sync font size scaling proportionally with the entire HTML document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`;
    return () => {
      document.documentElement.style.fontSize = "16px";
    };
  }, [fontScale]);

  // Translate colorblindness modes to the standard SVG matrix filter ids
  const getColorblindFilterStyle = () => {
    if (colorblindMode === "deuteranopia") return "url(#deuteranopia-filter)";
    if (colorblindMode === "protanopia") return "url(#protanopia-filter)";
    if (colorblindMode === "tritanopia") return "url(#tritanopia-filter)";
    if (colorblindMode === "monochrome") return "url(#monochrome-filter)";
    return undefined;
  };

  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [zoomingCardId, setZoomingCardId] = useState<string | null>(null);
  const [zoomCoordinates, setZoomCoordinates] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [introActive, setIntroActive] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLiveTalkOpen, setIsLiveTalkOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [audioArmed, setAudioArmed] = useState(false);

  // Set up audio arming on any click or interaction
  useEffect(() => {
    const armAudioHandler = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
          setAudioArmed(true);
          console.log("[UDO Audio] Armed audio context via user interaction.");
        }
      } catch (err) {
        console.warn("[UDO Audio] Failed to arm:", err);
      }
    };

    window.addEventListener("click", armAudioHandler, { once: true });
    window.addEventListener("keydown", armAudioHandler, { once: true });

    return () => {
      window.removeEventListener("click", armAudioHandler);
      window.removeEventListener("keydown", armAudioHandler);
    };
  }, []);

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

  const handleIntroComplete = () => {
    setIntroActive(false);
    if (audioArmed) {
      playInnovationChime();
    } else {
      const playOnFirstInteraction = () => {
        playInnovationChime();
        window.removeEventListener("click", playOnFirstInteraction);
      };
      window.addEventListener("click", playOnFirstInteraction);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // High-fidelity Interactive Patient File Upload state
  const [uploadState, setUploadState] = useState<"idle" | "reading" | "decrypting" | "analyzing" | "completed">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const triggerUploadSequence = (fileName: string) => {
    setSelectedFileName(fileName);
    setUploadState("reading");
    
    setTimeout(() => {
      setUploadState("decrypting");
      setTimeout(() => {
        setUploadState("analyzing");
        setTimeout(() => {
          setUploadState("completed");
          setTimeout(() => {
            // Set active patient to a customized mock case based on the file name and proceed to the 6-Phase-Workflow
            setActivePatient({
              id: "pat-uploaded",
              name: "Thomas Muller",
              avatarSeed: "thomas",
              caseId: "BG-2026-9901-A",
              status: "Entwurf",
              isQESSigned: false,
              extractedData: {
                demographics: {
                  firstName: "Thomas",
                  lastName: "Muller",
                  birthDate: "14.11.1982",
                  insuranceNumber: "X120938475",
                  caseId: "BG-2026-9901-A",
                  insuranceProvider: "Techniker Krankenkasse (TK)",
                  commissioningEntity: "Association for Wood and Metal (BGHM)",
                },
                history: {
                  anamnesis: `Document: "${fileName}". The 43-year-old patient Thomas Muller presented with persistent left lumboischialgia following an occupational accident on 12.03.2025. While lifting a heavy crate, he experienced a sudden, shooting pain in the lumbar region radiating into his left leg (L5 dermatome).`,
                  complaints: "Moderate to severe load-dependent pain in the lower back with numbness in the dorsum of the left foot. Walking distance limited to approximately 500 meters.",
                },
                clinicalFindings: [
                  "Restricted range of motion in the lumbar spine (Schober's sign 10/12 cm)",
                  "Positive left-sided Lasègue's sign at 45 degrees",
                  "Sensory deficit (hypesthesia) in the left L5 dermatome",
                  "Achilles tendon reflex bilaterally active; patellar reflex normal"
                ],
                imagingFindings: [
                  "Lumbar Spine MRI dated 28.03.2025: Significant mediolateral disc herniation in the left L4/L5 segment with consecutive compression of the left L5 nerve root.",
                  "Lumbar Spine X-Ray dated 12.03.2025: Mild osteochondrosis and facet joint arthrosis at L4-S1, no spondylolisthesis."
                ],
                labValues: [
                  { parameter: "Leukocytes", value: "7.8 G/l", referenceRange: "4.0 - 10.0", status: "normal" },
                  { parameter: "CRP", value: "3.2 mg/l", referenceRange: "< 5.0", status: "normal" },
                  { parameter: "Creatinine", value: "0.9 mg/dl", referenceRange: "0.7 - 1.2", status: "normal" }
                ],
                timeline: [
                  { date: "12.03.2025", event: "Occupational accident (lifting trauma) with acute lumbar spine syndrome", source: "D-Physician Initial Report" },
                  { date: "15.03.2025", event: "Initiation of conservative physiotherapy", source: "Prescription" },
                  { date: "28.03.2025", event: "Lumbar MRI confirms left L4/L5 disc herniation", source: "Radiology Center Cologne-North" },
                  { date: "11.07.2026", event: "Expert medical examination conducted by U.D.O.", source: "U.D.O. Verification Hub" }
                ]
              },
              consensusRounds: [
                {
                  id: "cr-1",
                  findingName: "Confirmed left L4/L5 disc herniation",
                  description: "Is there an objective structural disc herniation in the specified segment?",
                  votes: {
                    "Gemini 3.5": "KEEP",
                    "DeepSeek R1": "KEEP",
                    "GPT-4o": "KEEP"
                  },
                  finalDecision: "KEEP",
                  qaAnnotation: "Finding is unequivocally confirmed by the radiological MRI imaging dated 28.03.2025."
                }
              ]
            });
            setActiveView("workflow");
            setUploadState("idle");
            setSelectedFileName(null);
            setIsUploadOpen(false);
          }, 1000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerUploadSequence(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerUploadSequence(e.target.files[0].name);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomCoordinates({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
    setZoomingCardId(id);
    
    setTimeout(() => {
      setActiveFunctionId(id);
      setZoomingCardId(null);
      setZoomCoordinates(null);
    }, 600);
  };

  if (introActive) {
    return <IntroPresentation onComplete={handleIntroComplete} />;
  }

  return (

    <div 
      className="relative min-h-screen bg-transparent text-slate-100 overflow-hidden font-sans flex flex-col"
      style={{ filter: getColorblindFilterStyle() }}
    >
      
      {/* DYNAMIC MOUSE GLOW TRAILING AURA */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 80%)`
        }}
      />
      
      {/* 3D PARTICLE STARFIELD & INTERACTIVE CARDS GALAXY */}
      <ParticleSphereBackground 
        activeView={activeView}
        setActiveView={setActiveView}
        setActiveFunctionId={setActiveFunctionId}
      />

      {/* TOP HEADER IS HIDDEN TO MAXIMIZE VISUAL SPACE */}

      {/* =========================================================================
         4 CORNERS CONTROL DOCK & FLOATING NAVIGATION SYSTEM
         ========================================================================= */}
      {!activeView && !activeFunctionId && (
        <>
          {/* LEFT RAIL: PRACTICE MANAGEMENT, SYSTEMS & ACTIONS (Spaced Vertically across full screen) */}
          <div className="fixed left-6 top-6 bottom-6 z-40 flex flex-col justify-between items-start pointer-events-none">
            {/* Practice Upgrades */}
            <button
              onClick={() => setActiveView("upgrades")}
              className="h-12 w-12 hover:w-56 group relative flex items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pl-[15px] pointer-events-auto"
              title={language === "en" ? "Practice Upgrades" : "Praxis-Upgrades"}
            >
              <Sparkles size={16} className="text-teal-400 shrink-0" />
              <span className="ml-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "Practice Upgrades" : "Praxis-Upgrades"}
              </span>
            </button>

            {/* KPI Analytics */}
            <button
              onClick={() => setActiveView("analytics")}
              className="h-12 w-12 hover:w-56 group relative flex items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pl-[15px] pointer-events-auto"
              title={language === "en" ? "KPI Analytics" : "Kennzahlen & ROI"}
            >
              <LineChart size={16} className="text-teal-400 shrink-0" />
              <span className="ml-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "KPI Analytics" : "Kennzahlen & ROI"}
              </span>
            </button>

            {/* System Actions Hub */}
            <div className="relative pointer-events-auto">
              <button
                onClick={() => setIsMasterMenuOpen(!isMasterMenuOpen)}
                className={`h-12 w-12 hover:w-56 group relative flex items-center justify-start rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl cursor-pointer overflow-hidden pl-[15px] ${
                  isMasterMenuOpen 
                    ? "bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.25)]" 
                    : "bg-slate-900/80 hover:bg-slate-950 text-white border-white/10 hover:border-teal-500/40"
                }`}
                title={language === "en" ? "System Actions Hub" : "System-Aktionen"}
              >
                <Cpu size={16} className={`${isMasterMenuOpen ? "animate-spin text-slate-950" : "animate-pulse text-teal-400"} shrink-0`} />
                <span className="ml-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                  {language === "en" ? "System Actions" : "System-Aktionen"}
                </span>
              </button>

              {isMasterMenuOpen && (
                <div className="absolute bottom-16 left-0 w-80 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-[28px] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-50 animate-fade-in text-white space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-2">
                      <Grid size={14} />
                      System Controls
                    </span>
                    <button 
                      onClick={() => setIsMasterMenuOpen(false)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setRobotState("HAPPY");
                        setRobotBubble('"Here is the consensus vote: all 12 leading medical experts agree that the left L4/L5 herniation is causally linked to the patient\'s occupational incident."');
                        setIsMasterMenuOpen(false);
                      }}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/20 rounded-xl text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 font-bold"
                    >
                      <span>🧪 Consensus Vote</span>
                    </button>
                    <button
                      onClick={() => {
                        setRobotState("THINKING");
                        setRobotBubble('"Initiating S2k-Guideline Verification for segment L4/L5. All checks are fully aligned."');
                        setTimeout(() => setRobotState("WAVING"), 1800);
                        setIsMasterMenuOpen(false);
                      }}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/20 rounded-xl text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 font-bold"
                    >
                      <span>📜 Guideline Check</span>
                    </button>
                    <button
                      onClick={() => {
                        setRobotState("HAPPY");
                        setRobotBubble('"Qualified Electronic Signature (QES) has been successfully generated and securely transmitted to the insurer."');
                        setIsMasterMenuOpen(false);
                      }}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/20 rounded-xl text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 font-bold"
                    >
                      <span>🔑 Sign with QES</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRobotClick();
                        setIsMasterMenuOpen(false);
                      }}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/20 rounded-xl text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2.5 font-bold"
                    >
                      <span>💬 Assistant Dialogue</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT RAIL: DIAGNOSTICS, TRANSLATION & LIVE DIALOGUE (Spaced Vertically across full screen) */}
          <div className="fixed right-6 top-6 bottom-6 z-40 flex flex-col justify-between items-end pointer-events-none">
            {/* Elegant Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === "en" ? "de" : "en")}
              className="h-12 w-12 hover:w-36 group relative flex flex-row-reverse items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pr-[14px] pointer-events-auto"
              title={language === "en" ? "Auf Deutsch umstellen" : "Switch to English"}
            >
              <span className="text-teal-400 font-mono font-black text-xs shrink-0 w-5 text-center">
                {language === "en" ? "EN" : "DE"}
              </span>
              <span className="mr-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "Deutsch 🇩🇪" : "English 🇺🇸"}
              </span>
            </button>

            {/* 6-Phase Workflow */}
            <button
              onClick={() => setActiveView("workflow")}
              className="h-12 w-12 hover:w-56 group relative flex flex-row-reverse items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pr-[15px] pointer-events-auto"
              title={language === "en" ? "6-Phase Workflow" : "6-Phasen-Workflow"}
            >
              <Activity size={16} className="text-teal-400 shrink-0" />
              <span className="mr-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "6-Phase Workflow" : "6-Phasen-Workflow"}
              </span>
            </button>

            {/* Next AIs */}
            <button
              onClick={() => setActiveView("chat")}
              className="h-12 w-12 hover:w-56 group relative flex flex-row-reverse items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pr-[15px] pointer-events-auto"
              title={language === "en" ? "Next AIs Consultation" : "Nächste KIs Konsilium"}
            >
              <Sparkles size={16} className="text-teal-400 shrink-0 animate-pulse" />
              <span className="mr-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "Next AIs Board" : "Nächste KIs"}
              </span>
            </button>

            {/* Upload Patient Data */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-12 w-12 hover:w-56 group relative flex flex-row-reverse items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pr-[15px] pointer-events-auto"
              title={language === "en" ? "Upload Patient Data" : "Patientendaten hochladen"}
            >
              <Upload size={16} className="text-teal-400 shrink-0 animate-bounce" />
              <span className="mr-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "Upload Data" : "Daten hochladen"}
              </span>
            </button>

            {/* Start Live Talk to UDO */}
            <button
              onClick={() => {
                setActiveView("chat");
                setTimeout(() => {
                  if (globalForceActiveListening) {
                    globalForceActiveListening();
                  }
                }, 400);
              }}
              className="h-12 w-12 hover:w-60 group relative flex flex-row-reverse items-center justify-start rounded-2xl bg-slate-900/80 hover:bg-slate-950 text-white hover:text-teal-400 border border-white/10 hover:border-teal-500/40 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden pr-[15px] pointer-events-auto animate-pulse"
              title={language === "en" ? "Start Live Talk to UDO" : "Live-Gespräch mit UDO"}
            >
              <Mic size={16} className="text-teal-400 shrink-0" />
              <span className="mr-3 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {language === "en" ? "Live Talk to UDO" : "U.D.O. Live Talk"}
              </span>
            </button>
          </div>
        </>
      )}

      {/* =========================================================================
         APPLE-STYLE TRANSLUCENT POP-UP WINDOWS
         ========================================================================= */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 170 }}
              className="w-full max-w-2xl bg-slate-950/95 border border-white/15 rounded-[32px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] relative"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {/* Minimize/Close Button */}
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Minimize window"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Upload size={28} className={uploadState !== "idle" ? "animate-bounce" : ""} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-extrabold text-teal-400 uppercase tracking-widest block">
                    INGESTION & CAUSALITY ENGINE
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-wide mt-1">
                    Upload Patient Data
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-300 leading-relaxed mb-6">
                Drag and drop clinical letters, radiological MRI findings, or expert reports here. Our clinical guideline alignment engine will extract relevant variables instantly.
              </p>

              {/* Drag Zone */}
              <div className="mb-6">
                {uploadState === "idle" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="border-2 border-dashed border-white/10 hover:border-teal-500/40 bg-white/5 hover:bg-white/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 text-center group min-h-[140px]">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <Upload size={24} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                      <span className="text-sm text-slate-200 font-bold group-hover:text-white transition-colors">
                        Drop report here
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                        PDF, Word, TXT, Images
                      </span>
                    </label>
                    
                    <button
                      onClick={() => {
                        triggerUploadSequence("thomas_muller_accident_report.pdf");
                      }}
                      className="p-6 rounded-2xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black tracking-wider text-sm transition-all duration-300 uppercase cursor-pointer flex flex-col items-center justify-center gap-3 shadow-lg shadow-teal-500/10 min-h-[140px]"
                    >
                      <Activity size={24} />
                      <span>Ingest Sample Case</span>
                      <span className="text-[10px] font-mono opacity-80 font-bold">Thomas Müller (Accident Report)</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#030712]/95 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <Loader2 className="text-teal-400 animate-spin" size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white uppercase tracking-wider truncate">Processing Patient Dossier...</p>
                        <p className="text-xs font-mono text-slate-400 truncate mt-0.5">{selectedFileName}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className={uploadState === "reading" ? "text-teal-400 animate-pulse font-bold" : "text-slate-400"}>
                          1. HIPAA/GDPR Compliance Verification
                        </span>
                        {uploadState !== "reading" ? <Check size={14} className="text-teal-400" /> : <Loader2 size={12} className="text-teal-400 animate-spin" />}
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className={uploadState === "decrypting" ? "text-teal-400 animate-pulse font-bold" : uploadState === "reading" ? "text-slate-600" : "text-slate-400"}>
                          2. Clinical Findings & ICD-10 Variable Extraction
                        </span>
                        {uploadState === "analyzing" || uploadState === "completed" ? (
                          <Check size={14} className="text-teal-400" />
                        ) : uploadState === "decrypting" ? (
                          <Loader2 size={12} className="text-teal-400 animate-spin" />
                        ) : (
                          <span className="text-slate-600 font-bold">WAITING</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-white/10 pt-4">
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="px-6 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold tracking-wider text-xs transition-all uppercase cursor-pointer border border-white/10"
                >
                  Minimize Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLiveTalkOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 170 }}
              className="w-full max-w-2xl bg-slate-950/95 border border-white/15 rounded-[32px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] relative"
            >
              {/* Minimize/Close Button */}
              <button
                onClick={() => setIsLiveTalkOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Minimize window"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Mic size={28} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-extrabold text-teal-400 uppercase tracking-widest block">
                    EXPERT LIVE DIALOGUE
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-wide mt-1">
                    Start Live Talk to U.D.O.
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-300 leading-relaxed mb-6">
                Initiate real-time, interactive voice and chat dialogues with U.D.O. using the responsive Nova Voice. Ask legal, forensic, clinical-guideline, or case correlation questions.
              </p>

              {/* Glowing wave indicator */}
              <div className="border border-white/10 bg-black/50 rounded-2xl p-6 flex flex-col items-center justify-center h-[140px] gap-4 mb-6">
                <div className="flex items-center gap-1.5 h-12 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                    <div
                      key={bar}
                      className="w-1 bg-teal-400 rounded-full"
                      style={{
                        height: `${Math.sin(bar * 0.5) * 60 + 80}%`,
                        animation: `bounce 1.${bar % 3}s ease-in-out infinite alternate`,
                        animationDelay: `${bar * 0.05}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono tracking-widest text-teal-400 uppercase font-bold animate-pulse">
                  Nova Voice Channel Ready
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                  S2k Guidelines Active
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsLiveTalkOpen(false)}
                    className="px-6 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold tracking-wider text-xs transition-all uppercase cursor-pointer border border-white/10"
                  >
                    Minimize
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsLiveTalkOpen(false);
                      setActiveView("chat");
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black tracking-wider text-xs transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <Mic size={14} />
                    <span>Start Voice Chat</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER: Hub Dashboard vs. Selected Active Portal Overlay */}
      <main className="flex-1 w-full relative z-20 flex flex-col pt-16 pointer-events-none">
        {activeFunctionId ? (
          /* =========================================================================
             DEDICATED SELF-CONTAINED INTERACTIVE FUNCTION PAGE
             ========================================================================= */
          <div className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-6 bg-slate-950/90 backdrop-blur-2xl rounded-[32px] border border-slate-800 text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)] mt-8 mb-8 pointer-events-auto">
            <FunctionDetailPage cardId={activeFunctionId} onBack={() => setActiveFunctionId(null)} />
          </div>
        ) : !activeView ? (
          /* =========================================================================
             1. CENTRAL HUB DASHBOARD (Unobstructed view of rotating card galaxy)
             - Maximized negative space for elegant Apple aesthetics
             ========================================================================= */
          <div className="flex-1 flex flex-col items-center justify-center p-6 w-full relative pointer-events-none">
            {/* Interactive 3D Sphere landing hero page hidden/loaded silently */}
            <div className="w-full opacity-0 h-0 select-none pointer-events-none overflow-hidden">
              <SplineSceneBasic />
            </div>
          </div>
        ) : (
          /* =========================================================================
             2. ACTIVE MODULE CONTAINER (100% Maximized Apple-Style Translucent Window)
             ========================================================================= */
          <div className="flex-1 flex flex-col p-4 lg:p-8 h-[calc(100vh-100px)] overflow-hidden pointer-events-none w-full max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 35, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.85, y: 35, filter: "blur(15px)" }}
              transition={{ type: "spring", stiffness: 100, damping: 16, mass: 1.15 }}
              className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden pointer-events-auto"
            >
              {/* Glassmorphic Active Portal Wrapper */}
              <div className="flex-1 bg-slate-900/90 border border-white/10 rounded-[28px] shadow-[0_30px_100px_rgba(0,0,0,0.85)] p-6 lg:p-8 relative flex flex-col min-w-0 h-full overflow-hidden backdrop-blur-2xl">
                
                {/* Module Header Bar */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                      {activeView === "workflow" && <Activity size={20} />}
                      {activeView === "chat" && <MessageSquare size={20} />}
                      {activeView === "upgrades" && <Sparkles size={20} />}
                      {activeView === "analytics" && <LineChart size={20} />}
                      {activeView === "whitepaper" && <BookOpen size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-2xl font-black text-white tracking-tight leading-none uppercase">
                        {activeView === "workflow" && "6-Phase Workflow"}
                        {activeView === "chat" && "U.D.O. Clinical Intelligence"}
                        {activeView === "upgrades" && "Practice Upgrades"}
                        {activeView === "analytics" && "Analytics & ROI Board"}
                        {activeView === "whitepaper" && "Technical & Clinical Whitepaper"}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                        {activeView === "workflow" && "EVIDENCE-BASED GUIDELINE VERIFICATION"}
                        {activeView === "chat" && "EXPERT VOICE & CONSENSUS ENGINE (NOVA)"}
                        {activeView === "upgrades" && "PRESCRIPTIONS, APPOINTMENTS & BOARD"}
                        {activeView === "analytics" && "ROBUST CLINICAL ROI DASHBOARD"}
                        {activeView === "whitepaper" && "S2K FORENSIC CRITERIA & AGENT SCHEMAS"}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Language Switcher in Portal */}
                    <button
                      onClick={() => setLanguage(language === "en" ? "de" : "en")}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-teal-400 border border-white/10 transition-all cursor-pointer flex items-center gap-2 font-bold shadow-md"
                      title={language === "en" ? "Auf Deutsch umstellen" : "Switch to English"}
                    >
                      <span className="text-teal-400 font-mono text-[10px] font-black uppercase tracking-wider">
                        {language === "en" ? "EN" : "DE"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider hidden md:inline">
                        {language === "en" ? "🇩🇪 DE" : "🇺🇸 EN"}
                      </span>
                    </button>

                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-teal-400 border border-white/10 transition-all cursor-pointer flex items-center gap-2 font-bold shadow-md"
                      title={isMaximized ? "Split screen view" : "Maximize view"}
                    >
                      {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                      <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">
                        {isMaximized ? "Restore Split" : "Maximize (Full)"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView(null);
                        setIsMaximized(false);
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-rose-400 border border-white/10 transition-all cursor-pointer flex items-center gap-2 font-bold shadow-md"
                      title="Close view and return to main orbit"
                    >
                      <X size={15} />
                      <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">Close Panel</span>
                    </button>
                  </div>
                </div>

                {/* Active Component Wrapper with custom scroll */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {activeView === "workflow" && (
                    <PhaseWorkflow 
                      onRobotStateChange={handleRobotStateChange}
                      activePatient={activePatient}
                      setActivePatient={setActivePatient}
                    />
                  )}

                  {activeView === "chat" && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <CologneChatbot 
                        onRobotStateChange={handleRobotStateChange}
                        onDrBubbleTrigger={(text) => setRobotBubble(text)}
                      />
                      <GutachtenPanel 
                        onRobotStateChange={handleRobotStateChange}
                      />
                    </div>
                  )}

                  {activeView === "upgrades" && (
                    <PracticeUpgrades />
                  )}

                  {activeView === "analytics" && (
                    <ExecutiveDashboard />
                  )}

                  {activeView === "whitepaper" && (
                    <SystemWhitepaper />
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </main>


      {/* Zoom Animation Overlay for Function Pages */}
      <AnimatePresence>
        {zoomingCardId && zoomCoordinates && (
          <motion.div
            initial={{
              position: "fixed",
              left: zoomCoordinates.x,
              top: zoomCoordinates.y,
              width: zoomCoordinates.width,
              height: zoomCoordinates.height,
              borderRadius: "24px",
              zIndex: 9999,
            }}
            animate={{
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              borderRadius: "0px",
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 flex items-center justify-center overflow-hidden z-[9999]"
          >
            <motion.img
              layoutId={`img-${zoomingCardId}`}
              src={FUNCTIONS_CARDS.find(m => m.id === zoomingCardId)?.imageUrl}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.15, filter: "brightness(0.65)" }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute bottom-20 left-8 md:left-16 text-white max-w-2xl text-left pointer-events-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-teal-500/35 border border-teal-500/55 text-teal-250 font-bold px-3 py-1 rounded-full animate-pulse">
                  {FUNCTIONS_CARDS.find(m => m.id === zoomingCardId)?.numberLabel}
                </span>
                <span className="text-xs font-mono tracking-widest text-slate-300 uppercase font-bold">SYSTEM LÄDT...</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 uppercase">
                {FUNCTIONS_CARDS.find(m => m.id === zoomingCardId)?.title}
              </h1>
              <p className="text-sm md:text-md text-slate-300 font-mono tracking-wider font-semibold opacity-90 uppercase">
                {FUNCTIONS_CARDS.find(m => m.id === zoomingCardId)?.category}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AccessibilityWidget />

    </div>
  );
}
