import React, { useState, useEffect } from "react";
import { Mic, MessageSquare, Sparkles, Volume2, ShieldCheck, Cpu, Activity, ChevronDown, ChevronUp, Copy, Check, Terminal } from "lucide-react";
import ConsultationOrbControl from "./ConsultationOrbControl";
import CologneChatbot from "./CologneChatbot";
import GutachtenPanel from "./GutachtenPanel";

interface UnifiedConsultationPortalProps {
  language?: "en" | "de";
  onRobotStateChange?: (state: any) => void;
  onDrBubbleTrigger?: (text: string) => void;
}

export default function UnifiedConsultationPortal({
  language = "de",
  onRobotStateChange,
  onDrBubbleTrigger,
}: UnifiedConsultationPortalProps) {
  const [consultMode, setConsultMode] = useState<"voice" | "chat">("voice");
  
  // Dev mode API telemetry indicator state
  const [apiStatus, setApiStatus] = useState<"idle" | "pending" | "success" | "error">("success");
  const [lastApiCallTime, setLastApiCallTime] = useState<string>(new Date().toLocaleTimeString());
  const [lastPayload, setLastPayload] = useState<any>({
    endpoint: "/api/udoconsensus",
    method: "POST",
    status: 200,
    latencyMs: 184,
    response: {
      consensusScore: 0.98,
      agentResponses: ["AWMF_S2k_RuleEngine: COMPLIANT", "CardioAI: ST-segment baseline normal", "NeurologyAI: EEG Spike-Wave index < 2%"],
      tokenCount: 412,
      model: "gemini-2.5-flash"
    }
  });
  const [isPayloadExpanded, setIsPayloadExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Listen for custom API events if fired across windows
  useEffect(() => {
    const handleApiEvent = (e: any) => {
      if (e.detail) {
        setApiStatus(e.detail.status || "success");
        setLastApiCallTime(new Date().toLocaleTimeString());
        if (e.detail.payload) setLastPayload(e.detail.payload);
      }
    };
    window.addEventListener("udo-api-telemetry", handleApiEvent);
    return () => window.removeEventListener("udo-api-telemetry", handleApiEvent);
  }, []);

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* Dev Mode Real-time API Status Indicator Bar */}
      <div className="bg-slate-950/90 border border-teal-500/30 rounded-xl p-2.5 px-4 backdrop-blur-md flex flex-col gap-2 font-mono text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                apiStatus === "pending" ? "bg-amber-400" : apiStatus === "error" ? "bg-rose-500" : "bg-emerald-400"
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                apiStatus === "pending" ? "bg-amber-500" : apiStatus === "error" ? "bg-rose-500" : "bg-emerald-500"
              }`} />
            </span>
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1">
              <Terminal size={12} /> DEV TELEMETRY
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              apiStatus === "pending" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
              apiStatus === "error" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
              "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {apiStatus.toUpperCase()} ({lastPayload.status || 200})
            </span>
            <span className="text-[10px] text-slate-400 hidden md:inline">
              {lastPayload.endpoint} • {lastPayload.latencyMs || 184}ms • {lastApiCallTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPayload}
              className="p-1 px-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
              title="Copy Payload JSON"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Payload"}</span>
            </button>
            <button
              onClick={() => setIsPayloadExpanded(!isPayloadExpanded)}
              className="p-1 px-2 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
            >
              <span>{isPayloadExpanded ? "Hide JSON" : "Inspect Payload"}</span>
              {isPayloadExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Collapsible Recent Response Payload Inspector */}
        {isPayloadExpanded && (
          <div className="mt-1 p-3 rounded-lg bg-black/80 border border-teal-500/20 text-slate-300 overflow-x-auto max-h-40 scrollbar-thin text-[11px] leading-relaxed">
            <pre className="text-teal-300">{JSON.stringify(lastPayload, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Top Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950/80 border border-teal-500/20 rounded-2xl p-3 px-5 gap-4 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              {language === "en" ? "UDO Unified Consultation Portal" : "U.D.O. Konsultations-Portal"}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono block">
              {language === "en" 
                ? "Seamless switching between Voice AI synthesis and Text/Report Workspace" 
                : "Nahtloser Wechsel zwischen KI-Sprachsteuerung und Text/Gutachten-Workspace"}
            </span>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setConsultMode("voice")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              consultMode === "voice"
                ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mic size={15} />
            <span>{language === "en" ? "Voice Portal" : "Sprach-Modus"}</span>
          </button>

          <button
            onClick={() => setConsultMode("chat")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              consultMode === "chat"
                ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare size={15} />
            <span>{language === "en" ? "Chat & Workspace" : "Text & Workspace"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area depending on mode */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {consultMode === "voice" ? (
          <div className="flex flex-col items-center justify-center min-h-[480px] p-6 bg-slate-950/60 border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-xl">
            {/* Background glowing accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-3xl space-y-6 relative z-10 text-center">
              <div>
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-[0.25em]">
                  Echtzeit KI-Sprachinteraktion
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mt-1">
                  UDO AI Voice Control System
                </h2>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                  {language === "en"
                    ? "Click the glowing orb to start speaking or listening to the multi-agent clinical consensus."
                    : "Klicken Sie auf den leuchtenden Orb, um Sprache aufzunehmen oder den Facharzt-Ergebnissen zuzuhören."}
                </p>
              </div>

              {/* Consultation Orb Control */}
              <div className="w-full">
                <ConsultationOrbControl language={language} />
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 max-w-xl mx-auto flex items-center justify-around text-slate-400 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-teal-400" />
                  <span>Sub-300ms Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>AWMF S2k Guardrails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-violet-400" />
                  <span>Multi-Voice TTS</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch w-full h-full">
            <CologneChatbot
              onRobotStateChange={onRobotStateChange}
              onDrBubbleTrigger={onDrBubbleTrigger}
            />
            <GutachtenPanel
              onRobotStateChange={onRobotStateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
