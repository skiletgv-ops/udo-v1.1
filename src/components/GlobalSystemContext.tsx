import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Patient } from "../types";
import { useWakeWordListener, WakeWordListeningState } from "../hooks/useWakeWordListener";
import { 
  startAmbientDrone, 
  stopAmbientDrone, 
  startRadioKolnSequencer, 
  stopRadioKolnSequencer 
} from "../utils/audioSynth";

export type RobotState =
  | "IDLE"
  | "TRACKING"
  | "WAVING"
  | "SPEAKING"
  | "THINKING"
  | "POINTING"
  | "SURPRISED"
  | "HAPPY"
  | "ATTENTION"
  | "PROCESSING"
  | "SUCCESS"
  | "ERROR"
  | "EXPORT";

export interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: string;
}

interface GlobalSystemContextType {
  activeView: string | null;
  setActiveView: (view: string | null) => void;
  robotState: RobotState;
  setRobotState: (state: RobotState) => void;
  robotBubble: string | undefined;
  setRobotBubble: (bubble: string | undefined) => void;
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
  systemTime: string;
  isMaximized: boolean;
  setIsMaximized: (maximized: boolean) => void;
  isMasterMenuOpen: boolean;
  setIsMasterMenuOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleRobotClick: () => void;
  handleRobotStateChange: (state: RobotState) => void;
  handleQuickModuleJump: (viewId: string | null) => void;
  language: "en" | "de";
  setLanguage: (lang: "en" | "de") => void;
  isVoiceMuted: boolean;
  setIsVoiceMuted: (muted: boolean) => void;
  speakResponse: (text: string, forceLang?: "en" | "de") => void;
  globalListeningState: WakeWordListeningState;
  globalStartListening: () => void;
  globalStopListening: () => void;
  globalForceActiveListening: () => void;
  globalIsSupported: boolean;
  handleGlobalSendMessage: (text: string, neuralExpressive?: boolean) => Promise<void>;
  isGlobalChatLoading: boolean;
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string | null) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  availableVoices: SpeechSynthesisVoice[];
  
  // Accessibility & Audio additions
  fontScale: number;
  setFontScale: (scale: number) => void;
  colorblindMode: "normal" | "deuteranopia" | "protanopia" | "tritanopia" | "monochrome" | "high-contrast";
  setColorblindMode: (mode: "normal" | "deuteranopia" | "protanopia" | "tritanopia" | "monochrome" | "high-contrast") => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  radioKolnActive: boolean;
  setRadioKolnActive: (active: boolean) => void;
  lineHeightScale: number;
  setLineHeightScale: (scale: number) => void;
  fontWeightScale: number;
  setFontWeightScale: (scale: number) => void;
  eyeWarmthScale: number;
  setEyeWarmthScale: (scale: number) => void;

  // AI Agent Memory and Sync States
  memoryRecords: MemoryRecord[];
  addMemoryRecord: (record: Omit<MemoryRecord, "id" | "timestamp">) => void;
  syncStatus: "synced" | "saving" | "error";
  setSyncStatus: (status: "synced" | "saving" | "error") => void;
  clearMemory: () => void;
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  isLiveTalkOpen: boolean;
  setIsLiveTalkOpen: (open: boolean) => void;
}

export interface MemoryRecord {
  id: string;
  type: "text" | "voice";
  patientName?: string;
  problemSolved?: string;
  timestamp: string;
  rawText: string;
}

const GlobalSystemContext = createContext<GlobalSystemContextType | undefined>(undefined);

export function useGlobalSystem() {
  const context = useContext(GlobalSystemContext);
  if (!context) {
    throw new Error("useGlobalSystem must be used within a GlobalSystemProvider");
  }
  return context;
}

export function GlobalSystemProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [robotState, setRobotState] = useState<RobotState>("IDLE");
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [robotBubble, setRobotBubble] = useState<string | undefined>(
    "Welcome! I am UDO, your clinical assistant. Use the system action menu or select a 3D module to begin."
  );
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [systemTime, setSystemTime] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);

  // Custom Accessibility & Audio Settings
  const [fontScale, setFontScale] = useState<number>(1.1); // Increased baseline for more readable fonts by default
  const [colorblindMode, setColorblindMode] = useState<"normal" | "deuteranopia" | "protanopia" | "tritanopia" | "monochrome" | "high-contrast">("normal");
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [radioKolnActive, setRadioKolnActive] = useState<boolean>(false);
  const [lineHeightScale, setLineHeightScale] = useState<number>(1.5);
  const [fontWeightScale, setFontWeightScale] = useState<number>(1); // 0: light, 1: normal, 2: medium, 3: bold
  const [eyeWarmthScale, setEyeWarmthScale] = useState<number>(0); // 0 to 5

  // AI Agent Memory and Sync States
  const [memoryRecords, setMemoryRecords] = useState<MemoryRecord[]>([]);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "error">("synced");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLiveTalkOpen, setIsLiveTalkOpen] = useState(false);

  // Load initial memory records on mount
  useEffect(() => {
    const saved = localStorage.getItem("udo_ai_memories");
    if (saved) {
      try {
        setMemoryRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load clinical memory", e);
      }
    } else {
      // Seed some starting memories for contextual elegance
      const seedMemories: MemoryRecord[] = [
        {
          id: "seed-1",
          type: "text",
          patientName: "G. Müller",
          problemSolved: "L4/L5 Protrusion confirmed via Dr. Clara segment mapping",
          timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(),
          rawText: "Aligned S2k radiological correlation for patient G. Müller in spinal segment L4/L5."
        },
        {
          id: "seed-2",
          type: "voice",
          patientName: "F. Schneider",
          problemSolved: "Consensus debate completed; 4-0 voting in favor of trauma causality",
          timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString(),
          rawText: "Completed consensus session for occupational spinal lifting injury."
        }
      ];
      setMemoryRecords(seedMemories);
      localStorage.setItem("udo_ai_memories", JSON.stringify(seedMemories));
    }
  }, []);

  const addMemoryRecord = useCallback((record: Omit<MemoryRecord, "id" | "timestamp">) => {
    setSyncStatus("saving");
    setTimeout(() => {
      const newRecord: MemoryRecord = {
        ...record,
        id: `mem-${Date.now()}`,
        timestamp: new Date().toLocaleString()
      };
      setMemoryRecords(prev => {
        const updated = [newRecord, ...prev];
        localStorage.setItem("udo_ai_memories", JSON.stringify(updated));
        return updated;
      });
      setSyncStatus("synced");
    }, 1200); // Elegant cloud synchronization delay
  }, []);

  const clearMemory = useCallback(() => {
    setSyncStatus("saving");
    setTimeout(() => {
      setMemoryRecords([]);
      localStorage.removeItem("udo_ai_memories");
      setSyncStatus("synced");
    }, 800);
  }, []);

  // Sync background drone sound state (Fully removed ambient drone and old background sequencer)
  useEffect(() => {
    // Ambient drone fully disabled
  }, [audioEnabled]);

  // Sync Radio Köln state (Disabled legacy context-level sequencer and audio sync)
  useEffect(() => {
    // Disabled legacy context-level sequencer
  }, [radioKolnActive, audioEnabled]);

  // Custom Voice Settings
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.8); // Default realistic speed set to 0.8x
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Dynamically load system voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Auto-select DE MS HEDDA if available
      const hedda = voices.find(v => v.name.toLowerCase().includes("hedda") || v.voiceURI.toLowerCase().includes("hedda"));
      if (hedda) {
        setSelectedVoiceURI(hedda.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cologne Chat messages persistent state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "doctor",
      text: "Guten Tag, liebe Frau Doctor Bongartz! Willkommen im UDO Kontrollzentrum. Ich bin Ihr lehrreicher, hochinformativer und humorvoller KI-Konsiliardienst. Ich liefere Ihnen zu jeder Anfrage eine Fall-Zusammenfassung, Stimmungs-Analyse (Traurig/Wütend/Besorgt/Neutral), einen spontanen kollegialen Witz und die 4-KI-Konsil-Abstimmung (UDO Clara, Eric, Marcus & Gratsiano). Wie kann unser Konsil Ihnen heute helfen?",
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Refs for speaking-listening coordination
  const stopListeningRef = React.useRef<(() => void) | null>(null);
  const startListeningRef = React.useRef<(() => void) | null>(null);
  const listeningStateRef = React.useRef<WakeWordListeningState>("idle");

  // Translate initial welcome message & default bubbles on language toggle
  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === "init-1") {
        return [
          {
            id: "init-1",
            sender: "doctor",
            text: language === "de"
              ? "Guten Tag, liebe Frau Doctor Bongartz! Willkommen im UDO Kontrollzentrum. Ich bin Ihr lehrreicher, hochinformativer und humorvoller KI-Konsiliardienst. Ich liefere Ihnen zu jeder Anfrage eine Fall-Zusammenfassung, Stimmungs-Analyse (Traurig/Wütend/Besorgt/Neutral), einen spontanen kollegialen Witz und die 4-KI-Konsil-Abstimmung (UDO Clara, Eric, Marcus & Gratsiano). Wie kann unser Konsil Ihnen heute helfen?"
              : "Greetings, Doctor Bongartz! Welcome to the UDO Control Center. I am your educational, highly informational, and witty AI consultant. Every response includes a case summary, sentiment check (sad/mad/anxious/neutral), a spontaneous joke for you, and a 4-AI research consensus vote (UDO Clara, Eric, Marcus & Gratsiano). How may our panel assist you today?",
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });

    setRobotBubble(prev => {
      if (!prev) return prev;
      if (prev.startsWith("Welcome! I am UDO") || prev.startsWith("Willkommen! Ich bin UDO")) {
        return language === "de"
          ? "Willkommen! Ich bin UDO, Ihr medizinischer Experte. Nutzen Sie das System-Aktionsmenü oder wählen Sie ein Modul, um zu beginnen."
          : "Welcome! I am UDO, your clinical assistant. Use the system action menu or select a module to begin.";
      }
      if (prev.startsWith("Switching to:") || prev.startsWith("Wechsle zu:")) {
        const name = activeView === "video" ? (language === "de" ? "3D-Videobewegungsanalyse" : "3D Video Analysis") : 
                     activeView === "workflow" ? (language === "de" ? "6-Phasen-Workflow" : "6-Phase Workflow") : 
                     activeView === "upgrades" ? (language === "de" ? "Praxis-Upgrades" : "Practice Upgrades") : 
                     activeView === "chat" ? (language === "de" ? "UDO Konsiliardienst" : "UDO Live Consultation") : 
                     (language === "de" ? "Kennzahlen & ROI-Board" : "Analytics & ROI");
        return language === "de"
          ? `Wechsle zu: ${name}. Lassen Sie uns das überprüfen!`
          : `Switching to: ${name}. Let us review this!`;
      }
      if (prev.startsWith("Welcome to the UDO Central System!") || prev.startsWith("Willkommen im UDO Zentralsystem!")) {
        return language === "de"
          ? "Willkommen im UDO Zentralsystem! Wählen Sie eine Aktion oder laden Sie Patientendaten hoch, um zu beginnen."
          : "Welcome to the UDO Central System! Select an action or upload patient data to begin.";
      }
      return prev;
    });
  }, [language, activeView]);

  // Clock updates to show German/Cologne time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString(language === "de" ? "de-DE" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Berlin"
        }) + " CET"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Sync robot speech and states to activeView transitions
  useEffect(() => {
    if (activeView) {
      setRobotState("WAVING");
      const name = activeView === "video" ? (language === "de" ? "3D-Videobewegungsanalyse" : "3D Video Analysis") : 
                   activeView === "workflow" ? (language === "de" ? "6-Phasen-Workflow" : "6-Phase Workflow") : 
                   activeView === "upgrades" ? (language === "de" ? "Praxis-Upgrades" : "Practice Upgrades") : 
                   activeView === "chat" ? (language === "de" ? "UDO Konsiliardienst" : "UDO Live Consultation") : 
                   (language === "de" ? "Kennzahlen & ROI-Board" : "Analytics & ROI");
      setRobotBubble(
        language === "de" 
          ? `Wechsle zu: ${name}. Lassen Sie uns das überprüfen!` 
          : `Switching to: ${name}. Let us review this!`
      );
      const timer = setTimeout(() => setRobotState("IDLE"), 2000);
      return () => clearTimeout(timer);
    } else {
      setRobotState("IDLE");
      setRobotBubble(
        language === "de"
          ? "Willkommen im UDO Zentralsystem! Wählen Sie eine Aktion oder laden Sie Patientendaten hoch, um zu beginnen."
          : "Welcome to the UDO Central System! Select an action or upload patient data to begin."
      );
    }
  }, [activeView, language]);

  // Dr. Altenberg quotes for Mascot Click triggers (localized)
  const DR_ALTENBERG_QUOTES = {
    en: [
      "\"Welcome, colleague! High-fidelity medical analysis requires absolute clinical precision and evidence-based standards.\"",
      "\"When evaluating L4/L5 herniation, always confirm the radiological correlation with dermatomal deficits.\"",
      "\"UDO is running on all cylinders. All consensus AI board members have agreed on the diagnostic path!\"",
      "\"A complete, guidelines-compliant expert opinion prevents future disputes. Let us make this perfectly secure.\"",
      "\"Remember, clear communication is half of the healing process. Let us make the report easily readable.\""
    ],
    de: [
      "\"Willkommen, Kollegin! Hochpräzise medizinische Analysen erfordern absolute klinische Präzision und evidenzbasierte Standards.\"",
      "\"Bestätigen Sie bei der Beurteilung eines L4/L5-Bandscheibenvorfalls immer die radiologische Korrelation mit dermatomalen Defiziten.\"",
      "\"UDO läuft auf allen Zylindern. Alle Konsens-KI-Fachärzte haben sich auf den diagnostischen Weg geeinigt!\"",
      "\"Ein vollständiges, richtlinienkonformes Gutachten verhindert zukünftige Streitigkeiten. Machen wir es absolut rechtssicher.\"",
      "\"Denken Sie daran: Klare Kommunikation ist die halbe Heilung. Gestalten wir das Gutachten leicht lesbar.\""
    ]
  };

  const handleRobotClick = () => {
    const quotesList = DR_ALTENBERG_QUOTES[language];
    const randomIdx = Math.floor(Math.random() * quotesList.length);
    const rawQuote = quotesList[randomIdx];
    setRobotState("HAPPY");
    setRobotBubble(rawQuote);

    setTimeout(() => {
      setRobotState("IDLE");
    }, 4000);
  };

  const handleRobotStateChange = (state: RobotState) => {
    setRobotState(state);
    if (state === "THINKING") {
      setRobotBubble(
        language === "de"
          ? "Ich stimme mich mit der Fachjury und den Konsensrichtlinien ab. Einen Moment, liebe Kollegin..."
          : "I am aligning with our clinical consensus board and guidelines. Just a moment, dear colleague..."
      );
    } else if (state === "SURPRISED") {
      setRobotBubble(
        language === "de"
          ? "Oh! Etwas im Datensatz scheint widersprüchlich zu sein. Bitte überprüfen Sie es genau."
          : "Oh! Something seems inconsistent in the data. Please double check, colleague."
      );
    } else if (state === "HAPPY") {
      setRobotBubble(
        language === "de"
          ? "Hervorragende Arbeit! Alle Befunde wurden erfolgreich verifiziert."
          : "Excellent work! All findings have been verified successfully."
      );
    }
  };

  // Quick helper to switch view and auto-manage panel state
  const handleQuickModuleJump = (viewId: string | null) => {
    setActiveView(viewId);
    setIsMasterMenuOpen(false);
  };

  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isGlobalChatLoading, setIsGlobalChatLoading] = useState(false);

  const speakResponse = useCallback((text: string, forceLang?: "en" | "de") => {
    if (isVoiceMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Stop listening temporarily so we don't hear our own voice
    if (stopListeningRef.current) {
      try {
        stopListeningRef.current();
      } catch (err) {}
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_\[\]\(\)]/g, ""); // strip markdown formatting for TTS
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = forceLang || language;
    utterance.lang = targetLang === "de" ? "de-DE" : "en-US";
    utterance.rate = speechRate; // Customizable speed (e.g. 1.0)
    
    // Try to find a high-quality native voice or custom-chosen voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

    if (!selectedVoice) {
      const targetLangPrefix = targetLang === "de" ? "de" : "en";
      
      // Look for Hedda specifically first if German
      if (targetLangPrefix === "de") {
        selectedVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith("de") && 
          v.name.toLowerCase().includes("hedda")
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith(targetLangPrefix) && 
          (v.name.toLowerCase().includes("hedda") ||
           v.name.toLowerCase().includes("natural") || 
           v.name.toLowerCase().includes("google") || 
           v.name.toLowerCase().includes("katja") ||
           v.name.toLowerCase().includes("stefan") ||
           v.name.toLowerCase().includes("zira") ||
           v.name.toLowerCase().includes("samantha"))
        );
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangPrefix));
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (startListeningRef.current) {
        try {
          startListeningRef.current();
        } catch (err) {}
      }
    };
    utterance.onerror = () => {
      if (startListeningRef.current) {
        try {
          startListeningRef.current();
        } catch (err) {}
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isVoiceMuted, language, selectedVoiceURI, speechRate]);

  const handleGlobalSendMessage = useCallback(async (textToSend: string, neuralExpressive?: boolean) => {
    if (!textToSend.trim() || isGlobalChatLoading) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(language === "de" ? "de-DE" : "en-US", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGlobalChatLoading(true);
    setRobotState("THINKING");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, language, neuralExpressive })
      });
      const data = await response.json();

      const replyText = data.response || data.content || (language === "de" ? "Ich entschuldige mich, Kollegin. Ein Übertragungsfehler ist aufgetreten." : "I apologize, colleague. A transmission error occurred. Could you please try again?");

      const doctorMsg = {
        id: `msg-doc-${Date.now()}`,
        sender: "doctor" as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString(language === "de" ? "de-DE" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages((prev) => [...prev, doctorMsg]);
      setRobotState("SPEAKING");
      setRobotBubble(replyText);
      speakResponse(replyText);

      // Automatic Clinical Memory Inference
      let parsedName: string | undefined = undefined;
      let parsedProblem: string | undefined = undefined;

      const nameMatches = textToSend.match(/(?:patient|herr|frau|dr\.|mr\.|mrs\.|med\.)\s+([A-Z][a-zßüöä]+)/i);
      if (nameMatches && nameMatches[1]) {
        parsedName = nameMatches[1];
      } else if (activePatient?.name) {
        parsedName = activePatient.name;
      }

      if (textToSend.toLowerCase().includes("guideline") || textToSend.toLowerCase().includes("leitlinie")) {
        parsedProblem = language === "de" ? "AWMF S2k Leitlinie analysiert" : "S2k Clinical guideline alignment analyzed";
      } else if (textToSend.toLowerCase().includes("mde") || textToSend.toLowerCase().includes("earning")) {
        parsedProblem = language === "de" ? "MdE-Einschätzung berechnet" : "MdE evaluation performed";
      } else if (textToSend.toLowerCase().includes("herniation") || textToSend.toLowerCase().includes("vorfall") || textToSend.toLowerCase().includes("l4/l5") || textToSend.toLowerCase().includes("l5/s1")) {
        parsedProblem = language === "de" ? "Wirbelsäulen-Segmentanalyse durchgeführt" : "Lumbar spine segment structural review";
      } else {
        parsedProblem = language === "de" ? "Klinische Beratung archiviert" : "Clinical consultation recorded";
      }

      addMemoryRecord({
        type: listeningStateRef.current !== "idle" ? "voice" : "text",
        patientName: parsedName,
        problemSolved: parsedProblem,
        rawText: `Q: ${textToSend.substring(0, 80)}${textToSend.length > 80 ? "..." : ""} | A: ${replyText.substring(0, 100)}...`
      });

    } catch (error) {
      console.error("Global Chat error:", error);
      setRobotState("SURPRISED");
      
      const errorMsg = {
        id: `msg-err-${Date.now()}`,
        sender: "doctor" as const,
        text: language === "de" ? "Ich habe eine Serverstörung erlebt. Könnten wir diese Frage noch einmal versuchen, liebe Kollegin?" : "I experienced a server disruption. Could we try that question again, dear colleague?",
        timestamp: new Date().toLocaleTimeString(language === "de" ? "de-DE" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
      speakResponse(errorMsg.text);
    } finally {
      setIsGlobalChatLoading(false);
    }
  }, [language, isGlobalChatLoading, speakResponse, activePatient, addMemoryRecord]);

  // Global continuous wake-word listener looking for 'UDO'
  const {
    listeningState: globalListeningState,
    requestPermission: globalRequestPermission,
    startListening: globalStartListening,
    stopListening: globalStopListening,
    forceActiveListening: globalForceActiveListening,
    isSupported: globalIsSupported
  } = useWakeWordListener({
    lang: language === "de" ? "de-DE" : "en-US",
    onWakeWordDetected: () => {
      setRobotState("HAPPY");
      const wakeReply = language === "de"
        ? "Ja, Frau Dr. Altenberg? Ich höre aufmerksam zu. Wie kann ich Ihnen heute helfen?"
        : "Yes, esteemed colleague? I am listening. How can I help you today?";
      
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speakResponse(wakeReply);
      setActiveView("chat");
      
      const sysMsg = {
        id: `msg-wake-${Date.now()}`,
        sender: "doctor" as const,
        text: (language === "de" ? "[Sprachaktiviert] " : "[Voice Activated] ") + wakeReply,
        timestamp: new Date().toLocaleTimeString(language === "de" ? "de-DE" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, sysMsg]);
    },
    onCommandDetected: (commandText) => {
      // Direct command trigger
      handleGlobalSendMessage(commandText);
    },
    onError: (err) => {
      console.log("[Global UDO Voice Status]:", err);
    }
  });

  // Synchronize listeningStateRef
  useEffect(() => {
    listeningStateRef.current = globalListeningState;
  }, [globalListeningState]);

  // Keep references updated
  stopListeningRef.current = globalStopListening;
  startListeningRef.current = globalStartListening;

  // Automatically start voice wake word listener globally on mount only if permission was already granted
  useEffect(() => {
    const savedPermission = localStorage.getItem("udo_mic_permission");
    if (savedPermission === "granted" && globalIsSupported) {
      globalStartListening();
    }
    return () => {
      globalStopListening();
    };
  }, [language, globalStartListening, globalStopListening, globalIsSupported]);

  return (
    <GlobalSystemContext.Provider
      value={{
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
        chatMessages,
        setChatMessages,
        handleRobotClick,
        handleRobotStateChange,
        handleQuickModuleJump,
        language,
        setLanguage,
        isVoiceMuted,
        setIsVoiceMuted,
        speakResponse,
        globalListeningState,
        globalStartListening,
        globalStopListening,
        globalForceActiveListening,
        globalIsSupported,
        handleGlobalSendMessage,
        isGlobalChatLoading,
        selectedVoiceURI,
        setSelectedVoiceURI,
        speechRate,
        setSpeechRate,
        availableVoices,
        fontScale,
        setFontScale,
        colorblindMode,
        setColorblindMode,
        audioEnabled,
        setAudioEnabled,
        radioKolnActive,
        setRadioKolnActive,
        lineHeightScale,
        setLineHeightScale,
        fontWeightScale,
        setFontWeightScale,
        eyeWarmthScale,
        setEyeWarmthScale,
        memoryRecords,
        addMemoryRecord,
        syncStatus,
        setSyncStatus,
        clearMemory,
        isUploadOpen,
        setIsUploadOpen,
        isLiveTalkOpen,
        setIsLiveTalkOpen
      }}
    >
      {children}
    </GlobalSystemContext.Provider>
  );
}
