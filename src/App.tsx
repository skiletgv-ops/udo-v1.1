import React, { useState, useEffect } from "react";
import ParticleSphereBackground from "./components/ParticleSphereBackground";
import RobotMascot from "./components/RobotMascot";
import PhaseWorkflow from "./components/PhaseWorkflow";
import CologneChatbot from "./components/CologneChatbot";
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
  Check
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
    handleQuickModuleJump
  } = useGlobalSystem();

  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [zoomingCardId, setZoomingCardId] = useState<string | null>(null);
  const [zoomCoordinates, setZoomCoordinates] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [introActive, setIntroActive] = useState(true);

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
    return <IntroPresentation onComplete={() => setIntroActive(false)} />;
  }

  return (

    <div className="relative min-h-screen bg-transparent text-slate-100 overflow-hidden font-sans flex flex-col">
      
      {/* 3D PARTICLE STARFIELD & INTERACTIVE CARDS GALAXY */}
      <ParticleSphereBackground 
        activeView={activeView}
        setActiveView={setActiveView}
        setActiveFunctionId={setActiveFunctionId}
      />

      {/* TOP HEADER IS HIDDEN TO MAXIMIZE VISUAL SPACE */}

      {/* =========================================================================
         MASTER BUTTON & ACTION CONTROL PANEL (MINIMIZE, MAXIMIZE & ALL ACTIONS IN ONE)
         ========================================================================= */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        
        {/* Toggle Panel Size Button (Dynamic Minimize/Maximize for active module) */}
        {activeView && (
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-950 text-slate-100 hover:text-teal-400 border border-slate-800 hover:border-teal-500/50 shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title={isMaximized ? "Split-Ansicht wiederherstellen" : "Bereich maximieren"}
          >
            {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="font-mono uppercase font-bold text-[10px] hidden sm:inline">
              {isMaximized ? "Split-Ansicht" : "Maximieren (Full)"}
            </span>
          </button>
        )}

        {/* Master Action Core Menu Button containing ALL actions & functions */}
        <div className="relative">
          <button
            onClick={() => setIsMasterMenuOpen(!isMasterMenuOpen)}
            className={`p-3 rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs cursor-pointer font-bold ${
              isMasterMenuOpen 
                ? "bg-teal-600 text-white border-teal-500" 
                : "bg-white/80 hover:bg-white text-slate-800 border-slate-200 hover:border-teal-300"
            }`}
          >
            <Cpu size={15} className={`${isMasterMenuOpen ? "animate-spin" : "animate-pulse text-teal-600"}`} />
            <span className="font-mono uppercase text-[10px]">
              System Actions
            </span>
          </button>

          {/* Master Action Translucent Dropdown Menu */}
          {isMasterMenuOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.08)] z-50 animate-fade-in text-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-600 font-extrabold flex items-center gap-1.5">
                  <Grid size={12} />
                  System Control Hub
                </span>
                <button 
                  onClick={() => setIsMasterMenuOpen(false)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Module Switching shortcuts */}
              <div className="space-y-1.5 mb-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Clinical Services</p>
                
                <button
                  onClick={() => handleQuickModuleJump("video")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    activeView === "video" 
                      ? "bg-teal-50 border border-teal-200 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Video size={13} className="text-teal-600 font-bold" />
                  <div className="flex-1">
                    <p className="leading-none text-[11px] font-bold">3D Video Analysis</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-semibold">BIOMECHANICAL MOTION ANALYSIS</p>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickModuleJump("workflow")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    activeView === "workflow" 
                      ? "bg-teal-50 border border-teal-200 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Activity size={13} className="text-teal-600 font-bold" />
                  <div className="flex-1">
                    <p className="leading-none text-[11px] font-bold">6-Phase Workflow</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-semibold">EVIDENCE-BASED PATHWAYS</p>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickModuleJump("chat")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    activeView === "chat" 
                      ? "bg-teal-50 border border-teal-200 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <MessageSquare size={13} className="text-teal-600 font-bold" />
                  <div className="flex-1">
                    <p className="leading-none text-[11px] font-bold">Gemini Live Chat</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-semibold">EXPERT CLINICAL DIALOGUE (NOVA)</p>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickModuleJump("upgrades")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    activeView === "upgrades" 
                      ? "bg-teal-50 border border-teal-200 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Sparkles size={13} className="text-teal-600 font-bold" />
                  <div className="flex-1">
                    <p className="leading-none text-[11px] font-bold">Practice Upgrades</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-semibold">PRESCRIPTIONS, APPOINTMENTS & BOARD</p>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickModuleJump("analytics")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    activeView === "analytics" 
                      ? "bg-teal-50 border border-teal-200 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <LineChart size={13} className="text-teal-600 font-bold" />
                  <div className="flex-1">
                    <p className="leading-none text-[11px] font-bold">Analytics & KPIs</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-semibold">ROBUST ROI DASHBOARD</p>
                  </div>
                </button>
              </div>

              {/* U.D.O. AI Medical Consensus ACTIONS */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 mb-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">U.D.O. AI Medical Consensus</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setRobotState("HAPPY");
                      setRobotBubble('"Here is the consensus vote: all 12 leading medical experts agree that the left L4/L5 herniation is causally linked to the patient\'s occupational incident."');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl text-[10px] text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                  >
                    <span>🧪 Consensus Vote</span>
                  </button>
                  <button
                    onClick={() => {
                      setRobotState("THINKING");
                      setRobotBubble('"Initiating S2k-Guideline Verification for segment L4/L5. All checks are fully aligned."');
                      setTimeout(() => setRobotState("WAVING"), 1800);
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl text-[10px] text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                  >
                    <span>📜 Guideline Check</span>
                  </button>
                  <button
                    onClick={() => {
                      setRobotState("HAPPY");
                      setRobotBubble('"Qualified Electronic Signature (QES) has been successfully generated and securely transmitted to the insurer."');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl text-[10px] text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                  >
                    <span>🔑 Sign with QES</span>
                  </button>
                  <button
                    onClick={handleRobotClick}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl text-[10px] text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                  >
                    <span>🍻 Supportive Dialog</span>
                  </button>
                </div>
              </div>

              {/* Layout controls inside the master button */}
              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Layout Control</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsMaximized(!isMaximized);
                      setIsMasterMenuOpen(false);
                    }}
                    disabled={!activeView}
                    className="flex-1 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                  >
                    {isMaximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                    <span>{isMaximized ? "SPLIT-SCREEN" : "MAXIMIZE"}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleQuickModuleJump(null);
                      setIsMaximized(false);
                    }}
                    disabled={!activeView}
                    className="flex-1 py-1.5 rounded-xl bg-rose-50 border border-rose-100 hover:border-rose-200 hover:bg-rose-50 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 text-rose-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                  >
                    <X size={11} />
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>

              {/* Technical indicators inside master actions menu */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  GDPR SECURE
                </span>
                <span>v2.0 | AWMF-S2k</span>
              </div>
            </div>
          )}
        </div>
      </div>

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
             - Maximized to full width / sides (max-w-7xl / lg:max-w-full px-12)
             ========================================================================= */
          <div className="flex-1 flex flex-col items-center justify-start p-6 max-w-7xl lg:max-w-full lg:px-12 mx-auto w-full animate-fade-in relative pointer-events-none space-y-8">
            {/* Interactive 3D Sphere landing hero page - hidden on home to keep space clean if fullscreen requested */}
            <div className="w-full pointer-events-auto opacity-0 h-0 select-none pointer-events-none overflow-hidden">
              <SplineSceneBasic />
            </div>

            {/* Direct Core Controls Panel - High Fidelity Tactile Buttons */}
            <div className="w-full z-10 mt-4 mb-8 px-4 pointer-events-auto">
              <div className="text-left mb-8 max-w-2xl">
                <p className="text-[10px] font-mono tracking-widest text-teal-400 font-extrabold uppercase">
                  OPERATIVE AI STEERING HUB
                </p>
                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase mt-1">
                  U.D.O. Medical Expert Workstation
                </h3>
                <p className="text-xs text-slate-450 mt-2">
                  Select a command option below to import patient files, initiate direct clinical verification, or launch the Live Gemini consultation with Nova Voice.
                </p>
              </div>

              {/* Flex row / Grid of premium sleek horizontal button consoles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                
                {/* BUTTON-CONSOLE 1: UPLOAD PATIENT DATA */}
                <div 
                  className={`relative rounded-2xl p-6 border transition-all duration-300 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between ${
                    dragActive 
                      ? "border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.25)] scale-[1.01]" 
                      : "border-white/10 hover:border-teal-500/40 hover:shadow-[0_15px_30px_rgba(20,184,166,0.05)]"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <Upload size={18} className={uploadState !== "idle" ? "animate-bounce" : ""} />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
                          Service: Ingestion & Verification
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">
                          Upload Patient Data
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal mb-4">
                    Drag and drop clinical reports, MRI findings, or physician letters here, or select a file to activate the automated guidelines processing.
                  </p>

                  {/* Drag and Drop Zone or Progress bar */}
                  <div className="mb-4">
                    {uploadState === "idle" ? (
                      <label className="border border-dashed border-white/10 hover:border-teal-500/30 bg-white/5 hover:bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all gap-1 text-center group">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                        />
                        <span className="text-xs text-slate-300 font-bold group-hover:text-white transition-colors">
                          Drag file here or click to browse
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                          Supports PDF, Word, TXT, Images
                        </span>
                      </label>
                    ) : (
                      <div className="bg-[#030712]/90 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                          <Loader2 className="text-teal-400 animate-spin" size={14} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">Processing report...</p>
                            <p className="text-[9px] font-mono text-slate-400 truncate">{selectedFileName}</p>
                          </div>
                        </div>

                        {/* Ingestion steps */}
                        <div className="space-y-1 text-[9px] font-mono">
                          <div className="flex items-center justify-between">
                            <span className={uploadState === "reading" ? "text-teal-400 animate-pulse font-bold" : "text-slate-400"}>
                              1. HIPAA & GDPR Compliance Check
                            </span>
                            {uploadState !== "reading" ? <Check size={10} className="text-teal-400" /> : <Loader2 size={8} className="text-teal-400 animate-spin" />}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={uploadState === "decrypting" ? "text-teal-400 animate-pulse font-bold" : uploadState === "reading" ? "text-slate-600" : "text-slate-400"}>
                              2. Clinical Findings Extraction (ICD-10)
                            </span>
                            {uploadState === "analyzing" || uploadState === "completed" ? (
                              <Check size={10} className="text-teal-400" />
                            ) : uploadState === "decrypting" ? (
                              <Loader2 size={8} className="text-teal-400 animate-spin" />
                            ) : (
                              <span className="text-slate-600">WAITING</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={uploadState === "analyzing" ? "text-teal-400 animate-pulse font-bold" : (uploadState === "reading" || uploadState === "decrypting") ? "text-slate-600" : "text-slate-400"}>
                              3. Guidelines & Insurer Rule Alignment
                            </span>
                            {uploadState === "completed" ? (
                              <Check size={10} className="text-teal-400" />
                            ) : uploadState === "analyzing" ? (
                              <Loader2 size={8} className="text-teal-400 animate-spin" />
                            ) : (
                              <span className="text-slate-600">WAITING</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-white/5 pt-4">
                    <button
                      onClick={() => {
                        triggerUploadSequence("thomas_muller_accident_report.pdf");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black tracking-wider text-[11px] transition-all duration-300 w-full sm:w-auto uppercase cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Ingest Sample Case (Thomas Muller)</span>
                      <Activity size={12} />
                    </button>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                      S2k Clinical Guidelines Active
                    </span>
                  </div>
                </div>

                {/* BUTTON-CONSOLE 2: GEMINI LIVE CONSULTATION */}
                <div className="relative rounded-2xl p-6 border border-white/10 hover:border-teal-500/40 hover:shadow-[0_15px_30px_rgba(20,184,166,0.05)] bg-slate-950/90 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <Mic size={18} className="animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
                          Service: Live Dialogue
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">
                          Gemini AI Live Talk
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal mb-4">
                    Initiate real-time, interactive dialogues with Gemini using the responsive Nova Voice. Ask legal, forensic, clinical-guideline, or case correlation questions.
                  </p>

                  {/* Audio Wave Indicator */}
                  <div className="border border-white/5 bg-black/40 rounded-xl p-4 flex flex-col items-center justify-center h-[96px] gap-2">
                    <div className="flex items-center gap-1 h-8 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 bg-teal-500/40 rounded-full"
                          style={{
                            height: `${Math.sin(bar * 0.5) * 60 + 80}%`,
                            animation: `bounce 1.${bar % 3}s ease-in-out infinite alternate`,
                            animationDelay: `${bar * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono tracking-wider text-teal-400 uppercase font-bold animate-pulse">
                      Nova Voice Channel Ready
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-white/5 pt-4">
                    <button
                      onClick={() => setActiveView("chat")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-teal-400 border border-teal-500/30 hover:border-teal-400 font-extrabold tracking-wider text-[11px] transition-all duration-300 w-full sm:w-auto uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-inner"
                    >
                      <Mic size={12} />
                      <span>Sprechstunde starten</span>
                    </button>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                      Hotword: say 'UDO' to speak
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             2. ACTIVE MODULE CONTAINER (Suspended overlay panel page for each function)
             ========================================================================= */
          <div className="flex-1 flex flex-col lg:flex-row items-stretch p-4 lg:p-6 gap-6 h-[calc(100vh-100px)] overflow-hidden pointer-events-none">
            
            {/* LEFT SIDEBAR: Robot Mascot floating alongside the active view */}
            {!isMaximized && (
              <div className="hidden lg:flex flex-col items-center justify-center lg:w-[28%] shrink-0 pointer-events-auto animate-fade-in bg-white/45 border border-slate-200/50 rounded-3xl p-6 backdrop-blur-md shadow-xl">
                <RobotMascot 
                  state={robotState} 
                  messageBubble={robotBubble} 
                  onBubbleClick={handleRobotClick}
                />
                <p className="text-[10px] text-slate-400 font-mono text-center mt-4 uppercase tracking-widest max-w-[180px]">
                  Dr. Heinrich Altenberg (Köln KI-Spezialist)
                </p>
              </div>
            )}

            <div className={`flex-1 transition-all duration-500 relative flex flex-col min-w-0 h-full overflow-hidden animate-fade-in pointer-events-auto ${
              isMaximized ? "max-w-full" : "lg:w-[70%]"
            }`}>
              
              {/* Glassmorphic Active Portal Wrapper */}
              <div className="flex-1 bg-white/85 border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 lg:p-6 relative flex flex-col min-w-0 h-full overflow-hidden backdrop-blur-lg">
                
                {/* Module Header Bar */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                      {activeView === "communicator" && <Mic size={16} />}
                      {activeView === "video" && <Video size={16} />}
                      {activeView === "workflow" && <Activity size={16} />}
                      {activeView === "chat" && <MessageSquare size={16} />}
                      {activeView === "upgrades" && <Sparkles size={16} />}
                      {activeView === "analytics" && <LineChart size={16} />}
                    </div>
                    <div>
                      <h3 className="text-md lg:text-lg font-extrabold text-slate-800 tracking-tight leading-none uppercase">
                        {activeView === "video" && "3D Video Analysis"}
                        {activeView === "workflow" && "6-Phase Workflow"}
                        {activeView === "chat" && "Gemini Live Consultation"}
                        {activeView === "upgrades" && "Practice Upgrades"}
                        {activeView === "analytics" && "Analytics & ROI Board"}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                        {activeView === "video" && "BIOMECHANICAL MOTION SCREENING"}
                        {activeView === "workflow" && "EVIDENCE-BASED GUIDELINE VERIFICATION"}
                        {activeView === "chat" && "EXPERT VOICE DIALOGUE ENGINE (NOVA)"}
                        {activeView === "upgrades" && "PRESCRIPTIONS, APPOINTMENTS & BOARD"}
                        {activeView === "analytics" && "ROBUST CLINICAL ROI DASHBOARD"}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-850 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                      title={isMaximized ? "Restore Split Screen" : "Maximize view"}
                    >
                      {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                      <span className="text-[9px] font-mono uppercase tracking-wider hidden md:inline">
                        {isMaximized ? "Split" : "Maximize"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView(null);
                        setIsMaximized(false);
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 font-bold shadow-sm"
                      title="Close view and return to main orbit"
                    >
                      <X size={13} />
                      <span className="text-[9px] font-mono uppercase tracking-wider hidden sm:inline">Close</span>
                    </button>
                  </div>
                </div>

                {/* Active Component Wrapper with custom scroll */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {activeView === "video" && (
                    <VideoAnalysePortal 
                      onRobotStateChange={handleRobotStateChange}
                      activePatient={activePatient}
                      setActivePatient={(p) => setActivePatient(p)}
                    />
                  )}

                  {activeView === "workflow" && (
                    <PhaseWorkflow 
                      onRobotStateChange={handleRobotStateChange}
                      activePatient={activePatient}
                      setActivePatient={setActivePatient}
                    />
                  )}

                  {activeView === "chat" && (
                    <CologneChatbot 
                      onRobotStateChange={handleRobotStateChange}
                      onDrBubbleTrigger={(text) => setRobotBubble(text)}
                    />
                  )}

                  {activeView === "upgrades" && (
                    <PracticeUpgrades />
                  )}

                  {activeView === "analytics" && (
                    <ExecutiveDashboard />
                  )}
                </div>

              </div>
            </div>
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

      {/* FOOTER */}
      <footer className="relative z-30 px-6 py-4 bg-black/60 border-t border-slate-900 text-center text-[10px] font-mono text-slate-450 mt-auto">
        <p>© 2026 U.D.O. Platform | Ultimate Diagnostic Operator v2.0</p>
        <p className="mt-0.5 text-slate-500 font-semibold">DSGVO-zertifiziert | Gehostet auf deutschen Cloud Run Servern</p>
      </footer>

    </div>
  );
}
