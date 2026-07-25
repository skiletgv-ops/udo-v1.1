'use client'

import React, { useState } from "react";
import { SplineScene } from "./splite";
import { Card } from "./Card";
import { Spotlight } from "./spotlight";
import { Maximize2, Minimize2, Sparkles, Cpu, ArrowRight } from "lucide-react";

export function SplineSceneBasic() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`transition-all duration-500 ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950 p-6 md:p-12 flex flex-col justify-between h-screen w-screen overflow-hidden"
          : "relative w-full h-[550px] bg-slate-950/95 rounded-[32px] border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col justify-between"
      }`}
    >
      {/* Background Spotlight for premium realism */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-80"
        size={400}
      />

      {/* Floating Header / Control Bar */}
      <div className="relative z-20 flex justify-between items-center w-full pb-4 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-teal-400 font-extrabold uppercase flex items-center gap-1">
            <Cpu size={12} /> U.D.O. Core Engine 1.0
          </span>
        </div>
        
        {/* Full Screen Toggle Button */}
        <button
          onClick={toggleFullScreen}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-teal-500/55 transition-all duration-300 cursor-pointer flex items-center gap-1.5 font-bold shadow-lg"
          title={isFullScreen ? "Vollbild beenden" : "Vollbildmodus"}
        >
          {isFullScreen ? (
            <>
              <Minimize2 size={14} className="text-teal-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Muster-Ansicht</span>
            </>
          ) : (
            <>
              <Maximize2 size={14} className="text-teal-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Vollbild</span>
            </>
          )}
        </button>
      </div>

      {/* Main Responsive Split Layout (Text and Sphere) */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch gap-6 md:gap-12 min-h-0 relative z-10 py-6">
        
        {/* Left content: Text Pane */}
        <div className="flex-1 flex flex-col justify-center text-left min-w-0 pr-0 md:pr-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono font-bold w-fit mb-4">
            <Sparkles size={12} className="animate-pulse text-teal-400" />
            Interactive 3D Diagnostik-Schnittstelle
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-50 via-slate-100 to-slate-400 uppercase font-sans">
            Interaktive <br />
            <span className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">3D-Diagnose</span>
          </h1>
          
          <p className="mt-4 text-slate-300 text-xs md:text-sm leading-relaxed font-sans max-w-xl">
            Erleben Sie die Evolution der computergestützten Befundung. Drücken Sie die linke Maustaste und ziehen Sie die Sphäre, um die medizinische Feldkomplexität frei im Raum zu manipulieren. Dieses 3D-Konsil verknüpft neuronale Diagnosedaten in Echtzeit.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="block text-slate-500 text-[8px] uppercase">Rendermodus</span>
              WebGL 2.0 Realtime
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="block text-slate-500 text-[8px] uppercase">Licht & Tiefe</span>
              Physisch-basiert (PBR)
            </div>
          </div>
        </div>

        {/* Right content: 3D Sphere Pane with visual depth & realism touches */}
        <div className="flex-1 relative rounded-2xl border border-slate-800 bg-slate-950/45 overflow-hidden flex items-center justify-center min-h-[220px] md:min-h-0">
          
          {/* Atmospheric Background Ambient Glow behind the sphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_65%)] blur-2xl pointer-events-none" />
          
          {/* Grounding Shadow mimicking a real contact light falloff */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-4 bg-teal-950/60 rounded-full blur-md animate-pulse pointer-events-none border-t border-teal-500/10" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-32 h-2 bg-teal-900/50 rounded-full blur-sm animate-pulse pointer-events-none" />

          {/* Spline Canvas Container */}
          <div className="w-full h-full relative z-10">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>

          {/* Subtle depth vignette overlay (Pristine visual finish) */}
          <div className="absolute inset-0 pointer-events-none border border-slate-800/80 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />
        </div>

      </div>

      {/* Floating Footer Indicators */}
      <div className="relative z-20 flex justify-between items-center w-full pt-3 border-t border-slate-800/60 text-[9px] font-mono text-slate-500 shrink-0">
        <span>© 2026 U.D.O. SYSTEM ENGINE v2.0</span>
        <span>DRÜCKEN & ZIEHEN ZUM ROTIEREN</span>
      </div>
    </div>
  );
}
