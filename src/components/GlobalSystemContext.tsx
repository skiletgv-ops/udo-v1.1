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
  | "HAPPY";

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
  handleGlobalSendMessage: (text: string) => Promise<void>;
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
    "Welcome! I am U.D.O., your clinical assistant. Use the system action menu or select a 3D module to begin."
  );
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [systemTime, setSystemTime] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);

  // Custom Accessibility & Audio Settings
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [colorblindMode, setColorblindMode] = useState<"normal" | "deuteranopia" | "protanopia" | "tritanopia" | "monochrome" | "high-contrast">("normal");
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [radioKolnActive, setRadioKolnActive] = useState<boolean>(false);

  // Sync background drone sound state
  useEffect(() => {
    if (audioEnabled) {
      startAmbientDrone();
    } else {
      stopAmbientDrone();
    }
  }, [audioEnabled]);

  // Sync Radio Köln sequencer state
  useEffect(() => {
    if (radioKolnActive && audioEnabled) {
      startRadioKolnSequencer();
    } else {
      stopRadioKolnSequencer();
    }
  }, [radioKolnActive, audioEnabled]);

  // Custom Voice Settings
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Default realistic speed
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Dynamically load system voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
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
      text: "Welcome to the U.D.O. Control Center! I am your personal U.D.O. Clinical & Forensic Medicine Specialist. Addressing you, my esteemed colleague in neurology, I am prepared to collaborate on complex cases, guideline adherence, or MdE evaluations. Feel free to speak directly or type your clinical inquiry. You can activate me anytime by saying 'UDO' followed by your question, or by using the microphone control below. Try saying: 'UDO, how can you help me with this project?' or 'What are the clinical guidelines?'",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Refs for speaking-listening coordination
  const stopListeningRef = React.useRef<(() => void) | null>(null);
  const startListeningRef = React.useRef<(() => void) | null>(null);

  // Translate initial welcome message & default bubbles on language toggle
  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === "init-1") {
        return [
          {
            id: "init-1",
            sender: "doctor",
            text: language === "de"
              ? "Willkommen im U.D.O. Kontrollzentrum! Ich bin Ihr persönlicher U.D.O. Medizinischer Konsiliardienst. Als Kollegin in der Neurologie unterstütze ich Sie mit Leitlinien und MdE-Analysen. Sprechen Sie einfach direkt mit mir oder tippen Sie Ihre Frage ein. Sie können mich jederzeit aktivieren, indem Sie 'UDO' gefolgt von Ihrer Frage sagen, oder indem Sie die Mikrofonsteuerung unten verwenden."
              : "Welcome to the U.D.O. Control Center! I am your personal U.D.O. Clinical & Forensic Medicine Specialist. Addressing you, my esteemed colleague in neurology, I am prepared to collaborate on complex cases, guideline adherence, or MdE evaluations. Feel free to speak directly or type your clinical inquiry. You can activate me anytime by saying 'UDO' followed by your question, or by using the microphone control below.",
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });

    setRobotBubble(prev => {
      if (!prev) return prev;
      if (prev.startsWith("Welcome! I am U.D.O.") || prev.startsWith("Willkommen! Ich bin U.D.O.")) {
        return language === "de"
          ? "Willkommen! Ich bin U.D.O., Ihr medizinischer Experte. Nutzen Sie das System-Aktionsmenü oder wählen Sie ein Modul, um zu beginnen."
          : "Welcome! I am U.D.O., your clinical assistant. Use the system action menu or select a module to begin.";
      }
      if (prev.startsWith("Switching to:") || prev.startsWith("Wechsle zu:")) {
        const name = activeView === "video" ? (language === "de" ? "3D-Videobewegungsanalyse" : "3D Video Analysis") : 
                     activeView === "workflow" ? (language === "de" ? "6-Phasen-Workflow" : "6-Phase Workflow") : 
                     activeView === "upgrades" ? (language === "de" ? "Praxis-Upgrades" : "Practice Upgrades") : 
                     activeView === "chat" ? (language === "de" ? "U.D.O. Konsiliardienst" : "U.D.O. Live Consultation") : 
                     (language === "de" ? "Kennzahlen & ROI-Board" : "Analytics & ROI");
        return language === "de"
          ? `Wechsle zu: ${name}. Lassen Sie uns das überprüfen!`
          : `Switching to: ${name}. Let us review this!`;
      }
      if (prev.startsWith("Welcome to the U.D.O. Central System!") || prev.startsWith("Willkommen im U.D.O. Zentralsystem!")) {
        return language === "de"
          ? "Willkommen im U.D.O. Zentralsystem! Wählen Sie eine Aktion oder laden Sie Patientendaten hoch, um zu beginnen."
          : "Welcome to the U.D.O. Central System! Select an action or upload patient data to begin.";
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
                   activeView === "chat" ? (language === "de" ? "U.D.O. Konsiliardienst" : "U.D.O. Live Consultation") : 
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
          ? "Willkommen im U.D.O. Zentralsystem! Wählen Sie eine Aktion oder laden Sie Patientendaten hoch, um zu beginnen."
          : "Welcome to the U.D.O. Central System! Select an action or upload patient data to begin."
      );
    }
  }, [activeView, language]);

  // Dr. Altenberg quotes for Mascot Click triggers (localized)
  const DR_ALTENBERG_QUOTES = {
    en: [
      "\"Welcome, colleague! High-fidelity medical analysis requires absolute clinical precision and evidence-based standards.\"",
      "\"When evaluating L4/L5 herniation, always confirm the radiological correlation with dermatomal deficits.\"",
      "\"U.D.O. is running on all cylinders. All consensus AI board members have agreed on the diagnostic path!\"",
      "\"A complete, guidelines-compliant expert opinion prevents future disputes. Let us make this perfectly secure.\"",
      "\"Remember, clear communication is half of the healing process. Let us make the report easily readable.\""
    ],
    de: [
      "\"Willkommen, Kollegin! Hochpräzise medizinische Analysen erfordern absolute klinische Präzision und evidenzbasierte Standards.\"",
      "\"Bestätigen Sie bei der Beurteilung eines L4/L5-Bandscheibenvorfalls immer die radiologische Korrelation mit dermatomalen Defiziten.\"",
      "\"U.D.O. läuft auf allen Zylindern. Alle Konsens-KI-Fachärzte haben sich auf den diagnostischen Weg geeinigt!\"",
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
      selectedVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith(targetLangPrefix) && 
        (v.name.toLowerCase().includes("natural") || 
         v.name.toLowerCase().includes("google") || 
         v.name.toLowerCase().includes("katja") ||
         v.name.toLowerCase().includes("hedda") ||
         v.name.toLowerCase().includes("stefan") ||
         v.name.toLowerCase().includes("zira") ||
         v.name.toLowerCase().includes("samantha"))
      );
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

  const handleGlobalSendMessage = useCallback(async (textToSend: string) => {
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
        body: JSON.stringify({ message: textToSend, language })
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
  }, [language, isGlobalChatLoading, speakResponse]);

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
        setRadioKolnActive
      }}
    >
      {children}
    </GlobalSystemContext.Provider>
  );
}
