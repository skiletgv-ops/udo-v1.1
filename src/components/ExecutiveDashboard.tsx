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
  Database
} from "lucide-react";

export default function ExecutiveDashboard() {
  // ROI Calculator states
  const [reportsPerMonth, setReportsPerMonth] = useState(25);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [hoursWithoutUdo, setHoursWithoutUdo] = useState(10);
  const [hoursWithUdo, setHoursWithUdo] = useState(2);

  // Calculations
  const timeSavedPerReport = Math.max(0, hoursWithoutUdo - hoursWithUdo);
  const totalTimeSavedMonth = reportsPerMonth * timeSavedPerReport;
  const financialBenefitMonth = totalTimeSavedMonth * hourlyRate;
  const annualSavings = financialBenefitMonth * 12;

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
      
      {/* 2.0 Market Overview Whitepaper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Executive summary and global growth numbers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-3.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <TrendingUp size={12} className="animate-pulse" />
              <span>Globale Marktanalyse (Whitepaper v2.0)</span>
            </span>

            <h3 className="text-sm font-black text-white font-sans uppercase tracking-tight">Der vertikale KI-Boom in der Medizin</h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Laut Weißbuch wuchs der globale Markt für KI-gestützte klinische Dokumentation von <strong>3,11 Mrd. USD (2024)</strong> auf <strong>4,01 Mrd. USD (2025)</strong> &ndash; das entspricht einer jährlichen Wachstumsrate (CAGR) von 28,8%. Bis 2034 wird ein Wachstum auf 10,50 Milliarden Dollar prognostiziert (33,30% CAGR).
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
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

        {/* Dynamic ROI Calculator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4 shadow-xl">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold flex items-center gap-1">
              <Coins size={12} />
              <span>Interaktiver Praxis-ROI-Kalkulator</span>
            </span>

            <h3 className="text-sm font-black text-white font-sans uppercase tracking-tight">Errechnen Sie Ihren Zeit- &amp; Finanzgewinn</h3>

            <div className="space-y-3.5 text-xs">
              {/* Slider reports per month */}
              <div className="space-y-1">
                <div className="flex justify-between font-sans text-[11px]">
                  <span className="text-slate-300">Gutachten / Monat:</span>
                  <strong className="text-blue-300">{reportsPerMonth} Fälle</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={reportsPerMonth}
                  onChange={(e) => setReportsPerMonth(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-white/10"
                />
              </div>

              {/* Slider hourly rate */}
              <div className="space-y-1">
                <div className="flex justify-between font-sans text-[11px]">
                  <span className="text-slate-300">Stundensatz (€):</span>
                  <strong className="text-blue-300">{hourlyRate} € / Std.</strong>
                </div>
                <input
                  type="range"
                  min="80"
                  max="250"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-white/10"
                />
              </div>

              {/* Slider hours with/without UDO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans">Erstellungszeit ohne U.D.O:</span>
                  <select
                    value={hoursWithoutUdo}
                    onChange={(e) => setHoursWithoutUdo(Number(e.target.value))}
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  >
                    <option value={15}>15 Stunden</option>
                    <option value={12}>12 Stunden</option>
                    <option value={10}>10 Stunden</option>
                    <option value={8}>8 Stunden</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans">Erstellungszeit mit U.D.O:</span>
                  <select
                    value={hoursWithUdo}
                    onChange={(e) => setHoursWithUdo(Number(e.target.value))}
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2 py-1.5 text-xs text-blue-300 font-bold"
                  >
                    <option value={4}>4 Stunden</option>
                    <option value={3}>3 Stunden</option>
                    <option value={2}>2 Stunden</option>
                    <option value={1}>1 Stunde</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculations outputs */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Zeit-Ersparnis (Mtl.)</span>
                <strong className="text-lg text-blue-300 font-mono font-black">{totalTimeSavedMonth} Std.</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Mehrwert / Umsatz (Mtl.)</span>
                <strong className="text-lg text-blue-300 font-mono font-black">{financialBenefitMonth.toLocaleString("de-DE")} €</strong>
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

              <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 hover:border-white/20 rounded-xl transition-all">
                Plan wählen &amp; 30 Tage testen
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
