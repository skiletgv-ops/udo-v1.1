import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  MessageCircle, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Code2, 
  User, 
  PhoneCall, 
  Calendar, 
  ShieldCheck, 
  X, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useConsultation } from "../context/ConsultationContext";
import { VoicePoweredOrb } from "./ui/voice-powered-orb";

interface Props {
  language?: "de" | "en";
}

export default function ConsultationOrbControl({ language = "de" }: Props) {
  const {
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
    isChatOpen,
    selectedSlotId,
    startVoiceRecording,
    stopVoiceRecording,
    toggleVoiceRecording,
    sendTextMessage,
    resetConsultation,
    setIsChatOpen
  } = useConsultation();

  const [textInput, setTextInput] = useState("");
  const [showDebug, setShowDebug] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversationHistory, interimTranscript]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || apiStatus.status === "pending") return;
    const msg = textInput;
    setTextInput("");
    sendTextMessage(msg);
  };

  // Orb Hue depending on active state
  const getOrbHue = () => {
    switch (orbState) {
      case "listening": return 340; // Vibrant Rose/Red
      case "thinking": return 45;   // Bright Amber/Gold
      case "speaking": return 175;  // Glowing Teal/Cyan
      case "success": return 145;   // Emerald Green
      case "error": return 0;       // Pure Crimson Red
      default: return 185;          // Deep Teal
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4">
      


      {/* Dynamic Status Eyebrow */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${
          orbState === "listening" ? "bg-rose-500 animate-ping" :
          orbState === "thinking" ? "bg-amber-400 animate-pulse" :
          orbState === "speaking" ? "bg-teal-400 animate-pulse" :
          orbState === "success" ? "bg-emerald-400" :
          orbState === "error" ? "bg-rose-600" : "bg-teal-500/50"
        }`} />
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
          {orbState === "listening" && (language === "en" ? "Listening... Speak now" : "Zuhören... Bitte sprechen")}
          {orbState === "thinking" && (language === "en" ? "Consulting AI Core..." : "KI-Analyse läuft...")}
          {orbState === "speaking" && (language === "en" ? "U.D.O. Consultant Speaking" : "U.D.O. Berater antwortet")}
          {orbState === "success" && (language === "en" ? "Consultation Complete" : "Erstberatung Abgeschlossen")}
          {orbState === "error" && (language === "en" ? "Connection Issue" : "Verbindungsstörung")}
          {orbState === "idle" && (language === "en" ? "Ready for Voice or Chat" : "Bereit für Sprache oder Text-Chat")}
        </span>
      </div>

      {/* Main Orb + Dual Buttons Container */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center my-2">
        
        {/* Background Canvas Orb */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
          <VoicePoweredOrb
            hue={getOrbHue()}
            enableVoiceControl={isRecording}
            glowIntensity={isRecording ? 2.8 : orbState === "speaking" ? 2.2 : 1.2}
            className="w-full h-full scale-110"
          />
        </div>

        {/* Outer Pulsing Rings */}
        <div className={`absolute inset-0 rounded-full border ${
          isRecording ? "border-rose-500/30 animate-ping" : "border-teal-500/20 animate-[pulse_4s_infinite]"
        } pointer-events-none z-10`} />
        
        <div className={`absolute inset-6 rounded-full border ${
          isRecording ? "border-rose-400/20" : "border-teal-400/15"
        } pointer-events-none z-10`} />

        {/* Dual Control Buttons Center Assembly */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20 gap-4">
          
          {/* RECORD BUTTON (Voice Path) */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              onClick={toggleVoiceRecording}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-2xl relative cursor-pointer ${
                isRecording
                  ? "bg-rose-500 text-slate-950 border-rose-300 shadow-[0_0_40px_rgba(244,63,94,0.8)]"
                  : orbState === "thinking"
                  ? "bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)]"
                  : orbState === "speaking"
                  ? "bg-teal-400 text-slate-950 border-teal-200 shadow-[0_0_30px_rgba(45,212,191,0.6)]"
                  : "bg-slate-950/90 hover:bg-slate-900/90 text-teal-400 border-teal-500/40 shadow-[0_0_25px_rgba(20,184,166,0.4)]"
              }`}
              title={isRecording ? "Aufnahme stoppen" : "Sprachaufnahme starten (Record)"}
            >
              <div className="relative flex items-center justify-center">
                {isRecording ? (
                  <>
                    <span className="absolute inset-0 w-full h-full bg-rose-400 rounded-full blur-md animate-ping opacity-60" />
                    <MicOff size={24} className="sm:w-7 sm:h-7 relative z-10" />
                  </>
                ) : (
                  <Mic size={24} className="sm:w-7 sm:h-7 relative z-10" />
                )}
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider mt-1 leading-none">
                {isRecording ? "Live" : "Record"}
              </span>
            </motion.button>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">
              Sprache
            </span>
          </div>

          {/* CHAT BUTTON (Text Path) */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              onClick={() => setIsChatOpen(!isChatOpen)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-2xl relative cursor-pointer ${
                isChatOpen
                  ? "bg-violet-500 text-white border-violet-300 shadow-[0_0_35px_rgba(139,92,246,0.7)]"
                  : "bg-slate-950/90 hover:bg-slate-900/90 text-violet-400 border-violet-500/40 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              }`}
              title="Text-Chat öffnen / schließen"
            >
              <MessageCircle size={24} className="sm:w-7 sm:h-7 relative z-10" />
              <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider mt-1 leading-none">
                {isChatOpen ? "Close" : "Chat"}
              </span>
            </motion.button>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">
              Text-Chat
            </span>
          </div>

        </div>

        {/* Live Interim Transcript Bubble */}
        {interimTranscript && (
          <div className="absolute -bottom-10 bg-slate-900/95 border border-rose-500/40 text-rose-200 px-4 py-1.5 rounded-full text-xs font-mono backdrop-blur-xl shadow-xl z-30 animate-pulse max-w-xs truncate">
            "{interimTranscript}"
          </div>
        )}
      </div>

      {/* Shared Live Chat Portal & Text Input Field */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            className="w-full bg-slate-900/90 border border-violet-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    UDO Chat Consultation (Dr. Bongartz)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Nahtloser Wechsel zwischen Sprache & Text — Gemeinsamer Verlauf
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation Stream */}
            <div
              ref={chatScrollRef}
              className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-950/80 rounded-2xl border border-white/5 text-xs font-sans scrollbar-thin"
            >
              {conversationHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Sparkles size={24} className="opacity-40 animate-pulse text-violet-400" />
                  <p className="text-xs">Schreiben Sie eine Nachricht oder nutzen Sie den Record-Button.</p>
                </div>
              ) : (
                conversationHistory.map((turn, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${turn.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                        {turn.role === "user" ? "Patient" : "U.D.O. Consultant"}
                      </span>
                      <span className="text-[8px] font-mono text-slate-600">{turn.timestamp}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        turn.role === "user"
                          ? "bg-violet-600 text-white rounded-br-none shadow-md"
                          : "bg-slate-800 text-slate-100 rounded-bl-none border border-white/10"
                      }`}
                    >
                      {turn.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Schreiben Sie Ihr Anliegen hier..."
                disabled={apiStatus.status === "pending"}
                className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || apiStatus.status === "pending"}
                className="px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-violet-600/20"
              >
                <Send size={14} />
                <span>Senden</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Card when Call Complete */}
      {callComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 size={24} />
              <div>
                <h3 className="text-base font-bold text-white">Erstberatung abgeschlossen</h3>
                <p className="text-xs text-slate-400">Zusammenfassung für das Ärzteteam Dr. Bongartz</p>
              </div>
            </div>
            <button
              onClick={resetConsultation}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw size={13} /> Neues Gespräch
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Patientenstammdaten</span>
              <div className="font-bold text-slate-100">
                {patientData.first_name || patientData.last_name
                  ? `${patientData.first_name} ${patientData.last_name}`
                  : "Anonym erfasst"}
              </div>
              <div className="text-[11px] text-slate-400">Geb.: {patientData.dob || "k. A."} • Tel: {patientData.phone || "k. A."}</div>
              <div className="text-[10px] text-teal-400">Versicherung: {patientData.insurance}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Medizinischer Befund & Dringlichkeit</span>
              <div className="text-slate-200 line-clamp-2">{reason || "Symptombeschreibung erfasst"}</div>
              <div className="pt-1 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  urgency === "emergency" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                  urgency === "urgent" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                  "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                }`}>
                  Dringlichkeit: {urgency}
                </span>
                {selectedSlotId && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Termin gebucht ({selectedSlotId})
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* DEV MODE API DEBUG INDICATOR PANEL */}
      <div className="w-full pt-2">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-[10px] font-mono text-slate-500 hover:text-teal-400 flex items-center gap-1.5 transition-colors cursor-pointer mx-auto"
        >
          <Code2 size={12} />
          <span>{showDebug ? "Hide Live API Debug Panel" : "Show Live API Debug Panel"}</span>
          {showDebug ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showDebug && (
          <div className="mt-2 p-3 rounded-2xl bg-slate-950/90 border border-white/10 font-mono text-[10px] text-slate-400 space-y-2 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">API ROUTE: POST /api/consult</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  apiStatus.status === "pending" ? "bg-amber-500/20 text-amber-300 animate-pulse" :
                  apiStatus.status === "success" ? "bg-emerald-500/20 text-emerald-300" :
                  apiStatus.status === "error" ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-400"
                }`}>
                  STATUS: {apiStatus.status.toUpperCase()}
                </span>
              </div>
              <span>{apiStatus.timestamp ? new Date(apiStatus.timestamp).toLocaleTimeString() : "No call yet"}</span>
            </div>

            {apiStatus.lastError && (
              <div className="p-2 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300">
                ERROR: {apiStatus.lastError}
              </div>
            )}

            {apiStatus.lastResponsePayload && (
              <div>
                <span className="text-slate-500 block mb-0.5">LAST AI RESPONSE PAYLOAD:</span>
                <pre className="p-2 rounded bg-black/60 border border-white/5 text-[9px] text-teal-300 overflow-x-auto max-h-36">
                  {JSON.stringify(apiStatus.lastResponsePayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
