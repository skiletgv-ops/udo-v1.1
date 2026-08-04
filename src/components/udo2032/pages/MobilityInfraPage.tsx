import React, { useState } from 'react';
import {
  Plane,
  Server,
  AlertOctagon,
  Radio,
  Zap,
  Globe,
  Wind,
  CheckCircle2,
  ShieldCheck,
  Flame
} from 'lucide-react';

export function MobilityInfraPage() {
  // Crisis Mode state
  const [crisisActive, setCrisisActive] = useState(false);

  // UAM Drone Routes state
  const [droneFleet, setDroneFleet] = useState([
    { id: 'DRONE-01', mission: 'Urgent Medical Sample Transport (Köln-Nord -> Uni-Klinik)', status: 'IN_FLIGHT', battery: '92%', eta: '4 min' },
    { id: 'DRONE-02', mission: 'Organ Box Delivery (Airport -> Transplant Center)', status: 'STANDBY', battery: '100%', eta: 'Ready' }
  ]);

  // Carbon Compute state
  const [gridCarbonIntensity, setGridCarbonIntensity] = useState(142); // gCO2/kWh
  const [computeJobShifted, setComputeJobShifted] = useState(true);

  return (
    <div className="space-y-8 font-sans select-none text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Plane size={16} />
            <span>PHASE 6: MOBILITY, INFRASTRUCTURE & DISASTER</span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white">
            Urban Air Mobility & Emergency Conductor
          </h1>
        </div>

        {/* Crisis Mode Toggle */}
        <button
          onClick={() => setCrisisActive(!crisisActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
            crisisActive
              ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse'
              : 'bg-slate-900 border border-red-500/50 text-red-400 hover:bg-red-950'
          }`}
        >
          <AlertOctagon size={16} />
          <span>{crisisActive ? 'CRISIS MODE ACTIVE (OFFLINE MESH)' : 'ACTIVATE CRISIS MODE'}</span>
        </button>
      </div>

      {/* Crisis Banner if active */}
      {crisisActive && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 font-mono text-xs flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <div className="flex items-center gap-3">
            <Radio size={20} className="animate-ping text-red-400" />
            <div>
              <span className="font-bold text-white block">EMERGENCY DISASTER MESH ACTIVE (#29, #30)</span>
              <span className="text-red-300 text-[11px]">Local peer-to-peer mesh routing enabled. Zero cloud dependency verified.</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-red-900 px-3 py-1 rounded">SAT-LINK ONLINE</span>
        </div>
      )}

      {/* Grid: Urban Air Mobility & Energy-Aware Compute */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Urban Air Mobility (UAM) Drone Planner (#21) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Plane className="w-4 h-4 text-cyan-400" />
              <span>Urban Air Mobility (UAM) Planner (#21)</span>
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              Vertiport Telemetry
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Autonomous flight route planning for medical payload drones between clinic nodes and vertiports.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {droneFleet.map((drone) => (
              <div key={drone.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-400">{drone.id}</span>
                  <span className="text-emerald-400">{drone.status}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{drone.mission}</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Battery: {drone.battery}</span>
                  <span>ETA: {drone.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Energy-Aware Compute & Carbon Intensity Scheduler (#22) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-emerald-300 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Energy-Aware Green Compute (#22)</span>
            </h2>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
              Carbon Aware
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs space-y-1">
            <span className="text-slate-400 text-[10px] block">GRID CARBON INTENSITY</span>
            <span className="text-emerald-400 font-bold text-xl">{gridCarbonIntensity} gCO2/kWh</span>
            <span className="text-slate-300 text-[11px] block pt-1">
              {computeJobShifted ? 'Heavy LLM fine-tuning jobs shifted to 100% hydro-electric node.' : 'Standard scheduling.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
