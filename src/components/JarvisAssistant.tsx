import React, { useState, useEffect, useRef } from "react";
import { useGlobalSystem, ChatMessage } from "./GlobalSystemContext";
import {
  Mic,
  Keyboard,
  Camera,
  FileText,
  Languages,
  Radio as RadioIcon,
  Brain,
  Sliders,
  Smile,
  Clipboard,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Check,
  Compass,
  MapPin,
  AlertTriangle,
  Send,
  CloudSun,
  Battery,
  Calendar,
  Layers,
  Copy,
  BookOpen,
  Share2,
  Mail,
  Search,
  CheckSquare,
  HelpCircle,
  Clock,
  ChevronRight,
  Info,
  Heart,
  Star,
  Grid,
  Settings,
  Activity,
  LineChart,
  Upload,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
type AssistantState = "idle" | "thinking" | "listening" | "speaking" | "error" | "success";

interface CustomMemoryItem {
  key: string;
  value: string;
  category: "routine" | "preference" | "history";
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color: string;
}

export default function JarvisAssistant() {
  const {
    language,
    setLanguage,
    colorblindMode,
    setColorblindMode,
    fontScale,
    setFontScale,
    isVoiceMuted,
    setIsVoiceMuted,
    speakResponse,
    chatMessages,
    setChatMessages,
    radioKolnActive,
    setRadioKolnActive,
    activeView,
    setActiveView,
    isUploadOpen,
    setIsUploadOpen,
    isLiveTalkOpen,
    setIsLiveTalkOpen,
    globalForceActiveListening,
    lineHeightScale,
    setLineHeightScale,
    fontWeightScale,
    setFontWeightScale,
    eyeWarmthScale,
    setEyeWarmthScale,
    audioEnabled,
    setAudioEnabled
  } = useGlobalSystem();

  // --- DOCKS STATE SYSTEM ---
  const [isAiDockExpanded, setIsAiDockExpanded] = useState(false);
  const [activeRightMenu, setActiveRightMenu] = useState<"documents" | "favorites" | "more" | null>(null);
  const [favoritesList, setFavoritesList] = useState<string[]>(["6-Phase Workflow", "Radio Köln FM", "Practice Upgrades"]);

  // --- STATE SYSTEM ---
  const [orbState, setOrbState] = useState<AssistantState>("idle");
  const [isOrbMinimized, setIsOrbMinimized] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [orbYOffset, setOrbYOffset] = useState(0); // For floating offset
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [avatarLipSyncHeight, setAvatarLipSyncHeight] = useState(4);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [wakeWordListening, setWakeWordListening] = useState(false);
  const [isSpeakingProgress, setIsSpeakingProgress] = useState(0);

  // --- CAMERA AI STATES ---
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<"object" | "plant" | "bar" | "math" | "schema">("object");
  const [cameraAnalysisResult, setCameraAnalysisResult] = useState<string | null>(null);
  const [cameraScanning, setCameraScanning] = useState(false);

  // --- LIVE TRANSLATOR STATES ---
  const [translationInput, setTranslationInput] = useState("");
  const [translationOutput, setTranslationOutput] = useState("");
  const [translationLangs, setTranslationLangs] = useState({ from: "en", to: "de" });
  const [isTranslating, setIsTranslating] = useState(false);

  // --- MEMORY STATES ---
  const [memories, setMemories] = useState<CustomMemoryItem[]>([
    { key: "Preferred Station", value: "Radio Köln FM", category: "preference" },
    { key: "Target System", value: "Cologne Cyber Clinic", category: "routine" },
    { key: "Active Language", value: "English (US)", category: "preference" },
    { key: "Routine Action", value: "Morning ward diagnostics at 08:30", category: "routine" }
  ]);
  const [newMemoryKey, setNewMemoryKey] = useState("");
  const [newMemoryValue, setNewMemoryValue] = useState("");

  // --- UNIVERSAL READER STATES ---
  const [readerText, setReaderText] = useState("");
  const [readerPlaying, setReaderPlaying] = useState(false);
  const [readerSpeed, setReaderSpeed] = useState(1.0);
  const [readerStatus, setReaderStatus] = useState("IDLE");

  // --- MOOD AI STATES ---
  const [detectedMood, setDetectedMood] = useState<"focused" | "relaxed" | "energetic" | "stress">("focused");
  const [typingSpeed, setTypingSpeed] = useState(0);

  // --- AUTOMATION ROUTINES (JARVIS) ---
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);

  // --- CHAT INTERACTION STATES ---
  const [quickInput, setQuickInput] = useState("");

  // Refs for tracking elements
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking cycle for avatar
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Lip sync simulation when speaking
  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    if (orbState === "speaking") {
      syncInterval = setInterval(() => {
        setAvatarLipSyncHeight(Math.floor(Math.random() * 24) + 4);
      }, 100);
    } else {
      setAvatarLipSyncHeight(4);
    }
    return () => clearInterval(syncInterval);
  }, [orbState]);

  // Audio simulation timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (orbState === "speaking") {
      t = setInterval(() => {
        setIsSpeakingProgress(prev => {
          if (prev >= 100) {
            setOrbState("idle");
            return 0;
          }
          return prev + 2.5;
        });
      }, 150);
    }
    return () => clearInterval(t);
  }, [orbState]);

  // Handle Clipboard Change on tab visibility or manual read
  const handleReadClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setReaderText(text);
        setReaderStatus("TEXT EXTRACTED");
        setOrbState("success");
      }
    } catch (e) {
      setReaderText("Demo data: Patient No. 904 Spinal Protrusion checked at Cologne Cyber Clinic.");
      setReaderStatus("DEMO TEXT LOADED");
    }
  };

  // Typing analysis for Mood Detection
  const handleTypingEvent = () => {
    setTypingSpeed(prev => prev + 1);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    
    typingTimerRef.current = setTimeout(() => {
      if (typingSpeed > 15) {
        setDetectedMood("energetic");
      } else if (typingSpeed > 0 && typingSpeed <= 8) {
        setDetectedMood("relaxed");
      } else {
        setDetectedMood("focused");
      }
      setTypingSpeed(0);
    }, 1500);
  };

  // --- JARVIS ROUTINE AUTOMATION TRIGGER ---
  const triggerJarvisRoutine = (routine: "morning" | "driving" | "night") => {
    setActiveRoutine(routine);
    setOrbState("thinking");
    
    setTimeout(() => {
      setOrbState("speaking");
      if (routine === "morning") {
        speakResponse("Good morning, doctor. Loading your Cyber Clinic schedules. Current weather in Cologne is sunny. Station WDR 2 is tuned.");
      } else if (routine === "driving") {
        speakResponse("Driving Mode active. Map guidance initialized. Traffic on highway A4 near Cologne is clear. Tuning in Radio Köln FM.");
        setRadioKolnActive(true);
      } else {
        speakResponse("Good night, doctor. Dimming main interface displays. Setting sleep timer for WDR culture stream. Sleep well.");
        setColorblindMode("monochrome");
      }
      setOrbState("success");
    }, 1500);
  };

  // --- CAMERA AI ANALYZER ---
  const triggerCameraScan = () => {
    setCameraScanning(true);
    setOrbState("thinking");

    setTimeout(() => {
      setCameraScanning(false);
      setOrbState("success");

      let analysis = "";
      if (cameraMode === "object") {
        analysis = "OBJECT DETECTION: Identified clinical spine support pillow | Match Confidence: 98.4%. Recommended for rehabilitation.";
      } else if (cameraMode === "plant") {
        analysis = "BOTANY SCAN: Aloe Vera (Liliaceae). Medicinal use: Treatment of thermal radiation skin damage. Safe for clinical office usage.";
      } else if (cameraMode === "bar") {
        analysis = "BARCODE RESOLUTION: Patient-ID match. Record No. 49023 - G. Müller. Spine segmentation L4/L5 confirmed.";
      } else if (cameraMode === "math") {
        analysis = "CALCULUS SOLVED: Patient Cobb angle formula results in 14.5 degrees. Mild Scoliosis detected. Postural corrections advised.";
      } else {
        analysis = "SCHEMATIC BREAKDOWN: Audio Synth signal paths confirmed. Volume: 8%. Radio Köln live web-stream synced to port 3000.";
      }
      setCameraAnalysisResult(analysis);
      speakResponse(analysis);
    }, 2000);
  };

  // --- AI AUDIO REPLIES / CHAT ENGINE ---
  const submitQuickChat = () => {
    if (!quickInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "juser-" + Date.now(),
      sender: "user",
      text: quickInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setQuickInput("");
    setOrbState("thinking");

    const inputLower = quickInput.toLowerCase();
    
    setTimeout(() => {
      let replyText = "";
      if (inputLower.includes("play") || inputLower.includes("köln") || inputLower.includes("koeln")) {
        setRadioKolnActive(true);
        replyText = "Executing screen command: Open and play Radio Köln. Commencing station stream!";
      } else if (inputLower.includes("contrast") || inputLower.includes("monochrome")) {
        setColorblindMode("monochrome");
        replyText = "Executing display command: Switching viewport to high contrast monochrome mode.";
      } else if (inputLower.includes("reset")) {
        setColorblindMode("normal");
        setFontScale(1.1);
        replyText = "Executing system command: All layout properties and font sizes reset successfully.";
      } else {
        replyText = `Analyzing clinical inquiry: "${quickInput}". Integrating UDO database models to yield surgical recommendation. Let's process.`;
      }

      setOrbState("speaking");
      speakResponse(replyText);

      const systemMsg: ChatMessage = {
        id: "jsystem-" + Date.now(),
        sender: "doctor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, systemMsg]);
    }, 1500);
  };

  const addMemoryItem = () => {
    if (!newMemoryKey || !newMemoryValue) return;
    setMemories(prev => [
      ...prev,
      { key: newMemoryKey, value: newMemoryValue, category: "preference" }
    ]);
    setNewMemoryKey("");
    setNewMemoryValue("");
    setOrbState("success");
  };

  const deleteMemoryItem = (key: string) => {
    setMemories(prev => prev.filter(m => m.key !== key));
  };

  const startReaderAudio = () => {
    if (!readerText) {
      speakResponse("Clipboard is currently empty. Please load document or copy some text first.");
      return;
    }
    setReaderPlaying(true);
    setOrbState("speaking");
    speakResponse(readerText);
  };

  const stopReaderAudio = () => {
    setReaderPlaying(false);
    setOrbState("idle");
  };

  const RADIAL_ACTIONS: QuickAction[] = [
    { 
      icon: <Copy size={14} />, 
      label: "Copy Text", 
      action: () => { 
        navigator.clipboard.writeText(readerText || "Cologne Cyber Clinic Report"); 
        setOrbState("success"); 
      }, 
      color: "bg-blue-500 hover:bg-blue-600" 
    },
    { 
      icon: <Languages size={14} />, 
      label: "Translate", 
      action: () => { 
        setActiveTool("translation"); 
        setTranslationInput(readerText); 
        setOrbState("thinking"); 
      }, 
      color: "bg-cyan-500 hover:bg-cyan-600" 
    },
    { 
      icon: <Volume2 size={14} />, 
      label: "Speak", 
      action: startReaderAudio, 
      color: "bg-emerald-500 hover:bg-emerald-600" 
    },
    { 
      icon: <Sparkles size={14} />, 
      label: "Summarize", 
      action: () => { 
        setReaderText("SUMMARIZED: Patient spine scans align within nominal bounds. Standard physical therapy recommended weekly."); 
        setOrbState("success"); 
      }, 
      color: "bg-purple-500 hover:bg-purple-600" 
    },
  ];

  // Dynamic Collision Management
  const isScreenOccupied = activeView !== null;

  return (
    <>
      {/* LEFT EXPANDABLE AI DOCK */}
      <AnimatePresence>
        {!isScreenOccupied && (
          <motion.div 
            drag="y"
            dragConstraints={{ top: -300, bottom: 300 }}
            dragElastic={0.15}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto flex items-center gap-2 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          >
            <div className="flex flex-col items-center">
              {/* Drag Handle Accent */}
              <div className="w-4 h-1 rounded-full bg-white/10 mb-2 cursor-ns-resize" />
              
              <div 
                className={`flex flex-col items-center gap-3 p-3 rounded-[28px] border bg-slate-950/80 backdrop-blur-3xl shadow-2xl transition-all duration-300 ${
                  isAiDockExpanded ? "border-teal-500/40" : "border-white/10"
                }`}
              >
                {/* Core AI Icon (Sparkle) */}
                <button
                  onClick={() => setIsAiDockExpanded(!isAiDockExpanded)}
                  className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all ${
                    isAiDockExpanded 
                      ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]" 
                      : "bg-white/5 hover:bg-white/10 text-teal-400"
                  } cursor-pointer`}
                  title="Toggle AI Dock"
                >
                  <Sparkles size={18} className={isAiDockExpanded ? "animate-pulse" : ""} />
                </button>

                {/* Vertically Expanded AI Items */}
                <AnimatePresence>
                  {isAiDockExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col items-center gap-3 overflow-hidden"
                    >
                      {/* 1. Companion / Dialogue Panel */}
                      <button
                        onClick={() => {
                          setActiveTool("chat");
                          setIsPanelExpanded(!isPanelExpanded);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          activeTool === "chat" && isPanelExpanded
                            ? "bg-teal-500/10 border border-teal-500/35 text-teal-300"
                            : "bg-white/5 hover:bg-white/10 text-slate-300"
                        } cursor-pointer`}
                        title="AI Dialogue Input"
                      >
                        <MessageSquare size={15} />
                      </button>

                      {/* 2. Voice / Listening trigger */}
                      <button
                        onClick={() => {
                          if (globalForceActiveListening) globalForceActiveListening();
                          setOrbState("listening");
                        }}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                        title="Start Nova Voice"
                      >
                        <Mic size={15} className="text-emerald-400 animate-pulse" />
                      </button>

                      {/* 3. Consensus chat */}
                      <button
                        onClick={() => setActiveView("chat")}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                        title="Full Consensus Chat"
                      >
                        <Layers size={15} />
                      </button>

                      {/* 4. Radio Quick Switch */}
                      <button
                        onClick={() => setRadioKolnActive(!radioKolnActive)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          radioKolnActive
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-white/5 hover:bg-white/10 text-slate-300"
                        } cursor-pointer`}
                        title="Radio Köln FM"
                      >
                        <RadioIcon size={15} />
                      </button>

                      {/* 5. Radial action simulator */}
                      <button
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setShowRadialMenu(!showRadialMenu);
                        }}
                        onClick={() => setShowRadialMenu(!showRadialMenu)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          showRadialMenu
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 hover:bg-white/10 text-slate-300"
                        } cursor-pointer`}
                        title="Quick Actions (Right-Click)"
                      >
                        <Compass size={15} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT UTILITIES DOCK */}
      <AnimatePresence>
        {!isScreenOccupied && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-3 p-3 rounded-[28px] border border-white/10 bg-slate-950/80 backdrop-blur-3xl shadow-2xl">
              {/* 📄 Documents trigger */}
              <button
                onClick={() => {
                  setActiveRightMenu(activeRightMenu === "documents" ? null : "documents");
                }}
                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all ${
                  activeRightMenu === "documents"
                    ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                } cursor-pointer`}
                title="Documents Board"
              >
                <FileText size={18} />
              </button>

              {/* ⭐ Favorites trigger */}
              <button
                onClick={() => {
                  setActiveRightMenu(activeRightMenu === "favorites" ? null : "favorites");
                }}
                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all ${
                  activeRightMenu === "favorites"
                    ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                } cursor-pointer`}
                title="System Favorites"
              >
                <Star size={18} />
              </button>

              {/* ⚙️ More trigger */}
              <button
                onClick={() => {
                  setActiveRightMenu(activeRightMenu === "more" ? null : "more");
                }}
                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all ${
                  activeRightMenu === "more"
                    ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                } cursor-pointer`}
                title="More Utilities"
              >
                <Grid size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECONSTRUCTED CENTRAL CHAT & TOOL EXPERT DRAWER */}
      <AnimatePresence>
        {isPanelExpanded && activeTool && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed bottom-32 left-6 right-6 md:left-auto md:right-32 md:w-[420px] z-50 bg-slate-950/95 border border-white/15 rounded-[32px] p-6 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 shrink-0">
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-2">
                <Brain size={14} className="animate-pulse" />
                {activeTool === "chat" ? "AI Dialogue" :
                 activeTool === "camera" ? "Computer Vision Scanner" :
                 activeTool === "translation" ? "Live AI Translation" :
                 activeTool === "automation" ? "Jarvis Automation" :
                 activeTool === "memory" ? "Long Term Brain Memory" :
                 activeTool === "reader" ? "Universal Clinical Reader" :
                 activeTool === "mood" ? "Biometric Sentiment Mood" : "Diagnostic Hub Monitor"}
              </span>
              <button 
                onClick={() => setIsPanelExpanded(false)}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto pr-1">
              {/* Tool Renderings */}
              {activeTool === "chat" && (
                <div className="space-y-3">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => {
                        setQuickInput(e.target.value);
                        handleTypingEvent();
                      }}
                      placeholder="Ask UDO to play radio, change style..."
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                      onKeyDown={(e) => e.key === "Enter" && submitQuickChat()}
                    />
                    <button
                      onClick={submitQuickChat}
                      className="p-1.5 bg-teal-500 text-slate-950 rounded-xl flex items-center justify-center cursor-pointer hover:bg-teal-400"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider bg-black/40 p-2 rounded-lg border border-white/5">
                    ⌨️ Quick Screen commands: <br/>
                    - "Play Radio Köln"<br/>
                    - "Switch to Monochrome"<br/>
                    - "Reset Display UI"
                  </div>
                </div>
              )}

              {activeTool === "camera" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
                    {[
                      { id: "object", label: "Obj" },
                      { id: "plant", label: "Pla" },
                      { id: "bar", label: "Barcode" },
                      { id: "math", label: "Math" },
                      { id: "schema", label: "Elec" },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setCameraMode(m.id as any)}
                        className={`py-1 rounded text-[9px] font-mono uppercase font-black cursor-pointer ${
                          cameraMode === m.id ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="h-28 rounded-xl bg-slate-900 border border-white/15 overflow-hidden relative flex items-center justify-center">
                    {cameraScanning ? (
                      <div className="absolute inset-0 bg-teal-500/5 flex flex-col items-center justify-center gap-1">
                        <div className="w-full h-0.5 bg-teal-400 animate-bounce" />
                        <span className="text-[10px] font-mono text-teal-400 uppercase animate-pulse">Scanning feed...</span>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                        <Camera size={18} className="text-teal-400 animate-pulse" />
                        <span className="font-mono text-[9px] uppercase tracking-wider">Device camera feed simulator</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={triggerCameraScan}
                    className="w-full py-1.5 rounded-lg bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wide cursor-pointer hover:bg-teal-400 transition-colors"
                  >
                    Process Scan Match
                  </button>

                  {cameraAnalysisResult && (
                    <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-[10px] font-mono text-teal-300 leading-relaxed uppercase">
                      {cameraAnalysisResult}
                    </div>
                  )}
                </div>
              )}

              {activeTool === "translation" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-black/40 p-1.5 rounded-lg border border-white/5 text-[9px] font-mono uppercase">
                    <span className="font-bold text-teal-400">{translationLangs.from.toUpperCase()}</span>
                    <button 
                      onClick={() => setTranslationLangs(prev => ({ from: prev.to, to: prev.from }))}
                      className="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 rounded cursor-pointer text-slate-400 hover:text-white"
                    >
                      ⇅ Swap
                    </button>
                    <span className="font-bold text-teal-400">{translationLangs.to.toUpperCase()}</span>
                  </div>

                  <textarea
                    value={translationInput}
                    onChange={(e) => setTranslationInput(e.target.value)}
                    placeholder="Type text to translate..."
                    className="w-full h-16 p-2 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white focus:outline-none focus:border-teal-500/50 resize-none font-mono"
                  />

                  <button
                    onClick={() => {
                      setIsTranslating(true);
                      setOrbState("thinking");
                      setTimeout(() => {
                        setTranslationOutput(
                          translationLangs.from === "en" 
                            ? "ÜBERSETZT: Patientendaten zur Lendenwirbelsäule erfolgreich synchronisiert."
                            : "TRANSLATED: Lumbar spine diagnostic documents successfully synchronized with database."
                        );
                        setIsTranslating(false);
                        setOrbState("success");
                      }, 1200);
                    }}
                    className="w-full py-1.5 rounded-lg bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wide cursor-pointer hover:bg-teal-400 transition-colors"
                  >
                    Translate Speech/Text
                  </button>

                  {translationOutput && (
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-200 font-mono">
                      {translationOutput}
                    </div>
                  )}
                </div>
              )}

              {activeTool === "automation" && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    Select a pre-compiled Jarvis cyber routine to fire clinical workflows:
                  </p>
                  {[
                    { id: "morning", label: "🌅 Good Morning Routine", desc: "Tunes news stream, reads clinic itinerary, triggers Cologne weather report." },
                    { id: "driving", label: "🚗 driving commute Mode", desc: "Turns on GPS traffic updates, initializes patient notes tracker, plays Radio Köln." },
                    { id: "night", label: "🌙 Bedtime wind down", desc: "Initiates sleep timers, dims UI contrast to comfortable warm sepia." }
                  ].map(routine => (
                    <button
                      key={routine.id}
                      onClick={() => triggerJarvisRoutine(routine.id as any)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 text-left cursor-pointer transition-all flex flex-col gap-0.5"
                    >
                      <span className="text-[11px] font-bold text-slate-200 uppercase">{routine.label}</span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase leading-normal">{routine.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTool === "memory" && (
                <div className="space-y-3">
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {memories.map(m => (
                      <div key={m.key} className="flex justify-between items-center p-2 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono">
                        <div className="min-w-0">
                          <span className="text-teal-400 font-bold block truncate">{m.key}</span>
                          <span className="text-slate-300 block truncate">{m.value}</span>
                        </div>
                        <button
                          onClick={() => deleteMemoryItem(m.key)}
                          className="p-1 rounded bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 cursor-pointer text-[8px]"
                        >
                          DEL
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-2.5 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Add New Memory Parameter</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={newMemoryKey}
                        onChange={(e) => setNewMemoryKey(e.target.value)}
                        placeholder="Key name..."
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newMemoryValue}
                        onChange={(e) => setNewMemoryValue(e.target.value)}
                        placeholder="Value..."
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={addMemoryItem}
                      className="w-full py-1 rounded-lg bg-teal-500 text-slate-950 font-black text-[9px] uppercase cursor-pointer hover:bg-teal-400"
                    >
                      Save Parameter
                    </button>
                  </div>
                </div>
              )}

              {activeTool === "reader" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleReadClipboard}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      📋 Paste Clipboard
                    </button>
                  </div>

                  <textarea
                    value={readerText}
                    onChange={(e) => setReaderText(e.target.value)}
                    placeholder="Extracting medical reports, textbooks, or PDFs..."
                    className="w-full h-24 p-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 focus:outline-none font-mono"
                  />

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Speed Rate: {readerSpeed.toFixed(1)}x</span>
                    <div className="flex gap-1">
                      {[0.8, 1.0, 1.2, 1.5].map(s => (
                        <button
                          key={s}
                          onClick={() => setReaderSpeed(s)}
                          className={`px-1 rounded text-[8px] ${readerSpeed === s ? 'bg-teal-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {readerPlaying ? (
                      <button
                        onClick={stopReaderAudio}
                        className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer"
                      >
                        Pause Synthesizer
                      </button>
                    ) : (
                      <button
                        onClick={startReaderAudio}
                        className="flex-1 py-1.5 bg-teal-500 text-slate-950 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                      >
                        Synthesize Document Voice
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTool === "mood" && (
                <div className="space-y-3 text-center py-2">
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-3xl">
                      {detectedMood === "focused" ? "🧘" :
                       detectedMood === "relaxed" ? "🍃" :
                       detectedMood === "energetic" ? "🔥" : "⚠️"}
                    </span>
                    <div className="text-left">
                      <span className="text-xs font-black uppercase text-slate-100 block">Sentiment: {detectedMood.toUpperCase()}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Analyzed via interactive input tempos</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-left space-y-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">AI Suggestions for you:</span>
                    <ul className="text-[9px] font-mono text-slate-400 uppercase space-y-1">
                      <li>• Recommended Radio: {detectedMood === "stress" ? "WDR 5 (Calm Talk)" : "Radio Köln (Energetic Hits)"}</li>
                      <li>• Eye Strain Level: Comfortable</li>
                      <li>• Recommended Action: Deep diaphragmatic breathing loop (3 cycles)</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setOrbState("speaking");
                      speakResponse("Initializing therapeutic soundscape and slow breathing sequence for your comfort.");
                    }}
                    className="w-full py-1.5 rounded-lg bg-teal-500 text-slate-950 font-black text-[10px] uppercase cursor-pointer hover:bg-teal-400"
                  >
                    Trigger relaxation exercise
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC MODALS FROM RIGHT UTILITIES DOCK */}
      <AnimatePresence>
        {activeRightMenu === "documents" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-950 border border-white/10 rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <span className="text-sm font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <FileText size={16} />
                  Clinical Documents Hub
                </span>
                <button onClick={() => setActiveRightMenu(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveView("whitepaper");
                    setActiveRightMenu(null);
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 text-left transition-all cursor-pointer flex flex-col gap-1"
                >
                  <BookOpen size={18} className="text-teal-400" />
                  <span className="text-xs font-black uppercase text-slate-200 mt-1">Review Whitepapers</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase leading-normal">Read guidelines, certifications and schema.</span>
                </button>

                <button
                  onClick={() => {
                    setIsUploadOpen(true);
                    setActiveRightMenu(null);
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 text-left transition-all cursor-pointer flex flex-col gap-1"
                >
                  <Upload size={18} className="text-teal-400 animate-bounce" />
                  <span className="text-xs font-black uppercase text-slate-200 mt-1">Ingest PDF Cases</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase leading-normal">Inject fresh medical PDF case file to parser.</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool("camera");
                    setCameraMode("bar");
                    setIsPanelExpanded(true);
                    setActiveRightMenu(null);
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 text-left transition-all cursor-pointer flex flex-col gap-1"
                >
                  <BarcodeIcon />
                  <span className="text-xs font-black uppercase text-slate-200 mt-1">OCR Scanning</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase leading-normal">Solve patient medical tags from clinical items.</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool("reader");
                    setIsPanelExpanded(true);
                    setActiveRightMenu(null);
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 text-left transition-all cursor-pointer flex flex-col gap-1"
                >
                  <Clipboard size={18} className="text-teal-400" />
                  <span className="text-xs font-black uppercase text-slate-200 mt-1">Clinical Reader</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase leading-normal">Speech synthesize textbooks, notes, reports.</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeRightMenu === "favorites" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-950 border border-white/10 rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <span className="text-sm font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <Star size={16} className="fill-teal-400 text-teal-400" />
                  Clinical Favorites
                </span>
                <button onClick={() => setActiveRightMenu(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                {favoritesList.map((fav, i) => (
                  <button
                    key={fav}
                    onClick={() => {
                      if (fav.includes("Workflow")) setActiveView("workflow");
                      else if (fav.includes("Radio")) setRadioKolnActive(!radioKolnActive);
                      else setActiveView("upgrades");
                      setActiveRightMenu(null);
                    }}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/20 rounded-xl text-xs font-bold text-slate-200 hover:text-white text-left flex items-center justify-between"
                  >
                    <span>{fav}</span>
                    <ChevronRight size={14} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeRightMenu === "more" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-4xl bg-slate-950/95 border border-white/15 rounded-[36px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Grid size={18} className="text-teal-400" />
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase tracking-widest block leading-none">CORE UTILITIES MODULE</span>
                    <h2 className="text-lg font-black uppercase text-white mt-1 leading-none">U.D.O. System Command Deck</h2>
                  </div>
                </div>
                <button onClick={() => setActiveRightMenu(null)} className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1. AI */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">🤖 Clinical AI</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveView("chat");
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      <span>Consensus Board</span>
                    </button>
                    <button
                      onClick={() => {
                        if (globalForceActiveListening) globalForceActiveListening();
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Mic size={14} />
                      <span>Nova Voice companion</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTool("translation");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Languages size={14} />
                      <span>Live Translation</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTool("memory");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Brain size={14} />
                      <span>Agent Memory</span>
                    </button>
                  </div>
                </div>

                {/* 2. MEDIA */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">📻 Media & Acoustics</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setRadioKolnActive(!radioKolnActive);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioIcon size={14} />
                        <span>Radio Köln Stream</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.2 rounded-full font-mono bg-orange-500/25 text-orange-400">FM</span>
                    </button>
                    <button
                      onClick={() => {
                        setAudioEnabled(!audioEnabled);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Volume2 size={14} />
                      <span>Ambient soundscape</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTool("reader");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <FileText size={14} />
                      <span>Spine Report Reader</span>
                    </button>
                  </div>
                </div>

                {/* 3. DOCUMENTS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">📄 Documents & Cases</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveView("whitepaper");
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <BookOpen size={14} />
                      <span>Review Whitepapers</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUploadOpen(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Upload size={14} />
                      <span>Ingest PDF Reports</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTool("camera");
                        setCameraMode("bar");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Camera size={14} />
                      <span>OCR Barcode scan</span>
                    </button>
                  </div>
                </div>

                {/* 4. UTILITIES & ACCESSIBILITY */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">⚙️ system settings</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveTool("automation");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Activity size={14} />
                      <span>Jarvis routines</span>
                    </button>
                    
                    {/* ACCESSIBILITY LAUNCHER */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Visual Adjustment</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFontScale(Math.max(0.8, fontScale - 0.1))}
                          className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs"
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setFontScale(Math.min(1.8, fontScale + 0.1))}
                          className="flex-1 py-1 bg-teal-500 text-slate-950 rounded-lg text-xs font-bold"
                        >
                          A+
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setColorblindMode(colorblindMode === "normal" ? "monochrome" : "normal");
                        }}
                        className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono uppercase"
                      >
                        Style: {colorblindMode === "normal" ? "Color Mode" : "Monochrome"}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTool("dashboard");
                        setIsPanelExpanded(true);
                        setActiveRightMenu(null);
                      }}
                      className="p-3 text-left bg-white/5 hover:bg-white/10 hover:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <LineChart size={14} />
                      <span>Performance Metrics</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RE-CONSOLIDATED BOTTOM RIGHT AI ORB */}
      <div 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 pointer-events-auto"
        id="jarvis-assistant-orb"
      >
        <div className="relative">
          <motion.button
            onClick={() => {
              if (orbState === "idle") {
                setOrbState("listening");
                speakResponse("System listening. Please ask your clinical or entertainment query.");
              } else {
                setOrbState("idle");
              }
            }}
            onDoubleClick={() => {
              setActiveTool("memory");
              setIsPanelExpanded(true);
              setOrbState("success");
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowRadialMenu(!showRadialMenu);
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all duration-300 shadow-2xl relative cursor-pointer ${
              orbState === "idle"
                ? "bg-slate-900 border-teal-400/50 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105"
                : orbState === "thinking"
                ? "bg-slate-900 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-105"
                : orbState === "listening"
                ? "bg-slate-900 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)] scale-110"
                : orbState === "speaking"
                ? "bg-slate-900 border-purple-400 shadow-[0_0_35px_rgba(192,132,252,0.7)] scale-110"
                : orbState === "error"
                ? "bg-slate-900 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-bounce"
                : "bg-slate-900 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-105"
            }`}
          >
            {/* Ambient Inner Core */}
            <div className={`absolute w-10 h-10 rounded-full opacity-60 transition-all duration-300 ${
              orbState === "idle" ? "bg-teal-400/20 blur-md" :
              orbState === "thinking" ? "bg-sky-400/30 blur-md animate-spin" :
              orbState === "listening" ? "bg-emerald-400/40 blur-md" :
              orbState === "speaking" ? "bg-purple-400/40 blur-md" :
              orbState === "error" ? "bg-red-500/40 blur-md" : "bg-emerald-500/40 blur-md"
            }`} />

            {/* Speaking Waveform or Active Core */}
            {orbState === "speaking" ? (
              <div className="flex items-center gap-[2px] h-4 z-10">
                {[1, 2, 3, 4, 5].map(bar => (
                  <motion.div
                    key={bar}
                    animate={{ height: [4, 16, 4] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: bar * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-[2px] bg-purple-400 rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                orbState === "idle" ? "bg-teal-400" :
                orbState === "thinking" ? "bg-sky-400 scale-90" :
                orbState === "listening" ? "bg-emerald-400 scale-110" :
                orbState === "error" ? "bg-red-500" : "bg-emerald-500"
              }`} />
            )}
          </motion.button>

          {/* Tooltip */}
          <div className="absolute right-0 bottom-16 bg-slate-950/90 border border-white/10 text-[9px] font-mono uppercase font-black tracking-widest text-teal-400 px-2 py-0.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
            {orbState}
          </div>
        </div>
      </div>
    </>
  );
}

function BarcodeIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2v14H3zm4 0h1v14H7zm3 0h3v14h-3zm5 0h1v14h-1zm3 0h3v14h-3z" />
    </svg>
  );
}
