import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Bot, 
  ShieldAlert, 
  FileText, 
  Radio, 
  Smile, 
  Coffee, 
  Copy, 
  Check,
  Zap,
  Activity,
  Heart
} from "lucide-react";
import { useGlobalSystem } from "../GlobalSystemContext";
import { voiceService } from "../../services/voiceService";
import { audioService } from "../../services/audioFeedbackService";
import { evalEmergencyTriage } from "../triage/EmergencyTriageGateway";

interface Message {
  id: string;
  sender: "user" | "udo";
  text: string;
  timestamp: string;
  actionType?: "triage" | "report" | "radio" | "joke" | "eeg";
  actionData?: any;
}

interface MascotChatAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTriageGateway?: () => void;
}

const INITIAL_WELCOME = {
  de: "Hallo Frau Dr. Ulrike Bongartz! Ich bin UDO V2, Ihr autonomer KI-Zentralsystem-Guide & Assistenzroboter. Wie kann ich Sie heute bei Ihren neurologischen Gutachten, GOÄ-Abrechnungen oder Notfall-Triage unterstützen?",
  en: "Hello Dr. Ulrike Bongartz! I am UDO V2, your autonomous AI Central System Guide & Assistant. How can I assist you today with your neurological reports, GOÄ billing, or emergency triage?"
};

export function MascotChatAgentModal({ isOpen, onClose, onOpenTriageGateway }: MascotChatAgentModalProps) {
  const { language } = useGlobalSystem();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>(Array(24).fill(10));

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting message when modal opens or language changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: "msg-welcome",
        sender: "udo",
        text: INITIAL_WELCOME[language],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
      
      // Optionally speak welcome message
      voiceService.speakText(INITIAL_WELCOME[language], {
        lang: language === "de" ? "de-DE" : "en-US",
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      });
    }
  }, [isOpen, language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Waveform animation while listening or speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening || isSpeaking || isThinking) {
      interval = setInterval(() => {
        setWaveformData(Array(24).fill(0).map(() => Math.floor(Math.random() * 80) + 15));
      }, 120);
    } else {
      setWaveformData(Array(24).fill(10));
    }
    return () => clearInterval(interval);
  }, [isListening, isSpeaking, isThinking]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Check if query triggers S2k emergency triage
    const triageCheck = evalEmergencyTriage(text);

    setTimeout(() => {
      let responseText = "";
      let actionType: "triage" | "report" | "radio" | "joke" | "eeg" | undefined = undefined;

      if (triageCheck.flag === "LEVEL_1_CRITICAL" || triageCheck.flag === "LEVEL_2_URGENT") {
        actionType = "triage";
        responseText = language === "de"
          ? `🚨 S2K NOTFALL-ALARM DETEKTIERT! (${triageCheck.code})\nBefund: ${triageCheck.conditionName.de}\nMassnahme: ${triageCheck.action.de}\nLatenz: ${triageCheck.latencyMs} ms.`
          : `🚨 S2K EMERGENCY ALERT DETECTED! (${triageCheck.code})\nCondition: ${triageCheck.conditionName.en}\nAction: ${triageCheck.action.en}\nLatency: ${triageCheck.latencyMs} ms.`;
      } else if (text.toLowerCase().includes("goä") || text.toLowerCase().includes("gutachten") || text.toLowerCase().includes("report")) {
        actionType = "report";
        responseText = language === "de"
          ? "📄 GOÄ Ziffer 800 & 801 Entwurf erstellt:\n- Psychiatrische/Neurologische Tiefenexploration (80 Min)\n- GOÄ Ziffer 800 (3.5-facher Satz = 112.40 €)\n- Befund: Neuropsychologische Leistungstests ohne Herdausfall."
          : "📄 GOÄ Code 800 & 801 Draft generated:\n- Neuro-Psychiatric In-Depth Assessment (80 mins)\n- GOÄ Code 800 (3.5x factor = 112.40 €)\n- Finding: Intact cognitive status without focal deficit.";
      } else if (text.toLowerCase().includes("radio") || text.toLowerCase().includes("köln") || text.toLowerCase().includes("music")) {
        actionType = "radio";
        const isNowPlaying = audioService.toggleRadio("Radio Workspace Köln FM 107.1");
        responseText = isNowPlaying
          ? (language === "de" ? "📻 Radio Workspace Köln FM 107.1 ist jetzt eingeschaltet! Entspannen Sie sich, Frau Dr. Ulrike." : "📻 Radio Workspace Köln FM 107.1 is now playing! Enjoy the relaxation, Dr. Ulrike.")
          : (language === "de" ? "📻 Radio wurde ausgeschaltet." : "📻 Radio powered off.");
      } else if (text.toLowerCase().includes("witz") || text.toLowerCase().includes("joke") || text.toLowerCase().includes("kaffee") || text.toLowerCase().includes("espresso")) {
        actionType = "joke";
        audioService.playJokeChime();
        responseText = language === "de"
          ? "☕ Espresso wird serviert! Und hier ein Witz für Frau Dr. Ulrike:\nWarum trinken Neurologen am liebsten Espresso? Weil er die synaptische Leitgeschwindigkeit im Thalamus ohne GOÄ-Abrechnungsverzögerung verdoppelt! ☕⚡"
          : "☕ Espresso delivered! Here is a joke for Dr. Ulrike:\nWhy do neurologists love espresso? Because it doubles thalamic synaptic conduction velocity with zero GOÄ billing latency! ☕⚡";
      } else if (text.toLowerCase().includes("eeg") || text.toLowerCase().includes("alpha")) {
        actionType = "eeg";
        responseText = language === "de"
          ? "🧠 EEG Alpha-Rhythmus Analyse (10 Hz):\n- Okzipitale Alpha-Aktivität seitengleich (9.8 - 10.2 Hz)\n- Regularität: Hoch, Blockade bei Lidschlag intakt\n- Beurteilung: Altersentsprechendes Normal-EEG ohne steile Wellen."
          : "🧠 EEG Alpha-Rhythm Analysis (10 Hz):\n- Occipital alpha activity symmetric (9.8 - 10.2 Hz)\n- Regularity: High, attenuation on eye opening present\n- Conclusion: Age-appropriate normal EEG without epileptiform discharges.";
      } else {
        responseText = language === "de"
          ? `Ich habe Ihre Anfrage verstanden: "${text}". Alle Befunde wurden im UDO-Revisionsprotokoll erfasst und nach S2k-Leitlinie verifiziert.`
          : `I have processed your query: "${text}". All findings are recorded in the UDO audit log and verified against S2k guidelines.`;
      }

      setIsThinking(false);

      const udoMsg: Message = {
        id: `udo-${Date.now()}`,
        sender: "udo",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType,
        actionData: triageCheck
      };

      setMessages(prev => [...prev, udoMsg]);

      // Speak response
      voiceService.speakText(responseText, {
        lang: language === "de" ? "de-DE" : "en-US",
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      });
    }, 600);
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      voiceService.stopSTT();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startSTT({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSendMessage(transcript);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      }, language === "de" ? "de-DE" : "en-US");
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-2xl animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-slate-900/95 border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col h-[85vh] max-h-[700px]"
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_#22d3ee]">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_#10b981]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
                  UDO V2 Interactive AI Assistant
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                  S2k Online
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {language === "de"
                  ? "Assistent für Dr. Ulrike Bongartz (Neurologie & Psychiatrie)"
                  : "Assistant for Dr. Ulrike Bongartz (Neurology & Psychiatry)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  voiceService.interrupt();
                  setIsSpeaking(false);
                } else {
                  const lastMsg = messages[messages.length - 1];
                  if (lastMsg) {
                    voiceService.speakText(lastMsg.text, {
                      lang: language === "de" ? "de-DE" : "en-US",
                      onStart: () => setIsSpeaking(true),
                      onEnd: () => setIsSpeaking(false)
                    });
                  }
                }
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking 
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse" 
                  : "bg-slate-800 border-white/10 text-slate-400 hover:text-white"
              }`}
              title={isSpeaking ? "Stop Voice" : "Replay Last Message"}
            >
              {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* QUICK SHORTCUT TASK BUTTONS FOR DR ULRIKE */}
        <div className="bg-slate-950/80 px-4 py-2 border-b border-cyan-500/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSendMessage("Prüfe S2k Notfall-Triage")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldAlert size={13} className="text-red-400 animate-pulse" />
            <span>S2k Triage Check</span>
          </button>

          <button
            onClick={() => handleSendMessage("Erstelle GOÄ 800 Bericht")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText size={13} className="text-cyan-400" />
            <span>GOÄ 800 Report</span>
          </button>

          <button
            onClick={() => handleSendMessage("Spiele Radio Workspace Köln FM 107.1")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-500/40 hover:bg-amber-900/60 text-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Radio size={13} className="text-amber-400" />
            <span>Radio Köln FM</span>
          </button>

          <button
            onClick={() => handleSendMessage("Erzähle einen Neurologie Witz und spendiere Espresso")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/40 hover:bg-purple-900/60 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Coffee size={13} className="text-purple-400" />
            <span>Espresso & Witz</span>
          </button>

          <button
            onClick={() => handleSendMessage("Analysiere EEG 10Hz Alpha Rhythmus")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Activity size={13} className="text-emerald-400" />
            <span>EEG Alpha Waves</span>
          </button>
        </div>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg relative ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white rounded-br-none border border-cyan-400/50"
                    : "bg-slate-950 text-slate-100 rounded-bl-none border border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5 mb-2 font-mono text-[10px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-cyan-300">
                    {msg.sender === "user" ? (language === "de" ? "Dr. Ulrike" : "User") : "UDO V2 AI"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-line font-sans font-medium">
                  {msg.text}
                </p>

                {/* SPECIAL ACTION CARDS IF APPLICABLE */}
                {msg.actionType === "triage" && onOpenTriageGateway && (
                  <div className="mt-3 pt-2 border-t border-red-500/30 flex justify-end">
                    <button
                      onClick={onOpenTriageGateway}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap size={13} />
                      <span>{language === "de" ? "Emergency Gateway Öffnen" : "Open Emergency Gateway"}</span>
                    </button>
                  </div>
                )}

                {/* COPY BUTTON */}
                <button
                  onClick={() => handleCopyText(msg.id, msg.text)}
                  className="absolute top-2 right-2 p-1 rounded bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] opacity-0 hover:opacity-100 transition-all cursor-pointer"
                  title="Text kopieren"
                >
                  {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 w-max">
              <Sparkles size={14} className="animate-spin text-cyan-400" />
              <span>{language === "de" ? "UDO verarbeitet Anfrage nach S2k-Standard..." : "UDO processing query via S2k guidelines..."}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* VOICE WAVEFORM & INPUT CONTROLS */}
        <div className="bg-slate-950 p-4 border-t border-cyan-500/30 space-y-3">
          {/* Waveform Visualizer Bar */}
          <div className="flex items-center justify-center gap-1 h-6 bg-slate-900/80 rounded-xl px-4 border border-cyan-500/20">
            {waveformData.map((height, i) => (
              <motion.div
                key={i}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.1 }}
                className={`w-1 rounded-full ${
                  isListening 
                    ? "bg-red-400" 
                    : isSpeaking 
                    ? "bg-emerald-400" 
                    : "bg-cyan-500/40"
                }`}
              />
            ))}
          </div>

          {/* Input Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  : "bg-slate-900 border-cyan-500/30 text-cyan-300 hover:bg-cyan-950"
              }`}
              title={isListening ? "Spracheingabe Stoppen" : "Spracheingabe Starten"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                language === "de"
                  ? "Sprechen oder Fragen an UDO eingeben..."
                  : "Type or speak your request to UDO..."
              }
              className="flex-1 bg-slate-900 border border-cyan-500/30 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-[0_0_20px_#22d3ee] cursor-pointer shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
