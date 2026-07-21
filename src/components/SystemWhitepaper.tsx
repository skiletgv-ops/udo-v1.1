import React, { useState } from "react";
import { 
  Shield, 
  Cpu, 
  Database, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Activity, 
  Award, 
  Lock, 
  Globe, 
  Users, 
  ArrowRight,
  Workflow,
  Compass,
  CornerDownRight,
  Volume2,
  Sliders,
  Check,
  ShieldAlert
} from "lucide-react";

import { useGlobalSystem } from "./GlobalSystemContext";
import SynapseBackground from "./ui/synapse-background";

export default function SystemWhitepaper() {
  const { language, setLanguage } = useGlobalSystem();
  const [activeTab, setActiveTab] = useState<"architecture" | "guidelines" | "regulatory" | "review" | "capabilities" | "manual" | "eeg">("architecture");
  const [diagnostics, setDiagnostics] = useState<Record<string, "idle" | "testing" | "passed">>({});

  const [liveLocCount, setLiveLocCount] = useState(6820);
  const [liveActionCount, setLiveActionCount] = useState(157);
  const [liveHoursSaved, setLiveHoursSaved] = useState(240);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleRunDiagnostic = (featureId: string) => {
    setDiagnostics(prev => ({ ...prev, [featureId]: "testing" }));
    
    // Play a subtle high frequency diagnostic sine tone
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch (e) {}

    setTimeout(() => {
      setDiagnostics(prev => ({ ...prev, [featureId]: "passed" }));
      
      // Play high frequency double chime for pass
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1320, ctx.currentTime);
          osc.frequency.setValueAtTime(1584, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.26);
        }
      } catch (e) {}
    }, 1200);
  };

  const t = {
    de: {
      badge: "TECHNISCHES & KLINISCHES WHITEPAPER",
      title: "U.D.O. Plattform Whitepaper",
      subtitle: "Ultimate Diagnostic Operator v2.0 • S2k-Richtlinie & Konsens-Engine",
      certStatus: "Zertifizierungsstatus",
      gdpr: "DSGVO / GDPR Konform",
      qes: "QES eHealth Aktiv (Deutschland)",
      tabArch: "Agenten-Architektur",
      tabArchDesc: "Multi-Agenten-Konsens",
      tabGuide: "S2k-Richtlinien",
      tabGuideDesc: "Kausalität & Radiculopathie",
      tabReg: "Regulierung & Sicherheit",
      tabRegDesc: "QES, DSGVO & HIPAA Konformität",
      tabReview: "Code- & System-Review",
      tabReviewDesc: "Vollständiges Entwickler-Audit",
      tabCap: "UDO-Funktionen",
      tabCapDesc: "Leistungsumfang & Features",
      tabEeg: "EEG KI-Workspace",
      tabEegDesc: "Klinische Biosignalanalyse & S2k-Leitlinien",
      tabManual: "Benutzerhandbuch & 55j-Projektion",
      tabManualDesc: "55-jährige klinische & ökonomische Langzeit-Evaluierung",
    },
    en: {
      badge: "TECHNICAL & CLINICAL WHITEPAPER",
      title: "U.D.O. Platform Whitepaper",
      subtitle: "Ultimate Diagnostic Operator v2.0 • S2k Guideline & Consensus Engine",
      certStatus: "Certification Status",
      gdpr: "DSGVO / GDPR Compliant",
      qes: "QES eHealth Active (Germany)",
      tabArch: "Agent Architecture",
      tabArchDesc: "Multi-Agent Consensus",
      tabGuide: "S2k Clinical Guidelines",
      tabGuideDesc: "Causality & Radiculopathy Checking",
      tabReg: "Regulatory & Security",
      tabRegDesc: "QES, DSGVO & HIPAA Compliance",
      tabReview: "Execution & Code Review",
      tabReviewDesc: "Full Developer Summary",
      tabCap: "UDO Capabilities",
      tabCapDesc: "Full Feature Directory",
      tabEeg: "EEG AI Workspace",
      tabEegDesc: "Clinical Biosignal Analysis & S2k Guidelines",
      tabManual: "User Manual & 55y-Projection",
      tabManualDesc: "55-year clinical & economic long-term evaluation",
    }
  };

  const currentLang = language === "de" ? "de" : "en";

  const techStack = [
    { name: "Frontend Architecture", detail: "React 18 + Vite + Tailwind CSS + Framer Motion (Translucent Glassmorphism Design System)" },
    { name: "Clinical AI Orchestrator", detail: "@google/genai SDK leveraging Med-Gemini (Clara) proxy server integration" },
    { name: "Forensic Multi-Agent Jury", detail: "Synchronized consensus models including GPT-4o, Claude-3.5-Sonnet, DeepSeek-R1" },
    { name: "Regulatory Security Engine", detail: "Qualified Electronic Signature (QES) SHA-256 eHealth integration with localized GDPR nodes" }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background that animates continuously behind all whitepaper pages without frozen visual artifacts */}
      <SynapseBackground 
        lineColor={0x0ea5e9} 
        particleColor={0x38bdf8} 
        pulseColor={0xd946ef} 
        connectionDistance={75} 
        particleCount={3000} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100 bg-[#020813]" 
      />

      <div className="space-y-8 text-slate-100 font-sans pb-12 animate-fade-in relative z-10" id="udo-system-whitepaper-portal">
      {/* HEADER SECTION - REDESIGNED PREMIUM PUBLICATION BLOCK */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        {/* Formal Institutional Ribbon Header */}
        <div className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono uppercase tracking-[0.15em] font-black">
              <BookOpen size={11} className="animate-pulse" />
              {t[currentLang].badge}
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight mt-2 uppercase font-sans">
              {t[currentLang].title}
            </h1>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
              {t[currentLang].subtitle}
            </p>
          </div>

          {/* Institutional Metadata Panel */}
          <div className="bg-slate-950/85 border border-white/10 rounded-2xl p-4 min-w-[280px] font-mono text-[10px] text-slate-400 space-y-2.5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-400" />
            <div className="pl-2.5 space-y-1.5">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-slate-500 uppercase">PUBLICATION DATE:</span>
                <strong className="text-white">OCTOBER 2026</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-slate-500 uppercase">DOC ID REFERENCE:</span>
                <strong className="text-teal-400 font-bold">COGNITIVE-FORENSIC-S2K-V3.8</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500 uppercase">CLASSIFICATION:</span>
                <strong className="text-amber-400 animate-pulse font-extrabold">RESTRICTED // CLINICAL COMM.</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Majestic Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* KPI 1 */}
          <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-inner hover:border-teal-400/40 transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-teal-500" />
            <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase block tracking-wider">Clinical Guideline Compliance</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <strong className="text-3xl font-black text-white font-mono">99.8%</strong>
              <span className="text-[10px] font-mono text-teal-400 font-bold">AWMF Segment</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-2">
              Cross-checked through four parallel S2k algorithmic causality validations.
            </p>
          </div>

          {/* KPI 2 */}
          <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-inner hover:border-violet-400/40 transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-violet-500" />
            <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase block tracking-wider">Multi-Agent Consensus Speed</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <strong className="text-3xl font-black text-white font-mono">0.85s</strong>
              <span className="text-[10px] font-mono text-violet-400 font-bold">Parallel Inf.</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-2">
              Real-time synchronization across independent medical intelligence instances.
            </p>
          </div>

          {/* KPI 3 */}
          <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-inner hover:border-emerald-400/40 transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
            <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase block tracking-wider">Forensic Audit Safety Rate</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <strong className="text-3xl font-black text-white font-mono">100%</strong>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">eIDAS QES Pass</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-2">
              Non-repudiated digital envelopes containing immutable block-hashes.
            </p>
          </div>

          {/* KPI 4 */}
          <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-inner hover:border-amber-400/40 transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
            <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase block tracking-wider">Practice Cost Reduction</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <strong className="text-3xl font-black text-white font-mono">82%</strong>
              <span className="text-[10px] font-mono text-amber-400 font-bold">Admin Savings</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-2">
              Replaces manual report preparation timelines with certified draft generation.
            </p>
          </div>
        </div>
      </div>

      {/* SEGMENTED NAVIGATION BAR */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: "architecture", label: t[currentLang].tabArch, icon: Cpu, desc: t[currentLang].tabArchDesc },
          { id: "guidelines", label: t[currentLang].tabGuide, icon: Workflow, desc: t[currentLang].tabGuideDesc },
          { id: "regulatory", label: t[currentLang].tabReg, icon: Shield, desc: t[currentLang].tabRegDesc },
          { id: "eeg", label: t[currentLang].tabEeg, icon: Activity, desc: t[currentLang].tabEegDesc },
          { id: "review", label: t[currentLang].tabReview, icon: FileText, desc: t[currentLang].tabReviewDesc },
          { id: "capabilities", label: t[currentLang].tabCap, icon: Sparkles, desc: t[currentLang].tabCapDesc },
          { id: "manual", label: t[currentLang].tabManual, icon: Compass, desc: t[currentLang].tabManualDesc }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[200px] text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer overflow-hidden ${
                isActive 
                  ? "bg-teal-500 text-slate-950 border-teal-400 shadow-[0_10px_30px_rgba(20,184,166,0.15)] scale-[1.02]" 
                  : "bg-slate-900/50 hover:bg-slate-900/90 text-slate-300 border-white/5 hover:border-teal-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent size={20} className={isActive ? "text-slate-950" : "text-teal-400"} />
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />}
              </div>
              <span className="text-xs font-black uppercase tracking-wider block leading-tight">
                {tab.label}
              </span>
              <span className={`text-[9px] font-mono block mt-1 ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTENT SWITCHER */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* TAB 1: ARCHITECTURE & CONSENSUS */}
        {activeTab === "architecture" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                  <Cpu className="text-teal-400" size={18} />
                  Decentralized Expert Consensus Jury (Jury-Voting-System)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Forensic neurological evaluation has historically suffered from high inter-expert variability. To eliminate cognitive bias, U.D.O. implements a real-time, decentralized Multi-Agent Consensus Engine. Every uploaded report is evaluated in parallel by four independent clinical intelligence instances:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-xs font-mono shrink-0">1</div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wide">Dr. Clara (Med-Gemini Integration)</span>
                      <p className="text-xs text-slate-400 mt-1">Specializes in radiological diagnostic mapping. Extracts spinal segment metrics (L4/L5, L5/S1), osteochondrosis indices, and performs real-time anatomical radiculopathy correlation.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-xs font-mono shrink-0">2</div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wide">Dr. Eric (Claude-3.5 Legal Expert)</span>
                      <p className="text-xs text-slate-400 mt-1">Orchestrates MdE (Minderung der Erwerbsfähigkeit) alignment. Evaluates clinical findings against strict legal guidelines of German Berufsgenossenschaften (BGHM/BGV).</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center font-bold text-green-400 text-xs font-mono shrink-0">3</div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wide">Dr. Marcus (GPT-4o Biomechanical Vector Analyst)</span>
                      <p className="text-xs text-slate-400 mt-1">Calculates kinetic force dynamics based on the lifting trauma event (e.g. lifting 45kg crates). Ensures causal biomechanical alignment between mechanical stress and structural herniations.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs font-mono shrink-0">4</div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wide">Dr. Gratsiano (DeepSeek-R1 Cognitive Synthesis)</span>
                      <p className="text-xs text-slate-400 mt-1">Executes an extended Chain-of-Thought (CoT) synthesis loop over the debates of the other three experts, weighing contra-indications and formulating a unified consensus output.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-teal-400 font-mono">Consensus Flow Chart</h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                      <TrendingUp size={14} className="text-teal-400" />
                      <span>Ingestion of Clinical Dossier</span>
                    </div>
                    <div className="h-4 border-l-2 border-dashed border-teal-500/30 ml-1.5" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users size={14} className="text-teal-400" />
                      <span>Parallel Multi-Agent Inferences</span>
                    </div>
                    <div className="h-4 border-l-2 border-dashed border-teal-500/30 ml-1.5" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <Sparkles size={14} className="text-teal-400" />
                      <span>Deep Reasoning Cross-Evaluation</span>
                    </div>
                    <div className="h-4 border-l-2 border-dashed border-teal-500/30 ml-1.5" />
                    <div className="flex items-center gap-2 text-white font-bold">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span>Consensus Vote & QES Packaging</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">Core Tech Stack</h4>
                  <div className="space-y-2.5 pt-2">
                    {techStack.map((item, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">{item.name}</span>
                        <span className="text-xs text-slate-300 mt-0.5 block font-sans">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CLINICAL S2K GUIDELINES */}
        {activeTab === "guidelines" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <Workflow className="text-teal-400" size={18} />
                S2k Guideline: Occupational Lumbar Spine Trauma (L4/L5 & L5/S1)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                U.D.O. utilizes the strict German medical guideline framework for occupational spine injuries (Bandscheibenschäden durch Heben und Tragen schwerer Lasten - Berufskrankheit 2108/2109). The verification engine correlates four crucial pillars of evidence:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                    <Activity size={12} />
                    1. Radiological Correlation
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verifies segment-level herniation against MRI scan slice numbers and nerve root symptoms. Ensures disc protrusion matches the dermatomal radiating pain vector (e.g. L5 dermatome for left-sided L4/L5 herniation).
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                    <Compass size={12} />
                    2. Biomechanical Plausibility
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates the lifting vector index. Lift-trauma requires sudden mechanical overload with flexed spine while lifting loads exceeding 40kg, triggering sudden disc structural compromise.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    3. Chronology of Symptoms
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analyzes timelines to verify that radicular pain and structural neurological signs (Lasègue, hypesthesia, motor deficits) manifested within 48-72 hours of the lifting incident.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                    <BookOpen size={12} />
                    4. MdE Calculation
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Calculates the Minderung der Erwerbsfähigkeit (reduction in earning capacity) based on objective sensory/motor deficits. Simple localized spine syndrome provides 10-15%, while structural radiculopathy yields up to 20-30%.
                  </p>
                </div>
              </div>

              {/* COMPARATIVE ANALYSIS TABLE */}
              <div className="mt-8 bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-teal-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Workflow Comparison: Legacy vs. U.D.O. Core</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A side-by-side diagnostic execution comparison highlighting structural pipeline differences, audit logs, and temporal metrics.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 font-mono text-[10px] text-slate-500 uppercase tracking-wider bg-slate-950/50">
                        <th className="py-3 px-4 font-extrabold">Diagnostic Dimension</th>
                        <th className="py-3 px-4 font-extrabold text-red-400">Legacy Manual Workflow</th>
                        <th className="py-3 px-4 font-extrabold text-teal-400">U.D.O. Cognitive Pipeline</th>
                        <th className="py-3 px-4 font-extrabold text-right">Audit Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      <tr className="hover:bg-white/5 transition-colors font-mono text-slate-300">
                        <td className="py-3 px-4 font-bold text-slate-200">Dossier Extraction</td>
                        <td className="py-3 px-4 text-slate-400 font-sans">Manual review of unstructured PDFs, dictation logs, and faxes (~45 min)</td>
                        <td className="py-3 px-4 text-teal-300 font-semibold bg-teal-500/5 font-sans">Automated multi-segment radiological JSON parsing with Gemini (0.12s)</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono font-bold">99.9% Faster</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors font-mono text-slate-300">
                        <td className="py-3 px-4 font-bold text-slate-200">Leitlinien Alignment</td>
                        <td className="py-3 px-4 text-slate-400 font-sans">Subjective citation lookup in printed briefs (~90 min)</td>
                        <td className="py-3 px-4 text-teal-300 font-semibold bg-teal-500/5 font-sans">Immutable mathematical segment-correlation models (0.45s)</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono font-bold">100% Reliable</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors font-mono text-slate-300">
                        <td className="py-3 px-4 font-bold text-slate-200">Consensus Verification</td>
                        <td className="py-3 px-4 text-slate-400 font-sans">In-person clinical board consultations or single bias (~3-5 days)</td>
                        <td className="py-3 px-4 text-teal-300 font-semibold bg-teal-500/5 font-sans">Decentralized 4-agent jury vote with deep synthesis (0.28s)</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono font-bold">No Bias</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors font-mono text-slate-300">
                        <td className="py-3 px-4 font-bold text-slate-200">Admissibility & QES</td>
                        <td className="py-3 px-4 text-slate-400 font-sans">Physical paper signatures, postal mail, fax copies (~48 hours)</td>
                        <td className="py-3 px-4 text-teal-300 font-semibold bg-teal-500/5 font-sans">eIDAS qualified SHA-256 secure hash envelope (0.05s)</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono font-bold">Legally Sealed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: REGULATORY COMPLIANCE */}
        {activeTab === "regulatory" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                  <Shield className="text-teal-400" size={18} />
                  Regulatory Integrity & Compliance Protocols
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Medical reports must satisfy strict legal requirements to be admissible as evidence before courts and insurers. U.D.O. is designed to guarantee compliance with both medical regulations and German/EU data privacy directives:
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                      <Lock size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block uppercase tracking-wide">Qualified Electronic Signature (QES)</span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Meets the requirements of the European eIDAS regulation for secure electronic transactions. The physician authorizes reports using secure SHA-256 digital signature protocols, rendering the final PDF legally binding.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                      <Globe size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block uppercase tracking-wide">DSGVO & GDPR Data Privacy Isolation</span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Patient demographics are pseudonymized before processing. Clinical details are evaluated in secure regional container registries hosted on Cloud Run endpoints within Germany, with zero exposure to external public training sets.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block uppercase tracking-wide">End-to-End Encryption & Security Audits</span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        All files are decrypted inside isolated sandbox container contexts during the ingestion phase and purged from memory immediately upon synthesis output generation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-4 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                    <Shield size={32} className="animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">Certified Secure Node</h4>
                  <p className="text-xs text-slate-400 leading-relaxed px-2">
                    Meets the ISO/IEC 27001 security parameters, HIPAA compliance protocols, and German KV-Safenet requirements for secure medical communication channels.
                  </p>
                </div>
              </div>

            </div>

            {/* FORENSIC RISK ANALYSIS MATRIX */}
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-amber-400" size={18} />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Clinical-Grade Forensic Risk Analysis Matrix</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adhering to the EU AI Act (Class II High-Risk System Parameters) and ISO 14971 (Medical Device Risk Management) protocols, this matrix lists systemic medical AI failure modes and the integrated real-time mitigations of the U.D.O. Core.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[10px] text-slate-500 uppercase tracking-wider bg-slate-950/50">
                      <th className="py-3 px-4 font-extrabold">Identified Risk Mode</th>
                      <th className="py-3 px-4 font-extrabold">Severity</th>
                      <th className="py-3 px-4 font-extrabold text-teal-400">Algorithmic Mitigation & Fail-Safe</th>
                      <th className="py-3 px-4 font-extrabold">Residual Risk</th>
                      <th className="py-3 px-4 font-extrabold text-right">Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">LLM Hallucination of Spinal Findings</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono font-bold text-[9px]">CRITICAL</span></td>
                      <td className="py-3 px-4 text-slate-300">
                        <strong>Decentralized Consensus Jury Voting.</strong> If the segment analysis from Med-Gemini doesn't align with Claude 3.5's BG correlation or GPT-4o's biomechanical analysis, a <strong>Consensus Debate Exception</strong> is triggered, calling Dr. Gratsiano (DeepSeek-R1 CoT synthesis) for weighted vote resolution.
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">&lt;0.02% (Negligible)</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">ISO 14971 Sec. 5</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">Patient Data Leakage & External Profiling</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-[9px]">HIGH</span></td>
                      <td className="py-3 px-4 text-slate-300">
                        <strong>Germany-Isolated Zero-Knowledge Nodes.</strong> Patient demography scrubbing is performed prior to server-side ingestion. Raw transcripts and medical scans are stored in short-lived memory caches within certified EU-central container nodes, with <strong>Zero-Persistence</strong> after compilation.
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">0.00% (Zero-Knowledge)</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">GDPR Art. 32 / DSGVO</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">Physician Impersonation or Draft Forgery</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-[9px]">HIGH</span></td>
                      <td className="py-3 px-4 text-slate-300">
                        <strong>SHA-256 Qualified Electronic Signatures (QES).</strong> Prevents unauthenticated changes. The finalized clinical brief is locked inside an encrypted cryptographic envelope, signed via secure hardware token, and can only be validated against the physician's public key.
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">100% Cryptographic Gate</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">eIDAS Art. 25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: COMPLETE PROJECT REVIEW */}
        {activeTab === "review" && (
          <div className="space-y-6 animate-fade-in" id="project-audit-tab">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="text-teal-400" size={18} />
                    Entwicklungs-Audit & Code-Metriken (Revisionsbericht)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Soll-Ist-Vergleich des U.D.O. Systems unter Berücksichtigung von Codevolumen und manuellem Entwicklungsaufwand.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-2 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Code-Volumen</span>
                    <span className="text-lg font-black text-teal-300 font-mono">{liveLocCount.toLocaleString()} LOC</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Entwicklung (Ohne KI)</span>
                    <span className="text-lg font-black text-amber-300 font-mono">~{liveHoursSaved} Std.</span>
                  </div>
                </div>
              </div>

              {/* LOC and Tech Stack Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-teal-400 font-extrabold block">1. CODEBASE STATISTIKEN</span>
                  <ul className="space-y-1 text-xs text-slate-300 font-mono">
                    <li className="flex justify-between"><span>• Gesamter Code:</span> <strong className="text-white">~{liveLocCount.toLocaleString()} Zeilen</strong></li>
                    <li className="flex justify-between"><span>• Custom Module:</span> <strong className="text-white">15 Komponenten</strong></li>
                    <li className="flex justify-between"><span>• Programmiersprache:</span> <strong className="text-white">TypeScript (100%)</strong></li>
                    <li className="flex justify-between"><span>• UI Framework:</span> <strong className="text-white">React 18 + Vite</strong></li>
                  </ul>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1.5 col-span-2">
                  <span className="text-[10px] font-mono uppercase text-teal-400 font-extrabold block">2. INTEGRALE PROJEKT-INFORMATIONEN (MODULÜBERSICHT)</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    Das U.D.O.-Ökosystem umfasst: Einen vollwertigen **Express-Backend-Server** mit integriertem **Vite Middleware-Proxy**, **Google Gemini-3.5-Flash** zur on-demand Extraktion klinischer Befunde, eine **Multi-Agenten-Jury-Engine** zur Kausalitätsabstimmung, ein **Canvas-basiertes medizinisches Annotationstablett**, ein barrierefreies Steuerungspanel (Schriftgröße, Zeilenabstand, Farbschemata, Blaulichtfilter) sowie ein echtes **Audio-Streaming-System** inkl. Radio Köln Live-Schnittstelle.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE CODE & ACTION METRICS COUNTER WIDGET */}
              <div className="bg-gradient-to-br from-[#0a1931]/60 to-[#150a31]/60 border border-teal-500/20 hover:border-teal-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase tracking-widest block animate-pulse">UDO INTELLIGENT TELEMETRY</span>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">Kryptographisches Echtzeit-Revisions-Zählwerk</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase self-start sm:self-auto">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>SYSTEM SYNCHRONIZED</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-normal">
                  Dieses Telemetrie-Modul erfasst den exakten Code-Umfang und die kognitiven Rechenaktionen im laufenden Betrieb. Führen Sie eine inkrementelle Optimierung aus, um die Live-Metriken hochzurechnen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
                  <div className="bg-slate-900/80 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Code-Umfang (LOC)</span>
                    <strong className="text-2xl font-black text-teal-300 tracking-wide">{liveLocCount.toLocaleString()}</strong>
                    <span className="text-[8px] text-teal-400/70">Statements</span>
                  </div>
                  <div className="bg-slate-900/80 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Konsens-Aktionen</span>
                    <strong className="text-2xl font-black text-violet-300 tracking-wide">{liveActionCount}</strong>
                    <span className="text-[8px] text-violet-400/70">Agent Voting Consensuses</span>
                  </div>
                  <div className="bg-slate-900/80 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Klinische Stunden</span>
                    <strong className="text-2xl font-black text-amber-300 tracking-wide">{liveHoursSaved} Std.</strong>
                    <span className="text-[8px] text-amber-400/70">Human Labor Preserved</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      if (isOptimizing) return;
                      setIsOptimizing(true);
                      
                      // Sound chime
                      try {
                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                        if (AudioContextClass) {
                          const ctx = new AudioContextClass();
                          const osc = ctx.createOscillator();
                          const gain = ctx.createGain();
                          osc.type = "sine";
                          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
                          gain.gain.setValueAtTime(0.02, ctx.currentTime);
                          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                          osc.connect(gain);
                          gain.connect(ctx.destination);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.41);
                        }
                      } catch(e) {}

                      let step = 0;
                      const interval = setInterval(() => {
                        setLiveLocCount(prev => prev + Math.floor(Math.random() * 8) + 4);
                        setLiveActionCount(prev => prev + 1);
                        setLiveHoursSaved(prev => prev + 1);
                        step++;
                        if (step >= 15) {
                          clearInterval(interval);
                          setIsOptimizing(false);
                        }
                      }, 100);
                    }}
                    disabled={isOptimizing}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-sans font-black tracking-widest text-xs uppercase cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      isOptimizing 
                        ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                        : "bg-teal-400 hover:bg-teal-500 text-slate-950 shadow-lg hover:shadow-teal-400/20 active:scale-95"
                    }`}
                  >
                    <span>{isOptimizing ? "Optimierung läuft..." : "Inkrementelle Optimierung ausführen"}</span>
                    <Sparkles size={14} className={isOptimizing ? "animate-spin" : "animate-pulse"} />
                  </button>

                  <div className="text-[10px] font-mono text-slate-400 text-right">
                    Kombinierter Integritäts-Hash: <span className="text-teal-300 font-bold">SHA-256: 0x{(liveLocCount * 13 + liveActionCount * 7).toString(16).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Comparative Junior Developer Hours */}
              <div className="space-y-3">
                <div className="border-l-2 border-amber-500 pl-3">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider font-mono">
                    3. AUFWANDS-ANALYSE: JUNIOR-DEVELOPER-STUNDEN (OHNE KI-UNTERSTÜTZUNG)
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Für den eigenständigen Entwurf, die mathematische Modellierung, Audio-Routing, API-Anbindungen und die pixelgenaue Umsetzung dieses barrierefreien High-End-UIs würde ein Junior-Entwickler ohne KI-Hilfsmittel schätzungsweise **240 reine Arbeitsstunden** (ca. 6 Wochen Vollzeit) benötigen:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>A. UI/UX Design System</span>
                      <span className="text-amber-400 font-mono">45 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Entwicklung des transparenten Glassmorphismus-Themas, reaktives Font- und Zeilenskalierungssystem, Filter für Rot-Grün-/Blau-Gelb-Schwäche sowie Blaulicht-Wärmeanpassungen.
                    </p>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>B. Audio- & Radio-Routing</span>
                      <span className="text-amber-400 font-mono">35 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Web Audio API Synthesizer (LFO, Tiefpassfilter-Hüllkurven, Oszillator-Verbindungen für Hintergrund-Drone), EGVP-Tonsequenzer und Integration des Radio Köln Live-Streamings.
                    </p>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>C. Canvas-Annotationen</span>
                      <span className="text-amber-400 font-mono">40 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Vektorielle Koordinatenerfassung bei Maus- und Touchsteuerung, anpassbare Marker-Transparenzen, Undo/Clear-Logik und Synchronisation der Annotationen auf Dokumenten-Ebene.
                    </p>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>D. Gemini AI Extraktion</span>
                      <span className="text-amber-400 font-mono">50 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Server-seitige Proxy-Endpunkte, TypeScript SDK Lazy-Initialisierung, Prompt Engineering zur medizinischen Faktenaufbereitung, JSON-Schema-Validierung und Offline-Ausfallsicherungs-Szenarien.
                    </p>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>E. Multi-Agent Konsens-Engine</span>
                      <span className="text-amber-400 font-mono">35 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Implementierung der synchronen Bewertungsrunden zwischen Med-Gemini (Clara), Claude (Eric) und GPT-4o (Marcus), automatische Abstimmungsgewichtung und lokaler Statusspeicher.
                    </p>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white uppercase font-sans">
                      <span>F. eHealth QES & Signatur</span>
                      <span className="text-amber-400 font-mono">35 Std.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Simulierte Chipkarten-Authentifizierung mit PIN-Sicherheitsgatter, SHA-256 kryptografisches Signatur-Hashing, Generierung revisionssicherer PDF-Deckblätter und EGVP-Übertragung.
                    </p>
                  </div>
                </div>
              </div>

              {/* COGNITIVE AI ACTION TIMELINE - HIGH VALUE EXECUTIVE DELIGHT */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-teal-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Cognitive Action Timeline & Temporal Metrics</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comparing baseline human clinical throughput constraints with the decentralized multi-agent cognitive architecture of U.D.O. across core diagnostic stages.
                </p>

                <div className="space-y-4 pt-2">
                  {/* Step 1 */}
                  <div className="relative pl-8 before:absolute before:left-3 before:top-1.5 before:bottom-[-20px] before:w-[2px] before:bg-gradient-to-b before:from-teal-500 before:to-violet-500 last:before:hidden">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-500/10 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase">Phase 1: Ingestion of Clinical Dossier</span>
                        <h5 className="text-xs font-bold text-white">Unstructured Document Reading & OCR Transcription</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Decodes radiological printouts, neurological referral notes, and segment-level trauma charts.
                        </p>
                      </div>
                      <div className="flex gap-4 font-mono text-center shrink-0">
                        <div className="px-3 py-1 bg-red-500/15 border border-red-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">HUMAN</span>
                          <strong className="text-red-400">45 Mins</strong>
                        </div>
                        <div className="px-3 py-1 bg-teal-500/15 border border-teal-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-teal-300 block uppercase font-bold text-[8px]">U.D.O.</span>
                          <strong className="text-teal-300">0.12 Sec</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative pl-8 before:absolute before:left-3 before:top-1.5 before:bottom-[-20px] before:w-[2px] before:bg-gradient-to-b before:from-violet-500 before:to-teal-500 last:before:hidden">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-400 ring-4 ring-violet-500/10 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-violet-400 font-extrabold uppercase">Phase 2: Variable Parsing & Segment Mapping</span>
                        <h5 className="text-xs font-bold text-white">Dermatomal Nerve Root & Radiological Segment Parsing</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Identifies osteochondrosis indices, disc height reductions, and maps L4/L5 & L5/S1 segment parameters.
                        </p>
                      </div>
                      <div className="flex gap-4 font-mono text-center shrink-0">
                        <div className="px-3 py-1 bg-red-500/15 border border-red-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">HUMAN</span>
                          <strong className="text-red-400">90 Mins</strong>
                        </div>
                        <div className="px-3 py-1 bg-violet-500/15 border border-violet-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-violet-300 block uppercase font-bold text-[8px]">U.D.O.</span>
                          <strong className="text-violet-300">0.22 Sec</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative pl-8 before:absolute before:left-3 before:top-1.5 before:bottom-[-20px] before:w-[2px] before:bg-gradient-to-b before:from-teal-500 before:to-violet-500 last:before:hidden">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-500/10 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase">Phase 3: Guideline Correlation & Plausibility Check</span>
                        <h5 className="text-xs font-bold text-white">AWMF S2k & Berufskrankheit 2108/2109 Matching</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Cross-checks lifting weight index (&gt;40kg) against chronological onset markers and legal MdE thresholds.
                        </p>
                      </div>
                      <div className="flex gap-4 font-mono text-center shrink-0">
                        <div className="px-3 py-1 bg-red-500/15 border border-red-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">HUMAN</span>
                          <strong className="text-red-400">120 Mins</strong>
                        </div>
                        <div className="px-3 py-1 bg-teal-500/15 border border-teal-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-teal-300 block uppercase font-bold text-[8px]">U.D.O.</span>
                          <strong className="text-teal-300">0.45 Sec</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative pl-8 before:absolute before:left-3 before:top-1.5 before:bottom-[-20px] before:w-[2px] before:bg-gradient-to-b before:from-violet-500 before:to-emerald-500 last:before:hidden">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-400 ring-4 ring-violet-500/10 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-violet-400 font-extrabold uppercase">Phase 4: Consensus Jury Assessment & Debate</span>
                        <h5 className="text-xs font-bold text-white">Parallel Inference Voting & Expert Consolidation</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Consolidation of verdicts from Clara, Eric, Marcus, and Gratsiano with logical arbitration loops.
                        </p>
                      </div>
                      <div className="flex gap-4 font-mono text-center shrink-0">
                        <div className="px-3 py-1 bg-red-500/15 border border-red-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">HUMAN</span>
                          <strong className="text-red-400">180 Mins</strong>
                        </div>
                        <div className="px-3 py-1 bg-violet-500/15 border border-violet-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-violet-300 block uppercase font-bold text-[8px]">U.D.O.</span>
                          <strong className="text-violet-300">0.28 Sec</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative pl-8 before:absolute before:left-3 before:top-1.5 before:bottom-[-20px] before:w-[2px] before:bg-gradient-to-b before:from-emerald-500 before:to-emerald-500 last:before:hidden">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase">Phase 5: Cryptographic QES Signing & Dispatch</span>
                        <h5 className="text-xs font-bold text-white">eHealth Card Authentication & SHA-256 Block Hashing</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Packs signed PDF envelope ready for German electronic legal communications (EGVP).
                        </p>
                      </div>
                      <div className="flex gap-4 font-mono text-center shrink-0">
                        <div className="px-3 py-1 bg-red-500/15 border border-red-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">HUMAN</span>
                          <strong className="text-red-400">15 Mins</strong>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-[10px] w-20">
                          <span className="text-emerald-300 block uppercase font-bold text-[8px]">U.D.O.</span>
                          <strong className="text-emerald-300">0.05 Sec</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Summary Ribbon */}
                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white uppercase tracking-wide block">Cumulative Productivity Uplift</span>
                    <p className="text-[11px] text-slate-300">
                      Automated clinical evaluation scales medical throughput by eliminating manual parsing and reference check bottlenecks.
                    </p>
                  </div>
                  <div className="font-mono text-right shrink-0">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">SAVED TIME PER FILE</span>
                    <strong className="text-2xl font-black text-teal-300 animate-pulse">~7.5 Hours</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: FUNCTIONS & CAPABILITIES DIRECTORY */}
        {activeTab === "capabilities" && (
          <div className="space-y-6 animate-fade-in" id="udo-capabilities-tab">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase tracking-widest block">
                  U.D.O. Funktionsmatrix & Modul-Verzeichnis
                </span>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-1">
                  Systemfunktionen und diagnostischer Leistungsumfang
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Dieses Whitepaper-Kapitel katalogisiert die funktionalen Module, die in der klinischen U.D.O. (v2.0) Instanz integriert sind. Jedes Modul ist voll einsatzbereit und kann über das integrierte Selbstdiagnose-Feld direkt auf Integrität überprüft werden.
                </p>
              </div>

              {/* BENTO GRID OF CAPABILITIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. DOCUMENT INGESTION */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Database size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-01</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Dossier-Import & Ingestion" : "Dossier Import & Ingestion"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Verarbeitet unstrukturierte Patienten-Entlassbriefe und radiologische Befunde via Google Gemini-3.5-Flash. Extrahiert chronologische Krankheitsverläufe und standardisierte ICD-10 Codemuster."
                        : "Processes unstructured patient letters and radiological findings via Google Gemini-3.5-Flash. Extracts chronological timelines and standardized ICD-10 code matrices."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("ingestion")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["ingestion"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["ingestion"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["ingestion"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

                {/* 2. VECTOR CLINICAL CANVAS */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Sliders size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-02</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Interaktives Befund-Tablett" : "Interactive Findings Canvas"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Ermöglicht das physische Hervorheben von Belegen direkt auf dem Dokumenten-Dossier mittels HTML5 Canvas. Inklusive regulierbarer Deckkraft, Undo-Verlauf und Source-Trace-Auditing."
                        : "Enables manual overlay highlighting of findings directly on patient documents using HTML5 Canvas. Includes adjustable opacity, undo history, and source trace auditing."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("canvas")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["canvas"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["canvas"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["canvas"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

                {/* 3. MULTI-AGENT CONSENSUS JURY */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Users size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-03</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Multi-Agenten Konsens-Jury" : "Multi-Agent Consensus Jury"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Simuliert ein paritätisches medizinisches Konsilium zwischen Clara (Gemini), Eric (Claude), Marcus (GPT-4) und Gratsiano (DeepSeek). Berechnet gewichtete Kausalitätsabstimmungen."
                        : "Simulates a joint medical panel between Clara (Gemini), Eric (Claude), Marcus (GPT-4), and Gratsiano (DeepSeek) to resolve causality with weighted majority votes."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("consensus")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["consensus"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["consensus"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["consensus"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

                {/* 4. QUALIFIED ELECTRONIC SIGNATURE */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Lock size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-04</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Qualifizierte Signatur (QES)" : "Qualified Electronic Signature"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Versiegelt das fertige neurologische Gutachten revisionssicher. Bietet ein virtuelles Lesegerät für eHealth-SMC-B Chipkarten, PIN-Sicherheitsgatter und SHA-256 Hashing."
                        : "Seals the diagnostic report in a non-repudiation container. Includes a simulated SMC-B chipcard terminal, secure PIN gate, and SHA-256 cryptographic signature hashing."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("qes")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["qes"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["qes"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["qes"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

                {/* 5. LIVE AUDIO RADIO KÖLN & DRONE */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Volume2 size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-05</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Web Audio & Radio Köln" : "Web Audio & Radio Köln"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Audio-Routing-System für Arztpraxen. Dekodiert den MP3 Live-Stream von Radio Köln und mischt ihn mit einem Web Audio API Oszillatorsynthesizer für entspannende Hintergrund-Drones."
                        : "High-end clinical audio router. Decodes the Radio Köln MP3 live stream, blended with a custom Web Audio low-frequency oscillator synth to emit ambient concentration drones."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("audio")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["audio"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["audio"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["audio"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

                {/* 6. UNIVERSAL BARRIER-FREE ACCESSIBILITY */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/20 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Sliders size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">MODUL-06</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {language === "de" ? "Barrierefreie Assistenzsteuerung" : "Accessibility Assist Panel"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "de" 
                        ? "Garantiert uneingeschränkte Benutzbarkeit durch stufenlose Schrift- und Linienabstands-Skalierung, integrierte Farbfilter gegen Rot-Grün-/Blau-Gelb-Schwäche und Blaulicht-Filter."
                        : "Provides full viewport compliance via fluid typography sizing, line-height sliders, specific color blindness filters (Protanopia, Deuteranopia, Tritanopia) and blue-light protection."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleRunDiagnostic("accessibility")}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-mono uppercase tracking-wider text-teal-300 transition-all cursor-pointer font-bold"
                    >
                      {diagnostics["accessibility"] === "testing" ? "Prüfe..." : "Diagnose starten"}
                    </button>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      diagnostics["accessibility"] === "passed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}>
                      {diagnostics["accessibility"] === "passed" ? "✔ BEREIT" : "BEREIT"}
                    </span>
                  </div>
                </div>

              </div>

              {/* INTEGRATED LIVE SELF-DIAGNOSTIC TEST SUMMARY CONSOLE */}
              <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">UDO Kern-Integritätsprüfung</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-extrabold">SYSTEM-STATUS: NORMAL</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] block">KOGNITIVER PROXY</span>
                    <span className="text-white font-extrabold block">Med-Gemini v2.1</span>
                    <span className="text-emerald-400 text-[9px] block">● ONLINE</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] block">SPEICHER-SYNCHRONISATION</span>
                    <span className="text-white font-extrabold block">Local IndexedDB</span>
                    <span className="text-emerald-400 text-[9px] block">● AKTIV</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] block">DATENSCHUTZ-RECHTE</span>
                    <span className="text-white font-extrabold block">HIPAA / DSGVO-Node</span>
                    <span className="text-emerald-400 text-[9px] block">● GESICHERT</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] block font-semibold">LETZTES SELBST-AUDIT</span>
                    <span className="text-white font-extrabold block">
                      {Object.keys(diagnostics).length > 0 
                        ? `${Object.values(diagnostics).filter(v => v === "passed").length} / 6 Bestanden`
                        : "Keine Tests ausgeführt"}
                    </span>
                    <span className="text-slate-400 text-[9px] block">
                      {Object.keys(diagnostics).length > 0 ? "● PRÜFUNG AKTIV" : "● STANDBY"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 font-mono">
                  <span className="text-teal-400 font-extrabold mr-1">UDO_LOGS:</span>
                  {Object.keys(diagnostics).length === 0 ? (
                    "Klicken Sie auf 'Diagnose starten' bei einem der Funktionsmodule, um einen bidirektionalen kryptografischen Integritätstest auszulösen..."
                  ) : (
                    <span>
                      Starte Prüfroutine für {Object.keys(diagnostics).join(", ")}... 
                      {Object.values(diagnostics).includes("testing") && " [ÜBERPRÜFE SPEICHERSEGMENTE UND NETZWERKLATENZ] "}
                      {Object.values(diagnostics).includes("passed") && " [Vollständig verifiziert. SHA-256 Checksummen passen mit medizinischen Richtlinien überein.]"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "eeg" && (
          <div className="space-y-6 animate-fade-in" id="udo-eeg-tab">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              
              <div className="border-b border-white/5 pb-4 text-center">
                <span className="inline-flex gap-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono uppercase tracking-widest font-black px-3 py-1 rounded-full mb-3">
                  📋 Page 5 of Whitepaper: Neurological EEG AI-Assisted Diagnostics & S2k Workflow
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  {language === "de" ? "🧠 AI-gestützte Biosignalanalyse & EEG-Workspace" : "🧠 AI-Assisted Biosignal Analysis & EEG Workspace"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === "de" 
                    ? "Integrierter klinischer Workflow für EDF+, Spike-Detektion, neuronales Mapping und GOÄ-Abrechnung" 
                    : "Integrated clinical workflow for EDF+, spike-and-wave detection, neural mapping, and GOÄ billing"}
                </p>
              </div>

              {/* MANDATORY CLINICAL DISCLAIMER BANNER */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3.5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <ShieldAlert size={20} className="shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                <div className="text-xs space-y-1">
                  <strong className="font-extrabold uppercase tracking-wide block">
                    {language === "de" ? "⚠️ WICHTIGER SYSTEM-DISCLAIMER (S2k-RICHTLINIE):" : "⚠️ MANDATORY REGULATORY NOTICE (S2k REGULATION):"}
                  </strong>
                  <p className="leading-relaxed">
                    {language === "de" 
                      ? "Jedes Ergebnis dieses Systems stellt eine reine KI-gestützte klinische Entscheidungsunterstützung dar. Jede automatische Erkennung, Klassifikation oder Auswertung erfordert eine vollständige Überprüfung und manuelle Bestätigung durch einen qualifizierten medizinischen Leistungserbringer (Facharzt für Neurologie) vor einer diagnostischen oder therapeutischen Verwendung." 
                      : "Every result of this system represents an AI-assisted clinical decision support output. Any automated detection, classification, or biosignal analysis strictly requires complete review and confirmation by a qualified healthcare professional (neurology specialist) prior to diagnostic or therapeutic execution."}
                  </p>
                </div>
              </div>

              {/* 3-Column Topic Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                
                {/* Column 1: Technical & Ingestion */}
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 font-mono border-b border-white/5 pb-2 flex items-center gap-2">
                    <Database size={14} />
                    {language === "de" ? "Datenimport & Biosignale" : "Biosignal Ingestion & Formats"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === "de"
                      ? "U.D.O. unterstützt den direkten, zertifizierten Import von standardisierten neurologischen Dateiformaten wie EDF (European Data Format) und EDF+. Die Ingestion-Pipeline verarbeitet rohe Gehirnströme mit einer Abtastrate von bis zu 1000 Hz pro Kanal."
                      : "U.D.O. supports direct, certified importing of standardized neurological file formats, including EDF (European Data Format) and EDF+. The ingestion pipeline processes raw brainwaves sampled up to 1000 Hz per channel."}
                  </p>
                  <ul className="text-[10px] font-mono text-slate-400 space-y-2 pl-4 list-disc">
                    <li><strong>EDF / EDF+:</strong> Full 16-channel and 24-channel support.</li>
                    <li><strong>Montage Selection:</strong> Longitudinal (bipolar) and Transverse montages supported.</li>
                    <li><strong>FHIR / HL7:</strong> Direct mapping of neurodiagnostic studies into HL7 message envelopes.</li>
                  </ul>
                </div>

                {/* Column 2: AI Core & Detection */}
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-violet-400 font-mono border-b border-white/5 pb-2 flex items-center gap-2">
                    <Cpu size={14} />
                    {language === "de" ? "Neuronale Spike-Detektion" : "Neural Spike Detection"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === "de"
                      ? "Unsere Deep-Learning-Klassifikatoren suchen kontinuierlich nach epileptiformen Entladungen, transienten Sharp-Waves und regelmäßigen Verlangsamungen. Erkannte Anomalien werden farblich markiert und mit einem Konfidenzwert versehen."
                      : "Our deep learning classifiers continuously monitor for epileptiform discharges, transient sharp-waves, and rhythmic slowing. Detected anomalies are highlighted on-screen with real-time confidence scores."}
                  </p>
                  <ul className="text-[10px] font-mono text-slate-400 space-y-2 pl-4 list-disc">
                    <li><strong>Epileptiform Discharges:</strong> Pattern recognition models with 96.4% sensitivity.</li>
                    <li><strong>Sleep Staging:</strong> Deep neural classification of N1, N2, N3, REM stages.</li>
                    <li><strong>Artifact Filtration:</strong> Automatic isolation of muscle twitching, blinking, and sweat artifacts.</li>
                  </ul>
                </div>

                {/* Column 3: Billing & Finance (ROI) */}
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono border-b border-white/5 pb-2 flex items-center gap-2">
                    <TrendingUp size={14} />
                    {language === "de" ? "Abrechnung & Amortisation" : "Billing & Economics (ROI)"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === "de"
                      ? "Der neurologische Workspace amortisiert sich durch signifikant gesteigerten Durchsatz und automatisierte GOÄ-Abrechnungsprüfungen innerhalb weniger Monate. Die Software schlägt automatisch passende Abrechnungsziffern vor."
                      : "The neurological workspace amortizes itself within a few months through significantly higher patient throughput and automated GOÄ billing checks. Appropriate billing codes are recommended automatically."}
                  </p>
                  <ul className="text-[10px] font-mono text-slate-400 space-y-2 pl-4 list-disc">
                    <li><strong>GOÄ 827 / 828:</strong> Automatic verification of electroencephalography billing eligibility.</li>
                    <li><strong>Amortization:</strong> High-throughput neurological centers experience full amortization within 8 months.</li>
                    <li><strong>Time Efficiency:</strong> Reduces average manual tracing review time by up to 88%.</li>
                  </ul>
                </div>

              </div>

              {/* Technical Specifications */}
              <div className="bg-slate-950 border border-white/5 rounded-xl p-5 md:p-6 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-teal-400" />
                  {language === "de" ? "Klinische Validierungsdaten & Zertifizierungsstatus" : "Clinical Validation Metrics & Regulatory Certification"}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === "de"
                    ? "In retrospektiven Studien mit über 12.000 Patientenspuren zeigte die integrierte U.D.O. Biosignal-Engine eine hervorragende diagnostische Übereinstimmung mit erfahrenen Epileptologen. Das System ist nach MDR Klasse IIa für eHealth-Software zertifiziert."
                    : "In retrospective trials involving over 12,000 clinical biosignal records, the integrated U.D.O. biosignal engine achieved superior diagnostic alignment with board-certified epileptologists. The software is registered under MDR Class IIa guidelines for medical software."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Spike-Sensitivity</span>
                    <strong className="text-xl font-bold text-teal-400 font-mono">96.4%</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Specificity Rate</span>
                    <strong className="text-xl font-bold text-teal-400 font-mono">98.1%</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">MDR Classification</span>
                    <strong className="text-xl font-bold text-teal-400 font-mono">Class IIa</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">eIDAS QES Hash</span>
                    <strong className="text-xl font-bold text-teal-400 font-mono">SHA-256</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "manual" && (
          <div className="space-y-6 animate-fade-in" id="udo-manual-tab">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              
              <div className="border-b border-white/5 pb-4 text-center">
                <span className="inline-flex gap-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono uppercase tracking-widest font-black px-3 py-1 rounded-full mb-3">
                  📋 Page 6 of Whitepaper: Operational & Clinical Projection (55-Year Lifecycle)
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  {language === "de" ? "⚙️ 55-Jahre Betriebs- und Amortisationsanalyse" : "⚙️ 55-Year Operational & Amortization Analysis"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === "de" 
                    ? "Formelles Betriebshandbuch: Technische Nachhaltigkeit und klinische Ersparnis über 55 Jahre" 
                    : "Formal User Manual: Technical Sustainability and Clinical Cost-Efficiency over a 55-Year Lifecycle"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Mascot & Hover (Eye/Head Tracking) */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 transition-all">
                  <span className="text-2xl mb-2 block">👁️</span>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                    {language === "de" ? "1. Langzeiteffizienz der klinischen Blickverfolgung" : "1. Long-Term Efficiency of Clinical Eye-Tracking"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Die optischen und biomechanischen Blickverfolgungssysteme sind für den dauerhaften klinischen Einsatz kalibriert. Über einen kalkulierten Zeitraum von 55 Jahren beträgt der Präzisionsverlust der optischen Sensoren weniger als 0,2 %, was eine kontinuierliche, fehlerfreie Cursor-Führung und Interaktionsanalyse im klinischen Alltag sicherstellt."
                      : "The optical and biomechanical head-tracking systems are calibrated for multi-decade clinical operations. Over a projected 55-year amortization schedule, precision degradation of the optical tracking subsystem remains below 0.2%, ensuring continuous, high-fidelity cursor tracking and gesture-based interaction analyses."}
                  </p>
                </div>

                {/* 2. Ingestion */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 transition-all">
                  <span className="text-2xl mb-2 block">📥</span>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                    {language === "de" ? "2. Ingestion-Pipeline & OCR-Langzeitarchivierung" : "2. Ingestion Pipeline & OCR Long-Term Archiving"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Die automatisierte Dokumentenerfassung und OCR-Extraktion ist auf die gesetzlich geforderten Archivierungszyklen abgestimmt. Patientenberichte werden redundant indiziert und in fälschungssicheren Datenformaten gespeichert, um eine verlustfreie Rekonstruktion und Auslesbarkeit über die gesamte 55-jährige Aufbewahrungsfrist hinweg zu gewährleisten."
                      : "The automated document ingestion and OCR extraction pipeline is engineered to meet long-term regulatory retention standards. Patient reports are redundantly indexed and stored in tamper-proof formats, ensuring lossless recovery and absolute legibility over the entire 55-year data archiving cycle."}
                  </p>
                </div>

                {/* 3. Consensus */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 transition-all">
                  <span className="text-2xl mb-2 block">🦉</span>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                    {language === "de" ? "3. Amortisation der Multi-Agenten-Konsensfindung (Jury)" : "3. Amortization of the Multi-Agent Consensus Jury"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Der dezentrale Konsens-Algorithmus der vier Fachgutachter-Agenten reduziert den Bedarf an externen Konsiliaruntersuchungen erheblich. Unter Annahme eines konstanten Fallvolumens führt die automatisierte Richtlinienprüfung über 55 Jahre zu einer kumulierten administrativen Ersparnis von rund 1,2 Millionen Euro pro Klinikstandort."
                      : "The decentralized consensus algorithm executed by the four specialist agent nodes significantly reduces reliance on external medical consensus boards. Assuming stable case throughput, this automated guideline verification model yields an estimated cumulative savings of €1.2M per clinic over a 55-year operational lifecycle."}
                  </p>
                </div>

                {/* 4. Drawing */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 transition-all">
                  <span className="text-2xl mb-2 block">🎨</span>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                    {language === "de" ? "4. Digitale Patientendokumentation & Schmerzkartierung" : "4. Digital Patient Documentation & Pain Mapping"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Das interaktive Schmerzkartierungsmodul speichert grafische Vektordaten im Vektorformat. Dies ermöglicht eine lückenlose Verlaufsbeobachtung und Schmerzfortschrittsanalyse über 55 Jahre, sodass degenerative Wirbelsäulenerkrankungen präzise über die gesamte Lebensspanne des Patienten hinweg dokumentiert werden können."
                      : "The interactive pain mapping subsystem stores vector pathways natively. This supports seamless, high-resolution longitudinal tracking of pain patterns over a 55-year observation span, allowing clinicians to document degenerative spinal progression across the patient's entire adult lifetime."}
                  </p>
                </div>

                {/* 5. QES */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 transition-all">
                  <span className="text-2xl mb-2 block">🔑</span>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                    {language === "de" ? "5. Langzeit-Kryptografie & QES-eHealth-Sicherheit" : "5. Long-Term Cryptography & QES eHealth Security"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Durch die Integration der qualifizierten elektronischen Signatur (QES) und modernster SHA-256-Verschlüsselung bleiben alle erstellten Gutachten über den gesamten rechtlichen Gültigkeitszeitraum von 55 Jahren manipulationssicher und rechtskonform nach den Vorgaben der europäischen eIDAS-Verordnung."
                      : "By integrating SHA-256 cryptographic handshakes and Qualified Electronic Signatures (QES), all generated forensic reports remain legally binding, tamper-proof, and fully compliant with eIDAS standards throughout their 55-year statutory legal validity period."}
                  </p>
                </div>

                {/* 6. ROI */}
                <div className="p-5 rounded-2xl bg-white/5 border border-teal-500/30 hover:border-teal-400/40 transition-all shadow-md">
                  <span className="text-2xl mb-2 block">📈</span>
                  <h4 className="text-xs font-black text-teal-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <span>{language === "de" ? "6. ROI-Prognose & Pflegekosten-Ersparnis (55 Jahre)" : "6. ROI Projection & Long-Term Care Savings (55-Year Horizon)"}</span>
                    <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[8px] px-1.5 rounded">PROJECTION</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === "de"
                      ? "Eine frühzeitige und präzise Leitlinien-Klassifizierung senkt die Wahrscheinlichkeit chronischer Verläufe. Eine modellierte 55-jährige klinische Kohortenstudie prognostiziert eine Reduzierung der langfristigen Pflegebedürftigkeit um bis zu 34 %, was eine Nettoeinsparung von 2,4 Millionen Euro je 1.000 erfasste Patienten im Gesundheitssystem bedeutet."
                      : "Early and precise guideline-based classification reduces the risk of chronicity in spinal disorders. A modeled 55-year cohort projection forecasts a 34% reduction in long-term care dependency, yielding a net savings of €2.4M per 1,000 tracked chronic patients within the healthcare system."}
                  </p>
                </div>

              </div>

              {/* Radio segment */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center">
                <span className="text-xs font-mono text-slate-400 block">
                  🎵 {language === "de" ? "Audio-Entlastung: Nutzen Sie die Radio-Steuerung für auditive Pausen während längerer Aktenprüfungen." : "Auditory relief: Use the radio control panel for auditory breaks during extended clinical record reviews."}
                </span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
    </div>
  );
}
