import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Download,
  Cpu,
  Shield,
  Workflow,
  CheckCircle,
  FileText,
  Sparkles,
  Award,
  Lock,
  Globe,
} from 'lucide-react';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhitepaperModal({ isOpen, onClose }: WhitepaperModalProps) {
  const [activeSection, setActiveSection] = useState<'abstract' | 'architecture' | 'agents' | 'consensus' | 'security' | 'roadmap'>('abstract');

  if (!isOpen) return null;

  const handleDownload = () => {
    const textContent = `
================================================================================
UDO S2k FORENSIC HUB — TECHNICAL & CLINICAL WHITEPAPER
Version 2.0 • Neural Diagnostic Core & S2k Guideline Consensus Engine
================================================================================

1. ABSTRACT & EXECUTIVE OVERVIEW
--------------------------------------------------------------------------------
The UDO (Ultimate Diagnostic Operator) S2k Forensic Hub represents the next-generation
clinical AI infrastructure designed for medical-legal and forensic neurological evaluations.
By integrating multi-agent consensus algorithms, automated S2k guideline checking (BK 2108/2109),
and Qualified Electronic Signatures (QES eIDAS), UDO reduces administrative evaluation times
by up to 82% while maintaining a 100% audit safety rate.

2. CORE TECHNOLOGY ARCHITECTURE
--------------------------------------------------------------------------------
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- 3D Rendering: Three.js + React Three Fiber + Drei (CUPRA Triangular DNA Geometry)
- Server Logic: Node.js Express full-stack proxy architecture
- AI Foundation: @google/genai SDK leveraging Med-Gemini (Clara) & multi-agent APIs
- Persistence: Local encrypted vault and optional cloud synchronization

3. AI AGENT MATRIX
--------------------------------------------------------------------------------
- Dr. Clara (Med-Gemini Integration): Radiological & MRI anatomical segment parser
- Dr. Eric (Claude 3.5 Sonnet): Legal & MdE (Minderung der Erwerbsfähigkeit) expert
- Dr. Marcus (GPT-4o): Biomechanical vector & force dynamics analyst
- Dr. Gratsiano (UDO-R1 (Dr. Gratsiano)): Extended Chain-of-Thought (CoT) consensus synthesis

4. CONSENSUS ENGINE & S2k GUIDELINES
--------------------------------------------------------------------------------
Evaluates lumbar spine trauma (L4/L5 & L5/S1 segments) against German AWMF S2k guidelines:
1. Radiological correlation with dermatomal radiculopathy
2. Biomechanical overload plausibility (lifting forces > 40kg)
3. Chronological manifestation within 48-72 hours of incident
4. MdE (Minderung der Erwerbsfähigkeit) percentage calculation (10% - 30%)

5. SECURITY, REGULATORY & QES
--------------------------------------------------------------------------------
- Qualified Electronic Signature (QES): eIDAS compliant SHA-256 digital envelope
- GDPR / DSGVO: Pseudonymized patient data isolation in regional EU containers
- ISO 14971 & EU AI Act Class II High-Risk compliance architecture

6. ROADMAP 2026+
--------------------------------------------------------------------------------
- Q1 2026: Real-time Multi-Agent Jury Consensus v2.0 Rollout
- Q2 2026: Full CGM ALBIS GDT 2.1 File Exchange Integration
- Q3 2026: Automated EEG Signal Biosignal Artifact Filtering
- Q4 2026: Pan-European eHealth Cross-Border QES Verification

© 2026 UDO Medical Systems · AES-256 · ISO 13485
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'UDO_S2k_Forensic_Hub_Whitepaper.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SECTIONS = [
    { id: 'abstract', label: '1. Abstract & Overview', icon: BookOpen },
    { id: 'architecture', label: '2. Core Architecture', icon: Cpu },
    { id: 'agents', label: '3. AI Agent Matrix', icon: Sparkles },
    { id: 'consensus', label: '4. S2k Guidelines', icon: Workflow },
    { id: 'security', label: '5. Security & QES', icon: Shield },
    { id: 'roadmap', label: '6. Roadmap 2026+', icon: Award },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#020813] pointer-events-auto"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0a0f1d] border border-[#B87333]/40 rounded-2xl shadow-[0_0_50px_rgba(184,115,51,0.2)] overflow-hidden text-slate-200 font-sans"
        >
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#B87333]/20 border border-[#B87333]/40 text-[#E8A87C] hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  UDO S2k Forensic Hub Whitepaper
                </h2>
                <p className="text-[10px] font-mono text-[#E8A87C] uppercase tracking-wider">
                  Technical & Clinical Architecture Specification · v2.0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B87333]/20 hover:bg-[#B87333]/40 border border-[#B87333]/50 hover:scale-105 active:scale-95 text-[#E8A87C] hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                EXPORT TXT
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN MODAL BODY */}
          <div className="flex-1 flex overflow-hidden">
            {/* SIDEBAR NAVIGATION */}
            <div className="w-60 border-r border-white/10 bg-slate-950/40 p-4 space-y-1 shrink-0 hidden sm:block">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-widest px-2 block mb-2">
                INDEX & NAVIGATION
              </span>
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-mono text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#B87333]/20 border border-[#B87333]/60 text-[#E8A87C] font-bold shadow-[0_0_15px_rgba(184,115,51,0.2)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00D4AA]' : 'text-slate-500'}`} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CONTENT VIEWPORT */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
              {activeSection === 'abstract' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <BookOpen className="w-5 h-5 text-[#00D4AA]" />
                    1. Abstract & Executive Overview
                  </h3>
                  <p className="text-slate-300">
                    The UDO (Ultimate Diagnostic Operator) S2k Forensic Hub represents the next-generation clinical AI infrastructure designed for medical-legal and forensic neurological evaluations.
                  </p>
                  <p className="text-slate-400">
                    By integrating multi-agent consensus algorithms, automated S2k guideline checking (BK 2108/2109), and Qualified Electronic Signatures (QES eIDAS), UDO reduces administrative evaluation times by up to 82% while maintaining a 100% audit safety rate.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                      <span className="text-xs font-mono text-[#E8A87C] font-bold">82% TIME SAVINGS</span>
                      <p className="text-[11px] text-slate-400">Automated extraction and pre-formatted S2k report drafting.</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                      <span className="text-xs font-mono text-[#00D4AA] font-bold">100% QES AUDIT SAFE</span>
                      <p className="text-[11px] text-slate-400">SHA-256 eIDAS envelope locking and immutable audit logging.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'architecture' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Cpu className="w-5 h-5 text-[#00D4AA]" />
                    2. Core Technology Architecture
                  </h3>
                  <p className="text-slate-300">
                    Built upon a desktop-grade, responsive full-stack architecture powered by React 18, TypeScript, and Express.
                  </p>
                  <ul className="space-y-2 text-slate-300 list-disc list-inside">
                    <li><strong className="text-white">Frontend Engine:</strong> React 18, Vite, Tailwind CSS v3, Framer Motion.</li>
                    <li><strong className="text-white">3D Visual Stage:</strong> React Three Fiber + Drei rendering CUPRA triangular geometry DNA.</li>
                    <li><strong className="text-white">Server Proxy API:</strong> Secure Express server handling Gemini 3.5 Flash and multi-agent synthesis.</li>
                    <li><strong className="text-white">GDT 2.1 File Exchange:</strong> Native CGM ALBIS GDT file bridge integration for practice management software.</li>
                  </ul>
                </div>
              )}

              {activeSection === 'agents' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Sparkles className="w-5 h-5 text-[#00D4AA]" />
                    3. AI Agent Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <h4 className="text-xs font-bold text-[#E8A87C]">Dr. Clara (Med-Gemini Integration)</h4>
                      <p className="text-xs text-slate-400 mt-1">Radiological scan segment parser for L4/L5 & L5/S1 root compression.</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <h4 className="text-xs font-bold text-[#00D4AA]">Dr. Eric (Claude 3.5 Legal)</h4>
                      <p className="text-xs text-slate-400 mt-1">MdE (Minderung der Erwerbsfähigkeit) alignment & BG guideline expert.</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <h4 className="text-xs font-bold text-[#E8A87C]">Dr. Marcus (GPT-4o Vector)</h4>
                      <p className="text-xs text-slate-400 mt-1">Biomechanical vector and lifting force dynamics calculation.</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <h4 className="text-xs font-bold text-[#00D4AA]">Dr. Gratsiano (UDO-R1 (Dr. Gratsiano))</h4>
                      <p className="text-xs text-slate-400 mt-1">Deep reasoning extended Chain-of-Thought consensus synthesis engine.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'consensus' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Workflow className="w-5 h-5 text-[#00D4AA]" />
                    4. S2k Guidelines & Consensus Engine
                  </h3>
                  <p className="text-slate-300">
                    Implements strict German AWMF S2k guideline checks for occupational spinal injuries (BK 2108/2109):
                  </p>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Radiological anatomical correlation with dermatomal radiculopathy.</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Biomechanical trauma plausibility verification.</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Chronological symptom manifestation matching.</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Shield className="w-5 h-5 text-[#00D4AA]" />
                    5. Security, Regulatory & QES
                  </h3>
                  <p className="text-slate-300">
                    Data privacy and forensic authenticity are non-negotiable pillars:
                  </p>
                  <ul className="space-y-2 text-slate-300 list-disc list-inside text-xs">
                    <li><strong className="text-white">QES eIDAS Integration:</strong> SHA-256 digital signature wrapping.</li>
                    <li><strong className="text-white">GDPR Isolation:</strong> Zero long-term patient data exposure to external training sets.</li>
                    <li><strong className="text-white">ISO 14971 Risk Controls:</strong> Algorithmic fail-safes and human-in-the-loop review.</li>
                  </ul>
                </div>
              )}

              {activeSection === 'roadmap' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Award className="w-5 h-5 text-[#00D4AA]" />
                    6. Roadmap 2026+
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="border-l-2 border-[#B87333] pl-3">
                      <span className="text-[#E8A87C] font-bold">Q1 2026:</span> Real-time Multi-Agent Jury v2.0
                    </div>
                    <div className="border-l-2 border-[#00D4AA] pl-3">
                      <span className="text-[#00D4AA] font-bold">Q2 2026:</span> Full CGM ALBIS GDT 2.1 File Exchange
                    </div>
                    <div className="border-l-2 border-[#B87333] pl-3">
                      <span className="text-[#E8A87C] font-bold">Q3 2026:</span> Automated EEG Biosignal Artifact Filter
                    </div>
                    <div className="border-l-2 border-[#00D4AA] pl-3">
                      <span className="text-[#00D4AA] font-bold">Q4 2026:</span> EU-Wide eHealth Cross-Border Verification
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-3 border-t border-white/10 bg-slate-950/90 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>© 2026 UDO Medical Systems</span>
            <span>AES-256 · ISO 13485 CERTIFIED</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WhitepaperModal;
