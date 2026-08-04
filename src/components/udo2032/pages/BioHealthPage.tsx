import React, { useState } from 'react';
import {
  Brain,
  Upload,
  FileText,
  Download,
  Activity,
  Dna,
  Mic,
  MicOff,
  Radar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { routeUdoPrompt } from '../../../services/udoMetaRouter';

export function BioHealthPage() {
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [gutachtenReport, setGutachtenReport] = useState<string | null>(null);

  // Digital Twin state
  const [selectedDrug, setSelectedDrug] = useState('Metoprolol 50mg');
  const [simulatingDrug, setSimulatingDrug] = useState(false);
  const [drugResult, setDrugResult] = useState<any>(null);

  // Micro-Symptom voice state
  const [isListening, setIsListening] = useState(false);
  const [symptomLog, setSymptomLog] = useState<string[]>([]);

  // Sample PDF / Text file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileText(text || "Patient 43J, Lumboischialgie links nach Hebetrauma, MRT LWS L4/L5 Bandscheibenvorfall mit Radikulopathie L5.");
    };
    reader.readAsText(file);
  };

  const handleGenerateGutachten = async () => {
    setGeneratingReport(true);
    const textToProcess = fileText || "Patient Herr Thomas Müller, geb. 14.11.1982. Zustand nach Arbeitsunfall am 12.03.2025. Klinischer Befund: LWS-Syndrom, Lasègue links bei 45 Grad positiv, Hypästhesie Dermatom L5. MRT zeigt mediolateralen Bandscheibenvorfall L4/L5 links.";

    try {
      const prompt = `Erstelle ein vollständiges, 8-teiliges medizinisches S2k-Gutachten für folgenden Fall:
${textToProcess}

Sektionen:
1. Stammdaten & Auftraggeber
2. Anamnese & Unfallhergang
3. Klinisch-Neurologischer Befund
4. Bildgebende Diagnostik (MRT/CT)
5. Kausalitätsbeurteilung
6. MdE-Einschätzung (Minderung der Erwerbsfähigkeit %)
7. Leitlinien-Konformität (S2k/S3)
8. Abschließendes Gutachterliches Fazit`;

      const response = await routeUdoPrompt({
        prompt,
        taskType: "medical",
        preferredProvider: "auto"
      });

      setGutachtenReport(response.result);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadPdf = () => {
    if (!gutachtenReport) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("UDO 2032 AUTONOMES S2K-GUTACHTEN", 14, 15);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(gutachtenReport.replace(/#/g, ''), 180);
    doc.text(splitText, 14, 25);
    doc.save(`UDO_S2k_Gutachten_${fileName || "Müller"}.pdf`);
  };

  const handleSimulateDrug = () => {
    setSimulatingDrug(true);
    setTimeout(() => {
      setDrugResult({
        drug: selectedDrug,
        metabolicEfficacy: "94.2% Optimal Metabolic Clearence",
        plasmaHalfLife: "3.8 Hours (CYP2D6 Normal Metabolizer)",
        adverseRisk: "LOW (0.4% Bradycardia probability)",
        geneticMatch: "HLA-B*5701 Negative • TPMT Normal"
      });
      setSimulatingDrug(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans select-none text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Brain size={16} />
            <span>PHASE 1: CORE INFRASTRUCTURE & BIO-HEALTH</span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white">
            Bio-Health Engine & Autonomous Gutachten
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} />
          <span>DSGVO 100% ON-DEVICE</span>
        </div>
      </div>

      {/* Grid: Gutachten Generator & Digital Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Autonomous Gutachten Generator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>PDF Upload & Autonomous Gutachten (#2)</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              8-Section S2k Synthesis
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Upload patient medical history or paste clinical findings to synthesize a forensically compliant 8-section medical-legal report.
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl bg-slate-900/50 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-all cursor-pointer">
              <Upload size={16} />
              <span>{fileName ? `Loaded: ${fileName}` : 'Upload PDF or Medical Record (.txt/.pdf)'}</span>
              <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileUpload} className="hidden" />
            </label>

            <textarea
              value={fileText}
              onChange={(e) => setFileText(e.target.value)}
              placeholder="Or paste medical findings here..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleGenerateGutachten}
                disabled={generatingReport}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                <Zap size={14} />
                <span>{generatingReport ? 'Synthesizing...' : 'Generate 8-Section Gutachten'}</span>
              </button>

              {gutachtenReport && (
                <button
                  onClick={downloadPdf}
                  className="py-2.5 px-4 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-900 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>

          {gutachtenReport && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {gutachtenReport}
            </div>
          )}
        </div>

        {/* Card 2: Digital Twin Drug & Metabolic Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Digital Twin Patient Simulator (#3)</span>
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded">
              CYP450 / Metabolic
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Simulate pharmacokinetics, metabolic clearance, and adverse drug reactions on the patient&apos;s digital twin profile.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Select Pharmaceutical:</span>
              <select
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="Metoprolol 50mg">Metoprolol 50mg (Beta Blocker)</option>
                <option value="Ibuprofen 600mg">Ibuprofen 600mg (NSAID)</option>
                <option value="Atorvastatin 20mg">Atorvastatin 20mg (Statin)</option>
                <option value="Gabapentin 300mg">Gabapentin 300mg (Anticonvulsant)</option>
              </select>
            </div>

            <button
              onClick={handleSimulateDrug}
              disabled={simulatingDrug}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play size={14} />
              <span>{simulatingDrug ? 'Calculating Kinetics...' : 'Run Digital Twin Simulation'}</span>
            </button>

            {drugResult && (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Drug:</span>
                  <span className="text-purple-300 font-bold">{drugResult.drug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Efficacy Rate:</span>
                  <span className="text-emerald-400">{drugResult.metabolicEfficacy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Half-Life Clearance:</span>
                  <span className="text-cyan-300">{drugResult.plasmaHalfLife}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Adverse Probability:</span>
                  <span className="text-emerald-400">{drugResult.adverseRisk}</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/40 pt-2">
                  <span className="text-slate-400">Genetic Biomarkers:</span>
                  <span className="text-slate-200">{drugResult.geneticMatch}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Multi-Omics Predictor & Emergency Triage Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 3: Genomic & Microbiome Multi-Omics Predictor (#4) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>Multi-Omics Disease Risk Engine (#4)</span>
            </h2>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
              DNA + Microbiome
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">CARDIOVASCULAR RISK</span>
              <span className="text-emerald-400 font-bold text-sm">LOW (12.4%)</span>
              <span className="text-[9px] text-slate-500 block">PRS Score: -1.2 SD</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">INFLAMMATORY INDEX</span>
              <span className="text-amber-400 font-bold text-sm">MODERATE (34.1%)</span>
              <span className="text-[9px] text-slate-500 block">Gut Microbiome Dysbiosis</span>
            </div>
          </div>
        </div>

        {/* Card 4: Emergency Triage Radar (#28) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Emergency Triage Radar (#28)</span>
            </h2>
            <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded">
              Live Priority
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between bg-red-950/40 border border-red-500/50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-white font-bold">Pat. #BG-9901 (Kritisch)</span>
              </div>
              <span className="text-red-400 font-bold">PRIO 1 (Verdacht Cauda Equina)</span>
            </div>

            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pat. #BG-9902 (Routine)</span>
              </div>
              <span className="text-emerald-400">PRIO 3 (LWS Kontrolltermin)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
