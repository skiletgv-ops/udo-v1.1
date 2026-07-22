import React, { useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  Coins, 
  Award, 
  ArrowUpRight, 
  CheckCircle,
  Sparkles,
  HelpCircle,
  Database,
  Calendar,
  Zap,
  DollarSign
} from "lucide-react";
import { motion } from "motion/react";

export default function ExecutiveDashboard() {
  // ROI & Financial Savings Calculator states
  const [calculationPeriod, setCalculationPeriod] = useState<"quartal" | "year">("quartal");
  const [reportsPerMonth, setReportsPerMonth] = useState(25);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [manualDocHours, setManualDocHours] = useState(82); // default 82 hours manual workload
  const [aiDocHours, setAiDocHours] = useState(2); // AI-assisted duration

  // Calculations
  const periodMultiplier = calculationPeriod === "quartal" ? 3 : 12;
  const casesInPeriod = reportsPerMonth * periodMultiplier;
  
  // Time saved per case and total period
  const timeSavedPerCase = Math.max(0, manualDocHours - aiDocHours);
  const totalHoursSavedPeriod = Math.round(casesInPeriod * timeSavedPerCase);
  const totalHoursManualPeriod = Math.round(casesInPeriod * manualDocHours);
  const totalHoursAiPeriod = Math.round(casesInPeriod * aiDocHours);
  
  // Financial savings calculations
  const grossMoneySavedPeriod = Math.round(totalHoursSavedPeriod * hourlyRate);
  const softwareLicenseCostPeriod = calculationPeriod === "quartal" ? 499 * 3 : 499 * 12;
  const netFinancialGain = Math.max(0, grossMoneySavedPeriod - softwareLicenseCostPeriod);
  const efficiencyGainPercent = manualDocHours > 0 
    ? Math.round(((manualDocHours - aiDocHours) / manualDocHours) * 100) 
    : 0;

  // Pricing plans
  const pricingPlans = [
    {
      name: "Basic",
      price: "199 €",
      period: "Monat",
      target: "Einzelgutachter",
      features: [
        "6-Phasen-Workflow",
        "Dossier-Upload (Volltext)",
        "UDO AI Belegbeurteilung",
        "DIN A4 Drucklayouts",
        "Kryptografische Signatur (Vorschau)"
      ],
      glow: "border-white/5"
    },
    {
      name: "Kleine Praxis",
      price: "499 €",
      period: "Monat",
      target: "Gemeinschaftspraxen",
      features: [
        "Alles aus Basic + v3.0 Upgrades",
        "Integrierter Kalender-Sync & SMS",
        "Kanban-Workflow Taskboard",
        "E-Rezept & Interaktions-Check",
        "AWMF & ICD-10 Wissensdatenbank",
        "Bestandsverwaltung & Meldebestand"
      ],
      glow: "border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    },
    {
      name: "Große Klinik",
      price: "1.499 €",
      period: "Monat",
      target: "Ärztehäuser & Krankenhäuser",
      features: [
        "Alles aus Kleine Praxis",
        "Echte EGVP-Gerichtsmailbox-Anbindung",
        "Gemeinschaftliche Multi-Modell-Abstimmung",
        "Eigene Serverinstanzen in Deutschland",
        "Schnittstellen zur Praxis-EDV (HL7/GDT)",
        "24/7 Notfall-Support & Schulung"
      ],
      glow: "border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="executive-roi-analytics-dashboard">
      
      {/* PREMIUM ANIMATED KPI CARD: REAL-TIME TIME SAVINGS COMPARISON */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-teal-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Clock size={14} className="text-teal-400 animate-pulse" />
                <span>DYNAMIC PIPELINE TIME-SAVINGS MODULE</span>
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">
                Echtzeit-Vergleich: Manuelle Erstellung vs. U.D.O. KI-Pipeline
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold self-start md:self-auto">
              <Zap size={14} className="text-emerald-400" />
              <span>{efficiencyGainPercent}% ZEIT-EFFIZIENZ-STEIGERUNG</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1: Manual Baseline */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                1. Manuelle Dokumentation (Basis)
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl md:text-4xl font-black text-slate-300 font-mono">{manualDocHours} Std.</span>
                <span className="text-xs text-slate-400 font-mono">/ Fall</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Manuelle Aktenanalyse, Diktat, Abtippen &amp; manuelle S2k-Prüfung ohne KI.
              </p>
            </div>

            {/* KPI 2: AI Pipeline Duration */}
            <div className="p-5 bg-teal-500/10 border border-teal-500/30 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] font-mono text-teal-300 uppercase block font-bold flex items-center gap-1">
                <Sparkles size={12} className="text-teal-400" />
                2. U.D.O. KI-Pipeline
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl md:text-4xl font-black text-teal-300 font-mono">{aiDocHours} Std.</span>
                <span className="text-xs text-teal-400 font-mono">/ Fall</span>
              </div>
              <p className="text-[10px] text-teal-200/80 mt-2 leading-relaxed">
                S2k-Extraktion, automatische MdE-Matrix, Sprach-Diktat &amp; KI-Validierung.
              </p>
            </div>

            {/* KPI 3: Real-Time Time Saved Card */}
            <div className="p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 rounded-2xl relative overflow-hidden shadow-lg">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block font-black tracking-wider">
                ⚡ Ersparnis Pro Gutachten
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">{timeSavedPerCase} Std.</span>
                <span className="text-xs text-emerald-300 font-mono font-bold">eingespart</span>
              </div>
              <p className="text-[10px] text-emerald-200/90 mt-2 font-mono font-semibold">
                Entspricht {(timeSavedPerCase * hourlyRate).toLocaleString("de-DE")} € Arbeitszeit-Freisetzung pro Akte.
              </p>
            </div>

          </div>

        </div>
      </motion.div>

      {/* 2.0 Market Overview Whitepaper & INTERACTIVE FINANCIAL SAVINGS CALCULATOR (QUARTAL OR YEAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Market Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-950/80 border border-white/10 rounded-2xl space-y-3.5 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <TrendingUp size={12} className="animate-pulse text-blue-400" />
                <span>Globale Marktanalyse (Whitepaper v2.0)</span>
              </span>

              <h3 className="text-sm font-black text-white font-sans uppercase tracking-tight">
                Der vertikale KI-Boom in der Medizin
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Laut Weißbuch wuchs der globale Markt für KI-gestützte klinische Dokumentation von <strong>3,11 Mrd. USD (2024)</strong> auf <strong>4,01 Mrd. USD (2025)</strong> &ndash; das entspricht einer jährlichen Wachstumsrate (CAGR) von 28,8%. Bis 2034 wird ein Wachstum auf 10,50 Milliarden Dollar prognostiziert.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Marktwert 2034</span>
                <strong className="text-lg text-blue-300 font-mono">10,5 Mrd. $</strong>
                <p className="text-[8px] text-slate-500 font-mono">Generative KI Dokumentation</p>
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Durchschnitts-CAGR</span>
                <strong className="text-lg text-indigo-300 font-mono">33,3 %</strong>
                <p className="text-[8px] text-slate-500 font-mono">Wachstum pro Jahr</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Money Savings Calculator: Quartal or Year */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 bg-slate-950/90 border border-teal-500/30 rounded-2xl space-y-5 shadow-2xl relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Coins size={14} className="text-teal-400" />
                <span>GEWINN &amp; ERSPARNIS KALKULATOR (QUARTAL / JAHR)</span>
              </span>

              {/* Period Selector Toggle */}
              <div className="flex items-center bg-slate-900 border border-white/15 rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setCalculationPeriod("quartal")}
                  className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    calculationPeriod === "quartal"
                      ? "bg-teal-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pro Quartal (3 Mon.)
                </button>
                <button
                  onClick={() => setCalculationPeriod("year")}
                  className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    calculationPeriod === "year"
                      ? "bg-teal-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pro Jahr (12 Mon.)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Controls Column 1 */}
              <div className="space-y-3.5">
                {/* Fall-Anzahl pro Monat */}
                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-[11px]">
                    <span className="text-slate-300">Gutachten / Monat:</span>
                    <strong className="text-teal-300 font-mono">{reportsPerMonth} Fälle</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={reportsPerMonth}
                    onChange={(e) => setReportsPerMonth(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-white/10"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block">
                    = {casesInPeriod} Fälle pro {calculationPeriod === "quartal" ? "Quartal" : "Jahr"}
                  </span>
                </div>

                {/* Stundensatz */}
                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-[11px]">
                    <span className="text-slate-300">Facharzt Stundensatz (€):</span>
                    <strong className="text-teal-300 font-mono">{hourlyRate} € / Std.</strong>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="300"
                    step="10"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-white/10"
                  />
                </div>
              </div>

              {/* Controls Column 2 */}
              <div className="space-y-3.5">
                {/* Manuelle Stunden vs AI Stunden */}
                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-[11px]">
                    <span className="text-slate-300">Manuelle Dauer pro Fall:</span>
                    <strong className="text-slate-200 font-mono">{manualDocHours} Std.</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="2"
                    value={manualDocHours}
                    onChange={(e) => setManualDocHours(Number(e.target.value))}
                    className="w-full accent-slate-400 bg-white/10"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-[11px]">
                    <span className="text-slate-300">U.D.O. KI Dauer pro Fall:</span>
                    <strong className="text-teal-300 font-mono">{aiDocHours} Std.</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={aiDocHours}
                    onChange={(e) => setAiDocHours(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-white/10"
                  />
                </div>
              </div>

            </div>

            {/* CALCULATED OUTPUTS BOX */}
            <div className="p-4 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-slate-900 border border-teal-500/30 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">
                  Zeit-Ersparnis ({calculationPeriod === "quartal" ? "Pro Quartal" : "Pro Jahr"})
                </span>
                <strong className="text-xl text-teal-300 font-mono font-black">{totalHoursSavedPeriod.toLocaleString("de-DE")} Std.</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">
                  Brutto-Finanzgewinn
                </span>
                <strong className="text-xl text-emerald-400 font-mono font-black">{grossMoneySavedPeriod.toLocaleString("de-DE")} €</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">
                  Reingewinn (nach Lizenz)
                </span>
                <strong className="text-xl text-teal-300 font-mono font-black">{netFinancialGain.toLocaleString("de-DE")} €</strong>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Subscription Pricing Models */}
      <div className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Abonnement &amp; Lizenzen</span>
          <h3 className="text-base font-black text-white font-sans uppercase">U.D.O. Preismodelle &amp; Tiers</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Flexible Lizenzen zugeschnitten auf Ihre Praxisgröße. Upgrade-Möglichkeit auf die Kleine Praxis Edition für v3.0 Features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all duration-300 ${plan.glow}`}
            >
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{plan.target}</span>
                  <h4 className="text-base font-black text-white font-sans uppercase">{plan.name}</h4>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono">{plan.price}</span>
                  <span className="text-[10px] text-slate-400 font-mono">/ {plan.period}</span>
                </div>

                <div className="w-full h-[1px] bg-white/10" />

                <ul className="space-y-2 text-xs text-slate-300">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-blue-400 mt-1 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer">
                Plan wählen &amp; 30 Tage testen
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

