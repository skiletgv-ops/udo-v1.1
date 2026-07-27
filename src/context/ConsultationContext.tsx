import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface PatientData {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  insurance: string;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  senderName?: string;
}

export type OrbState = "idle" | "listening" | "thinking" | "speaking" | "success" | "error";

export interface ApiCallStatus {
  status: "idle" | "pending" | "success" | "error";
  lastError?: string;
  lastResponsePayload?: any;
  timestamp?: string;
}

interface ConsultationContextType {
  // States
  conversationHistory: ConversationTurn[];
  patientData: PatientData;
  reason: string;
  urgency: "emergency" | "urgent" | "routine";
  callComplete: boolean;
  consentGiven: boolean;
  orbState: OrbState;
  apiStatus: ApiCallStatus;
  isRecording: boolean;
  interimTranscript: string;
  speechSupported: boolean;
  isChatOpen: boolean;
  selectedSlotId?: string;

  // Actions
  startVoiceRecording: () => void;
  stopVoiceRecording: () => void;
  toggleVoiceRecording: () => void;
  sendTextMessage: (text: string) => Promise<void>;
  resetConsultation: () => void;
  setIsChatOpen: (open: boolean) => void;
}

const INITIAL_PATIENT: PatientData = {
  first_name: "",
  last_name: "",
  dob: "",
  phone: "",
  insurance: "statutory"
};

const ConsultationContext = createContext<ConsultationContextType | null>(null);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [patientData, setPatientData] = useState<PatientData>(INITIAL_PATIENT);
  const [reason, setReason] = useState<string>("");
  const [urgency, setUrgency] = useState<"emergency" | "urgent" | "routine">("routine");
  const [callComplete, setCallComplete] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);

  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const [apiStatus, setApiStatus] = useState<ApiCallStatus>({ status: "idle" });

  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Speak text helper
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setOrbState("speaking");
    };

    utterance.onend = () => {
      setOrbState(callComplete ? "success" : "idle");
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setOrbState(callComplete ? "success" : "idle");
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Core API communication
  const processTurn = async (userText: string) => {
    if (!userText.trim()) return;

    const timeStr = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const updatedTurn: ConversationTurn = {
      role: "user",
      content: userText,
      timestamp: timeStr,
      senderName: "Patient"
    };

    const newHistory = [...conversationHistory, updatedTurn];
    setConversationHistory(newHistory);
    setOrbState("thinking");
    setApiStatus({ status: "pending", timestamp: new Date().toISOString() });

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationHistory: newHistory.map(h => ({
            role: h.role === "user" ? "user" : "model",
            content: h.content
          })),
          known_patient: patientData,
          language: "de"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();

      setApiStatus({
        status: "success",
        lastResponsePayload: data,
        timestamp: new Date().toISOString()
      });

      if (data.patient) {
        setPatientData(prev => ({
          first_name: data.patient.first_name || prev.first_name,
          last_name: data.patient.last_name || prev.last_name,
          dob: data.patient.dob || prev.dob,
          phone: data.patient.phone || prev.phone,
          insurance: data.patient.insurance || prev.insurance
        }));
      }

      if (data.reason) setReason(data.reason);
      if (data.urgency) setUrgency(data.urgency);
      if (data.call_complete !== undefined) setCallComplete(data.call_complete);
      if (data.consent_given !== undefined) setConsentGiven(data.consent_given);
      if (data.selected_slot_id) setSelectedSlotId(data.selected_slot_id);

      const aiReply = data.reply_to_patient || "Vielen Dank für Ihre Angabe. Wie kann ich Ihnen weiterhelfen?";

      const aiTurn: ConversationTurn = {
        role: "assistant",
        content: aiReply,
        timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        senderName: "UDO Consultant"
      };

      setConversationHistory([...newHistory, aiTurn]);

      // Speak response
      speakText(aiReply, () => {
        if (data.call_complete) {
          setOrbState("success");
        } else {
          setOrbState("idle");
        }
      });

    } catch (err: any) {
      console.error("Consultation turn error:", err);
      const errorMsg = "Ich habe derzeit ein Verbindungsproblem mit dem KI-Server. Bitte versuchen Sie es erneut oder rufen Sie unsere Praxis direkt an.";
      
      setApiStatus({
        status: "error",
        lastError: err.message || "Netzwerkfehler",
        timestamp: new Date().toISOString()
      });

      const aiTurn: ConversationTurn = {
        role: "assistant",
        content: errorMsg,
        timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        senderName: "System"
      };

      setConversationHistory([...newHistory, aiTurn]);
      setOrbState("error");

      speakText(errorMsg, () => {
        setOrbState("idle");
      });
    }
  };

  // Start Speech Recognition
  const startVoiceRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Ihr Browser unterstützt das integrierte Web Speech API Diktat nicht. Nutzen Sie bitte das Text-Chat-Feld.");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setOrbState("listening");
      setInterimTranscript("");
    };

    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalStr += transcriptChunk;
        } else {
          interimStr += transcriptChunk;
        }
      }

      setInterimTranscript(interimStr || finalStr);

      if (finalStr.trim()) {
        setIsRecording(false);
        setInterimTranscript("");
        processTurn(finalStr);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsRecording(false);
      if (orbState === "listening") {
        setOrbState("idle");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (orbState === "listening") {
        setOrbState("idle");
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Could not start recognition:", e);
      setIsRecording(false);
      setOrbState("idle");
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);
    if (orbState === "listening") {
      setOrbState("idle");
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const sendTextMessage = async (text: string) => {
    if (isRecording) {
      stopVoiceRecording();
    }
    await processTurn(text);
  };

  const resetConsultation = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setConversationHistory([]);
    setPatientData(INITIAL_PATIENT);
    setReason("");
    setUrgency("routine");
    setCallComplete(false);
    setConsentGiven(true);
    setSelectedSlotId(undefined);
    setOrbState("idle");
    setIsRecording(false);
    setInterimTranscript("");
    setApiStatus({ status: "idle" });
  };

  return (
    <ConsultationContext.Provider
      value={{
        conversationHistory,
        patientData,
        reason,
        urgency,
        callComplete,
        consentGiven,
        orbState,
        apiStatus,
        isRecording,
        interimTranscript,
        speechSupported,
        isChatOpen,
        selectedSlotId,
        startVoiceRecording,
        stopVoiceRecording,
        toggleVoiceRecording,
        sendTextMessage,
        resetConsultation,
        setIsChatOpen
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error("useConsultation must be used within a ConsultationProvider");
  }
  return context;
};
