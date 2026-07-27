import React, { useState, useEffect, useRef } from "react";
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Send,
  Sparkles,
  FileCode,
  Activity,
  User,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import { useGlobalSystem } from "./GlobalSystemContext";

interface PatientData {
  first_name: string;
  last_name: string;
  dob: string;
  address: string;
  phone: string;
  insurance: "statutory" | "private" | "unknown";
}

interface AppointmentSlot {
  slot_id: string;
  datetime: string;
  type: string;
}

interface PhoneCallPayload {
  reply_to_patient: string;
  call_complete: boolean;
  patient: PatientData;
  reason: string;
  urgency: "emergency" | "urgent" | "routine";
  action: "appointment_booked" | "waitlist" | "emergency_redirect" | "in_progress";
  appointment: { slot_id: string; datetime: string } | null;
  waitlist_position: number | null;
  consent_given: boolean;
}

const AVAILABLE_SLOTS: AppointmentSlot[] = [
  { slot_id: "SLOT-101", datetime: "Morgen, 09:30 Uhr", type: "Neurologische Erstkonsultation" },
  { slot_id: "SLOT-102", datetime: "Morgen, 14:00 Uhr", type: "EEG & S2k Leitlinien-Abklärung" },
  { slot_id: "SLOT-103", datetime: "Übermorgen, 10:15 Uhr", type: "Psychiatrisches Konsil" },
  { slot_id: "SLOT-104", datetime: "Freitag, 11:30 Uhr", type: "Nervenleitgeschwindigkeit (NLG)" },
];

const EMERGENCY_KEYWORDS = [
  "schlaganfall", "brustschmerz", "herzinfarkt", "selbstmord", "bewusstlos", 
  "atemnot", "krampfanfall", "notfall", "unfall", "112", "suizid", "lähmung", "todesschmerz"
];

const INITIAL_PAYLOAD: PhoneCallPayload = {
  reply_to_patient: "Guten Tag, hier ist UDO, Ihr KI-Willkommensberater der Praxis Dr. Bongartz in Köln (Neurologie & Psychiatrie). Ich bin ein KI-Assistent, der das Ärzteteam unterstützt und Ihre Anliegen vertraulich aufnimmt. Wie kann ich Ihnen heute helfen?",
  call_complete: false,
  patient: {
    first_name: "",
    last_name: "",
    dob: "",
    address: "",
    phone: "",
    insurance: "unknown"
  },
  reason: "",
  urgency: "routine",
  action: "in_progress",
  appointment: null,
  waitlist_position: null,
  consent_given: true
};

export default function ColognePhoneTriage() {
  const { speakResponse, isVoiceMuted } = useGlobalSystem();
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [callPayload, setCallPayload] = useState<PhoneCallPayload>(INITIAL_PAYLOAD);
  const [userInput, setUserInput] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: "ai" | "patient"; text: string; time: string }>>([]);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [activeTab, setActiveTab] = useState<"call" | "json" | "slots">("call");
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcriptHistory]);

  // Start Call Sequence
  const handleStartCall = () => {
    setIsCallActive(true);
    setCallPayload(INITIAL_PAYLOAD);
    const greeting = INITIAL_PAYLOAD.reply_to_patient;
    const initialHistory = [{
      sender: "ai" as const,
      text: greeting,
      time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    }];
    setTranscriptHistory(initialHistory);
    
    if (!isVoiceMuted) {
      speakResponse(greeting);
    }
  };

  // Hangup
  const handleEndCall = () => {
    setIsCallActive(false);
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  // Reset Everything
  const handleReset = () => {
    setIsCallActive(false);
    setCallPayload(INITIAL_PAYLOAD);
    setTranscriptHistory([]);
    setUserInput("");
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  // Process Patient Utterance through rule-based & AI state transitions
  const handleSendPatientSpeech = async (speechText: string) => {
    if (!speechText.trim() || isProcessingTurn) return;
    
    const now = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const updatedHistory = [...transcriptHistory, { sender: "patient" as const, text: speechText, time: now }];
    setTranscriptHistory(updatedHistory);
    setUserInput("");
    setIsProcessingTurn(true);

    const textLower = speechText.toLowerCase();

    // 1. HARD-CODED EMERGENCY BACKSTOP CHECK
    const isEmergency = EMERGENCY_KEYWORDS.some(kw => textLower.includes(kw));
    if (isEmergency) {
      const emergencyReply = "Achtung! Bei diesen Symptomen liegt ein medizinischer Notfall vor. Bitte wählen Sie umgehend den Notruf 112 oder suchen Sie die nächste Notaufnahme in Köln auf. Das Gespräch wird hiermit sicher beendet.";
      
      const newPayload: PhoneCallPayload = {
        ...callPayload,
        reply_to_patient: emergencyReply,
        call_complete: true,
        urgency: "emergency",
        action: "emergency_redirect",
        reason: speechText
      };

      setCallPayload(newPayload);
      setTranscriptHistory([...updatedHistory, { sender: "ai", text: emergencyReply, time: now }]);
      setIsProcessingTurn(false);
      
      if (!isVoiceMuted) {
        speakResponse(emergencyReply);
      }
      return;
    }

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: speechText,
          messages: updatedHistory.map(h => ({ role: h.sender === "patient" ? "user" : "model", content: h.text })),
          currentPayload: callPayload,
          language: "de"
        })
      });

      const triageData = await response.json();

      let currentPayload: PhoneCallPayload = {
        ...callPayload,
        reply_to_patient: triageData.reply_to_patient || "Ich verstehe. Bitte beschreiben Sie mir Ihr Anliegen genauer.",
        call_complete: triageData.call_complete || false,
        urgency: (triageData.urgency as "emergency" | "urgent" | "routine") || "routine",
        reason: triageData.reason || callPayload.reason || speechText,
        patient: {
          first_name: triageData.patient?.first_name || callPayload.patient.first_name,
          last_name: triageData.patient?.last_name || callPayload.patient.last_name,
          dob: triageData.patient?.dob || callPayload.patient.dob,
          phone: triageData.patient?.phone || callPayload.patient.phone,
          address: callPayload.patient.address,
          insurance: (triageData.patient?.insurance === "private" ? "private" : triageData.patient?.insurance === "statutory" ? "statutory" : callPayload.patient.insurance)
        }
      };

      if (currentPayload.call_complete && !currentPayload.appointment) {
        if (AVAILABLE_SLOTS.length > 0) {
          const slot = AVAILABLE_SLOTS[0];
          currentPayload.appointment = { slot_id: slot.slot_id, datetime: slot.datetime };
          currentPayload.action = "appointment_booked";
        } else {
          currentPayload.waitlist_position = 2;
          currentPayload.action = "waitlist";
        }
      }

      setCallPayload(currentPayload);

      const aiReply = currentPayload.reply_to_patient;
      setTranscriptHistory([...updatedHistory, { sender: "ai", text: aiReply, time: now }]);
      setIsProcessingTurn(false);

      if (!isVoiceMuted) {
        speakResponse(aiReply);
      }
    } catch (err) {
      console.warn("Falling back to local state machine", err);
      // Fallback
      let aiResponse = "Vielen Dank für diese Information. Seit wann bestehen diese Beschwerden, und gab es Auslöser?";
      let currentPayload = { ...callPayload };
      if (!currentPayload.reason) currentPayload.reason = speechText;
      currentPayload.reply_to_patient = aiResponse;
      setCallPayload(currentPayload);
      setTranscriptHistory([...updatedHistory, { sender: "ai", text: aiResponse, time: now }]);
      setIsProcessingTurn(false);
      if (!isVoiceMuted) speakResponse(aiResponse);
    }
  };

  // Quick Preset Test Scenarios
  const handleRunPresetScenario = (scenarioType: "emergency" | "routine_booking" | "waitlist") => {
    handleStartCall();
    setTimeout(() => {
      if (scenarioType === "emergency") {
        handleSendPatientSpeech("Ja, ich gebe mein Einverständnis. Ich habe seit 10 Minuten plötzliche Sehstörungen, Taubheitsgefühl im Arm und Brustschmerzen!");
      } else if (scenarioType === "routine_booking") {
        handleSendPatientSpeech("Ja, mein Name ist Thomas Müller, geb. 12.04.1978, gesetzlich versichert. Ich benötige einen Termin zur Abklärung von LWS-Rückenschmerzen.");
      } else {
        handleSendPatientSpeech("Ja, einverstanden. Mein Name ist Sarah Schneider, Privatpatientin. Ich habe seit Wochen leichte Migräne.");
      }
    }, 600);
  };

  return (
    <div className="w-full bg-[#080d1a]/95 border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100 backdrop-blur-2xl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 p-4 border-b border-teal-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Stethoscope size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                UDO TELEPHONE TRIAGE ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold uppercase">
                Praxis Dr. Bongartz (Köln)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider mt-0.5">
              KI-Telefonassistent (Neurologie & Psychiatrie)
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab("call")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "call" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <PhoneCall size={12} />
            <span>Telefonat</span>
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "json" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode size={12} />
            <span>JSON Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "slots" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar size={12} />
            <span>Slots ({AVAILABLE_SLOTS.length})</span>
          </button>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="p-4 sm:p-6 space-y-6">

        {/* TAB 1: INTERACTIVE CALL SIMULATOR */}
        {activeTab === "call" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Call Controls & Live Transcript (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Call Status Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isCallActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {isCallActive ? "Anruf aktiv - Leitung 0221 / 88921" : "Bereit für Inbound-Anruf"}
                    </span>
                    <span className="text-xs font-bold text-white uppercase">
                      {isCallActive ? "UDO KI-Agent spricht..." : "Praxis Dr. Bongartz, Köln-Altenberg"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCallActive ? (
                    <button
                      onClick={handleStartCall}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <PhoneCall size={14} />
                      <span>Anruf Starten</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20 transition-all"
                    >
                      <PhoneOff size={14} />
                      <span>Auflegen</span>
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                    title="Zurücksetzen"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase shrink-0">Szenario-Test:</span>
                <button
                  onClick={() => handleRunPresetScenario("emergency")}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1"
                >
                  <AlertTriangle size={10} />
                  <span>Notfall-Umleitung (112)</span>
                </button>
                <button
                  onClick={() => handleRunPresetScenario("routine_booking")}
                  className="px-2.5 py-1 rounded-lg bg-teal-950/40 border border-teal-500/30 hover:bg-teal-900/50 text-teal-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Calendar size={10} />
                  <span>Standard-Termin</span>
                </button>
              </div>

              {/* Live Transcript Window */}
              <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 h-[320px] overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin flex flex-col" ref={chatScrollRef}>
                {transcriptHistory.length === 0 ? (
                  <div className="m-auto text-center space-y-2 py-8 text-slate-500">
                    <PhoneCall size={32} className="mx-auto opacity-30 animate-bounce" />
                    <p className="text-xs font-mono uppercase">Klicken Sie auf "Anruf Starten", um die KI-Triage zu testen.</p>
                  </div>
                ) : (
                  transcriptHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${item.sender === "patient" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase">
                          {item.sender === "ai" ? "UDO KI-Assistent (Dr. Bongartz)" : "Anrufer / Patient"}
                        </span>
                        <span className="text-[8px] font-mono text-slate-600">{item.time}</span>
                      </div>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        item.sender === "ai"
                          ? "bg-teal-950/40 border border-teal-500/30 text-teal-100 rounded-tl-none shadow-md"
                          : "bg-slate-800 border border-white/10 text-white rounded-tr-none shadow-md"
                      }`}>
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Patient Speech Input Field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPatientSpeech(userInput)}
                  disabled={!isCallActive || isProcessingTurn}
                  placeholder={isCallActive ? "Patienten-Antwort eingeben (oder sprechen)..." : "Zuerst Anruf starten..."}
                  className="flex-1 bg-slate-900 border border-white/15 focus:border-teal-400 text-xs text-white rounded-xl px-4 py-3 outline-none transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendPatientSpeech(userInput)}
                  disabled={!isCallActive || !userInput.trim() || isProcessingTurn}
                  className="px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Right: Live Triage Card & Collected Patient Fields (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={13} />
                    Live Triage Status
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase ${
                    callPayload.urgency === "emergency" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse" :
                    callPayload.urgency === "urgent" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                    "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                  }`}>
                    {callPayload.urgency}
                  </span>
                </div>

                {/* Consent Indicator */}
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Verbales Einverständnis:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                    {callPayload.consent_given ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Erteilt
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> Ausstehend
                      </span>
                    )}
                  </div>
                </div>

                {/* Collected Fields List */}
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Patient:</span>
                    <span className="font-bold text-white">
                      {callPayload.patient.first_name || callPayload.patient.last_name 
                        ? `${callPayload.patient.first_name} ${callPayload.patient.last_name}`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Geburtsdatum:</span>
                    <span className="font-mono text-teal-300">
                      {callPayload.patient.dob || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Versicherung:</span>
                    <span className="font-bold uppercase text-[10px]">
                      {callPayload.patient.insurance === "private" ? (
                        <span className="text-purple-300 font-extrabold">Privat (PKV)</span>
                      ) : callPayload.patient.insurance === "statutory" ? (
                        <span className="text-teal-300 font-bold">Gesetzlich (GKV)</span>
                      ) : "Unbekannt"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Beschwerde / Anlass:</span>
                    <span className="font-medium text-slate-200 text-right truncate max-w-[160px]">
                      {callPayload.reason || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Aktion / Ergebnis:</span>
                    <span className="font-mono font-bold text-[10px] uppercase text-emerald-400">
                      {callPayload.action}
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Appointment / Emergency Banner */}
              {callPayload.appointment && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider block">
                    ✓ TERMIN BESTÄTIGT
                  </span>
                  <p className="text-xs font-bold text-white">
                    {callPayload.appointment.datetime}
                  </p>
                </div>
              )}

              {callPayload.action === "emergency_redirect" && (
                <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-xl space-y-1 animate-pulse">
                  <span className="text-[9px] font-mono font-extrabold text-rose-300 uppercase tracking-wider block flex items-center gap-1">
                    <AlertTriangle size={12} /> NOTFALL-UMLEITUNG
                  </span>
                  <p className="text-xs font-black text-rose-100">
                    Patient direkt an Notruf 112 verwiesen!
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: STANDARDIZED JSON PROTOCOL OUTPUT */}
        {activeTab === "json" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                <FileCode size={14} />
                Real-Time JSON Output Protocol
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(callPayload, null, 2));
                  alert("JSON Protocol copied to clipboard!");
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-teal-300 font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy size={12} />
                <span>JSON Kopieren</span>
              </button>
            </div>

            <pre className="bg-black/80 border border-teal-500/30 p-5 rounded-2xl text-teal-400 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
              {JSON.stringify(callPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* TAB 3: AVAILABLE SLOTS MANAGER */}
        {activeTab === "slots" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} />
                Freie Terminslots (Praxis Dr. Bongartz, Köln)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_SLOTS.map((slot) => (
                <div key={slot.slot_id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-teal-400 uppercase font-black">{slot.slot_id}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{slot.datetime}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{slot.type}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase">Frei</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
