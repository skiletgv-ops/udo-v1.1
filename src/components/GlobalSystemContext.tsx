import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient } from "../types";

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
  const [robotBubble, setRobotBubble] = useState<string | undefined>(
    "Welcome! I am U.D.O., your Gemini medical assistant. Use the system action menu or select a 3D module to begin."
  );
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [systemTime, setSystemTime] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);

  // Cologne Chat messages persistent state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "doctor",
      text: "Welcome to the U.D.O. Control Center! I am your Live Gemini AI medical assistant, equipped with the responsive and clear Nova Voice. I am ready to help you analyze patient reports, verify clinical guidelines, or calculate reductions in earning capacity. You can activate me anytime by saying 'UDO' followed by your question, or by using the microphone control below. Try saying: 'UDO, how can you help me with this project?' or 'What are the clinical guidelines?'",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Clock updates to show German/Cologne time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString("en-US", {
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
  }, []);

  // Sync robot speech and states to activeView transitions
  useEffect(() => {
    if (activeView) {
      setRobotState("WAVING");
      const name = activeView === "video" ? "3D Video Analysis" : 
                   activeView === "workflow" ? "6-Phase Workflow" : 
                   activeView === "upgrades" ? "Practice Upgrades" : 
                   activeView === "chat" ? "Gemini Live Chat" : "Analytics & ROI";
      setRobotBubble(`Switching to: ${name}. Let us review this!`);
      const timer = setTimeout(() => setRobotState("IDLE"), 2000);
      return () => clearTimeout(timer);
    } else {
      setRobotState("IDLE");
      setRobotBubble("Welcome to the U.D.O. Central System! Select an action or upload patient data to begin.");
    }
  }, [activeView]);

  // Dr. Altenberg quotes for Mascot Click triggers
  const DR_ALTENBERG_QUOTES = [
    "\"Welcome, colleague! High-fidelity medical analysis requires absolute clinical precision and evidence-based standards.\"",
    "\"When evaluating L4/L5 herniation, always confirm the radiological correlation with dermatomal deficits.\"",
    "\"U.D.O. is running on all cylinders. All consensus AI models have agreed on the diagnostic path!\"",
    "\"A complete, guidelines-compliant expert opinion prevents future disputes. Let us make this perfectly secure.\"",
    "\"Remember, clear communication is half of the healing process. Let us make the report easily readable.\""
  ];

  const handleRobotClick = () => {
    const randomIdx = Math.floor(Math.random() * DR_ALTENBERG_QUOTES.length);
    const rawQuote = DR_ALTENBERG_QUOTES[randomIdx];
    setRobotState("HAPPY");
    setRobotBubble(rawQuote);

    setTimeout(() => {
      setRobotState("IDLE");
    }, 4000);
  };

  const handleRobotStateChange = (state: RobotState) => {
    setRobotState(state);
    if (state === "THINKING") {
      setRobotBubble("I am aligning with Gemini and consensus guidelines. Just a moment, colleague...");
    } else if (state === "SURPRISED") {
      setRobotBubble("Oh! Something seems inconsistent in the patient record. Please double check.");
    } else if (state === "HAPPY") {
      setRobotBubble("Excellent work! All findings have been verified successfully.");
    }
  };

  // Quick helper to switch view and auto-manage panel state
  const handleQuickModuleJump = (viewId: string | null) => {
    setActiveView(viewId);
    setIsMasterMenuOpen(false);
  };

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
        handleQuickModuleJump
      }}
    >
      {children}
    </GlobalSystemContext.Provider>
  );
}
