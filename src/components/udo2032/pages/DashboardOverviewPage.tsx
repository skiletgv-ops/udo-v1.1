import React, { useState } from 'react';
import {
  Activity,
  Brain,
  DollarSign,
  Briefcase,
  User,
  Code2,
  Plane,
  ShieldCheck,
  Zap,
  Cpu,
  Globe,
  Radio,
  FileText,
  Lock,
  Layers,
  Sparkles,
  Server,
  Database,
  Download,
  Monitor
} from 'lucide-react';
import { UdoDesktopInstallerModal } from '../UdoDesktopInstallerModal';

export interface DashboardOverviewPageProps {
  onNavigate: (path: string) => void;
}

export function DashboardOverviewPage({ onNavigate }: DashboardOverviewPageProps) {
  const [showInstallerModal, setShowInstallerModal] = useState(false);

  const phases = [
    {
      title: 'PHASE 1: CORE INFRASTRUCTURE & BIO-HEALTH',
      route: '/dashboard/bio',
      color: 'from-cyan-500 to-blue-500',
      icon: Brain,
      features: [
        { id: '#1', name: 'Meta-Cognitive Router', desc: 'Waterfall multi-LLM orchestration (Gemini, Claude, DeepSeek, OpenAI) with confidence scoring' },
        { id: '#2', name: 'Bio-Health Dashboard', desc: 'PDF upload & autonomous 8-section medical-legal Gutachten report generator' },
        { id: '#3', name: 'Digital Twin Simulator', desc: 'Predictive patient drug response & metabolic pathway simulation' },
        { id: '#4', name: 'Multi-Omics Predictor', desc: 'Genomic & microbiome disease risk prediction engine' },
        { id: '#27', name: 'Ambient Voice Dictation', desc: 'Real-time German clinical speech recognition (de-DE) & micro-symptom extraction' },
        { id: '#28', name: 'Emergency Triage Radar', desc: 'Priority patient radar monitoring with real-time red alert prioritization' },
      ],
    },
    {
      title: 'PHASE 2: FINANCE & LEGAL ENGINE',
      route: '/dashboard/finance',
      color: 'from-emerald-500 to-teal-500',
      icon: DollarSign,
      features: [
        { id: '#5', name: 'Practice CFO & Asset Optimizer', desc: 'Automated revenue recovery & asset allocation simulation' },
        { id: '#6', name: 'Deepfake Shield', desc: 'AI audio/video manipulation detection via Gemini Vision spectral analysis' },
        { id: '#7', name: 'SmartLaw Contract Generator', desc: 'Natural language input to structured legal contract synthesis' },
        { id: '#11', name: 'Zero-Knowledge Verification', desc: 'Pseudonymized identity & age verification without raw data exposure' },
        { id: '#12', name: 'GOÄ/EBM Leakage Recovery', desc: 'Identifies unbilled medical services and uncaptured billing codes' },
      ],
    },
    {
      title: 'PHASE 3: ENTERPRISE OPS & COMMUNICATION',
      route: '/dashboard/enterprise',
      color: 'from-indigo-500 to-purple-500',
      icon: Briefcase,
      features: [
        { id: '#8', name: 'Supply Chain Autopilot', desc: 'Interactive SVG world map with live shipping lanes & traffic bottleneck resolution' },
        { id: '#9', name: 'Compliance Bot', desc: 'Automated policy scanner highlighting outdated clauses with side-by-side diffs' },
        { id: '#10', name: 'Universal Translator Bridge', desc: 'Real-time chat translation across 6 languages with emotional intent radar' },
        { id: '#23', name: 'Cross-Org Workflow Orchestrator', desc: 'Autonomous cross-department task execution & state sync' },
        { id: '#24', name: 'Knowledge Graph & Vector Search', desc: 'Semantic document retrieval & enterprise knowledge mapping' },
      ],
    },
    {
      title: 'PHASE 4: PERSONAL CONCIERGE & SECURITY',
      route: '/dashboard/personal',
      color: 'from-amber-500 to-orange-500',
      icon: User,
      features: [
        { id: '#13', name: 'Neurolinguistic Calendar', desc: 'Visual weekly planner with cognitive load score auto-scheduling' },
        { id: '#14', name: 'Smart Home Energy Simulator', desc: 'Solar input, battery %, and automated energy trading simulator' },
        { id: '#15', name: 'W3C Decentralized ID (DID)', desc: 'Self-sovereign identity profile & verifiable credential issuer' },
        { id: '#25', name: 'Dark Web Threat Scanner', desc: 'Real-time breach monitoring log & email compromise telemetry' },
        { id: '#26', name: 'Life-OS Executive Assistant', desc: 'Personal concierge for daily priorities & decision support' },
      ],
    },
    {
      title: 'PHASE 5: DEVELOPER & CREATIVE',
      route: '/dashboard/dev',
      color: 'from-pink-500 to-rose-500',
      icon: Code2,
      features: [
        { id: '#16', name: 'Quantum-Resistant Vault', desc: 'Post-quantum key store with AES-GCM / simulated Kyber encryption' },
        { id: '#17', name: 'Self-Healing Codebase', desc: 'Automated vulnerability scanner & security patch generator' },
        { id: '#18', name: 'Holographic Co-Creation 3D', desc: 'Prompt to 3D scene generator with interactive Three.js canvas' },
        { id: '#19', name: 'Digital Immortality "Soul-Bot"', desc: 'Persona trait recording form & interactive personal avatar' },
        { id: '#20', name: 'AI Agent Swarm Orchestrator', desc: 'Parallel multi-agent task execution manager' },
      ],
    },
    {
      title: 'PHASE 6: MOBILITY, INFRASTRUCTURE & DISASTER',
      route: '/dashboard/mobility',
      color: 'from-blue-500 to-cyan-500',
      icon: Plane,
      features: [
        { id: '#21', name: 'Urban Air Mobility Planner', desc: 'Interactive drone flight routes, vertiport nodes & weather telemetry' },
        { id: '#22', name: 'Energy-Aware Compute', desc: 'Real-time grid carbon intensity tracking & green compute scheduler' },
        { id: '#29', name: 'Emergency Conductor Crisis Mode', desc: 'Offline mesh network simulation, satellite links & emergency triage' },
        { id: '#30', name: 'Disaster Risk Matrix', desc: 'Micro-grid isolation & emergency resource allocation' },
      ],
    },
  ];

  return (
    <div className="space-y-8 font-sans select-none text-slate-100">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/80 border border-cyan-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full w-fit">
              <Sparkles size={14} className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>UDO 2032 ARCHITECTURE COMPLETE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              UDO 2032 Central Command
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              All <strong>30 core services</strong> across 6 logical deployment phases are active, synchronized, and running in local-first DSGVO-compliant container runtime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setShowInstallerModal(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all cursor-pointer uppercase tracking-wider"
            >
              <Monitor size={18} />
              <span>DOWNLOAD DESKTOP SETUP (.EXE)</span>
            </button>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">SYSTEM HEALTH</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                100% ONLINE
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">ROUTER CONFIDENCE</span>
              <span className="text-cyan-400 font-bold text-sm mt-0.5 block">98.4% VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Logical Phases Feature Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Complete 30-Service Functional Blueprint</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase) => {
            const Icon = phase.icon;

            return (
              <div
                key={phase.title}
                className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${phase.color} text-slate-950`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                        {phase.title}
                      </h3>
                    </div>
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-2.5 mb-6">
                    {phase.features.map((feat) => (
                      <li key={feat.id} className="text-xs font-sans text-slate-300 flex items-start gap-2">
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">
                          {feat.id}
                        </span>
                        <div>
                          <strong className="text-white block font-semibold">{feat.name}</strong>
                          <span className="text-slate-400 text-[11px] leading-tight block">{feat.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => onNavigate(phase.route)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-cyan-950/50 transition-all cursor-pointer"
                >
                  <span>LAUNCH MODULE</span>
                  <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <UdoDesktopInstallerModal
        isOpen={showInstallerModal}
        onClose={() => setShowInstallerModal(false)}
      />
    </div>
  );
}
