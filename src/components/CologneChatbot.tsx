import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, ShieldCheck, HelpCircle, Bot, Mic, MicOff, Volume2, VolumeX, Check, AlertCircle, Sliders, RotateCcw, Play, Brain, Minus, PhoneCall } from "lucide-react";
import { useGlobalSystem } from "./GlobalSystemContext";
import ColognePhoneTriage from "./ColognePhoneTriage";
import VoiceChatButton from "./voice/VoiceChatButton";

interface Message {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: string;
}

interface CologneChatbotProps {
  onRobotStateChange: (state: any) => void;
  onDrBubbleTrigger?: (text: string) => void;
  onMinimize?: () => void;
}

const PRESET_CHIPS = [
  "How can you help me with this project?",
  "What are the core clinical guidelines for L4/L5?",
  "Summarize Thomas Muller's medical status",
  "How do I calculate reduction in earning capacity?"
];

export default function CologneChatbot({ onRobotStateChange, onDrBubbleTrigger, onMinimize }: CologneChatbotProps) {
  const { 
    chatMessages: messages, 
    setChatMessages,
    language,
    isVoiceMuted,
    setIsVoiceMuted,
    speakResponse,
    globalListeningState: listeningState,
    globalStartListening: startListening,
    globalStopListening: stopListening,
    globalForceActiveListening: forceActiveListening,
    handleGlobalSendMessage,
    isGlobalChatLoading: isLoading,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speechRate,
    setSpeechRate,
    availableVoices
  } = useGlobalSystem();
  
  const [inputMessage, setInputMessage] = useState("");
  const [showVoiceConfig, setShowVoiceConfig] = useState(false);
  const [neuralExpressive, setNeuralExpressive] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "triage">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulated real-time consensus board states: 0 = idle, 1 = realizing, 2 = deliberating/reading each other, 3 = voting complete
  const [consensusStep, setConsensusStep] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setConsensusStep(1);
      const timer1 = setTimeout(() => setConsensusStep(2), 2200);
      const timer2 = setTimeout(() => setConsensusStep(3), 4500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setConsensusStep(0);
    }
  }, [isLoading]);

  // Scroll to bottom whenever messages or loading state updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, consensusStep]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    setInputMessage("");
    await handleGlobalSendMessage(textToSend, neuralExpressive);
    
    // Keep parent bubble/state callbacks synchronised if needed
    if (onRobotStateChange) {
      onRobotStateChange("THINKING");
    }
  };

  return (
    <div className={`flex flex-col h-[640px] bg-black/40 border rounded-2xl overflow-hidden shadow-xl relative transition-all duration-500 ${
      neuralExpressive 
        ? "border-purple-500/40 shadow-purple-500/5 ring-1 ring-purple-500/25" 
        : "border-white/10"
    }`} id="cologne-doctor-chat-module">
      
      {/* Header Info Panel */}
      <div className="bg-white/5 px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-black text-teal-300 text-xs shadow-inner uppercase">
              UDO
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              listeningState === "passive_listening" ? "bg-green-500 animate-pulse" :
              listeningState === "active_listening" ? "bg-rose-500 animate-ping" : "bg-slate-500"
            }`} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white font-sans uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
              <span>U.D.O. Clinical Intelligence</span>
              <span className="text-[9px] font-mono font-black text-teal-400 bg-teal-950/40 border border-teal-500/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
                Nova Voice
              </span>
              {neuralExpressive && (
                <span className="text-[9px] font-mono font-black text-purple-300 bg-purple-950/60 border border-purple-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <Sparkles size={10} className="text-purple-400 animate-spin" />
                  Neural Expressive
                </span>
              )}
            </h3>
            <p className="text-[9px] text-teal-400 font-mono tracking-widest font-semibold uppercase">
              {listeningState === "passive_listening" ? (language === "de" ? "● HÖRE AUF WECK-WORT 'UDO'" : "● LISTENING FOR 'UDO'") :
               listeningState === "active_listening" ? (language === "de" ? "● DIKTIEREN AKTIV..." : "● DICTATION ACTIVE...") : 
               (language === "de" ? "● DIALOGBEREIT" : "● DIALOGUE READY")}
            </p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
              title={language === "de" ? "Minimieren" : "Minimize"}
            >
              <Minus size={14} />
            </button>
          )}

          {/* Voice Configuration Settings Panel Toggle */}
          <button
            onClick={() => setShowVoiceConfig(!showVoiceConfig)}
            className={`p-2 rounded-xl border transition-all ${
              showVoiceConfig 
                ? "bg-teal-500 border-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title={language === "de" ? "Sprachauswahl & Geschwindigkeit" : "Voice Selection & Speech Speed"}
          >
            <Sliders size={14} />
          </button>

          {/* Mute output voice */}
          <button
            onClick={() => {
              setIsVoiceMuted(!isVoiceMuted);
              if (!isVoiceMuted && typeof window !== "undefined") {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-2 rounded-xl border transition-all ${
              isVoiceMuted 
                ? "bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-950/40" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title={isVoiceMuted ? (language === "de" ? "Stimme einschalten" : "Unmute Voice") : (language === "de" ? "Stimme stummstellen" : "Mute Voice")}
          >
            {isVoiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Wake Word passive trigger toggle */}
          <button
            onClick={() => {
              if (listeningState === "idle") {
                startListening();
              } else {
                stopListening();
              }
            }}
            className={`p-2 rounded-xl border transition-all ${
              listeningState === "passive_listening"
                ? "bg-teal-950/20 border-teal-500/40 text-teal-300 animate-pulse"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title={listeningState === "passive_listening" ? (language === "de" ? "Weck-Wort stoppen" : "Stop Wake-Word") : (language === "de" ? "Weck-Wort überwachen" : "Monitor Wake-Word")}
          >
            <Bot size={14} />
          </button>

          {/* Click to Talk / Force Active dictation */}
          <button
            onClick={() => {
              forceActiveListening();
            }}
            className={`p-2 rounded-xl border transition-all ${
              listeningState === "active_listening"
                ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20 animate-pulse"
                : "bg-teal-500 hover:bg-teal-600 border-teal-400 text-slate-950 font-black cursor-pointer shadow-lg shadow-teal-500/15"
            }`}
            title={language === "de" ? "Direkt sprechen (Diktat)" : "Direct Speech (Dictate)"}
          >
            <Mic size={14} />
          </button>

          <div className="flex items-center gap-1 bg-teal-950/20 border border-teal-500/25 rounded-full px-2.5 py-1 text-[9px] font-mono text-teal-300">
            <ShieldCheck size={11} className="text-teal-400 shrink-0" />
            <span>GDPR-Secure</span>
          </div>
        </div>
      </div>

      {/* Mode Sub-Header Bar */}
      <div className="bg-black/60 border-b border-white/10 px-5 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode("chat")}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "chat"
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <MessageSquare size={12} />
            <span>{language === "de" ? "💬 KI-Konsil & Chat" : "💬 Clinical Chat"}</span>
          </button>

          <button
            onClick={() => setActiveMode("triage")}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "triage"
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <PhoneCall size={12} />
            <span>{language === "de" ? "📞 Praxis Dr. Bongartz Telefon-Triage" : "📞 Practice Phone Triage"}</span>
          </button>
        </div>

        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase hidden md:inline-block">
          U.D.O. Cologne Medical Core
        </span>
      </div>

      {activeMode === "triage" ? (
        <div className="p-4 overflow-y-auto flex-1">
          <ColognePhoneTriage />
        </div>
      ) : (
        <>

      {/* Voice Selection & Speed Control Panel */}
      {showVoiceConfig && (
        <div className="bg-[#0c142c] border-b border-white/10 px-5 py-4 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-teal-400 tracking-wider flex items-center gap-1.5 uppercase">
              <Sliders size={12} />
              {language === "de" ? "Sprach- & Sprachgeschwindigkeitssteuerung" : "Voice & Speech Rate Panel"}
            </span>
            <span className="text-[8px] font-mono text-slate-400 uppercase">
              {language === "de" ? "Web Speech API (Echtzeit)" : "Web Speech API (Realtime)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voice Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-400 uppercase block">
                {language === "de" ? "Verfügbare Stimmen wählen" : "Select Available Voice"}
              </label>
              <div className="relative">
                <select
                  value={selectedVoiceURI || ""}
                  onChange={(e) => {
                    const nextVal = e.target.value || null;
                    setSelectedVoiceURI(nextVal);
                    // Trigger a brief feedback speak with the new voice
                    setTimeout(() => {
                      speakResponse(
                        language === "de" 
                          ? "Stimme erfolgreich aktualisiert." 
                          : "Voice updated successfully."
                      );
                    }, 100);
                  }}
                  className="bg-black/50 border border-white/10 text-[11px] text-white rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500/40 select-none cursor-pointer font-sans"
                >
                  <option value="">
                    {language === "de" ? "Default-Stimme des Systems" : "System Default Voice"}
                  </option>
                  {availableVoices.map((v) => {
                    const isDe = v.lang.toLowerCase().startsWith("de");
                    const isEn = v.lang.toLowerCase().startsWith("en");
                    
                    let flag = "🌐";
                    if (isDe) flag = "🇩🇪";
                    if (isEn) flag = "🇺🇸";
                    
                    const nameDisplay = v.name
                      .replace("Microsoft", "MS")
                      .replace("Google", "Google")
                      .replace("Natural", "Natural");

                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {flag} {nameDisplay} ({v.lang})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-mono text-slate-400 uppercase block">
                  {language === "de" ? "Sprechgeschwindigkeit" : "Speech Rate (Speed)"}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold">
                    {speechRate.toFixed(1)}x
                  </span>
                  <button
                    onClick={() => {
                      setSpeechRate(1.0);
                      setTimeout(() => {
                        speakResponse(
                          language === "de" 
                            ? "Zurückgesetzt auf Standardgeschwindigkeit." 
                            : "Reset to standard speech rate."
                        );
                      }, 100);
                    }}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title={language === "de" ? "Zurücksetzen auf 1.0" : "Reset to 1.0"}
                  >
                    <RotateCcw size={10} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-500">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => {
                    const rateVal = parseFloat(e.target.value);
                    setSpeechRate(rateVal);
                  }}
                  className="flex-1 accent-teal-400 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                />
                <span className="text-[9px] font-mono text-slate-500">2.0x</span>
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              {language === "de" ? "Schnellwahl-Tempo:" : "Preset Rates:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: language === "de" ? "Gemütlich (0.8x)" : "Realistic Slow (0.8x)", val: 0.8 },
                { label: language === "de" ? "Standard (1.0x)" : "Standard Realism (1.0x)", val: 1.0 },
                { label: language === "de" ? "Professional (1.2x)" : "Professional (1.2x)", val: 1.2 },
                { label: language === "de" ? "Rapid Briefing (1.5x)" : "Rapid Briefing (1.5x)", val: 1.5 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => {
                    setSpeechRate(preset.val);
                    setTimeout(() => {
                      speakResponse(
                        language === "de" 
                          ? `Geschwindigkeit eingestellt auf ${preset.val}x.` 
                          : `Speech speed rate set to ${preset.val}x.`
                      );
                    }, 100);
                  }}
                  className={`text-[9px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    speechRate === preset.val
                      ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold"
                      : "bg-black/30 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                speakResponse(
                  language === "de" 
                    ? "Hallo Kollege, dies ist ein kurzer Hörtest der gewählten Stimme." 
                    : "Hello colleague, this is a short audio test of your selected voice."
                );
              }}
              className="ml-auto text-[9px] font-sans font-bold bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <Play size={10} />
              <span>{language === "de" ? "Hörprobe" : "Test Voice"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4-Agent Collaborative Consensus Board */}
      <div className="bg-[#030712]/90 border-b border-white/10 px-5 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-extrabold text-teal-400 tracking-wider flex items-center gap-1.5 uppercase">
            <Sparkles size={11} className={consensusStep > 0 ? "animate-spin" : ""} />
            Consensus-Driven Diagnostic Board (4-AI Multi-Panel)
          </span>
          <span className="text-[9px] font-mono font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
            Colleague: 55yo Female Neurologist
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Dr. Clara (UDO Neuro) */}
          <div className={`p-2 rounded-xl border transition-all duration-300 ${
            consensusStep === 1 ? "bg-amber-950/15 border-amber-500/30 shadow-sm shadow-amber-500/5" :
            consensusStep === 2 ? "bg-teal-950/15 border-teal-500/30" :
            consensusStep === 3 ? "bg-green-950/15 border-green-500/30" :
            "bg-slate-950/40 border-white/5"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                consensusStep === 1 ? "bg-amber-400 animate-pulse" :
                consensusStep === 2 ? "bg-teal-400 animate-pulse" :
                consensusStep === 3 ? "bg-green-400" : "bg-slate-500"
              }`} />
              <div className="min-w-0">
                <span className="text-[9px] font-black text-white block truncate">Dr. Clara (UDO Neuro)</span>
                <span className="text-[7px] font-mono text-slate-400 block truncate">Neurology Expert</span>
              </div>
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-400 line-clamp-1 border-t border-white/5 pt-1">
              {consensusStep === 0 && "● Active & ready..."}
              {consensusStep === 1 && "⚡ Parsing MRI root pressure..."}
              {consensusStep === 2 && "🔄 S2k guideline correlation..."}
              {consensusStep === 3 && "✓ Voted: Radiculopathy Confirmed"}
            </div>
          </div>

          {/* Dr. Eric (UDO Forensic) */}
          <div className={`p-2 rounded-xl border transition-all duration-300 ${
            consensusStep === 1 ? "bg-amber-950/15 border-amber-500/30 shadow-sm shadow-amber-500/5" :
            consensusStep === 2 ? "bg-teal-950/15 border-teal-500/30" :
            consensusStep === 3 ? "bg-green-950/15 border-green-500/30" :
            "bg-slate-950/40 border-white/5"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                consensusStep === 1 ? "bg-amber-400 animate-pulse" :
                consensusStep === 2 ? "bg-teal-400 animate-pulse" :
                consensusStep === 3 ? "bg-green-400" : "bg-slate-500"
              }`} />
              <div className="min-w-0">
                <span className="text-[9px] font-black text-white block truncate">Dr. Eric (UDO Forensic)</span>
                <span className="text-[7px] font-mono text-slate-400 block truncate">S2k Forensic Legal</span>
              </div>
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-400 line-clamp-1 border-t border-white/5 pt-1">
              {consensusStep === 0 && "● Active & ready..."}
              {consensusStep === 1 && "⚡ Estimating MdE guidelines..."}
              {consensusStep === 2 && "🔄 Reviewing Med-Gemini findings..."}
              {consensusStep === 3 && "✓ Voted: Recommended MdE: 20%"}
            </div>
          </div>

          {/* Dr. Marcus (UDO Biomechanics) */}
          <div className={`p-2 rounded-xl border transition-all duration-300 ${
            consensusStep === 1 ? "bg-amber-950/15 border-amber-500/30 shadow-sm shadow-amber-500/5" :
            consensusStep === 2 ? "bg-teal-950/15 border-teal-500/30" :
            consensusStep === 3 ? "bg-green-950/15 border-green-500/30" :
            "bg-slate-950/40 border-white/5"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                consensusStep === 1 ? "bg-amber-400 animate-pulse" :
                consensusStep === 2 ? "bg-teal-400 animate-pulse" :
                consensusStep === 3 ? "bg-green-400" : "bg-slate-500"
              }`} />
              <div className="min-w-0">
                <span className="text-[9px] font-black text-white block truncate">Dr. Marcus (UDO Biomechanics)</span>
                <span className="text-[7px] font-mono text-slate-400 block truncate">Biomechanics Analyst</span>
              </div>
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-400 line-clamp-1 border-t border-white/5 pt-1">
              {consensusStep === 0 && "● Active & ready..."}
              {consensusStep === 1 && "⚡ Modeling kinetic load vectors..."}
              {consensusStep === 2 && "🔄 Correlating trauma timeline..."}
              {consensusStep === 3 && "✓ Voted: Trauma Causality Approved"}
            </div>
          </div>

          {/* Dr. Gratsiano (UDO Cognitive) */}
          <div className={`p-2 rounded-xl border transition-all duration-300 ${
            consensusStep === 1 ? "bg-amber-950/15 border-amber-500/30 shadow-sm shadow-amber-500/5" :
            consensusStep === 2 ? "bg-teal-950/15 border-teal-500/30" :
            consensusStep === 3 ? "bg-green-950/15 border-green-500/30" :
            "bg-slate-950/40 border-white/5"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                consensusStep === 1 ? "bg-amber-400 animate-pulse" :
                consensusStep === 2 ? "bg-teal-400 animate-pulse" :
                consensusStep === 3 ? "bg-green-400" : "bg-slate-500"
              }`} />
              <div className="min-w-0">
                <span className="text-[9px] font-black text-white block truncate">Dr. Gratsiano (UDO Cognitive)</span>
                <span className="text-[7px] font-mono text-slate-400 block truncate">Deep clinical Synthesis</span>
              </div>
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-400 line-clamp-1 border-t border-white/5 pt-1">
              {consensusStep === 0 && "● Active & ready..."}
              {consensusStep === 1 && "⚡ Running Deep CoT over findings..."}
              {consensusStep === 2 && "🔄 Weighing GPT & Claude debates..."}
              {consensusStep === 3 && "✓ Voted: Synthesis Sealed"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#05070a]/40 scrollbar-thin"
      >
        {messages.map((m) => {
          const isDoc = m.sender === "doctor";
          return (
            <div 
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isDoc ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"
              }`}
            >
              {isDoc && (
                <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-300 shrink-0 mt-1 uppercase">
                  UDO
                </div>
              )}
              
              <div className="space-y-1">
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                    isDoc 
                      ? "bg-white/5 text-slate-100 border border-white/5 rounded-tl-none" 
                      : "bg-teal-600 text-white font-medium rounded-tr-none shadow-sm shadow-teal-600/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[8px] font-mono text-slate-500 block px-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col gap-2 max-w-[80%] mr-auto text-left">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-300 shrink-0 mt-1 animate-pulse">
                UDO
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl rounded-tl-none text-xs text-slate-400 border border-white/5 shadow-md flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce animate-duration-75" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                
                {consensusStep === 1 && (language === "de" ? "Panel liest & erfasst Details..." : "Panel is reading & realizing details...")}
                {consensusStep === 2 && (language === "de" ? "Kollegen stimmen Antworten ab..." : "Colleagues are debating & aligning...")}
                {consensusStep === 3 && (language === "de" ? "Ergebnis wird final formuliert..." : "Formulating unified expert consensus...")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips bar with premium typography & micro hover effects */}
      <div className="px-4 py-3 border-t border-white/10 bg-[#020617]/70 flex flex-wrap gap-2 select-none">
        {(language === "de" ? [
          "Wie unterstützen Sie mich bei diesem Projekt?",
          "Was sind die klinischen Richtlinien für L4/L5?",
          "Zusammenfassung von Thomas Müllers Status",
          "Wie berechne ich die Minderung der Erwerbsfähigkeit?"
        ] : PRESET_CHIPS).map((chip) => (
          <button
            key={chip}
            disabled={isLoading}
            onClick={() => handleSendMessage(chip)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-950 text-[10px] text-teal-300 font-sans font-black tracking-wider uppercase border border-teal-500/10 hover:border-teal-500/40 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-lg hover:shadow-teal-500/5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Input controls form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="px-4 py-3 bg-[#05070a]/65 border-t border-white/10 flex gap-2 items-center"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            disabled={isLoading}
            placeholder={language === "de" ? "Kollegiale Anfrage an die U.D.O. Facharztjury..." : "Submit collegial inquiry to the U.D.O. expert board..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full bg-black/25 border border-white/10 rounded-xl pl-4 pr-24 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 leading-normal"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {/* Click to Talk / Force Active dictation */}
            <button
              type="button"
              id="chat-input-mic-button"
              onClick={() => {
                forceActiveListening();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                listeningState === "active_listening"
                  ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20 animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
              }`}
              title={language === "de" ? "Direkt sprechen (Diktat)" : "Direct Speech (Dictate)"}
            >
              <Mic size={13} />
            </button>
            {/* Neural Expressive toggle */}
            <button
              type="button"
              id="chat-input-neural-expressive-button"
              onClick={() => {
                setNeuralExpressive(!neuralExpressive);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                neuralExpressive
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30 animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Neural Expressive Chat Mode"
            >
              <Brain size={13} />
            </button>
          </div>
        </div>
        <VoiceChatButton
          language={language}
          disabled={isLoading}
          onNewMessage={(msg) => {
            setChatMessages((prev) => [
              ...prev,
              {
                id: msg.id || `msg-${Date.now()}-${Math.random()}`,
                sender: (msg.sender || (msg.role === 'user' ? 'user' : 'doctor')) as 'user' | 'doctor',
                text: msg.text,
                timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            if (msg.role === 'model' || msg.sender === 'doctor') {
              onRobotStateChange("SPEAKING");
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${
            isLoading || !inputMessage.trim()
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
          }`}
        >
          <Send size={14} />
        </button>
      </form>
      </>
      )}
    </div>
  );
}
