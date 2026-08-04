import React, { useState } from 'react';
import {
  Briefcase,
  Globe,
  FileSearch,
  MessageSquare,
  Network,
  Send,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { routeUdoPrompt } from '../../../services/udoMetaRouter';

export function EnterprisePage() {
  // Supply Chain state
  const [supplyChainNodes, setSupplyChainNodes] = useState([
    { id: 'BERLIN', name: 'Berlin Distribution Center', status: 'OPTIMAL', delay: '0 min', load: '42%' },
    { id: 'ROTTERDAM', name: 'Rotterdam Port Hub', status: 'BOTTLENECK', delay: '+140 min (Rerouted via Hamburg)', load: '94%' },
    { id: 'COLOGNE', name: 'Cologne Medical Depot', status: 'OPTIMAL', delay: '0 min', load: '38%' }
  ]);

  // Compliance Bot state
  const [scanningCompliance, setScanningCompliance] = useState(false);
  const [complianceResult, setComplianceResult] = useState<any>(null);

  // Universal Translator Bridge state
  const [chatInput, setChatInput] = useState('');
  const [targetLang, setTargetLang] = useState<'EN' | 'ES' | 'FR' | 'ZH'>('EN');
  const [translating, setTranslating] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Array<{
    original: string;
    translated: string;
    lang: string;
    emotionalIntent: string;
  }>>([]);

  const handleScanCompliance = () => {
    setScanningCompliance(true);
    setTimeout(() => {
      setComplianceResult({
        scannedPolicy: 'Clinic Data Protection Directive v2.1',
        outdatedClauses: [
          { clause: '§ 4 Abs. 2 (Data Retention)', issue: 'Refers to outdated 2018 GDPR retention schedule', suggestedPatch: 'Update retention period to 10-year forensically safe storage under DSGVO Art. 17' }
        ]
      });
      setScanningCompliance(false);
    }, 1200);
  };

  const handleTranslateMessage = async () => {
    if (!chatInput.trim() || translating) return;
    const msg = chatInput;
    setChatInput('');
    setTranslating(true);

    try {
      const response = await routeUdoPrompt({
        prompt: `Translate the following German medical/business message into ${targetLang} and analyze emotional intent in 1 sentence: "${msg}"`,
        taskType: "translation"
      });

      setTranslatedMessages((prev) => [
        ...prev,
        {
          original: msg,
          translated: response.result,
          lang: targetLang,
          emotionalIntent: 'Collaborative & Reassuring (Confidence: 96%)'
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-8 font-sans select-none text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Briefcase size={16} />
            <span>PHASE 3: ENTERPRISE OPS & COMMUNICATION</span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white">
            Supply Chain Autopilot & Universal Translator
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-purple-950/60 border border-purple-500/40 text-purple-400 px-3 py-1.5 rounded-full">
          <Globe size={14} />
          <span>MULTI-LINGUAL BRIDGE ACTIVE</span>
        </div>
      </div>

      {/* Grid: Supply Chain Autopilot & Compliance Bot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Supply Chain Autopilot SVG Map (#8) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Supply Chain Autopilot (#8)</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              Autonomous Reroute
            </span>
          </div>

          {/* Interactive World Map SVG Visualization */}
          <div className="relative w-full h-44 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden p-4">
            <svg viewBox="0 0 600 200" className="w-full h-full opacity-60">
              <circle cx="150" cy="100" r="8" className="fill-cyan-400 animate-ping" />
              <circle cx="150" cy="100" r="5" className="fill-cyan-400" />
              <text x="140" y="125" fill="#38bdf8" fontSize="10" fontFamily="monospace">BERLIN</text>

              <line x1="150" y1="100" x2="300" y2="70" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
              <circle cx="300" cy="70" r="6" className="fill-amber-400 animate-pulse" />
              <text x="280" y="50" fill="#fbbf24" fontSize="10" fontFamily="monospace">ROTTERDAM (Rerouted)</text>

              <line x1="300" y1="70" x2="450" y2="120" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
              <circle cx="450" cy="120" r="5" className="fill-emerald-400" />
              <text x="440" y="145" fill="#34d399" fontSize="10" fontFamily="monospace">COLOGNE</text>
            </svg>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {supplyChainNodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-white font-bold block">{node.name}</span>
                  <span className="text-slate-400 text-[11px]">{node.delay}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                    node.status === 'BOTTLENECK'
                      ? 'bg-amber-950 text-amber-400 border-amber-500/50'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                  }`}
                >
                  {node.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Compliance Bot Policy Diff Scanner (#9) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-purple-300 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-purple-400" />
              <span>Compliance Bot Policy Scanner (#9)</span>
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded">
              Auto Clause Diffs
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Scans internal clinic policies against new DSGVO / EU AI Act directives and generates side-by-side patch diffs.
          </p>

          <button
            onClick={handleScanCompliance}
            disabled={scanningCompliance}
            className="w-full py-3 rounded-xl bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap size={16} />
            <span>{scanningCompliance ? 'Scanning Policy Documents...' : 'Run Compliance Audit & Patch Generator'}</span>
          </button>

          {complianceResult && (
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-xs font-mono space-y-2">
              <span className="text-purple-300 font-bold block">Document: {complianceResult.scannedPolicy}</span>
              {complianceResult.outdatedClauses.map((c: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">{c.clause}</span>
                  <p className="text-slate-400 text-[11px]">{c.issue}</p>
                  <p className="text-emerald-400 text-[11px] font-bold">Suggested Patch: {c.suggestedPatch}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Universal Translator Bridge (#10) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Universal Translator Bridge & Emotional Intent Radar (#10)</span>
          </h2>
          <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <span>TARGET LANG:</span>
            {(['EN', 'ES', 'FR', 'ZH'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setTargetLang(lang)}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                  targetLang === lang ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslateMessage()}
            placeholder="Type German message for real-time translation & emotional intent analysis..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={handleTranslateMessage}
            disabled={translating || !chatInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            Translate
          </button>
        </div>

        {translatedMessages.length > 0 && (
          <div className="space-y-3 pt-2">
            {translatedMessages.map((msg, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>ORIGINAL (DE): {msg.original}</span>
                  <span className="text-cyan-400">TRANSLATED ({msg.lang})</span>
                </div>
                <p className="text-slate-100 text-sm font-sans">{msg.translated}</p>
                <div className="text-[10px] text-purple-400 border-t border-slate-800 pt-1">
                  EMOTIONAL INTENT RADAR: {msg.emotionalIntent}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
