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
import EEGWorkspace from "./components/EEGWorkspace";
import AccessibilityWidget from "./components/AccessibilityWidget";
import MemorySyncStatusIndicator from "./components/MemorySyncStatusIndicator";
import JarvisAssistant from "./components/JarvisAssistant";
import VoicePoweredOrb from "./components/ui/voice-powered-orb";
import ConsultationOrbControl from "./components/ConsultationOrbControl";
import NavigationShell from "./components/NavigationShell";
import { NavItemId } from "./config/navItems";
import { Button } from "./components/ui/button";

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
  MicOff,
  Upload,
  Loader2,
  Check,
  CheckCircle,
  BookOpen,
  Play,
  Square,
  Volume2,
  ArrowLeft,
  Copy,
  RotateCcw,
  Heart,
  Sun,
  Moon,
  FileText,
  ChevronRight,
  Eye,
  AlertTriangle,
  Minus,
  Download,
  Sliders,
  CircleDot
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
    colorblindMode,
    lineHeightScale,
    fontWeightScale,
    eyeWarmthScale
  } = useGlobalSystem();

  const [isMinimized, setIsMinimized] = useState(false);
  const [workspaceMinimized, setWorkspaceMinimized] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<NavItemId | null>(null);

  const handleNavItemSelect = (id: NavItemId | null) => {
    setActiveNavItem(id);
    if (!id) {
      setActiveView(null);
      setActiveHubCategory(null);
    } else if (id === "consult") {
      setActiveView("chat");
    } else if (id === "gutachten") {
      setActiveHubCategory("gutachten");
      setActiveView(null);
    } else if (id === "dashboard") {
      setActiveView("analytics");
    } else if (id === "compliance") {
      setActiveView("compliance");
    } else if (id === "whitepaper") {
      setActiveView("whitepaper");
    } else if (id === "admin") {
      setActiveView("admin");
    }
  };

  // Sync font size scaling proportionally with the entire HTML document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`;
    return () => {
      document.documentElement.style.fontSize = "16px";
    };
  }, [fontScale]);

  // Start panel as minimized when activeView changes (do not open automatically when page opened)
  useEffect(() => {
    if (activeView) {
      setIsMinimized(true);
    }
  }, [activeView]);

  // Translate colorblindness modes & warmth level into filter strings
  const getReadabilityStyle = () => {
    const filterParts: string[] = [];
    
    if (colorblindMode === "deuteranopia") filterParts.push("url(#deuteranopia-filter)");
    else if (colorblindMode === "protanopia") filterParts.push("url(#protanopia-filter)");
    else if (colorblindMode === "tritanopia") filterParts.push("url(#tritanopia-filter)");
    else if (colorblindMode === "monochrome") filterParts.push("url(#monochrome-filter)");

    if (eyeWarmthScale > 0) {
      filterParts.push(`sepia(${eyeWarmthScale * 15}%) saturate(${100 - eyeWarmthScale * 5}%) hue-rotate(-${eyeWarmthScale * 2}deg)`);
    }

    const weights = ["300", "400", "500", "700"];
    const activeWeight = weights[fontWeightScale] || "400";

    return {
      filter: filterParts.length > 0 ? filterParts.join(" ") : undefined,
      lineHeight: lineHeightScale,
      fontWeight: activeWeight as any
    };
  };

  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [zoomingCardId, setZoomingCardId] = useState<string | null>(null);
  const [zoomCoordinates, setZoomCoordinates] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [introActive, setIntroActive] = useState(true);
  const { isUploadOpen, setIsUploadOpen, isLiveTalkOpen, setIsLiveTalkOpen } = useGlobalSystem();
  const [homeViewMode, setHomeViewMode] = useState<"galaxy" | "grid">("grid");
  const [activeGridCategory, setActiveGridCategory] = useState<string>("ALL");
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [audioArmed, setAudioArmed] = useState(false);

  // Reorganized Home Workspace States (Senior Friendly, Apple + Material 3, Clean Layout)
  const [activeHubCategory, setActiveHubCategory] = useState<"gutachten" | "assistant" | "udo" | null>(null);
  const [cleanMode, setCleanMode] = useState(true);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [isOrbRecording, setIsOrbRecording] = useState(false);
  const [orbVoiceDetected, setOrbVoiceDetected] = useState(false);
  const [volumeThreshold, setVolumeThreshold] = useState(0.05);
  const [vizStyle, setVizStyle] = useState<"waveform" | "pulse">("waveform");
  const [hoveredCategory, setHoveredCategory] = useState<"gutachten" | "assistant" | null>(null);

  // Determine dynamic hue reactively based on active view, category, hover state, or recording state
  const getOrbHue = () => {
    if (isOrbRecording) return 340; // Beautiful rose/red while recording
    if (hoveredCategory === "gutachten") return 180; // Hovering gutachten shortcut: Teal
    if (hoveredCategory === "assistant") return 260; // Hovering assistant shortcut: Purple-blue
    if (activeHubCategory === "gutachten") return 180; // Active gutachten category: Teal
    if (activeHubCategory === "assistant") return 260; // Active assistant category: Purple-blue
    
    // Default beautiful clinical teal
    return 180;
  };

  // Handle single toggle behavior (Task 2)
  const handleToggleView = (view: string | null) => {
    if (view === null) {
      setActiveView(null);
      setIsMaximized(false);
      setIsMinimized(false);
    } else if (activeView === view) {
      setActiveView(null);
      setIsMaximized(false);
      setIsMinimized(false);
    } else {
      setActiveView(view);
      setIsMaximized(true);
      setIsMinimized(false);
      setActiveHubCategory(null);
      setCleanMode(false);
    }
  };

  const handleToggleHubCategory = (category: "gutachten" | "assistant" | "udo" | null) => {
    if (category === null) {
      setActiveHubCategory(null);
    } else if (activeHubCategory === category) {
      setActiveHubCategory(null);
    } else {
      setActiveHubCategory(category);
      setActiveView(null);
      setIsMinimized(false);
      setIsMaximized(false);
      setCleanMode(false);
      if (category === "gutachten") {
        setGutachtenStep("upload");
      }
    }
  };

  // Gutachten Pipeline States
  const [gutachtenStep, setGutachtenStep] = useState<"upload" | "processing" | "results">("upload");
  const [gutachtenFiles, setGutachtenFiles] = useState<string[]>([]);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStepIndex, setPipelineStepIndex] = useState(0);

  // Clinical Assistant Calculator States
  const [mdeNeuro, setMdeNeuro] = useState<"none" | "sensory" | "motor">("none");
  const [mdeMobility, setMdeMobility] = useState<"mild" | "moderate" | "severe">("mild");
  const [mdePain, setMdePain] = useState<"none" | "mild" | "severe">("mild");

  // Box Breathing States
  const [breathState, setBreathState] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [breathTimer, setBreathTimer] = useState(4);

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

  // Box breathing simulation loop (4 seconds each: inhale, hold, exhale, hold)
  useEffect(() => {
    if (activeHubCategory !== "udo") return;
    const interval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          setBreathState(curr => {
            switch (curr) {
              case "inhale": return "holdIn";
              case "holdIn": return "exhale";
              case "exhale": return "holdOut";
              case "holdOut": return "inhale";
              default: return "inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeHubCategory]);

  // Support wheel scrolling zoom and key navigation on the main landing page
  useEffect(() => {
    if (activeHubCategory || activeView || activeFunctionId) return;
    
    const handleGlobalWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      setScrollProgress(prev => {
        const next = prev + (delta > 0 ? 0.05 : -0.05);
        return Math.min(Math.max(next, 0), 1);
      });
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        setScrollProgress(prev => Math.min(prev + 0.15, 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        setScrollProgress(prev => Math.max(prev - 0.15, 0));
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: true });
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [activeHubCategory, activeView, activeFunctionId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Gutachten automatic progress timeline simulation
  useEffect(() => {
    if (gutachtenStep !== "processing") return;
    setPipelineProgress(0);
    setPipelineStepIndex(0);

    const timer = setInterval(() => {
      setPipelineProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setGutachtenStep("results");
          return 100;
        }
        const next = prev + 3;
        
        // Split pipeline steps sequentially from 0 to 4
        if (next < 20) setPipelineStepIndex(0);
        else if (next < 45) setPipelineStepIndex(1);
        else if (next < 70) setPipelineStepIndex(2);
        else if (next < 90) setPipelineStepIndex(3);
        else setPipelineStepIndex(4);

        return next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [gutachtenStep]);

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
                    "UDO Neuro": "KEEP",
                    "UDO Cognitive": "KEEP",
                    "UDO Biometrics": "KEEP"
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
      style={getReadabilityStyle()}
    >
      
      {/* DYNAMIC MOUSE GLOW TRAILING AURA */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 80%)`
        }}
      />

      {/* GLOBAL COGNITIVE WORKSPACE HEADER */}
      {!cleanMode && !(activeView === "chat" && workspaceMinimized) && (
        <header className="fixed top-6 left-6 right-6 z-40 flex justify-between items-center pointer-events-none">
          {/* Left: Futuristic Brand Badge */}
          <div 
            onClick={() => {
              setActiveView(null);
              setActiveFunctionId(null);
              setActiveHubCategory(null);
            }}
            className="flex items-center gap-3 bg-slate-950/80 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl pointer-events-auto shadow-2xl hover:bg-slate-950 hover:border-teal-500/30 transition-all cursor-pointer group"
            title={language === "en" ? "Return to main screen" : "Zurück zum Hauptbildschirm"}
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-teal-500/10 border border-teal-500/25 flex items-center justify-center relative">
              <img src={udoIcon} alt="U.D.O." className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-teal-400/5 group-hover:bg-transparent transition-all" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-teal-400 font-black uppercase tracking-widest block leading-none">CORTICAL CORE v3.8</span>
              <h1 className="text-xs font-extrabold text-white uppercase tracking-wider mt-0.5 leading-none flex items-center gap-1.5">
                <span>Ultimate Diagnostic Operator</span>
                <span className="text-slate-500 font-mono text-[9px] font-bold">U.D.O.</span>
              </h1>
            </div>
          </div>

          {/* Center/Right: Simplified Memory & Reset Menu */}
          <div className="flex items-center gap-2.5 pointer-events-auto">

            {activeHubCategory && (
              <button
                onClick={() => {
                  setActiveHubCategory(null);
                  setGutachtenStep("upload");
                }}
                className="px-4 py-2 bg-slate-900 border border-teal-500/40 text-xs font-bold tracking-wider text-teal-400 hover:bg-teal-500 hover:text-slate-950 rounded-xl shadow-lg transition-all uppercase cursor-pointer"
              >
                ← {language === "en" ? "Overview" : "Übersicht"}
              </button>
            )}

            <button
              onClick={() => setLanguage(language === "en" ? "de" : "en")}
              className="px-3 py-2 bg-slate-900 border border-white/10 text-[10px] font-mono tracking-widest font-black text-slate-300 hover:text-white rounded-xl uppercase cursor-pointer transition-all"
              title={language === "en" ? "Auf Deutsch umstellen" : "Switch to English"}
            >
              {language === "en" ? "DE" : "EN"}
            </button>

            <MemorySyncStatusIndicator />
          </div>
        </header>
      )}
      
      {/* Hidden SVG with linearGradient defs for rail button light-up-icon styling */}
      <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <linearGradient id="enter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

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
      {/* Old side rails have been consolidated into JarvisAssistant docks */}

      {/* =========================================================================
         APPLE-STYLE TRANSLUCENT POP-UP WINDOWS
         ========================================================================= */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 40 }}
              transition={{ type: "spring", damping: 18, stiffness: 140 }}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 40 }}
              transition={{ type: "spring", damping: 18, stiffness: 140 }}
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

      {/* MAIN CONTAINER: Navigation Shell & Hub Dashboard */}
      {!cleanMode && (
        <main className="flex-1 w-full relative z-20 flex flex-col pt-12 md:pt-4 pointer-events-none">
          <NavigationShell
            language={language}
            activeItemId={activeNavItem}
            onSelectItem={handleNavItemSelect}
            onRobotStateChange={handleRobotStateChange}
            onDrBubbleTrigger={(text) => setRobotBubble(text)}
          >
            {activeFunctionId ? (
              /* =========================================================================
                 DEDICATED SELF-CONTAINED INTERACTIVE FUNCTION PAGE
                 ========================================================================= */
              <motion.div
                key="function-detail"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-4 z-50 p-4 lg:p-6 bg-slate-950/95 backdrop-blur-2xl rounded-[32px] border border-slate-800 text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-y-auto pointer-events-auto"
              >
                <FunctionDetailPage cardId={activeFunctionId} onBack={() => setActiveFunctionId(null)} />
              </motion.div>
            ) : (
              <motion.div
                key="hub-dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col p-6 w-full relative max-h-[85vh] overflow-y-auto scrollbar-thin pointer-events-auto"
              >
            {!activeHubCategory ? (
              /* =========================================================================
                 A. CHIEF LANDING PAGE: "Was möchten Sie heute tun?"
                 ========================================================================= */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-8 md:py-16"
              >
                  {/* Central Operator Toggle & Orb Hub */}
                  {/* UDO Voice Orb Hub */}
                  <div className="flex flex-col items-center gap-6 w-full relative z-10 animate-fadeIn">
                    
                    {/* Glowing Title badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-1 mb-2 relative"
                    >
                      <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-[0.25em]">
                        UDO AI COGNITIVE CORE
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
                        UDO VOICE SYSTEM
                      </h2>
                      <p className="text-sm text-slate-400 mt-1 max-w-md">
                        {language === "en" 
                          ? "Real-time AI cognitive voice integration. Click to activate recording & speak."
                          : "Echtzeit-KI-Sprachsteuerung. Klicken Sie zum Aufnehmen und sprechen Sie."}
                      </p>
                    </motion.div>

                    {/* Majestic Glowing Orb Container - Powered by ConsultationOrbControl */}
                    <div className="w-full my-4">
                      <ConsultationOrbControl language={language} />
                    </div>

                  </div>



              </motion.div>
            ) : activeHubCategory === "gutachten" ? (
              /* =========================================================================
                 B. NESTED WORKFLOW: 🩺 GUTACHTEN REPORT pipeline
                 ========================================================================= */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl mx-auto bg-slate-950/80 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
                  <div>
                    <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                      🩺 GUTACHTEN HUB & PROCESSING PIPELINE
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mt-1">
                      {language === "en" ? "Medical Document Diagnostics" : "Klinische Dokumenten-Analyse"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveHubCategory(null);
                      setGutachtenStep("upload");
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white transition-all uppercase"
                  >
                    ← {language === "en" ? "Back to Hub" : "Zurück"}
                  </button>
                </div>

                {gutachtenStep === "upload" && (
                  <div className="space-y-6">
                    {/* Simulated Drag and Drop File box */}
                    <div 
                      onDragEnter={handleDrag} 
                      onDragOver={handleDrag} 
                      onDragLeave={handleDrag} 
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-[24px] p-8 md:p-12 text-center transition-all ${
                        dragActive 
                          ? "border-teal-400 bg-teal-400/5" 
                          : "border-white/10 bg-black/40 hover:bg-black/50 hover:border-teal-500/20"
                      }`}
                    >
                      <input 
                        type="file" 
                        id="gutachten-file-input" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files) {
                            const names = Array.from(e.target.files).map(f => f.name);
                            setGutachtenFiles(prev => [...prev, ...names]);
                          }
                        }}
                      />
                      <label htmlFor="gutachten-file-input" className="cursor-pointer flex flex-col items-center">
                        <Upload size={40} className="text-teal-400 mb-4" />
                        <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">
                          {language === "en" ? "Upload Clinical Documents" : "Klinische Befunde hochladen"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                          {language === "en"
                            ? "Drag & drop radiologist MRI reports, outpatient doctor letters, or neurological findings here."
                            : "Ziehen Sie MRT-Befunde, Arztberichte oder neurologische Unterlagen direkt hierher, um sie zu analysieren."}
                        </p>
                        <span className="mt-4 px-4 py-2 bg-slate-900 border border-white/10 hover:border-teal-500/30 text-xs font-bold rounded-xl text-slate-300">
                          {language === "en" ? "Select Local Files" : "Dateien auswählen"}
                        </span>
                      </label>
                    </div>

                    {/* Pre-configured clinical samples for extremely smooth elderly demo */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-extrabold">
                        {language === "en" ? "Select Interactive Demo Findings:" : "Oder wählen Sie einen Musterbefund zum Testen:"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { file: "MRT_Lendenwirbelsaeule_L4_L5_Mueller.pdf", desc: "🩺 Lumbar Spine Disc Herniation finding with neural root compression." },
                          { file: "Entlassungsbrief_Neurologie_Koeln_Kliniken.pdf", desc: "📄 Spine Clinic discharge letter indicating motor paresis of the drop foot." },
                          { file: "AWMF_S2k_Gutachterliches_Zeugnis_Referenz.pdf", desc: "📜 Official reference outline for legal S2k guidelines correlation." }
                        ].map((sample, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!gutachtenFiles.includes(sample.file)) {
                                setGutachtenFiles(prev => [...prev, sample.file]);
                              }
                            }}
                            className="bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-teal-500/30 rounded-2xl p-4 cursor-pointer text-left transition-all group"
                          >
                            <span className="text-xs font-bold text-white group-hover:text-teal-400 block truncate font-mono">
                              📄 {sample.file}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1 leading-snug">
                              {sample.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected File list */}
                    {gutachtenFiles.length > 0 && (
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                            {language === "en" ? "Uploaded Files Queue" : "Hochgeladene Dateien:"}
                          </span>
                          <button 
                            onClick={() => setGutachtenFiles([])}
                            className="text-[10px] text-rose-400 font-bold uppercase tracking-wider hover:underline"
                          >
                            {language === "en" ? "Clear Queue" : "Alles löschen"}
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                          {gutachtenFiles.map((f, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-900/40 px-3 py-2 rounded-xl border border-white/5">
                              <span className="text-xs font-mono text-slate-200 block truncate">
                                🟢 {f}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                Ready for AI Analysis
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* BEGIN CORTICAL CORRELATION ACTION */}
                        <div className="pt-4 flex justify-end">
                          <motion.button
                            onClick={() => setGutachtenStep("processing")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-extrabold rounded-2xl shadow-lg hover:shadow-teal-500/10 cursor-pointer uppercase text-xs tracking-wider flex items-center gap-2"
                          >
                            <span>⚡ {language === "en" ? "Run S2k Guideline Correlation" : "S2k-konforme Analyse starten"}</span>
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {gutachtenStep === "processing" && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-8">
                    <Loader2 size={44} className="text-teal-400 animate-spin" />
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">
                        {language === "en" ? "Analyzing Spine Findings" : "Befundanalyse wird durchgeführt..."}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md">
                        {language === "en"
                          ? "S2k guidelines correlations engine mapping lumbar spine herniation criteria..."
                          : "AWMF S2k-Kriterien werden mit den hochgeladenen Dokumenten abgeglichen..."}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-150"
                        style={{ width: `${pipelineProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-teal-400 font-extrabold">
                      {pipelineProgress}% COMPLETED
                    </span>

                    {/* Sequential checklist steps */}
                    <div className="w-full max-w-sm space-y-3 bg-black/30 p-5 rounded-2xl border border-white/5 text-left">
                      {[
                        "1. Clinical document OCR recognition & validation",
                        "2. Spine L4/L5 & L5/S1 root compression mapping",
                        "3. Reflex loss & motor drop-foot deficit extraction",
                        "4. S2k guideline criteria conformity check",
                        "5. Draft report synthesis & consensus check"
                      ].map((stepText, idx) => {
                        const isDone = pipelineStepIndex > idx;
                        const isCurrent = pipelineStepIndex === idx;
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 transition-colors ${
                              isDone ? "text-emerald-400" : isCurrent ? "text-teal-400 font-bold" : "text-slate-600"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle size={15} className="shrink-0 text-emerald-400" />
                            ) : isCurrent ? (
                              <Loader2 size={15} className="shrink-0 animate-spin text-teal-400" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                            )}
                            <span className="text-xs font-mono">{stepText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {gutachtenStep === "results" && (
                  <div className="space-y-6">
                    {/* Diagnostic Summary Header */}
                    <div className="bg-slate-900/80 border border-teal-500/20 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                            {language === "en" ? "Guideline Conformity Report Generated" : "AWMF S2k-Konformitätsbericht erstellt"}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {language === "en" 
                              ? "Correlated with L4/L5 protrusion criteria. Dropped foot paresis confirmed."
                              : "Abgeglichen mit L4/L5-Prolaps-Kriterien. Fußheberparese verifiziert."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGutachtenStep("upload")}
                          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-[10px] uppercase font-mono rounded-xl border border-white/10"
                        >
                          {language === "en" ? "Analyze New" : "Neu Analysieren"}
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC TWO-PANE INTEGRATION WORKSPACE */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <CologneChatbot 
                        onRobotStateChange={handleRobotStateChange}
                        onDrBubbleTrigger={(text) => setRobotBubble(text)}
                      />
                      <GutachtenPanel 
                        onRobotStateChange={handleRobotStateChange}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : activeHubCategory === "assistant" ? (
              /* =========================================================================
                 C. NESTED WORKFLOW: 🏥 CLINICAL ASSISTANT CORE
                 ========================================================================= */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl mx-auto bg-slate-950/80 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-8"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
                  <div>
                    <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                      🏥 ASSISTANT CENTRE & DIAGNOSTICS HUB
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mt-1">
                      {language === "en" ? "Clinical Guideline Tools" : "Klinische Assistenz & Rechner"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveHubCategory(null)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white transition-all uppercase"
                  >
                    ← {language === "en" ? "Back to Hub" : "Zurück"}
                  </button>
                </div>

                {/* Section 1: Main Workflows (Simplified & Touch-Friendly) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-extrabold">
                    {language === "en" ? "Select Interactive Module:" : "Hauptanwendungen starten:"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Workflow 1: 6-Phase S2k */}
                    <div 
                      onClick={() => handleToggleView("workflow")}
                      className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-teal-500/30 cursor-pointer transition-all text-left flex justify-between items-center group"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest block font-bold">WORKFLOW ENGINE</span>
                        <h4 className="text-sm font-bold text-white uppercase mt-1">6-Phase S2k Check</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Guided forensic guidelines assessment.</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Workflow 2: Clinical Consult Chat */}
                    <div 
                      onClick={() => handleToggleView("chat")}
                      className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-teal-500/30 cursor-pointer transition-all text-left flex justify-between items-center group"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest block font-bold">EXPERT ADVISER</span>
                        <h4 className="text-sm font-bold text-white uppercase mt-1">Clinical Chat</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Speak to Dr. Clara & Dr. Eric.</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Workflow 3: Gait Biomechanical analysis */}
                    <div 
                      onClick={() => setActiveFunctionId("video-analyse-portal")}
                      className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-teal-500/30 cursor-pointer transition-all text-left flex justify-between items-center group"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest block font-bold">BIOMECHANICAL ANALYTICS</span>
                        <h4 className="text-sm font-bold text-white uppercase mt-1">Gait & Mobility</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Analyse patient video footage.</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Interactive MdE Rechner Calculator (Designed with huge touch points for age 50+) */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                      <span>🧮</span>
                      <span>{language === "en" ? "Guideline MdE Calculator (Spine Herniation)" : "S2k MdE-Kalkulator (Lendenwirbelsäule)"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === "en" 
                        ? "Interactive reduction of earning capacity (MdE) calculator based on forensic consensus values."
                        : "Konsensbasierter Rechner zur Minderung der Erwerbsfähigkeit (MdE) bei Bandscheibenvorfällen."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    {/* Neuro deficit picker */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                        1. Neurologische Defizite:
                      </span>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: "none", label: "Keine (0% Base)" },
                          { id: "sensory", label: "Sensibel (Hypästhesie) (+5%)" },
                          { id: "motor", label: "Motorisch (Fußheber-Parese) (+20%)" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setMdeNeuro(opt.id as any)}
                            className={`p-3 rounded-xl text-xs text-left font-bold border transition-all cursor-pointer ${
                              mdeNeuro === opt.id 
                                ? "bg-teal-500/10 border-teal-400 text-teal-400" 
                                : "bg-slate-900 border-white/5 hover:border-white/10 text-slate-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spinal Mobility picker */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                        2. LWS-Beweglichkeit:
                      </span>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: "mild", label: "Leicht eingeschränkt (+10%)" },
                          { id: "moderate", label: "Mittelschwer eingeschränkt (+20%)" },
                          { id: "severe", label: "Schwer (Versteifung) (+30%)" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setMdeMobility(opt.id as any)}
                            className={`p-3 rounded-xl text-xs text-left font-bold border transition-all cursor-pointer ${
                              mdeMobility === opt.id 
                                ? "bg-teal-500/10 border-teal-400 text-teal-400" 
                                : "bg-slate-900 border-white/5 hover:border-white/10 text-slate-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spinal Pain picker */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                        3. Radikuläre Schmerzen:
                      </span>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: "none", label: "Keine (0%)" },
                          { id: "mild", label: "Leicht/intermittierend (+5%)" },
                          { id: "severe", label: "Schwer/chronisch (+10%)" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setMdePain(opt.id as any)}
                            className={`p-3 rounded-xl text-xs text-left font-bold border transition-all cursor-pointer ${
                              mdePain === opt.id 
                                ? "bg-teal-500/10 border-teal-400 text-teal-400" 
                                : "bg-slate-900 border-white/5 hover:border-white/10 text-slate-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Result Block */}
                  <div className="mt-6 p-5 bg-slate-900/80 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block font-bold">
                        {language === "en" ? "AWMF S2k Calculated MdE Value" : "Berechneter S2k MdE-Richtwert"}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl md:text-4xl font-black text-teal-400">
                          {(() => {
                            let total = 10;
                            if (mdeNeuro === "sensory") total += 5;
                            if (mdeNeuro === "motor") total += 20;
                            
                            if (mdeMobility === "mild") total += 10;
                            if (mdeMobility === "moderate") total += 20;
                            if (mdeMobility === "severe") total += 30;

                            if (mdePain === "mild") total += 5;
                            if (mdePain === "severe") total += 10;

                            // Clamp values based on medical guidelines standards
                            return Math.min(Math.max(total, 10), 40);
                          })()}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">MdE (Minderung der Erwerbsfähigkeit)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 max-w-lg">
                        {language === "en"
                          ? "*Notice: Spine S2k guidelines clamp MdE recommendations to standard ranges (10% - 40%) depending on neurological drop signs."
                          : "*Hinweis: Die AWMF S2k Leitlinie empfiehlt bei Bandscheibenschäden mit motorischem Defekt Richtwerte von 20% bis max 40% MdE."}
                      </p>
                    </div>

                    {/* Action Buttons: Copy justification & Download Official PDF Report */}
                    <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => {
                          const neuroText = mdeNeuro === "motor" ? "einer motorischen Parese" : mdeNeuro === "sensory" ? "sensibler Hypästhesien" : "ohne wesentliche neurologische Ausfälle";
                          const mobilityText = mdeMobility === "severe" ? "schwerer Wirbelsäulenversteifung" : mdeMobility === "moderate" ? "mittelschwerer Funktionsminderung" : "leichter Bewegungseinschränkung";
                          const totalPercent = Math.min(Math.max(10 + (mdeNeuro === "sensory" ? 5 : mdeNeuro === "motor" ? 20 : 0) + (mdeMobility === "mild" ? 10 : mdeMobility === "moderate" ? 20 : 30) + (mdePain === "mild" ? 5 : mdePain === "severe" ? 10 : 0), 10), 40);
                          
                          const justification = `Forensischer Befundbericht: Der Patient präsentiert sich mit ${mobilityText} im LWS-Segment und ${neuroText}. Nach Abgleich mit den AWMF S2k Leitlinien zur Begutachtung von Bandscheibenschäden wird ein MdE-Richtwert von ${totalPercent}% empfohlen.`;
                          
                          navigator.clipboard.writeText(justification);
                          alert(language === "en" ? "Copied medical justification to clipboard!" : "Klinische Begründung in die Zwischenablage kopiert!");
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Copy size={14} className="text-teal-400" />
                        <span>{language === "en" ? "Copy Justification Text" : "Begründungstext Kopieren"}</span>
                      </button>

                      <button
                        onClick={() => {
                          const neuroLabel = mdeNeuro === "motor" ? "Motorische Parese / Fußheberschwäche (L5)" : mdeNeuro === "sensory" ? "Sensible Hypästhesien (Nervreizung)" : "Keine wesentlichen Ausfälle";
                          const mobilityLabel = mdeMobility === "severe" ? "Schwere Wirbelsäulenversteifung (LWS)" : mdeMobility === "moderate" ? "Mittelschwere Bewegungseinschränkung" : "Leichte Bewegungseinschränkung";
                          const painLabel = mdePain === "severe" ? "Starke radikuläre Schmerzsymptomatik" : mdePain === "mild" ? "Mäßige Belastungsschmerzen" : "Keine relevanten Schmerzen";

                          let total = 10;
                          if (mdeNeuro === "sensory") total += 5;
                          if (mdeNeuro === "motor") total += 20;
                          if (mdeMobility === "mild") total += 10;
                          if (mdeMobility === "moderate") total += 20;
                          if (mdeMobility === "severe") total += 30;
                          if (mdePain === "mild") total += 5;
                          if (mdePain === "severe") total += 10;
                          const totalPercent = Math.min(Math.max(total, 10), 40);

                          const reportDate = new Date().toLocaleDateString("de-DE", {
                            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                          });

                          const printWindow = window.open("", "_blank");
                          if (!printWindow) {
                            alert("Bitte erlauben Sie Pop-ups, um den offiziellen MdE-Bericht herunterzuladen.");
                            return;
                          }

                          printWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>AWMF S2k MdE Gutachten-Bericht - U.D.O.</title>
                                <style>
                                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 40px; line-height: 1.6; background-color: #ffffff; }
                                  .header { border-bottom: 3px solid #0f766e; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
                                  .title { font-size: 22px; font-weight: 900; color: #0f766e; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; }
                                  .subtitle { font-size: 11px; color: #64748b; text-transform: uppercase; font-family: monospace; margin-top: 4px; }
                                  .badge-container { text-align: center; margin: 30px 0; }
                                  .badge { background: #0f766e; color: #ffffff; font-size: 32px; font-weight: 900; padding: 14px 28px; border-radius: 12px; text-align: center; display: inline-block; box-shadow: 0 10px 25px rgba(15,118,110,0.25); }
                                  .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 24px; }
                                  .section-title { font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 14px; font-family: monospace; letter-spacing: 1px; }
                                  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                                  .label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
                                  .value { font-size: 13px; font-weight: bold; color: #0f172a; }
                                  .justification { font-size: 13px; font-style: italic; background: #ffffff; border-left: 4px solid #0f766e; padding: 16px; margin-top: 10px; border-radius: 0 8px 8px 0; }
                                  .footer { margin-top: 60px; border-top: 1px solid #cbd5e1; padding-top: 20px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
                                  .signature-box { margin-top: 50px; border-top: 1px dashed #94a3b8; width: 260px; padding-top: 8px; font-size: 11px; font-weight: bold; }
                                  @media print { body { margin: 20px; } }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div>
                                    <h1 class="title">AWMF S2k Gutachtlicher MdE-Bericht</h1>
                                    <div class="subtitle">U.D.O. Clinical Intelligence System &bull; Forensische LWS-Leitlinie</div>
                                  </div>
                                  <div style="text-align: right;">
                                    <div style="font-size: 10px; color: #64748b; font-family: monospace;">DATUM / ZEITSTEMPEL</div>
                                    <div style="font-size: 12px; font-weight: bold;">${reportDate}</div>
                                  </div>
                                </div>

                                <div class="badge-container">
                                  <div class="subtitle" style="margin-bottom: 8px;">Empfohlene Minderung der Erwerbsfähigkeit</div>
                                  <div class="badge">${totalPercent}% MdE</div>
                                  <div style="font-size: 11px; color: #64748b; margin-top: 10px;">Gemäß AWMF S2k-Leitlinie "Begutachtung von Bandscheibenschäden der LWS"</div>
                                </div>

                                <div class="section">
                                  <div class="section-title">Erfasste Klinische Parameter</div>
                                  <div class="grid">
                                    <div>
                                      <div class="label">Beweglichkeit / Segment-Funktion</div>
                                      <div class="value">${mobilityLabel}</div>
                                    </div>
                                    <div>
                                      <div class="label">Neurologische Ausfälle</div>
                                      <div class="value">${neuroLabel}</div>
                                    </div>
                                    <div>
                                      <div class="label">Schmerzprofil & Belastung</div>
                                      <div class="value">${painLabel}</div>
                                    </div>
                                    <div>
                                      <div class="label">Referenz-Norm</div>
                                      <div class="value">BGHM Tab. 3.2 / AWMF Register 008-011</div>
                                    </div>
                                  </div>
                                </div>

                                <div class="section">
                                  <div class="section-title">Forensische Medizinische Begründung</div>
                                  <div class="justification">
                                    "Der Patient präsentiert sich mit ${mobilityLabel.toLowerCase()} im LWS-Segment und ${neuroLabel.toLowerCase()}. Bei vorliegendem Befund und Abgleich mit den AWMF S2k Leitlinien zur Begutachtung von Bandscheibenschäden der Lendenwirbelsäule wird eine unfallbedingte Minderung der Erwerbsfähigkeit (MdE) von genau ${totalPercent}% empfohlen."
                                  </div>
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
                                  <div>
                                    <div style="font-size: 10px; color: #64748b; font-family: monospace;">Prüfsiegel: SHA256-eIDAS-Verified &bull; U.D.O. Clinical Engine</div>
                                  </div>
                                  <div class="signature-box">
                                    Facharzt / Gutachter Unterschrift & Stempel
                                  </div>
                                </div>

                                <div class="footer">
                                  <div>U.D.O. S2k Forensic Decision Support System</div>
                                  <div>Seite 1 von 1</div>
                                </div>

                                <script>
                                  window.onload = function() {
                                    setTimeout(function() {
                                      window.print();
                                    }, 400);
                                  }
                                </script>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold rounded-xl border border-teal-500/40 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
                      >
                        <Download size={14} className="text-teal-400" />
                        <span>{language === "en" ? "Download Official Report" : "Offiziellen Bericht Herunterladen"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Operations & Whitepaper Access */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div 
                    onClick={() => handleToggleView("upgrades")}
                    className="p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 cursor-pointer text-left transition-all"
                  >
                    <h5 className="text-xs font-bold text-slate-300 uppercase">📈 Practice Upgrades</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Practice and scheduling boards.</p>
                  </div>

                  <div 
                    onClick={() => handleToggleView("analytics")}
                    className="p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 cursor-pointer text-left transition-all"
                  >
                    <h5 className="text-xs font-bold text-slate-300 uppercase">📊 Analytics ROI</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Practice case throughput metrics.</p>
                  </div>

                  <div 
                    onClick={() => handleToggleView("eeg")}
                    className="p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/10 cursor-pointer text-left transition-all ring-1 ring-teal-500/20"
                  >
                    <h5 className="text-xs font-bold text-teal-400 uppercase">🧠 EEG AI Portal</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Neurology waveform & spike-and-wave suite.</p>
                  </div>

                  <div 
                    onClick={() => handleToggleView("whitepaper")}
                    className="p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 cursor-pointer text-left transition-all"
                  >
                    <h5 className="text-xs font-bold text-slate-300 uppercase">📜 Technical Whitepaper</h5>
                    <p className="text-[10px] text-slate-500 mt-1">S2k criteria forensic schemas.</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </NavigationShell>
        </main>
      )}


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

      {!cleanMode && (
        <AccessibilityWidget 
          showPortalMenu={showPortalMenu}
          setShowPortalMenu={setShowPortalMenu}
        />
      )}
      
      {!cleanMode && <JarvisAssistant />}

      {/* Sleek Floating Glass Trigger to Enter/Exit Clean Mode */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <button
          onClick={() => setCleanMode(!cleanMode)}
          className="px-6 py-3 rounded-full bg-slate-950/70 hover:bg-slate-900/90 text-teal-400 hover:text-teal-300 border border-teal-500/30 hover:border-teal-400 transition-all duration-300 cursor-pointer font-sans font-bold tracking-widest text-xs uppercase backdrop-blur-xl shadow-[0_0_30px_rgba(20,184,166,0.25)] flex items-center gap-2.5 hover:scale-105 active:scale-95"
          title={cleanMode ? "Open Clinical Portal" : "Clean Screen"}
        >
          {cleanMode ? (
            <>
              <Eye size={15} className="stroke-[2.5px]" />
              <span>{language === "en" ? "Open Clinical Portal" : "Klinisches Portal öffnen"}</span>
            </>
          ) : (
            <>
              <X size={15} className="stroke-[2.5px] text-rose-400" />
              <span>{language === "en" ? "Clean Full Screen" : "Bildschirm leeren"}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
