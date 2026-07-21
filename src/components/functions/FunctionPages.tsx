import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Activity, 
  Video, 
  MessageSquare, 
  Sparkles, 
  LineChart, 
  Download, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  Database, 
  Search, 
  PenTool, 
  RefreshCw, 
  Volume2, 
  FileText,
  Clock,
  ThumbsUp
} from "lucide-react";
import { motion } from "motion/react";
import { FUNCTIONS_CARDS, Card } from "../../data/functionsData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface FunctionPagesProps {
  cardId: string;
  onBack: () => void;
}

export default function FunctionDetailPage({ cardId, onBack }: FunctionPagesProps) {
  const card = FUNCTIONS_CARDS.find(c => c.id === cardId) || FUNCTIONS_CARDS[0];

  // Common favoriting state
  const [isFav, setIsFav] = useState(false);

  // Specific state for calculators and simulations
  // n5: MdE Prozentkalkulator
  const [mdeImpairmentType, setMdeImpairmentType] = useState("wirbelsaeule");
  const [mdeRangeOfMotion, setMdeRangeOfMotion] = useState(30);
  const [mdeResult, setMdeResult] = useState(20);

  // n1: Kollateralschaden Check
  const [riskStress, setRiskStress] = useState(50);
  const [riskLiability, setRiskLiability] = useState(30);
  const [riskCompliance, setRiskCompliance] = useState(80);

  // n2: Segment L4/L5 Biomechanik-Scan
  const [biomechFlexion, setBiomechFlexion] = useState(45);
  const [biomechRotation, setBiomechRotation] = useState(15);

  // n18: Dialekt-Trost-Modul
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);

  // n13: Fachbegriffs-Buster
  const [searchBusterQuery, setSearchBusterQuery] = useState("");
  const [busterResult, setBusterResult] = useState<any>(null);

  // n19: ePA Sync
  const [epaSyncState, setEpaSyncState] = useState<"idle" | "syncing" | "done">("idle");
  const [epaProgress, setEpaProgress] = useState(0);

  // n4: QES Digital Sign Canvas
  const [qesSigned, setQesSigned] = useState(false);
  const [qesProgress, setQesProgress] = useState<"none" | "hash" | "signed">("none");

  // n8: KI Konsens Votum
  const [consensusRoundVotes, setConsensusRoundVotes] = useState({
    gemini: "KEEP",
    deepseek: "KEEP",
    gpt4o: "NEUTRAL"
  });
  const [showSynthesis, setShowSynthesis] = useState(false);

  // Calculate dynamic MdE result based on range of motion and type
  useEffect(() => {
    let result = 10;
    if (mdeImpairmentType === "wirbelsaeule") {
      result = Math.max(10, Math.min(70, Math.round((90 - mdeRangeOfMotion) * 0.8)));
    } else if (mdeImpairmentType === "knie") {
      result = Math.max(0, Math.min(50, Math.round((120 - mdeRangeOfMotion) * 0.4)));
    } else {
      result = Math.max(10, Math.min(80, Math.round(mdeRangeOfMotion * 0.6)));
    }
    setMdeResult(result);
  }, [mdeImpairmentType, mdeRangeOfMotion]);

  // Translate/Bust query
  const handleBusterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchBusterQuery.toLowerCase();
    if (query.includes("antero") || query.includes("wirbel") || query.includes("gleit")) {
      setBusterResult({
        term: "Anterolisthese",
        plain: "Wirbelgleiten nach vorne",
        explanation: "Ein Wirbel hat sich im Vergleich zum darunterliegenden Wirbel nach vorne verschoben. Häufig im Lendenwirbelbereich (L4/L5) anzutreffen. Kann Nerven einengen und Schmerzen verursachen.",
        gutachterTip: "Prüfen Sie im 3D-Video-Analyse-Modul die lumbale Flexion auf Ausweichbewegungen."
      });
    } else if (query.includes("myelo") || query.includes("nerv") || query.includes("rücken")) {
      setBusterResult({
        term: "Myelopathie",
        plain: "Schädigung des Rückenmarks",
        explanation: "Eine Schädigung des Rückenmarks, oft durch chronischen Druck (z.B. Bandscheibenvorfall oder Spinalkanalstenose). Symptome umfassen Taubheit oder Gangunsicherheit.",
        gutachterTip: "Hier liegt oft eine schwere Einschränkung der Erwerbsfähigkeit vor. MdE-Sätze liegen meist über 30%."
      });
    } else if (query.includes("lumbal") || query.includes("hexe") || query.includes("kreuz")) {
      setBusterResult({
        term: "Lumbalgie / Lumbago",
        plain: "Hexenschuss oder chronischer Kreuzschmerz",
        explanation: "Schmerzen im Bereich der Lendenwirbelsäule ohne Ausstrahlung in die Beine. Meist muskulär oder durch degenerative Veränderungen bedingt.",
        gutachterTip: "Kausalität bei Berufskrankheiten genau prüfen. Oft degenerative Vorschäden vorhanden."
      });
    } else {
      setBusterResult({
        term: searchBusterQuery || "Hemi-Spondylolisthese",
        plain: "Teilweises Wirbelgleiten mit segmentaler Instabilität",
        explanation: "Eine degenerative Gefügestörung der Wirbelsäule, bei der die Verbindung der Wirbelbögen gelockert ist.",
        gutachterTip: "Abgrenzung von Unfallereignis und anlagebedingten Verschleißschäden ist essentiell."
      });
    }
  };

  // Trigger ePA Sync simulation
  const startEpaSync = () => {
    setEpaSyncState("syncing");
    setEpaProgress(0);
    const interval = setInterval(() => {
      setEpaProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setEpaSyncState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Trigger QES process
  const triggerQesSign = () => {
    setQesProgress("hash");
    setTimeout(() => {
      setQesProgress("signed");
      setQesSigned(true);
    }, 1200);
  };

  // Cologne audio quotes
  const COLOGNE_QUOTES = [
    { key: "1", text: "Et hätt noch emmer joot jejange!", translation: "Es ist bisher noch immer gut gegangen! (Rheinisches Grundgesetz Artikel 3 - Zuversicht)" },
    { key: "2", text: "Wat fott es, es fott.", translation: "Was weg ist, ist weg. (Nutzen Sie diesen Trost bei irreversiblen Befunden)" },
    { key: "3", text: "Et es wie et es.", translation: "Es ist wie es ist. (Akzeptanz des gutachterlichen Ist-Zustandes)" },
    { key: "4", text: "Drink doch eene met!", translation: "Trink doch einen mit! (Kölsche Geselligkeit zur Entspannung des Patienten)" }
  ];

  const playCologneAudio = (key: string) => {
    setPlayingAudioKey(key);
    setTimeout(() => {
      setPlayingAudioKey(null);
    }, 1500);
  };

  // Dynamic charts for Biomechanical Scan (n2)
  const chartData = [
    { name: "Stand", stress: 100 + biomechFlexion * 1.5, pressure: 2.2 },
    { name: "Initiale Flexion", stress: 180 + biomechFlexion * 3, pressure: 3.5 },
    { name: "Maximale Neigung", stress: 250 + biomechFlexion * 4.2 + biomechRotation * 2.5, pressure: 5.1 },
    { name: "Rotationsmoment", stress: 300 + biomechRotation * 6.5, pressure: 4.2 },
    { name: "Aufrichthilfe", stress: 140 + biomechFlexion * 2, pressure: 2.8 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 select-none text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/60 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all cursor-pointer shadow-sm"
            aria-label="Back to Overview"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono font-black bg-teal-500 text-white px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                {card.numberLabel}
              </span>
              <span className="text-[10px] font-mono font-black bg-slate-100 text-slate-500 border border-slate-200/50 px-2.5 py-0.5 rounded-full uppercase">
                {card.category}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase mt-1">
              {card.title}
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">
              MODUL: {card.moduleName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFav(!isFav)}
            className={`h-10 px-4 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              isFav 
                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <Heart size={14} fill={isFav ? "#e11d48" : "none"} />
            <span>{isFav ? "Auf Favoriten-Liste" : "Als Favorit markieren"}</span>
          </button>
          
          <button className="h-10 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 text-xs font-bold shadow-md shadow-teal-600/10 active:scale-95 transition-all">
            <Download size={14} />
            <span>Bericht exportieren</span>
          </button>
        </div>
      </div>

      {/* Grid containing description and interactive workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Facts & Mascot Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card Visual Hero Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square border border-slate-200/50 shadow-md">
            <img 
              src={card.imageUrl} 
              alt={card.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[9px] font-mono text-teal-300 uppercase tracking-widest font-extrabold">ORIGINAL HOVER CARD</p>
              <h3 className="text-sm font-black text-white uppercase mt-0.5">{card.title}</h3>
            </div>
          </div>

          {/* Description & Scientific Guidelines */}
          <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/40 rounded-3xl p-5 text-left">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-black border-b border-slate-100 pb-2">
              Funktionsbeschreibung
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {card.detailedDescription || "Ein integrierter Spezialdienst des Ultimate Diagnostic Operator. Ermöglicht medizinisch-juristisch verifizierte Berechnungen, Analysen und interaktive Hilfestellung zur Erleichterung Ihres Gutachter-Alltags."}
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">DIN EN ISO 27001 Konform</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Höchster Patientendaten-Schutzstandard</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">AWMF-validierter Algorithmus</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Abgeglichen mit S2k/S3 Konsensus-Richtlinien</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dr. Altenberg / U.D.O. Advisor Note */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-950 text-white rounded-3xl p-5 text-left relative overflow-hidden shadow-lg">
            <div className="absolute top-2 right-2 text-teal-500/20 font-black text-6xl">U.D.O</div>
            <p className="text-[9px] font-mono text-teal-400 tracking-widest uppercase font-extrabold mb-1">DR. ALTENBERGS EXPERTEN-RATING</p>
            <p className="text-xs font-semibold italic text-slate-200 leading-relaxed relative z-10">
              "Liebe Kolleginnen und Kollegen, diese Funktion spart im Schnitt 18 Minuten Dokumentationszeit pro Patientengutachten. Nutzen Sie die Werkzeuge, um Rechtssicherheit bei Berufsgenossenschaften zu garantieren."
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/30">
                <Sparkles size={11} />
              </div>
              <p className="text-[9px] font-mono text-slate-300 font-bold uppercase">U.D.O. INTELLIGENCE ENGINE v2.0</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Playgrounds (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-6 shadow-xl text-left space-y-6">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
              <Activity className="text-teal-600" size={16} />
              <span>Interaktiver Arbeitsbereich</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase mt-0.5">Testen Sie die Funktion direkt mit Echtzeit-Eingabeparametern</p>
          </div>

          {/* n5: MdE-Prozentkalkulator */}
          {card.id === "5" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Schädigungsbereich</label>
                  <select 
                    value={mdeImpairmentType}
                    onChange={(e) => setMdeImpairmentType(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                  >
                    <option value="wirbelsaeule">Wirbelsäulenschaden (segmentale Instabilität)</option>
                    <option value="knie">Kniegelenksläsion (Kreuzband / Meniskus)</option>
                    <option value="schulter">Schultersteife (Impingement / Rotatorenmanschette)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Bewegungsmaß (in Grad): <span className="text-teal-600 font-mono font-black">{mdeRangeOfMotion}°</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="150" 
                    value={mdeRangeOfMotion}
                    onChange={(e) => setMdeRangeOfMotion(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-3.5"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold mt-1">
                    <span>10° (Starke Einschränkung)</span>
                    <span>150° (Freie Beweglichkeit)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic result widget */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Berechnete Minderung der Erwerbsfähigkeit</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Empfohlener Richtsatz gem. BG-Anhaltspunkten</p>
                  <div className="flex gap-2 mt-2.5">
                    <span className="text-[9px] font-mono text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded">UV-GOÄ Ziffer 70</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded">MdE Tab. 3.2</span>
                  </div>
                </div>
                <div className="text-center bg-teal-600 text-white rounded-2xl px-6 py-4 shadow-md shadow-teal-600/10 shrink-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider leading-none text-teal-200">Richtsatz</p>
                  <p className="text-3xl font-black mt-1 leading-none">{mdeResult}%</p>
                  <p className="text-[9px] font-semibold mt-1 font-mono leading-none">M.d.E.</p>
                </div>
              </div>
            </div>
          )}

          {/* n1: Kollateralschaden Check */}
          {card.id === "1" && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500">
                Geben Sie die klinischen Belastungsfaktoren des Patienten an, um eventuelle rechtliche oder organische Folgeschäden einer fehlerhaften Einstufung zu bewerten.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Physisches Stressniveau</span>
                    <span className="text-teal-600 font-mono">{riskStress}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={riskStress} 
                    onChange={(e) => setRiskStress(Number(e.target.value))}
                    className="w-full accent-teal-600" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Rechtliche Haftungsrelevanz</span>
                    <span className="text-teal-600 font-mono">{riskLiability}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={riskLiability} 
                    onChange={(e) => setRiskLiability(Number(e.target.value))}
                    className="w-full accent-teal-600" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Dokumentations-Compliance</span>
                    <span className="text-teal-600 font-mono">{riskCompliance}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={riskCompliance} 
                    onChange={(e) => setRiskCompliance(Number(e.target.value))}
                    className="w-full accent-teal-600" 
                  />
                </div>
              </div>

              {/* Collateral Risk Score Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase">Risiko-Index: {Math.round((riskStress + riskLiability + (100 - riskCompliance)) / 3)}% (MODERAT)</h4>
                  <p className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                    Achtung: Erhöhte lumbale Segmentbelastung erhöht das Risiko sekundärer Haftung. Sichern Sie das Gutachten über den 6-Phasen-Workflow zusätzlich ab.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* n2: Segment L4/L5 Biomechanik-Scan */}
          {card.id === "2" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Lumbale Beugung (Flexion): {biomechFlexion}°</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={biomechFlexion} 
                    onChange={(e) => setBiomechFlexion(Number(e.target.value))} 
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Lumbale Rotation: {biomechRotation}°</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="45" 
                    value={biomechRotation} 
                    onChange={(e) => setBiomechRotation(Number(e.target.value))} 
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Chart of vertebrae pressure */}
              <div className="h-44 w-full bg-slate-50 rounded-2xl p-3 border border-slate-150">
                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-extrabold mb-2">LASTENKURVE SEGMENT L4/L5 (MPa)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="stress" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-semibold flex items-center gap-2">
                <AlertTriangle size={14} className="text-blue-600 shrink-0" />
                <span>Kompensationslast von {Math.round(biomechFlexion * 1.8 + biomechRotation * 2.4)} N bei maximaler Flexion gemessen.</span>
              </div>
            </div>
          )}

          {/* n18: Dialekt-Trost-Modul */}
          {card.id === "18" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Die rheinische Mundart wirkt nachweislich blutdrucksenkend und baut klinische Prüfungsangst ab. Wählen Sie einen Trostspruch für Ihren geplagten Gutachten-Kandidaten aus.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOGNE_QUOTES.map((quote) => (
                  <button
                    key={quote.key}
                    onClick={() => playCologneAudio(quote.key)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all relative overflow-hidden ${
                      playingAudioKey === quote.key 
                        ? "bg-teal-50 border-teal-300 text-teal-900 shadow-md ring-2 ring-teal-500/10" 
                        : "bg-white hover:bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      playingAudioKey === quote.key ? "bg-teal-600 text-white animate-bounce" : "bg-teal-100 text-teal-800"
                    }`}>
                      <Volume2 size={15} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-tight">{quote.text}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">{quote.translation}</p>
                    </div>

                    {/* Simulated playing waves */}
                    {playingAudioKey === quote.key && (
                      <div className="absolute bottom-2 right-3 flex items-end gap-0.5 h-3">
                        <div className="w-0.5 bg-teal-600 h-2 animate-pulse" />
                        <div className="w-0.5 bg-teal-600 h-3 animate-pulse delay-75" />
                        <div className="w-0.5 bg-teal-600 h-1.5 animate-pulse delay-150" />
                        <div className="w-0.5 bg-teal-600 h-2.5 animate-pulse delay-200" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic waveform simulator */}
              <div className="bg-slate-900 text-teal-400 font-mono text-[10px] rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <Play size={13} className="text-teal-400" />
                  <span className="font-bold">AUDIO OUT: COLOGNE_PATIENT_COMFORT_HQ.WAV</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="mr-2">SPECTRUM:</span>
                  <div className="h-3 w-1.5 bg-teal-500 rounded-sm animate-pulse" />
                  <div className="h-5 w-1.5 bg-teal-500 rounded-sm animate-pulse delay-75" />
                  <div className="h-4 w-1.5 bg-teal-500 rounded-sm animate-pulse delay-150" />
                  <div className="h-2.5 w-1.5 bg-teal-500 rounded-sm animate-pulse delay-200" />
                  <div className="h-6 w-1.5 bg-teal-500 rounded-sm animate-pulse delay-300" />
                  <div className="h-3 w-1.5 bg-teal-500 rounded-sm animate-pulse delay-75" />
                </div>
              </div>
            </div>
          )}

          {/* n13: Fachbegriffs-Buster */}
          {card.id === "13" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Übersetzen Sie medizinische Begriffe und lateinische Deklinationsphrasen in allgemeinverständliche Erklärungen für Laien oder Patientenbriefe.
              </p>

              <form onSubmit={handleBusterSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="z.B. Anterolisthese, Myelopathie, Lumbalgie..." 
                    value={searchBusterQuery}
                    onChange={(e) => setSearchBusterQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-600/10"
                >
                  Busten
                </button>
              </form>

              {/* Translation Outcome */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-3 min-h-[140px] flex flex-col justify-center">
                {busterResult ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-teal-800 font-mono bg-teal-100/60 px-2 py-0.5 rounded">
                        {busterResult.term}
                      </span>
                      <span className="text-xs text-slate-400">&rarr;</span>
                      <span className="text-xs font-black text-slate-800 uppercase">
                        {busterResult.plain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {busterResult.explanation}
                    </p>
                    <div className="mt-3 p-2.5 bg-white rounded-lg border border-slate-200/60 text-[10px] text-slate-500 font-medium">
                      <strong className="text-teal-700 uppercase tracking-wider font-bold">Gutachter-Tipp:</strong> {busterResult.gutachterTip}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-4">
                    <Database size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Tippen Sie einen Begriff ein oder klicken Sie "Busten", um die Übersetzung zu starten.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* n19: ePA-Schnittstelle & Sync */}
          {card.id === "19" && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500">
                Schnittstellentest zur gematik Telematikinfrastruktur (TI). Synchronisieren Sie Patientendaten und laden Sie verschlüsselte ePA-Dokumente herunter.
              </p>

              <div className="border border-slate-150 rounded-2xl p-4 space-y-3 bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">gematik TI-Konnektor Status:</span>
                  <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                    BEREIT • ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Schnittstellen-ID:</span>
                  <span className="font-mono text-slate-400 font-bold">GEM-TI-998-EPAX-3</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">QES-Kartenprüfung (SMC-B):</span>
                  <span className="font-mono text-emerald-600 font-bold">Gültig bis 31.12.2028</span>
                </div>
              </div>

              {/* Action sync buttons */}
              {epaSyncState === "idle" && (
                <button
                  onClick={startEpaSync}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Synchronisierung Starten (ePA Pull)</span>
                </button>
              )}

              {epaSyncState === "syncing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-teal-700">
                    <span className="animate-pulse">Empfange verschlüsselte FHIR-Ressourcen...</span>
                    <span>{epaProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full transition-all duration-150" style={{ width: `${epaProgress}%` }} />
                  </div>
                </div>
              )}

              {epaSyncState === "done" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                    <CheckCircle className="text-emerald-600" size={15} />
                    <span>EPA-SYNC ERFOLGREICH ABGESCHLOSSEN</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    Es wurden 4 Berichte (1x Entlassbrief, 1x MRT-Befund LWS, 2x Laborberichte) erfolgreich heruntergeladen und dem Patientenspeicher zugewiesen.
                  </p>
                  <button 
                    onClick={() => setEpaSyncState("idle")}
                    className="mt-2 text-[10px] font-mono font-black text-teal-700 hover:underline"
                  >
                    Schnittstelle zurücksetzen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* n4: QES-Signaturerstellung */}
          {card.id === "4" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Erzeugen Sie eine qualifizierte elektronische Signatur (QES) für das Gutachten. Dies verifiziert das Dokument rechtssicher gem. eIDAS-Verordnung.
              </p>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50">
                <PenTool className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs font-bold text-slate-700">Bitte unterzeichnen Sie das Gutachten digital</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Zeichnen Sie Ihre Unterschrift mit der Maus oder dem Touchpad im Feld unten.</p>
                
                {/* Mock sign field */}
                <div className="w-full h-24 bg-white border border-slate-200 rounded-xl mt-4 relative flex items-center justify-center overflow-hidden">
                  {qesSigned ? (
                    <div className="absolute inset-0 flex items-center justify-center text-teal-600 font-mono text-xl font-bold italic animate-pulse">
                      Dr. Altenberg (QES-Verified)
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs font-semibold">Unterschriftsfeld</span>
                  )}
                  {qesSigned && (
                    <div className="absolute right-4 bottom-4 bg-teal-500 text-white rounded px-2 py-0.5 text-[8px] font-mono tracking-widest font-black">
                      SECURE STAMP
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {qesProgress === "none" && (
                <button
                  onClick={triggerQesSign}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle size={14} />
                  <span>Unterschrift & QES Hash erzeugen</span>
                </button>
              )}

              {qesProgress === "hash" && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3">
                  <RefreshCw className="animate-spin text-teal-600 shrink-0" size={16} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-teal-900">Berechne SHA-256 Gutachten-Hash...</p>
                    <p className="text-[10px] text-teal-700 font-semibold mt-0.5 font-mono">Sende Signaturanforderung an HBA-Karte</p>
                  </div>
                </div>
              )}

              {qesProgress === "signed" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                    <CheckCircle className="text-emerald-600 animate-bounce" size={15} />
                    <span>QES ERFOLGREICH ERSTELLT & EINGEBETTET</span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 space-y-0.5 bg-white p-2.5 rounded border border-slate-200/50">
                    <p>HASH: 8f3b25da10986fa88237d44158ba9c991f</p>
                    <p>SIGNATURE-ID: HBA-ALTENBERG-88942-DE</p>
                    <p>TIMESTAMP: {new Date().toISOString()}</p>
                  </div>
                  <button 
                    onClick={() => { setQesProgress("none"); setQesSigned(false); }}
                    className="text-[10px] font-mono text-teal-700 font-black hover:underline"
                  >
                    Signatur zurücksetzen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* n8: KI-Konsens-Votum */}
          {card.id === "8" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Rufen Sie die Einzel-Entscheidungsvoten der führenden Medizin-Modelle ab und führen Sie ein Konsensvotum zur diagnostischen Sicherheit durch.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase bg-slate-200/50 px-2 py-0.5 rounded-full">UDO Neuro</span>
                  <div className="my-3 text-lg font-black text-emerald-600">KEEP (BEHALTEN)</div>
                  <p className="text-[10px] text-slate-500 leading-normal">98.2% biomechanische Korrelation mit MRT-Befund.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase bg-slate-200/50 px-2 py-0.5 rounded-full">UDO Cognitive</span>
                  <div className="my-3 text-lg font-black text-emerald-600">KEEP (BEHALTEN)</div>
                  <p className="text-[10px] text-slate-500 leading-normal">Logische Kausalitätskette schließt Degeneration aus.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase bg-slate-200/50 px-2 py-0.5 rounded-full">UDO Biometrics</span>
                  <div className="my-3 text-lg font-black text-amber-600">NEUTRAL (PRÜFEN)</div>
                  <p className="text-[10px] text-slate-500 leading-normal">Möglicher Vorzustand nicht hinreichend dokumentiert.</p>
                </div>
              </div>

              {!showSynthesis ? (
                <button
                  onClick={() => setShowSynthesis(true)}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles size={14} />
                  <span>Konsens-Synthese Berechnen</span>
                </button>
              ) : (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-teal-900 uppercase">SYNTHETISIERTES KONSENS-ERGEBNIS</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mehrheitliche Annahme des Befundberichts (2:1 Votum). Das Segment L4/L5 zeigt eine traumatische Läsion, die mit hinreichender Kausalität auf das Unfallereignis zurückzuführen ist.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-[9px] font-mono text-slate-500">
                    CONFIDENCE SCORE: 94.8% | SYSTEM REVENUE BIAS: NONE
                  </div>
                  <button 
                    onClick={() => setShowSynthesis(false)}
                    className="text-[10px] font-mono text-teal-700 font-black hover:underline block"
                  >
                    Zurücksetzen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fallback layout for any other of the 20 cards */}
          {["5", "1", "2", "18", "13", "19", "4", "8"].indexOf(card.id) === -1 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Willkommen im hochauflösenden Arbeitsbereich für den integrierten Dienst <strong className="text-slate-800 uppercase">{card.title}</strong>. 
                Sämtliche Telemetriedaten werden gesichert über das rheinische Medical-Legal Gateway an den Gutachter übertragen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-150 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-700 uppercase">System-Status & Metriken</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Betriebsmodus:</span>
                    <span className="font-mono text-teal-600 font-bold">Standard-Interaktiv</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Latenzzeit:</span>
                    <span className="font-mono text-slate-500 font-bold">8ms (Echtzeit-Tunnel)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Diagnostische Konfidenz:</span>
                    <span className="font-mono text-teal-600 font-bold">99.1% (Expertisengrad)</span>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-700 uppercase">Kollaborative Aufgaben</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Dieser Dienst steht dem gesamten Gutachterteam zur Verfügung.</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle className="text-teal-600" size={15} />
                    <span className="text-xs font-bold text-slate-800">Prozess-Freigabe erteilt</span>
                  </div>
                </div>
              </div>

              {/* Mock interactive execution playground */}
              <div className="border border-slate-150 rounded-3xl p-5 space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Praxis-Simulations-Terminal</h4>
                <div className="bg-slate-900 text-teal-400 font-mono text-xs rounded-xl p-4 min-h-[100px] flex flex-col justify-between shadow-inner">
                  <div>
                    <p className="text-slate-400">// Bereite Ausführung für {card.title} vor...</p>
                    <p className="text-slate-200 mt-1">&gt; lade medizinischen Datensatz für ePA Case-ID: {Number(card.id) * 1337}...</p>
                    <p className="text-emerald-400 mt-1">&gt; status: betriebsbereit. Alle Systeme grün.</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 border-t border-slate-800 pt-2">
                    <span>v2.0 // SECURE CHANNEL</span>
                    <span>MD5_CHECKSUM_OK</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Dienst "${card.title}" wurde erfolgreich im Simulations-Schnittstellen-Tunnel ausgeführt!`)}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Dienst im Testmodus Ausführen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
