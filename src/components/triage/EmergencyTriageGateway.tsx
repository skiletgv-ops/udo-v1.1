import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileText, 
  X, 
  PhoneCall, 
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { useGlobalSystem } from "../GlobalSystemContext";
import { triggerAudioCue } from "../../services/audioFeedbackService";

export interface TriageResult {
  flag: "NORMAL" | "LEVEL_2_URGENT" | "LEVEL_1_CRITICAL";
  code: string;
  conditionName: { de: string; en: string };
  action: { de: string; en: string };
  s2kReference: string;
  latencyMs: number;
  matchedKeywords: string[];
  bypassLlm: boolean;
}

export function evalEmergencyTriage(input: string): TriageResult {
  const startTime = performance.now();
  const text = input.toLowerCase().trim();

  // Rule 1: ACUTE STROKE / FAST PROTOCOL
  const strokeKeywords = [
    "stroke", "schlaganfall", "fast", "hemiparesis", "halbseitenlähmung", 
    "facial droop", "fazialisparese", "aphasia", "sprachstörung", "dysarthria",
    "arm parese", "apoplex"
  ];
  const matchedStroke = strokeKeywords.filter(k => text.includes(k));
  if (matchedStroke.length > 0) {
    const endTime = performance.now();
    return {
      flag: "LEVEL_1_CRITICAL",
      code: "S2K-STROKE-FAST",
      conditionName: {
        de: "Akuter Ischämischer Schlaganfall / FAST-Protokoll Positiv",
        en: "Acute Ischemic Stroke / FAST Protocol Positive"
      },
      action: {
        de: "Sofortige Aktivierung Stroke Unit Team & CT-Angiographie (Lyse-Fenster < 4,5h). LLM-Bypass aktiviert!",
        en: "Immediate Stroke Unit Team & CT Angiography activation (Lysis window < 4.5h). LLM bypassed!"
      },
      s2kReference: "S2k-Leitlinie Akuttherapie des ischämischen Schlaganfalls (DGN 2024)",
      latencyMs: Number((endTime - startTime).toFixed(2)),
      matchedKeywords: matchedStroke,
      bypassLlm: true
    };
  }

  // Rule 2: STATUS EPILEPTICUS
  const seizureKeywords = [
    "status epilepticus", "seizure", "krampfanfall", "konvulsionen", 
    "anfall > 5 min", "serieller anfall", "tonisch-klonisch"
  ];
  const matchedSeizure = seizureKeywords.filter(k => text.includes(k));
  if (matchedSeizure.length > 0) {
    const endTime = performance.now();
    return {
      flag: "LEVEL_1_CRITICAL",
      code: "S2K-EPILEPSY-STATUS",
      conditionName: {
        de: "Status Epilepticus (Generalisierter Anfall > 5 Min)",
        en: "Status Epilepticus (Generalized Seizure > 5 Mins)"
      },
      action: {
        de: "Gabe von IV Lorazepam 4mg / Midazolam 10mg transmukosal. Atemwegssicherung & Intensivbereitschaft. LLM-Bypass!",
        en: "Administer IV Lorazepam 4mg / Midazolam 10mg transmucosal. Protect airway & alert ICU. LLM bypassed!"
      },
      s2kReference: "S2k-Leitlinie Status Epilepticus im Erwachsenenalter (DGN)",
      latencyMs: Number((endTime - startTime).toFixed(2)),
      matchedKeywords: matchedSeizure,
      bypassLlm: true
    };
  }

  // Rule 3: ACUTE CAUDA EQUINA SYNDROME
  const caudaKeywords = [
    "cauda equina", "kauda", "saddle anesthesia", "reithosenanästhesie",
    "harnverhalt", "urinary retention", "stuhlinkontinenz", "blasenstörung",
    "paraparesis"
  ];
  const matchedCauda = caudaKeywords.filter(k => text.includes(k));
  if (matchedCauda.length > 0) {
    const endTime = performance.now();
    return {
      flag: "LEVEL_1_CRITICAL",
      code: "S2K-NEURO-CAUDA",
      conditionName: {
        de: "Akutes Kauda-Syndrom (Musterreithosenanästhesie & Blasenstörung)",
        en: "Acute Cauda Equina Syndrome (Saddle Anesthesia & Urinary Retention)"
      },
      action: {
        de: "Notfall-MRT LWS (< 2h) & Sofortkonsil Neurochirurgie zur Dekompression. LLM-Bypass!",
        en: "Emergency Lumbar Spine MRI (< 2h) & Urgent Neurosurgery Consult for decompression. LLM bypassed!"
      },
      s2kReference: "S2k-Leitlinie Lumbaler Bandscheibenvorfall (DGOOC/DGN)",
      latencyMs: Number((endTime - startTime).toFixed(2)),
      matchedKeywords: matchedCauda,
      bypassLlm: true
    };
  }

  // Rule 4: INCREASED ICP / HERNIATION
  const icpKeywords = [
    "anisocoria", "pupillendifferenz", "cushing", "hirndruck", "herniation", 
    "einklemmung", "papillenödem", "stupor", "koma"
  ];
  const matchedIcp = icpKeywords.filter(k => text.includes(k));
  if (matchedIcp.length > 0) {
    const endTime = performance.now();
    return {
      flag: "LEVEL_1_CRITICAL",
      code: "S2K-ICP-HERNIATION",
      conditionName: {
        de: "Erhöhter Intrakranieller Druck / Drohende Zerebrale Einklemmung",
        en: "Increased Intracranial Pressure / Impending Brain Herniation"
      },
      action: {
        de: "Oberkörperhochlagerung 30°, Mannitol 20% / Hypertoner Kochsalz-Bolus & Notfall-CCT. LLM-Bypass!",
        en: "Elevate head 30°, Mannitol 20% / Hypertonic Saline bolus & Emergency CT Head. LLM bypassed!"
      },
      s2kReference: "S2k-Leitlinie Schädel-Hirn-Trauma & Hirndrucktherapie (DGN)",
      latencyMs: Number((endTime - startTime).toFixed(2)),
      matchedKeywords: matchedIcp,
      bypassLlm: true
    };
  }

  // Rule 5: ACUTE PSYCHOTIC / SUICIDAL CRISIS
  const psychKeywords = [
    "suicidal", "suizidal", "eigengefährdung", "fremdgefährdung", 
    "akute psychose", "starke erregung", "halluzinationen", "selbstverletzung"
  ];
  const matchedPsych = psychKeywords.filter(k => text.includes(k));
  if (matchedPsych.length > 0) {
    const endTime = performance.now();
    return {
      flag: "LEVEL_2_URGENT",
      code: "DGPPN-PSYCH-CRISIS",
      conditionName: {
        de: "Akute Psychiatrische Krisenintervention / Suizidalität",
        en: "Acute Psychiatric Crisis / Suicidal Intent Detection"
      },
      action: {
        de: "Sofortige Deeskalation, Geschütze Unterbringung & Notfall-Psychiater Hinzuziehung.",
        en: "Immediate de-escalation, protective environment & Emergency Psychiatric consult.",
      },
      s2kReference: "DGPPN S3-Leitlinie Verhinderung von Suizid & Krisenintervention",
      latencyMs: Number((endTime - startTime).toFixed(2)),
      matchedKeywords: matchedPsych,
      bypassLlm: true
    };
  }

  // DEFAULT NORMAL RESULT
  const endTime = performance.now();
  return {
    flag: "NORMAL",
    code: "S2K-CLEAR-ROUTINE",
    conditionName: {
      de: "Unauffällig / Keine Akut-Notfallkriterien Detektiert",
      en: "Clear / No Acute Emergency Criteria Detected"
    },
    action: {
      de: "Standardmäßige S2k-Pipeline & KI-Konsiliardienst Verarbeitung freigegeben.",
      en: "Standard S2k pipeline & AI consultation processing cleared."
    },
    s2kReference: "UDO Deterministic Safety Shield v2.0",
    latencyMs: Number((endTime - startTime).toFixed(2)),
    matchedKeywords: [],
    bypassLlm: false
  };
}

interface EmergencyTriageGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  initialInput?: string;
}

export function EmergencyTriageGateway({ isOpen, onClose, initialInput = "" }: EmergencyTriageGatewayProps) {
  const { language } = useGlobalSystem();
  const [queryText, setQueryText] = useState(initialInput || "");
  const [activeResult, setActiveResult] = useState<TriageResult | null>(
    initialInput ? evalEmergencyTriage(initialInput) : null
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (!isOpen) return null;

  const handleTestRun = (inputText: string) => {
    setQueryText(inputText);
    const res = evalEmergencyTriage(inputText);
    setActiveResult(res);
    if (res.flag === "LEVEL_1_CRITICAL" || res.flag === "LEVEL_2_URGENT") {
      triggerAudioCue("alert", res.code, res.conditionName[language]);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col font-sans"
      >
        {/* HEADER BAR */}
        <div className="bg-slate-950 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-wide uppercase font-mono">
                  S2k Emergency Triage Gateway
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
                  0-LLM Latency Shield
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === "de"
                  ? "Determinischer Regelbasierter Sicherheitsfilter (S2k-Notfallstandard)"
                  : "Deterministic Rule-Based Low-Latency Safety Layer (S2k Emergency Guidelines)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* QUICK TEST SCENARIOS FOR DOCTOR ULRIKE */}
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              ⚡ {language === "de" ? "Schnelltest Notfall-Szenarien (Dr. Ulrike S2k-Protokolle)" : "Quick Test Emergency Scenarios (Dr. Ulrike S2k Protocols)"}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleTestRun("Patient mit akuter Halbseitenlähmung, Fazialisparese und Aphasia seit 1 Stunde")}
                className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-left text-xs font-medium transition-all cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px] text-red-400">STROKE (FAST+)</span>
                  <Zap size={12} className="text-red-400" />
                </div>
                <span className="text-[10px] text-slate-300 line-clamp-1">Hemiparesis & Aphasia</span>
              </button>

              <button
                onClick={() => handleTestRun("Status Epilepticus krampfanfall > 5 min ohne Bewusstsein")}
                className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-left text-xs font-medium transition-all cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px] text-red-400">STATUS EPILEPTICUS</span>
                  <Activity size={12} className="text-red-400" />
                </div>
                <span className="text-[10px] text-slate-300 line-clamp-1">Seizure &gt; 5 mins</span>
              </button>

              <button
                onClick={() => handleTestRun("Akuter L4/L5 Bandscheibenvorfall mit Reithosenanästhesie und Harnverhalt")}
                className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-left text-xs font-medium transition-all cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px] text-red-400">CAUDA EQUINA</span>
                  <AlertTriangle size={12} className="text-red-400" />
                </div>
                <span className="text-[10px] text-slate-300 line-clamp-1">Saddle Anesthesia</span>
              </button>

              <button
                onClick={() => handleTestRun("Patient mit leichtem Lumbal-Syndrom und normalen Reflexen ohne Notfallsymptome")}
                className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-200 text-left text-xs font-medium transition-all cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px] text-emerald-400">ROUTINE CLEAR</span>
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-300 line-clamp-1">No Emergency</span>
              </button>
            </div>
          </div>

          {/* INPUT FIELD FOR CUSTOM SYMPTOMS */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              {language === "de" ? "Symptome / Befundtext eingeben" : "Enter Patient Symptoms / Clinical Findings"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTestRun(queryText)}
                placeholder={
                  language === "de"
                    ? "z.B. Patient zeigt Anisokorie, Hirndruck und Verwirrtheit..."
                    : "e.g. Patient presents with facial droop, hemiparesis and speech difficulty..."
                }
                className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
              <button
                onClick={() => handleTestRun(queryText)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_#22d3ee] cursor-pointer"
              >
                {language === "de" ? "Prüfen" : "Evaluate"}
              </button>
            </div>
          </div>

          {/* TRIAGE RESULT CARD */}
          {activeResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 transition-all shadow-xl ${
                activeResult.flag === "LEVEL_1_CRITICAL"
                  ? "bg-red-950/50 border-red-500 shadow-red-950/50"
                  : activeResult.flag === "LEVEL_2_URGENT"
                  ? "bg-amber-950/50 border-amber-500 shadow-amber-950/50"
                  : "bg-emerald-950/40 border-emerald-500/50 shadow-emerald-950/30"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  {activeResult.flag === "LEVEL_1_CRITICAL" ? (
                    <div className="w-8 h-8 rounded-xl bg-red-500 text-slate-950 flex items-center justify-center font-bold font-mono animate-bounce">
                      🚨
                    </div>
                  ) : activeResult.flag === "LEVEL_2_URGENT" ? (
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-mono">
                      ⚠️
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold font-mono">
                      ✓
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider block text-slate-300">
                      {activeResult.code}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {activeResult.conditionName[language]}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                    <Zap size={13} className="text-cyan-400" />
                    <span>Latency: {activeResult.latencyMs} ms</span>
                  </div>

                  {activeResult.bypassLlm && (
                    <span className="bg-red-500 text-slate-950 font-mono text-[10px] font-extrabold px-2 py-1 rounded tracking-wider uppercase animate-pulse">
                      LLM BYPASSED
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION RECOMMENDED */}
              <div className="space-y-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                    {language === "de" ? "Empfohlene Sofortmaßnahme (S2k Notfall-Direktive)" : "Recommended Action (S2k Emergency Directive)"}
                  </span>
                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {activeResult.action[language]}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2 pt-1">
                  <span>Reference: {activeResult.s2kReference}</span>
                  {activeResult.matchedKeywords.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span>Keywords:</span>
                      {activeResult.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* S2K SAFETY LAYER INFO PANEL */}
          <div className="bg-slate-950/60 border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
            <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-cyan-300 block font-mono">
                {language === "de" ? "Warum der S2k Emergency Triage Gateway?" : "Why the S2k Emergency Triage Gateway?"}
              </span>
              <p className="leading-relaxed text-slate-300">
                {language === "de"
                  ? "Standard-LLMs können eine Antwortlatenz von 2.000–5.000 ms aufweisen. Bei akut lebensbedrohlichen neurologischen Notfällen (z.B. Zeitfenster für Lyse bei Schlaganfall < 4,5h) evaluiert diese determinsitische Schicht Notfallsymptome in unter 1 ms und schlägt sofort Alarm."
                  : "Standard LLMs can introduce 2,000–5,000 ms of response latency. In life-threatening neurological emergencies (e.g. stroke thrombolysis window < 4.5h), this deterministic layer evaluates criteria in under 1 ms and immediately triggers alerts."}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION BAR */}
        <div className="bg-slate-950 px-6 py-4 border-t border-cyan-500/30 flex items-center justify-between">
          <button
            onClick={() => setShowGuideModal(!showGuideModal)}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <FileText size={14} />
            <span>{language === "de" ? "S2k Notfall-Richtlinie Dokumentation" : "S2k Emergency Guidelines Documentation"}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-all cursor-pointer"
            >
              {language === "de" ? "Schließen" : "Close"}
            </button>
            {activeResult?.flag === "LEVEL_1_CRITICAL" && (
              <a
                href="tel:112"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer animate-pulse"
              >
                <PhoneCall size={14} />
                <span>{language === "de" ? "Notruf 112" : "Call Emergency 112"}</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
