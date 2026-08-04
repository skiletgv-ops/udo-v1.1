import React, { useState } from 'react';
import {
  User,
  Calendar,
  Zap,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Battery,
  Lock
} from 'lucide-react';

export function PersonalSecurityPage() {
  // Calendar state
  const [cognitiveLoadScore, setCognitiveLoadScore] = useState(38); // 38% Optimal
  const [calendarSlots, setCalendarSlots] = useState([
    { time: '08:00 - 09:30', title: 'Deep Focus: Complex Gutachten Review', load: 'HIGH (Auto-Scheduled)', type: 'FOCUS' },
    { time: '10:00 - 11:30', title: 'Patient Consultations (5 Patients)', load: 'MEDIUM', type: 'CLINIC' },
    { time: '13:00 - 14:00', title: 'Neurolinguistic Energy Recharge Block', load: 'REST', type: 'REST' }
  ]);

  // Smart Home Energy state
  const [solarPower, setSolarPower] = useState(6.4); // kW
  const [batteryLevel, setBatteryLevel] = useState(88); // %
  const [energyTraded, setEnergyTraded] = useState(false);

  // Dark Web Threat Scanner state
  const [scanningBreaches, setScanningBreaches] = useState(false);
  const [breachResult, setBreachResult] = useState<any>(null);

  const handleTradeEnergy = () => {
    setEnergyTraded(true);
    setTimeout(() => {
      setSolarPower((prev) => +(prev + 0.8).toFixed(1));
    }, 500);
  };

  const handleScanDarkWeb = () => {
    setScanningBreaches(true);
    setTimeout(() => {
      setBreachResult({
        scanTarget: 'dr.bongartz@praxis-koeln.de',
        breachFound: false,
        darkWebStatus: 'SECURE: No credential leaks found in known dark web databases.',
        encryptionGrade: 'AES-256 Quantum Shielded'
      });
      setScanningBreaches(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 font-sans select-none text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <User size={16} />
            <span>PHASE 4: PERSONAL CONCIERGE & SECURITY VAULT</span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white">
            Neurolinguistic Calendar & Smart Home Energy
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-amber-950/60 border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-full">
          <Zap size={14} />
          <span>SMART ENERGY AUTO-TRADE</span>
        </div>
      </div>

      {/* Grid: Neurolinguistic Calendar & Smart Home Energy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Neurolinguistic Calendar (#13) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Neurolinguistic Calendar (#13)</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              Cognitive Load Score: {cognitiveLoadScore}%
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Auto-schedules deep work and clinical blocks based on real-time neural fatigue and cognitive capacity scores.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {calendarSlots.map((slot, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold block">{slot.time}</span>
                  <span className="text-slate-100 font-bold">{slot.title}</span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    slot.type === 'FOCUS'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : slot.type === 'REST'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {slot.load}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Smart Home Energy & Grid Trading Simulator (#14) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-amber-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Smart Home Energy & Grid Auto-Trade (#14)</span>
            </h2>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded">
              Solar + Battery
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">SOLAR INPUT</span>
              <span className="text-amber-400 font-bold text-lg">{solarPower} kW</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">BATTERY LEVEL</span>
              <span className="text-emerald-400 font-bold text-lg">{batteryLevel}%</span>
            </div>
          </div>

          <button
            onClick={handleTradeEnergy}
            className="w-full py-3 rounded-xl bg-slate-900 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap size={16} />
            <span>{energyTraded ? 'Excess Energy Traded to Local Grid (+€ 4.20/hr)' : 'Auto-Trade Excess Solar Energy to Grid'}</span>
          </button>
        </div>
      </div>

      {/* Grid: W3C Decentralized ID & Dark Web Threat Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 3: W3C Decentralized ID Profile (#15) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>W3C Decentralized ID Profile (#15)</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              DID:UDO:2032
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[10px]">VERIFIABLE CREDENTIAL IDENTIFIER:</div>
            <div className="text-cyan-400 font-bold break-all">did:udo:2032:0x9f821a4bc3802e12908f</div>
            <div className="text-emerald-400 text-[10px] pt-1">Status: Active • Cryptographically Verified</div>
          </div>
        </div>

        {/* Card 4: Dark Web Threat Scanner (#25) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-red-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Dark Web Threat Scanner (#25)</span>
            </h2>
            <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded">
              Breach Defense
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Continuous threat telemetry monitoring dark web databases for credential compromises and identity leaks.
          </p>

          <button
            onClick={handleScanDarkWeb}
            disabled={scanningBreaches}
            className="w-full py-3 rounded-xl bg-slate-900 border border-red-500/50 hover:border-red-400 text-red-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Search size={16} />
            <span>{scanningBreaches ? 'Scanning Dark Web Repositories...' : 'Run Dark Web Breach Audit'}</span>
          </button>

          {breachResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 font-mono text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 size={16} />
                <span>{breachResult.darkWebStatus}</span>
              </div>
              <div className="text-[10px] text-slate-400">Target: {breachResult.scanTarget}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
