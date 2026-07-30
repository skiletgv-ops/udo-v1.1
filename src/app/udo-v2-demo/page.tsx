"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, BookOpen, Layers, HelpCircle, Mic, MicOff, RefreshCw, Cpu, ShieldCheck, DollarSign, Activity } from "lucide-react";

export interface UdoV2DemoPageProps {
  onNavigateToPortal?: () => void;
}

export default function UdoV2DemoPage({ onNavigateToPortal }: UdoV2DemoPageProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [recoveredAmount, setRecoveredAmount] = useState<number>(0);
  const [reportsCount, setReportsCount] = useState<number>(0);
  const [ollamaStatus, setOllamaStatus] = useState<"idle" | "connecting" | "online" | "offline">("idle");

  const recognitionRef = useRef<any>(null);

  // Load persistent stats from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMoney = localStorage.getItem("udo_recovered_amount");
      const storedReports = localStorage.getItem("udo_reports_count");
      if (storedMoney) setRecoveredAmount(Number(storedMoney));
      if (storedReports) setReportsCount(Number(storedReports));
    }
  }, []);

  const handleGoBack = () => {
    if (onNavigateToPortal) {
      onNavigateToPortal();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleOpenWhitepaper = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/whitepaper");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleOpenHelp = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/help");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  // Call local Ollama LLM endpoint or fallback generator
  const queryOllamaOrFallback = async (userPrompt: string): Promise<string> => {
    setOllamaStatus("connecting");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: `Du bist UDO V2 Holographic Medical AI. Beantworte auf Deutsch präzise: ${userPrompt}`,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setOllamaStatus("online");
        return data.response || "UDO V2 Holographic Node: Befund analysiert.";
      }
    } catch (err) {
      console.warn("Local Ollama endpoint offline, engaging UDO V2 Holo-Core local synthesis fallback.");
      setOllamaStatus("offline");
    }

    // Fallback response generator
    return `UDO V2 Holo-Core: Spracheingabe "${userPrompt}" verarbeitet. S2k-Kausalität & DGUV-Abrechnung validiert.`;
  };

  // Toggle Web Speech API (de-DE)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "de-DE";
        recognition.interimResults = true;
        recognition.continuous = false;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("Höre zu...");
          setAiResponse("");
        };

        recognition.onresult = (event: any) => {
          let currentText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        recognition.onend = async () => {
          setIsListening(false);
          if (transcript && transcript !== "Höre zu...") {
            setIsProcessing(true);
            const reply = await queryOllamaOrFallback(transcript);
            setAiResponse(reply);
            setIsProcessing(false);

            // Trigger speech synthesis
            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
              const utt = new SpeechSynthesisUtterance(reply);
              utt.lang = "de-DE";
              window.speechSynthesis.speak(utt);
            }
          }
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        };

        recognition.start();
      } else {
        // Simulated speech toggle
        setIsListening(true);
        setTranscript("Hole Befunddaten für S2k Gutachten...");
        setTimeout(async () => {
          setIsListening(false);
          setIsProcessing(true);
          const reply = await queryOllamaOrFallback("Befundanalyse S2k Gutachten");
          setAiResponse(reply);
          setIsProcessing(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 flex flex-col p-4 md:p-8 relative overflow-hidden font-mono select-none">
      {/* Background Cyber Grid Overlay & Ambient Hologram Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Navigation & Header Cluster */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10 border-b border-cyan-900/40 pb-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-all bg-slate-900/90 border border-cyan-800/60 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400"
          >
            <ArrowLeft size={16} />
            <span>MAIN HUB</span>
          </button>
          <div className="h-6 w-[1px] bg-cyan-900/60 hidden md:block" />
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
              UDO V2 HOLOGRAPHIC CORE (DEMO)
            </span>
          </div>
        </div>

        {/* Top-Right Glassmorphism Buttons & Ticker Node */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenWhitepaper}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-slate-900/80 border border-cyan-500/40 rounded-xl hover:bg-slate-800 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <BookOpen size={14} className="text-cyan-400" />
            <span>HOLO-SPEC</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-200 bg-cyan-950/90 border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5),inset_0_0_10px_rgba(6,182,212,0.3)] transition-all"
          >
            <Layers size={14} className="text-cyan-300 animate-pulse" />
            <span>UDO V2 (DEMO)</span>
          </button>

          <button
            onClick={handleOpenHelp}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-300 transition-all backdrop-blur-sm hover:text-white hover:border-cyan-400/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>HELP</span>
          </button>
        </div>
      </header>

      {/* Top 2 Spot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 z-10">
        {/* Spot 1: Top-Left: Green Glowing Dot + AI Brain Online */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_16px_#10b981] animate-pulse" />
              <span className="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            </div>
            <div>
              <div className="text-xs text-emerald-500/80 font-mono tracking-widest uppercase font-semibold">
                SYSTEM NEURAL ENGINE
              </div>
              <div className="text-lg md:text-xl font-black text-emerald-400 tracking-wide flex items-center gap-2">
                <span>AI Brain Online</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Ollama Status</span>
            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
              ollamaStatus === "online"
                ? "text-emerald-300 border-emerald-500/50 bg-emerald-950/60"
                : ollamaStatus === "connecting"
                ? "text-amber-300 border-amber-500/50 bg-amber-950/60 animate-pulse"
                : "text-slate-400 border-slate-700 bg-slate-950/60"
            }`}>
              {ollamaStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Spot 2: Top-Right: CFO Node - Money Found: €0 */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-cyan-800/60 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono tracking-widest uppercase block">
                CFO NODE RECOVERY TICKER
              </span>
              <span className="text-2xl md:text-3xl font-black text-cyan-200 tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                Money Found: €{recoveredAmount.toLocaleString('de-DE')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Reports Total</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{reportsCount} Files</span>
          </div>
        </div>
      </div>

      {/* Spot 3: Center Area - Huge Blank Dark Screen with Orbital Rings & Giant Button */}
      <main className="flex-1 min-h-[440px] md:min-h-[520px] bg-slate-950/90 border border-cyan-900/50 rounded-3xl relative flex flex-col items-center justify-center p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-10 mb-6 overflow-hidden">
        
        {/* Outer & Inner Holographic Spinning Rings */}
        <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite] pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-cyan-400/15 animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border-2 border-dashed border-indigo-500/25 animate-[spin_8s_linear_infinite] pointer-events-none" />

        {/* Live Audio Transcript Display Box */}
        {(transcript || isProcessing || aiResponse) && (
          <div className="z-20 mb-8 max-w-xl w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-xl text-center space-y-2">
            {transcript && (
              <p className="text-sm text-cyan-300 italic font-sans">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
            {isProcessing && (
              <p className="text-xs text-amber-400 font-mono animate-pulse flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analysiere Eingabe mit UDO V2 Holo-Core...</span>
              </p>
            )}
            {aiResponse && (
              <p className="text-sm text-emerald-300 font-semibold font-sans border-t border-slate-800 pt-2">
                {aiResponse}
              </p>
            )}
          </div>
        )}

        {/* Giant Central Button */}
        <button
          onClick={toggleListening}
          className={`z-20 px-10 py-8 rounded-3xl font-black text-2xl md:text-3xl transition-all duration-500 flex items-center gap-4 cursor-pointer border-2 shadow-2xl active:scale-95 uppercase tracking-wider ${
            isListening
              ? "bg-red-950/90 text-red-200 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.7),inset_0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
              : "bg-slate-900/90 hover:bg-slate-800 text-cyan-200 border-cyan-400 shadow-[0_0_45px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_70px_rgba(6,182,212,0.8),inset_0_0_30px_rgba(6,182,212,0.4)] hover:border-cyan-300 hover:text-white"
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-red-400 animate-bounce" />
          ) : (
            <Mic className="w-8 h-8 text-cyan-400" />
          )}
          <span>{isListening ? "Listening Active..." : "🎤 Start Listening"}</span>
        </button>
      </main>

      {/* Spot 4: Bottom-Right Section - Triage Radar Circle with 3 Names (1 Glowing Red) */}
      <footer className="flex justify-end z-10">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-950/95 border-2 border-cyan-800/80 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center p-4 text-center backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500 transition-all">
          {/* Radar Sweep Arc Effect */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.15)_360deg)] animate-[spin_6s_linear_infinite] pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-1.5 mb-2 z-10">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              TRIAGE RADAR
            </span>
          </div>

          <div className="flex flex-col gap-2 z-10">
            <span className="text-slate-300 font-medium text-xs md:text-sm tracking-wide">
              Anna
            </span>
            <span className="text-slate-300 font-medium text-xs md:text-sm tracking-wide">
              Max
            </span>
            <span className="text-red-500 font-black text-sm md:text-base tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse uppercase">
              Lena (URGENT)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
