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
  CornerDownRight
} from "lucide-react";

export default function SystemWhitepaper() {
  const [activeTab, setActiveTab] = useState<"architecture" | "guidelines" | "regulatory" | "review">("architecture");

  const techStack = [
    { name: "Frontend Architecture", detail: "React 18 + Vite + Tailwind CSS + Framer Motion (Translucent Glassmorphism Design System)" },
    { name: "Clinical AI Orchestrator", detail: "@google/genai SDK leveraging Med-Gemini (Clara) proxy server integration" },
    { name: "Forensic Multi-Agent Jury", detail: "Synchronized consensus models including GPT-4o, Claude-3.5-Sonnet, DeepSeek-R1" },
    { name: "Regulatory Security Engine", detail: "Qualified Electronic Signature (QES) SHA-256 eHealth integration with localized GDPR nodes" }
  ];

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-12 animate-fade-in" id="udo-system-whitepaper-portal">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-teal-950/20 via-slate-900/60 to-black/60 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono uppercase tracking-widest font-black">
              <BookOpen size={12} className="animate-pulse" />
              Technical & Clinical Whitepaper
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none mt-1">
              U.D.O. Platform Whitepaper
            </h1>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
              Ultimate Diagnostic Operator v2.0 • S2k Guideline & Consensus Engine
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <Award className="text-teal-400 shrink-0" size={28} />
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-bold">Certification Status</span>
              <span className="text-xs text-white font-black uppercase tracking-wide block">DSGVO / GDPR Compliant</span>
              <span className="text-[9px] font-mono text-teal-400 block uppercase mt-0.5 font-semibold">QES German eHealth Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENTED NAVIGATION BAR */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: "architecture", label: "Agent Architecture", icon: Cpu, desc: "Multi-Agent Consensus System" },
          { id: "guidelines", label: "S2k Clinical Guidelines", icon: Workflow, desc: "Causality & Radiculopathy Checking" },
          { id: "regulatory", label: "Regulatory & Security", icon: Shield, desc: "QES, DSGVO & HIPAA Compliance" },
          { id: "review", label: "Execution & Code Review", icon: FileText, desc: "Full Developer Summary" }
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
          </div>
        )}

        {/* TAB 4: COMPLETE PROJECT REVIEW */}
        {activeTab === "review" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <FileText className="text-teal-400" size={18} />
                Full Project Capabilities & Visual Design Review
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The U.D.O. Platform represents an innovative design paradigm for highly specialized specialist medical applications. Below is a comprehensive architectural and design audit of the current software build:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                      <CornerDownRight size={12} />
                      UX/UI Visual Identity (The "Nova Space" Theme)
                    </span>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Custom translucent glassmorphic components styled with premium, low-contrast dark palettes. Features an active, rotating 3D Particle Starfield & Card Galaxy powered by Three.js/React-Three-Fiber. Generous negative space promotes clinical calm, avoiding the chaotic visual clutter typical of legacy eHealth portals.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                      <CornerDownRight size={12} />
                      Real-Time Ingestion & Extraction Pipeline
                    </span>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      A fully realized clinical variable extraction interface supporting drag-and-drop report ingestion, immediate demographical mapping, clinical anamnesis indexing, and timeline alignment with complete local state isolation.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                      <CornerDownRight size={12} />
                      Responsive Multi-Modal Dialogue Hub
                    </span>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Equipped with high-performance speech synthesis options, dynamic speech-rate controls, real-time waveform visualizers, and automatic wake-word triggers. Offers instant German/English clinical translation across all modules.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-300 block flex items-center gap-1.5">
                      <CornerDownRight size={12} />
                      Clinical Upgrades & KPI Analytics Core
                    </span>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Interactive D3/Recharts data dashboards demonstrating clinical processing speed improvements (96% optimization vs manual preparation), expert jury voting distribution charts, financial ROI projections, and modular feature acquisitions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
