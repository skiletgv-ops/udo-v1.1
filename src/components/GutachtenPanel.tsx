import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Printer, 
  Save, 
  Sparkles, 
  Check, 
  Database, 
  ShieldCheck, 
  HelpCircle, 
  Settings, 
  Cpu, 
  Edit3, 
  BookOpen, 
  CheckCircle, 
  Users, 
  Share2, 
  Layers, 
  X, 
  Minus,
  FileCheck,
  AlertTriangle,
  Code,
  Download,
  Loader2
} from "lucide-react";
import { Patient } from "../types";
import { useGlobalSystem } from "./GlobalSystemContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

interface GutachtenPanelProps {
  onRobotStateChange?: (state: any) => void;
  onMinimize?: () => void;
}

export default function GutachtenPanel({ onRobotStateChange, onMinimize }: GutachtenPanelProps) {
  const { language, activePatient, setActivePatient } = useGlobalSystem();
  
  // Default fallback data if no patient is active
  const fallbackDemographics = {
    firstName: "Thomas",
    lastName: "Müller",
    birthDate: "14.11.1982",
    insuranceNumber: "X120938475",
    caseId: "BG-2026-9901-A",
    insuranceProvider: "Techniker Krankenkasse (TK)",
    commissioningEntity: "BGHM (Berufsgenossenschaft Holz und Metall)",
  };

  const [activeTab, setActiveTab] = useState<"editor" | "apisetup" | "preview" | "v4upgrade">("editor");

  // v4.0 Predictive Analytics, Blockchain Ledger & Multi-User Collaboration States
  const [physioEngagement, setPhysioEngagement] = useState<number>(2); // 1 to 5 scale
  const [biomechanicalLoad, setBiomechanicalLoad] = useState<number>(4); // 1 to 5 scale
  const [blockchainStatus, setBlockchainStatus] = useState<"unanchored" | "anchoring" | "secured">("unanchored");
  const [blockchainHash, setBlockchainHash] = useState<string>("7e40c442a8fc1c549afbf4c8996fb92427ae41e4649b934ca495991b7852c92a");
  const [blockchainProgress, setBlockchainProgress] = useState<number>(0);
  const [blockchainLedger, setBlockchainLedger] = useState<Array<{ block: number; hash: string; timestamp: string; action: string; status: string }>>([
    { block: 108241, hash: "3fa85f64...2f8a", timestamp: "2026-07-20 09:12:04", action: "SYSTEM_INITIALIZED", status: "VERIFIED" },
    { block: 108245, hash: "90a1f28b...a912", timestamp: "2026-07-20 11:34:52", action: "DOSSIER_INGESTED", status: "VERIFIED" }
  ]);
  const [multiplayerDocs, setMultiplayerDocs] = useState([
    { name: "Dr. Clara (Med-Gemini)", section: "Section II. MRI L4/L5 radiological correlation", status: "Active Typing...", color: "border-teal-400 bg-teal-500/10 text-teal-300" },
    { name: "Dr. Eric (Claude S2k)", section: "Section III. Biomechanical temporal criteria check", status: "idle", color: "border-cyan-400 bg-cyan-500/10 text-cyan-300" },
    { name: "Dr. Marcus (GPT-4o)", section: "Section IV. MdE 20% consensus recommendation", status: "Active Reviewing", color: "border-purple-400 bg-purple-500/10 text-purple-300" }
  ]);
  const [collabMessages, setCollabMessages] = useState<string[]>([
    "[Multi-User] Dr. Clara: Completed initial MRI segment cross-referencing.",
    "[Multi-User] Dr. Eric: S2k guidelines matches lifting kinematics criteria.",
    "[Multi-User] Dr. Marcus: Force vector load >4800 N confirmed."
  ]);
  const [newMessageText, setNewMessageText] = useState("");

  // Local state for the Gutachten sections
  const [demographics, setDemographics] = useState(fallbackDemographics);
  const [clinicalAnamnesis, setClinicalAnamnesis] = useState(
    "The 43-year-old patient Thomas Müller presented with persistent left lumboischialgia following an occupational accident on 12.03.2025. While lifting a heavy metal crate (approx. 45 kg), he experienced a sudden, sharp pain in the lumbar region radiating into his left leg (L5 dermatome)."
  );
  const [physicalFindings, setPhysicalFindings] = useState(
    "- Restricted spinal range of motion (Schober's sign 10/12 cm)\n- Positive left Lasègue's sign at 45 degrees\n- Hypesthesia in the left L5 dermatome\n- Achilles and patellar reflexes active & symmetrical"
  );

  // Individual Doctor contributions
  const [drClaraMedGemini, setDrClaraMedGemini] = useState(
    "Clinical-Radiological Correlation: The MRI findings from 28.03.2025 demonstrate a distinct mediolateral disc herniation at the L4/L5 level, which directly compresses the exiting left L5 nerve root. This corresponds precisely to the clinical L5 dermatomal deficit and the positive Lasègue's sign. No signs of multi-segmental degeneration are present."
  );
  const [drEricClaude, setDrEricClaude] = useState(
    "S2k Guideline & MdE Assessment: According to the AWMF S2k guidelines for occupational lumbar disc disease, a post-traumatic herniation requires an adequate kinetic trauma (e.g., sudden axial load under heavy load). The lifting incident met these biomechanical criteria. Based on persistent radicular pain and sensory deficits, the recommended reduction in earning capacity (MdE) is 20%."
  );
  const [drMarcusGPT, setDrMarcusGPT] = useState(
    "Biomechanical Traumatic Vector analysis: The vector analysis of lifting a 45 kg load from a bent-over posture shows a lumbar shearing load of >4800 N, which exceeds the physiological threshold. There is an undisputed direct temporal and biomechanical correlation between the lifting incident and the acute disc herniation."
  );
  const [drGratsianoDeepSeek, setDrGratsianoDeepSeek] = useState(
    "Chain-of-Thought Synthesis: Cross-evaluating EMG conduction velocities of the left tibialis anterior (drop to 42 m/s) with the L4/L5 MRI confirmation. DeepSeek-R1 identifies that the lateral compression profile of the L5 nerve is fully consolidated with acute radicular irritation. Chronicity risk is high; conservative therapy is exhausted. 20% MdE is justified legally and clinically."
  );

  // Doctor inclusions per page
  const [includeClara, setIncludeClara] = useState(true);
  const [includeEric, setIncludeEric] = useState(true);
  const [includeMarcus, setIncludeMarcus] = useState(true);
  const [includeGratsiano, setIncludeGratsiano] = useState(true);

  // Synchronization and simulation
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");

  // Auto-sync if an active patient is uploaded
  useEffect(() => {
    if (activePatient && activePatient.extractedData) {
      const demo = activePatient.extractedData.demographics;
      setDemographics({
        firstName: demo.firstName || "Thomas",
        lastName: demo.lastName || "Müller",
        birthDate: demo.birthDate || "14.11.1982",
        insuranceNumber: demo.insuranceNumber || "X120938475",
        caseId: demo.caseId || "BG-2026-9901-A",
        insuranceProvider: demo.insuranceProvider || "TK",
        commissioningEntity: demo.commissioningEntity || "BGHM",
      });
      if (activePatient.extractedData.history?.anamnesis) {
        setClinicalAnamnesis(activePatient.extractedData.history.anamnesis);
      }
    }
  }, [activePatient]);

  const handleSaveDraft = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setNotificationText(language === "de" ? "Gutachten erfolgreich gespeichert & konsolidiert!" : "Gutachten successfully saved & consolidated!");
      setShowNotification(true);
      if (onRobotStateChange) onRobotStateChange("HAPPY");
      setTimeout(() => setShowNotification(false), 3000);
    }, 1200);
  };

  // Mock PDF Downloader states
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);

  const triggerFileSave = () => {
    const reportContent = `========================================================================
UDO CLINICAL CONSENSUS BOARD - OFFICIAL MEDICAL REPORT
========================================================================
CASE ID: ${demographics.caseId}
DATE OF ASSESSMENT: ${new Date().toLocaleDateString("de-DE")}
PATIENT PROFILE:
  - Patient Name: ${demographics.firstName} ${demographics.lastName}
  - Date of Birth: ${demographics.birthDate}
  - Health Insurance ID: ${demographics.insuranceNumber}
  - Health Insurance Provider: ${demographics.insuranceProvider}
  - Commissioning Entity: ${demographics.commissioningEntity}
  
========================================================================
I. CLINICAL ANAMNESIS & ACCIDENT VECTOR:
------------------------------------------------------------------------
${clinicalAnamnesis}

========================================================================
II. PHYSICAL CLINICAL FINDINGS:
------------------------------------------------------------------------
${physicalFindings}

========================================================================
III. MULTI-AI CONSENSUS PANEL ASSESSMENT:
------------------------------------------------------------------------
${includeClara ? `[MED-GEMINI EXPERT OPINION (Dr. Clara)]\n${drClaraMedGemini}\n\n` : ""}${includeEric ? `[CLAUDE S2K GUIDELINE ASSESSMENT (Dr. Eric)]\n${drEricClaude}\n\n` : ""}${includeMarcus ? `[BIOMECHANICAL TRAUMATIC ANALYSIS (Dr. Marcus)]\n${drMarcusGPT}\n\n` : ""}${includeGratsiano ? `[DEEPSEEK-R1 COGNITIVE SYNTHESIS (Dr. Gratsiano)]\n${drGratsianoDeepSeek}\n\n` : ""}========================================================================
IV. CLINICAL CONSENSUS DIAGNOSES & CAUSALITY:
------------------------------------------------------------------------
1. Acute Left-Sided L5 Radicular Compression Syndrome (ICD-10 M51.1)
2. Post-Traumatic Lumbar Disc Herniation L4/L5, temporally correlated
3. Recommended Reduction in Earning Capacity (MdE): 20% (Validated)

Obergutachter Signature & Authentication:
Dr. med. Altenberg, Chefärztin für Neurologie
UDO DIGITAL CONSENSUS BOARD SECURE SHA-256 HASH SEAL:
QES_SECURE_HASH::SHA256::7e40c442a8fc1c549afbf4c8996fb92427ae41e4649b934ca495991b7852c92a
========================================================================`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UDO_Medical_Report_${demographics.lastName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setDownloadStep(0);
    
    if (onRobotStateChange) onRobotStateChange("THINKING");

    const interval = setInterval(() => {
      setDownloadStep(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          triggerFileSave();
          setTimeout(() => {
            setIsDownloading(false);
            if (onRobotStateChange) onRobotStateChange("HAPPY");
          }, 800);
          return 5;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  const loadDemoMullerCase = () => {
    setDemographics(fallbackDemographics);
    setClinicalAnamnesis(
      "The 43-year-old patient Thomas Müller presented with persistent left lumboischialgia following an occupational accident on 12.03.2025. While lifting a heavy metal crate (approx. 45 kg), he experienced a sudden, sharp pain in the lumbar region radiating into his left leg (L5 dermatome)."
    );
    setPhysicalFindings(
      "- Restricted spinal range of motion (Schober's sign 10/12 cm)\n- Positive left Lasègue's sign at 45 degrees\n- Hypesthesia in the left L5 dermatome\n- Achilles and patellar reflexes active & symmetrical"
    );
    setDrClaraMedGemini(
      "Clinical-Radiological Correlation: The MRI findings from 28.03.2025 demonstrate a distinct mediolateral disc herniation at the L4/L5 level, which directly compresses the exiting left L5 nerve root. This corresponds precisely to the clinical L5 dermatomal deficit and the positive Lasègue's sign. No signs of multi-segmental degeneration are present."
    );
    setDrEricClaude(
      "S2k Guideline & MdE Assessment: According to the AWMF S2k guidelines for occupational lumbar disc disease, a post-traumatic herniation requires an adequate kinetic trauma (e.g., sudden axial load under heavy load). The lifting incident met these biomechanical criteria. Based on persistent radicular pain and sensory deficits, the recommended reduction in earning capacity (MdE) is 20%."
    );
    setDrMarcusGPT(
      "Biomechanical Traumatic Vector analysis: The vector analysis of lifting a 45 kg load from a bent-over posture shows a lumbar shearing load of >4800 N, which exceeds the physiological threshold. There is an undisputed direct temporal and biomechanical correlation between the lifting incident and the acute disc herniation."
    );
    setDrGratsianoDeepSeek(
      "Chain-of-Thought Synthesis: Cross-evaluating EMG conduction velocities of the left tibialis anterior (drop to 42 m/s) with the L4/L5 MRI confirmation. DeepSeek-R1 identifies that the lateral compression profile of the L5 nerve is fully consolidated with acute radicular irritation. Chronicity risk is high; conservative therapy is exhausted. 20% MdE is justified legally and clinically."
    );
    
    setNotificationText(language === "de" ? "Demo-Datensatz: Thomas Müller geladen!" : "Demo case: Thomas Müller loaded!");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative" id="patient-gutachten-advanced-panel">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="absolute top-4 right-4 z-50 bg-teal-600 border border-teal-400 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} />
          <span className="font-sans font-bold">{notificationText}</span>
        </div>
      )}

      {/* Mini Top Utility Bar */}
      <div className="bg-[#0b1329]/80 border-b border-white/10 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FileText className="text-teal-400" size={18} />
          <div>
            <h4 className="text-xs font-black text-white tracking-wider uppercase font-sans flex items-center gap-2">
              <span>Patient Gutachten & Multi-AI Board</span>
              <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                PRO EDITION
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {language === "de" 
                ? "Führen Sie Gutachten nach S2k-Richtlinien mit 4 KIs im Konsens" 
                : "Generate S2k-compliant medical assessments with 4 AIs in consensus"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDemoMullerCase}
            className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/30 text-[10px] text-teal-300 font-mono tracking-wider transition-all uppercase cursor-pointer"
          >
            {language === "de" ? "Thomas Müller laden" : "Load Thomas Müller Demo"}
          </button>
          
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] tracking-wider transition-all uppercase cursor-pointer flex items-center gap-1"
              title={language === "de" ? "Minimieren" : "Minimize"}
            >
              <Minus size={11} />
              <span>MIN</span>
            </button>
          )}

          <div className="h-5 w-px bg-white/10 mx-1" />

          {/* Tab Selection */}
          <div className="bg-black/40 p-1 rounded-xl border border-white/5 flex gap-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                activeTab === "editor" 
                  ? "bg-teal-600 text-white font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {language === "de" ? "Editor" : "Edit Board"}
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                activeTab === "preview" 
                  ? "bg-teal-600 text-white font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {language === "de" ? "Gutachten-Druck" : "Print Preview"}
            </button>
            <button
              onClick={() => setActiveTab("v4upgrade")}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1 ${
                activeTab === "v4upgrade" 
                  ? "bg-teal-600 text-white font-black" 
                  : "text-[#39FF14] hover:text-[#39FF14]/80"
              }`}
            >
              <Cpu size={11} className="text-[#39FF14] animate-pulse" />
              <span>v4.0 Engine</span>
            </button>
            <button
              onClick={() => setActiveTab("apisetup")}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1 ${
                activeTab === "apisetup" 
                  ? "bg-teal-600 text-white font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code size={11} />
              {language === "de" ? "API-Anleitung" : "API Guide"}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin max-h-[510px]">
        
        {activeTab === "editor" && (
          <div className="space-y-6">
            
            {/* Grid 1: Demographics & Case Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Demographics card */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3">
                <h5 className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={12} />
                  <span>1. Patient Demographics</span>
                </h5>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block">First Name & Last Name</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={demographics.firstName} 
                        onChange={(e) => setDemographics({...demographics, firstName: e.target.value})}
                        className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-1/2 focus:outline-none focus:border-teal-500/40"
                      />
                      <input 
                        type="text" 
                        value={demographics.lastName} 
                        onChange={(e) => setDemographics({...demographics, lastName: e.target.value})}
                        className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-1/2 focus:outline-none focus:border-teal-500/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block">Birth Date</label>
                      <input 
                        type="text" 
                        value={demographics.birthDate} 
                        onChange={(e) => setDemographics({...demographics, birthDate: e.target.value})}
                        className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block">Insurance Nr.</label>
                      <input 
                        type="text" 
                        value={demographics.insuranceNumber} 
                        onChange={(e) => setDemographics({...demographics, insuranceNumber: e.target.value})}
                        className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal & Insurance context */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3">
                <h5 className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={12} />
                  <span>2. Legal & Insurance context</span>
                </h5>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block">Case Reference ID</label>
                    <input 
                      type="text" 
                      value={demographics.caseId} 
                      onChange={(e) => setDemographics({...demographics, caseId: e.target.value})}
                      className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-full focus:outline-none focus:border-teal-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block">Commissioning Entity</label>
                    <input 
                      type="text" 
                      value={demographics.commissioningEntity} 
                      onChange={(e) => setDemographics({...demographics, commissioningEntity: e.target.value})}
                      className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-full focus:outline-none focus:border-teal-500/40"
                    />
                  </div>
                </div>
              </div>

              {/* Anamnesis / Physical Editor */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3">
                <h5 className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <Edit3 size={12} />
                  <span>3. Clinical Context</span>
                </h5>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block">Anamnesis / Accident Vector</label>
                    <textarea 
                      rows={2}
                      value={clinicalAnamnesis} 
                      onChange={(e) => setClinicalAnamnesis(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded px-2 py-1 text-[10px] text-white w-full focus:outline-none focus:border-teal-500/40 resize-none font-sans leading-tight"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Grid 2: Core 4-AI Consensus Workspace with Per-Page Toggles and Individual Edits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <h5 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2 font-sans">
                  <Cpu className="text-teal-400" size={14} />
                  <span>Interactive 4-AI Consensus Columns (Customizable & Editable)</span>
                </h5>
                <span className="text-[9px] font-mono text-slate-400">
                  {language === "de" ? "Wählen Sie, welche KIs ins Gutachten einfließen" : "Select which AIs appear on the exported Gutachten"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* AI 1: Dr. Clara (Med-Gemini) */}
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  includeClara 
                    ? "bg-slate-900/75 border-teal-500/30 shadow-md shadow-teal-500/5" 
                    : "bg-slate-950/20 border-white/5 opacity-40"
                }`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${includeClara ? "bg-teal-400 animate-pulse" : "bg-slate-600"}`} />
                      <div>
                        <span className="text-xs font-black text-white block">Dr. Clara (Med-Gemini)</span>
                        <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">Clinical Correlation</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeClara} 
                        onChange={() => setIncludeClara(!includeClara)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600 peer-checked:after:bg-white" />
                      <span className="ml-1.5 text-[9px] font-mono font-bold uppercase text-slate-400 peer-checked:text-teal-400">
                        {includeClara ? "ON PAGE" : "EXCLUDED"}
                      </span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono text-teal-400 uppercase block">Clara's UDO Neuro Clinical Finding Statement</label>
                    <textarea 
                      rows={4}
                      disabled={!includeClara}
                      value={drClaraMedGemini} 
                      onChange={(e) => setDrClaraMedGemini(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded px-2.5 py-2 text-[11px] leading-relaxed text-slate-100 w-full focus:outline-none focus:border-teal-500/40 resize-none font-sans"
                    />
                  </div>
                </div>

                {/* AI 2: Dr. Eric (UDO Forensic) */}
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  includeEric 
                    ? "bg-slate-900/75 border-amber-500/30 shadow-md shadow-amber-500/5" 
                    : "bg-slate-950/20 border-white/5 opacity-40"
                }`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${includeEric ? "bg-amber-400 animate-pulse" : "bg-slate-600"}`} />
                      <div>
                        <span className="text-xs font-black text-white block">Dr. Eric (UDO Forensic)</span>
                        <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">Forensic & Guideline</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeEric} 
                        onChange={() => setIncludeEric(!includeEric)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600 peer-checked:after:bg-white" />
                      <span className="ml-1.5 text-[9px] font-mono font-bold uppercase text-slate-400 peer-checked:text-amber-400">
                        {includeEric ? "ON PAGE" : "EXCLUDED"}
                      </span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono text-amber-400 uppercase block">Eric's UDO Forensic/MdE Assessment</label>
                    <textarea 
                      rows={4}
                      disabled={!includeEric}
                      value={drEricClaude} 
                      onChange={(e) => setDrEricClaude(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded px-2.5 py-2 text-[11px] leading-relaxed text-slate-100 w-full focus:outline-none focus:border-amber-500/40 resize-none font-sans"
                    />
                  </div>
                </div>

                {/* AI 3: Dr. Marcus (UDO Biomechanics) */}
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  includeMarcus 
                    ? "bg-slate-900/75 border-purple-500/30 shadow-md shadow-purple-500/5" 
                    : "bg-slate-950/20 border-white/5 opacity-40"
                }`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${includeMarcus ? "bg-purple-400 animate-pulse" : "bg-slate-600"}`} />
                      <div>
                        <span className="text-xs font-black text-white block">Dr. Marcus (UDO Biomechanics)</span>
                        <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">Kinetic Vector Analysis</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeMarcus} 
                        onChange={() => setIncludeMarcus(!includeMarcus)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white" />
                      <span className="ml-1.5 text-[9px] font-mono font-bold uppercase text-slate-400 peer-checked:text-purple-400">
                        {includeMarcus ? "ON PAGE" : "EXCLUDED"}
                      </span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono text-purple-400 uppercase block">Marcus' UDO Biomechanical Assessment</label>
                    <textarea 
                      rows={4}
                      disabled={!includeMarcus}
                      value={drMarcusGPT} 
                      onChange={(e) => setDrMarcusGPT(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded px-2.5 py-2 text-[11px] leading-relaxed text-slate-100 w-full focus:outline-none focus:border-purple-500/40 resize-none font-sans"
                    />
                  </div>
                </div>

                {/* AI 4: Dr. Gratsiano (UDO Cognitive) */}
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  includeGratsiano 
                    ? "bg-slate-900/75 border-rose-500/30 shadow-md shadow-rose-500/5" 
                    : "bg-slate-950/20 border-white/5 opacity-40"
                }`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${includeGratsiano ? "bg-rose-400 animate-pulse" : "bg-slate-600"}`} />
                      <div>
                        <span className="text-xs font-black text-white block">Dr. Gratsiano (UDO Cognitive)</span>
                        <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">Deep clinical Synthesis</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeGratsiano} 
                        onChange={() => setIncludeGratsiano(!includeGratsiano)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white" />
                      <span className="ml-1.5 text-[9px] font-mono font-bold uppercase text-slate-400 peer-checked:text-rose-400">
                        {includeGratsiano ? "ON PAGE" : "EXCLUDED"}
                      </span>
                    </label>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono text-rose-400 uppercase block">Gratsiano's UDO Cognitive Synthesis</label>
                    <textarea 
                      rows={4}
                      disabled={!includeGratsiano}
                      value={drGratsianoDeepSeek} 
                      onChange={(e) => setDrGratsianoDeepSeek(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded px-2.5 py-2 text-[11px] leading-relaxed text-slate-100 w-full focus:outline-none focus:border-rose-500/40 resize-none font-sans"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={handleSaveDraft}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase flex items-center gap-2 transition-all shadow-lg shadow-teal-600/10 cursor-pointer"
              >
                {isSyncing ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                <span>{language === "de" ? "Gutachten Speichern" : "Consolidate Report"}</span>
              </button>
            </div>

          </div>
        )}

        {/* PRINT PREVIEW TAB */}
        {activeTab === "preview" && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <span className="text-xs font-mono text-slate-300">
                📄 {language === "de" ? "Dieses Layout ist für den echten A4-Druck (Strg+P) optimiert." : "This layout is fully optimized for A4 paper printouts (Ctrl+P)."}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 font-black text-xs flex items-center gap-2 transition-all uppercase cursor-pointer"
                >
                  <Printer size={14} />
                  <span>{language === "de" ? "Drucken" : "Print"}</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs flex items-center gap-2 transition-all uppercase cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Download size={14} className={isDownloading ? "animate-spin" : ""} />
                  <span>{language === "de" ? "PDF Downloaden" : "Download Report"}</span>
                </button>
              </div>
            </div>

            {/* The Print Layout */}
            <div className="bg-white text-slate-950 p-8 rounded-xl shadow-2xl font-serif text-xs leading-relaxed max-w-3xl mx-auto space-y-6 border border-slate-300 select-all" id="print-area-document">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex justify-between items-start font-sans">
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase">UDO Clinical Consensus Board</h3>
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest">Digital Medical Panel & Expert Consensus Network</p>
                </div>
                <div className="text-right text-[9px] text-slate-600 font-mono">
                  <p>Case ID: {demographics.caseId}</p>
                  <p>Date: {new Date().toLocaleDateString("de-DE")}</p>
                </div>
              </div>

              {/* Patient Block */}
              <div className="bg-slate-100 p-4 rounded border border-slate-300 font-sans grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Patient Profile</p>
                  <h4 className="text-sm font-black text-slate-900">{demographics.firstName} {demographics.lastName}</h4>
                  <p className="text-[11px] text-slate-700">Born: {demographics.birthDate}</p>
                  <p className="text-[11px] text-slate-700">Insurance ID: {demographics.insuranceNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Context Info</p>
                  <p className="text-[11px] text-slate-800 font-semibold">{demographics.insuranceProvider}</p>
                  <p className="text-[11px] text-slate-600 font-medium">Commissioned by: {demographics.commissioningEntity}</p>
                </div>
              </div>

              {/* Anamnesis & Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-sans uppercase border-b border-slate-300 pb-1 text-slate-800">I. Anamnese & Unfallhergang (Accident Vector)</h4>
                <p className="text-slate-800 italic leading-relaxed">{clinicalAnamnesis}</p>
              </div>

              {/* Physical Clinical Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-sans uppercase border-b border-slate-300 pb-1 text-slate-800">II. Klinische Befunde (Neurological & Physical Examination)</h4>
                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-[11px] bg-slate-50 p-2.5 border border-slate-200 rounded">
                  {physicalFindings}
                </div>
              </div>

              {/* Multi-AI Expert Consensus Panel */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-sans uppercase border-b border-slate-300 pb-1 text-slate-800">III. Kollegiales Konsilium der Integrierten KI-Fachexperten (Consensus Assessment)</h4>
                
                <div className="space-y-4">
                  
                  {includeClara && (
                    <div className="pl-4 border-l-2 border-teal-500 py-1 space-y-1">
                      <h5 className="font-sans font-black text-[10px] text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                        Dr. Clara (Med-Gemini Expert Opinion):
                      </h5>
                      <p className="text-slate-800 leading-relaxed">{drClaraMedGemini}</p>
                    </div>
                  )}

                  {includeEric && (
                    <div className="pl-4 border-l-2 border-amber-500 py-1 space-y-1">
                      <h5 className="font-sans font-black text-[10px] text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Dr. Eric (Claude-3.5 Forensic Review):
                      </h5>
                      <p className="text-slate-800 leading-relaxed">{drEricClaude}</p>
                    </div>
                  )}

                  {includeMarcus && (
                    <div className="pl-4 border-l-2 border-purple-500 py-1 space-y-1">
                      <h5 className="font-sans font-black text-[10px] text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        Dr. Marcus (GPT-4o Biomechanical Analysis):
                      </h5>
                      <p className="text-slate-800 leading-relaxed">{drMarcusGPT}</p>
                    </div>
                  )}

                  {includeGratsiano && (
                    <div className="pl-4 border-l-2 border-rose-500 py-1 space-y-1">
                      <h5 className="font-sans font-black text-[10px] text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                        Dr. Gratsiano (DeepSeek-R1 Deep CoT Synthesis):
                      </h5>
                      <p className="text-slate-800 leading-relaxed font-sans bg-slate-50 p-2 border border-slate-200 rounded">{drGratsianoDeepSeek}</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Sign-off */}
              <div className="pt-8 grid grid-cols-2 gap-8 font-sans text-[10px] text-slate-600 border-t border-slate-300">
                <div>
                  <p className="font-bold text-slate-800">Verantwortliche Neurologische Obergutachterin:</p>
                  <div className="h-10 border-b border-dashed border-slate-400 mt-4" />
                  <p className="mt-1">Dr. med. Altenberg, Chefärztin für Neurologie</p>
                  <p>Spec. Social- & Forensic Medicine (55yo Female Colleague)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800">UDO Digital Consensus Board Hash Seal:</p>
                  <p className="mt-4 font-mono text-[8px] bg-slate-100 p-1.5 rounded break-all select-all text-slate-500">
                    QES_SECURE_HASH::SHA256::e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                  <p className="mt-1 text-[8px]">Verified compliant under German BDSG & GDPR Regulations.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* API SETUP GUIDE TAB */}
        {activeTab === "apisetup" && (
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            
            <div className="bg-teal-950/20 border border-teal-500/30 p-4 rounded-xl space-y-2">
              <h5 className="font-black text-white text-sm uppercase font-sans flex items-center gap-2">
                <Database className="text-teal-400" size={16} />
                <span>Live Multi-AI API Integration Guide</span>
              </h5>
              <p>
                By default, this presentation-ready demo simulates real-time consensus polling from your active AIs to ensure reliable showcase performance.
                To activate real live connections to **Med-Gemini**, **Claude-3.5**, **GPT-4o**, and **DeepSeek-R1**, follow this step-by-step guideline:
              </p>
            </div>

            <div className="space-y-4">
              
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl space-y-3">
                <span className="font-mono font-black text-teal-400 text-[10px] uppercase block">Step 1: Declare Keys in your Environment (`.env`)</span>
                <p>
                  Navigate to your `.env` file (or add via your workspace Environment Secrets) and append the following secret variables:
                </p>
                <pre className="bg-black/40 border border-white/10 p-3 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto select-all">
{`# .env config
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_claude_key_here
OPENAI_API_KEY=your_gpt4_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here`}
                </pre>
              </div>

              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl space-y-3">
                <span className="font-mono font-black text-teal-400 text-[10px] uppercase block">Step 2: Install client SDK dependencies</span>
                <p>
                  To handle API connections safely server-side, make sure the required packages are installed in your workspace:
                </p>
                <pre className="bg-black/40 border border-white/10 p-3 rounded-lg text-[10px] font-mono text-teal-300 overflow-x-auto select-all">
npm install @google/genai @anthropic-ai/sdk openai
                </pre>
              </div>

              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl space-y-3">
                <span className="font-mono font-black text-teal-400 text-[10px] uppercase block">Step 3: Update `server.ts` routes</span>
                <p>
                  Modify the `/api/chat` route or build a `/api/consensus` endpoint in your backend server file. Use the following integration template:
                </p>
                <pre className="bg-black/40 border border-white/10 p-3 rounded-lg text-[9px] font-mono text-teal-300 overflow-x-auto select-all max-h-60 overflow-y-auto">
{`// server.ts route example
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const deepseek = new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY, 
  baseURL: "https://api.deepseek.com" 
});

app.post("/api/consensus", async (req, res) => {
  const { clinicalHistory, findings } = req.body;
  
  try {
    // Parallel polling to all 4 elite engines
    const [geminiRes, claudeRes, gptRes, deepseekRes] = await Promise.all([
      // 1. Dr. Clara (Med-Gemini)
      ai.models.generateContent({
        model: "gemini-2.5-flash", // or custom med-gemini tuning
        contents: "Evaluate neurological correlation for this history: " + clinicalHistory
      }),
      // 2. Dr. Eric (Claude-3.5)
      anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Assess MdE percentage according to German S2k guidelines for: " + findings }]
      }),
      // 3. Dr. Marcus (GPT-4o)
      openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Review biomechanical lifting trauma kinetic vectors: " + clinicalHistory }]
      }),
      // 4. Dr. Gratsiano (DeepSeek-R1)
      deepseek.chat.completions.create({
        model: "deepseek-reasoner", // Enables genuine R1 deep thinking
        messages: [{ role: "user", content: "Synthesize medical causality & EMG conduction velocities: " + findings }]
      })
    ]);

    res.json({
      geminiOpinion: geminiRes.text,
      claudeOpinion: claudeRes.content[0].text,
      gptOpinion: gptRes.choices[0].message.content,
      deepseekOpinion: deepseekRes.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`}
                </pre>
              </div>

              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl space-y-3">
                <span className="font-mono font-black text-teal-400 text-[10px] uppercase block">Step 4: Update UI state binding</span>
                <p>
                  Connect the `Consolidate Report` button to trigger the `/api/consensus` POST request instead of using local mock states. This enables absolute, real-time live-updating of all expert views simultaneously!
                </p>
              </div>

            </div>

          </div>
        )}

        {activeTab === "v4upgrade" && (
          <div className="space-y-6">
            
            {/* V4 SUB-HEADER */}
            <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border border-[#39FF14]/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14]">
                  <Cpu size={20} className="animate-spin" style={{ animationDuration: "10s" }} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-wider uppercase font-sans">
                    CORTICAL CORE v4.0 - Active Architecture Upgrades
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    PROACTIVE PREDICTIVE ANALYTICS • BLOCKCHAIN INTEGRITY DECK • MULTI-USER COLLABORATIVE REAL-TIME CONSENSUS
                  </p>
                </div>
              </div>
            </div>

            {/* THREE-COLUMN BENTO GRID FOR V4 FEATURES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* COLUMN 1: PROACTIVE PREDICTIVE ANALYTICS */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono font-black text-[#39FF14] text-[10px] uppercase block tracking-wider">
                    MODULE I: Outcome Prognosis Engine
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Recalculate patient clinical outcomes, chronicity risk indices, and pain reduction projections by modifying rehabilitative parameters dynamically.
                  </p>

                  {/* Dynamic Sliders */}
                  <div className="space-y-3.5 bg-black/30 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-teal-400 font-bold uppercase">1. Early Physiotherapy Engagement</span>
                        <span className="text-[#39FF14] font-black">{physioEngagement}/5 (Level)</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={physioEngagement}
                        onChange={(e) => setPhysioEngagement(parseInt(e.target.value))}
                        className="w-full mt-1.5 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-teal-400 font-bold uppercase">2. Biomechanical Load Unloading</span>
                        <span className="text-[#39FF14] font-black">{6 - biomechanicalLoad}/5 (Unloaded)</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={biomechanicalLoad}
                        onChange={(e) => setBiomechanicalLoad(parseInt(e.target.value))}
                        className="w-full mt-1.5 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                      />
                    </div>
                  </div>

                  {/* Calculated Outputs */}
                  <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">Chronicity Risk</span>
                      <span className={`text-sm font-black ${
                        Math.max(10, Math.round(95 - physioEngagement * 15 + biomechanicalLoad * 8)) > 50 
                          ? "text-rose-400" : "text-[#39FF14]"
                      }`}>
                        {Math.max(10, Math.round(95 - physioEngagement * 15 + biomechanicalLoad * 8))}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">Recovery Period</span>
                      <span className="text-sm font-black text-cyan-400">
                        {Math.max(3, Math.round(14 - physioEngagement * 2.2 + biomechanicalLoad * 1.1))} Weeks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outcome Projection Chart */}
                <div className="h-40 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={Array.from({ length: 8 }, (_, i) => {
                        const week = i * 2;
                        const wMax = Math.max(3, Math.round(14 - physioEngagement * 2.2 + biomechanicalLoad * 1.1));
                        const progress = Math.min(100, Math.round((week / wMax) * 100));
                        const pain = Math.max(0, Math.round(8 - (week * (8 / wMax))));
                        return { week: "W" + week, Recovery: progress, Pain: pain };
                      })}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="week" stroke="#ffffff50" fontSize={8} />
                      <YAxis stroke="#ffffff50" fontSize={8} />
                      <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#ffffff15" }} />
                      <Area type="monotone" dataKey="Recovery" stroke="#39FF14" fill="rgba(57,255,20,0.06)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Pain" stroke="#ef4444" fill="rgba(239,68,68,0.03)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* COLUMN 2: BLOCKCHAIN-BASED DOCUMENT INTEGRITY LEDGER */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono font-black text-[#39FF14] text-[10px] uppercase block tracking-wider">
                    MODULE II: Blockchain Verifier Ledger
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Anchor clinical consensus reports on decentralized ledger nodes to generate immutable cryptographic time-stamps and QES validation proofs.
                  </p>

                  {/* SHA-256 Hash Block */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl font-mono text-[9px] space-y-1">
                    <span className="text-slate-500 uppercase block">Gutachten Payload Seal (SHA-256)</span>
                    <span className="text-teal-400 block truncate select-all">{blockchainHash}</span>
                  </div>

                  {/* Action trigger button */}
                  {blockchainStatus === "unanchored" ? (
                    <button
                      onClick={() => {
                        setBlockchainStatus("anchoring");
                        setBlockchainProgress(0);
                        const interval = setInterval(() => {
                          setBlockchainProgress(prev => {
                            if (prev >= 100) {
                              clearInterval(interval);
                              setBlockchainStatus("secured");
                              const newBlockNum = blockchainLedger[blockchainLedger.length - 1].block + 4;
                              const newHash = "f9a4" + Math.random().toString(16).substring(2, 10) + "...92c1";
                              setBlockchainHash("SHA256::" + newHash + "c8e9b81a" + Math.round(Math.random() * 9000));
                              setBlockchainLedger(prevLedger => [
                                ...prevLedger,
                                {
                                  block: newBlockNum,
                                  hash: newHash,
                                  timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
                                  action: "GUTACHTEN_ANCHORED",
                                  status: "SECURED"
                                }
                              ]);
                              return 100;
                            }
                            return prev + 10;
                          });
                        }, 250);
                      }}
                      className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-sans font-black text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-500/15"
                    >
                      <Database size={13} />
                      <span>Anchor Document to Node</span>
                    </button>
                  ) : blockchainStatus === "anchoring" ? (
                    <div className="bg-black/30 border border-teal-500/20 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-teal-400">
                        <span className="animate-pulse">BROADCASTING TRANSACTION...</span>
                        <span>{blockchainProgress}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400" style={{ width: `${blockchainProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-[#39FF14] text-xs font-black uppercase tracking-wider font-mono">
                        <CheckCircle size={14} />
                        <span>Anchor Block Secured</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block font-mono">Transaction locked on ledger index.</span>
                    </div>
                  )}
                </div>

                {/* Interactive Ledger list */}
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin pt-2 border-t border-white/5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block">Active Blockchain Registry</span>
                  {blockchainLedger.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-[10px] font-mono bg-black/25 p-2 rounded-lg border border-white/5">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold">Block #{item.block}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[9px] truncate max-w-[80px]">{item.action}</span>
                        </div>
                        <span className="text-[8px] text-slate-500 block mt-0.5">{item.timestamp}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[#39FF14] text-[8px] font-black uppercase">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 3: REAL-TIME COLLABORATIVE EDITING SIMULATOR */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono font-black text-[#39FF14] text-[10px] uppercase block tracking-wider">
                    MODULE III: Real-Time Multiplayer Room
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Collaborate instantly with concurrent medical specialists. Monitor active text updates, presence cursors, and coordinate medical consensus in real-time.
                  </p>

                  {/* Active specialists presence */}
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {multiplayerDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px] font-mono p-1.5 border border-white/5 bg-black/25 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                          <span className="text-white font-bold">{doc.name}</span>
                        </div>
                        <span className="text-slate-400 text-[9px] max-w-[120px] truncate">{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaborative log/chat terminal */}
                <div className="space-y-2">
                  <div className="bg-black/50 border border-white/10 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[9px] text-teal-300 space-y-2.5 scrollbar-thin">
                    {collabMessages.map((msg, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {msg}
                      </div>
                    ))}
                  </div>

                  {/* Typing input simulation */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!newMessageText.trim()) return;
                          setCollabMessages(prev => [...prev, `[User] Obergutachter: ${newMessageText}`]);
                          setNewMessageText("");
                          setTimeout(() => {
                            const replies = [
                              "[Multi-User] Dr. Clara: Copy that. Applying corresponding adjustments.",
                              "[Multi-User] Dr. Eric: Consensus recommendation aligned successfully.",
                              "[Multi-User] Dr. Marcus: Biomechanical vector models synced."
                            ];
                            setCollabMessages(prev => [...prev, replies[Math.floor(Math.random() * replies.length)]]);
                          }, 1000);
                        }
                      }}
                      placeholder="Send live consensus update..."
                      className="flex-1 bg-black/60 border border-white/15 px-3 py-1.5 text-[10px] text-white rounded-xl placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (!newMessageText.trim()) return;
                        setCollabMessages(prev => [...prev, `[User] Obergutachter: ${newMessageText}`]);
                        setNewMessageText("");
                        setTimeout(() => {
                          const replies = [
                            "[Multi-User] Dr. Clara: Copy that. Applying corresponding adjustments.",
                            "[Multi-User] Dr. Eric: Consensus recommendation aligned successfully.",
                            "[Multi-User] Dr. Marcus: Biomechanical vector models synced."
                          ];
                          setCollabMessages(prev => [...prev, replies[Math.floor(Math.random() * replies.length)]]);
                        }, 1000);
                      }}
                      className="px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MOCK PDF GENERATION MODAL OVERLAY */}
      <AnimatePresence>
        {isDownloading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[28px] p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Loader2 className="animate-spin text-teal-400" size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-wider uppercase font-sans">
                    {language === "de" ? "PDF-Gutachten wird generiert" : "Generating PDF Report"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                    UDO VECTOR COMPILATION ENGINE
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>PROGRESS</span>
                  <span className="text-teal-400 font-bold">{Math.round((downloadStep / 5) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-400 transition-all duration-300"
                    style={{ width: `${(downloadStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-2">
                {[
                  { step: 0, label: language === "de" ? "Klinische Befunde zusammenstellen" : "Compiling clinical findings" },
                  { step: 1, label: language === "de" ? "AI-Konsensberichte konsolidieren" : "Assembling 4-AI consensus reports" },
                  { step: 2, label: language === "de" ? "S2k-Leitlinienabgleich überprüfen" : "Matching S2k guidelines & trauma kinetics" },
                  { step: 3, label: language === "de" ? "Digitales QES SHA-256 Siegel anwenden" : "Applying digital QES SHA-256 signatures" },
                  { step: 4, label: language === "de" ? "Hochauflösendes Vektorlayout rendern" : "Rendering high-density vector document layout" },
                  { step: 5, label: language === "de" ? "PDF erfolgreich generiert!" : "Export completed! Initiating secure download" }
                ].map((s) => (
                  <div key={s.step} className="flex items-center justify-between text-[11px] font-mono">
                    <span className={downloadStep === s.step ? "text-teal-300 font-bold" : downloadStep > s.step ? "text-slate-400" : "text-slate-600"}>
                      {s.step + 1}. {s.label}
                    </span>
                    {downloadStep > s.step ? (
                      <Check className="text-teal-400 shrink-0" size={12} />
                    ) : downloadStep === s.step ? (
                      <Loader2 className="animate-spin text-teal-400 shrink-0" size={10} />
                    ) : (
                      <span className="text-slate-600 shrink-0">WAIT</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
