import React, { useState, useEffect, useRef } from "react";
import { 
  Headphones, 
  Sliders, 
  Cpu, 
  Zap, 
  Activity, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Shield, 
  Database, 
  Eye, 
  TrendingUp, 
  Compass, 
  Crosshair, 
  Waves, 
  Grid, 
  Wrench,
  ChevronRight,
  Info
} from "lucide-react";

// Paths to generated images (which exist in the assets directory)
const heroShotImg = "/src/assets/images/headphones_hero_shot_1783898636566.jpg";
const robotUsingImg = "/src/assets/images/robot_using_headphones_1783898648571.jpg";
const explodedViewImg = "/src/assets/images/headphones_exploded_view_1783898660463.jpg";
const robotActionImg = "/src/assets/images/robot_action_headphones_1783898670892.jpg";

interface HeadphonesVisualizerProps {
  onRobotStateChange?: (state: any) => void;
  videoIsStill: boolean;
}

interface ExplodedPart {
  id: number;
  name: string;
  desc: string;
  material: string;
  weight: string;
}

const EXPLODED_PARTS: ExplodedPart[] = [
  {
    id: 1,
    name: "Precision Dynamic Drivers",
    desc: "40mm custom bio-cellulose diaphragms delivering ultra-low distortion, responsive transients, and rich low-frequency acoustic replication.",
    material: "Graphite composite & copper-clad aluminum wire",
    weight: "14.2g"
  },
  {
    id: 2,
    name: "Neodymium Ring Magnets",
    desc: "N52 grade high-flux density rare earth magnets delivering up to 1.4 Tesla of magnetic energy for ultimate driver responsiveness.",
    material: "Sintered Neodymium-Iron-Boron (NdFeB)",
    weight: "8.5g"
  },
  {
    id: 3,
    name: "Tightly Wound Voice Coils",
    desc: "Ultra-lightweight high-tension copper voice coils tuned for extreme rapid response and precise mechanical stability in high humidity.",
    material: "Oxygen-Free Copper (99.99%)",
    weight: "2.1g"
  },
  {
    id: 4,
    name: "Stacked Multilayer PCBs",
    desc: "Integrated neural-processing microcircuits for active sound dampening and zero-latency audio routing designed for robot telemetry.",
    material: "6-layer fiberglass reinforced FR-4 with gold contacts",
    weight: "5.4g"
  },
  {
    id: 5,
    name: "Acoustically Tuned Damping Foam",
    desc: "Micro-porous absorption layers placed in the rear chamber to completely cancel standing waves and minimize cabinet resonance.",
    material: "Reticulated open-cell polyurethane polymer",
    weight: "1.1g"
  },
  {
    id: 6,
    name: "Zero-Gravity Frame & Hinges",
    desc: "Ergonomic, lightweight suspended arch skeleton with articulated hinges allowing 180° rotation for robust and fatigue-free wear.",
    material: "Aircraft-grade T6 titanium alloy & sandblasted steel",
    weight: "82.0g"
  },
  {
    id: 7,
    name: "Plush Memory-Foam Padding",
    desc: "Decompression seals wrapped in ultra-soft protein leather, adapting to the skull anatomy to isolate external dystopian noise.",
    material: "Viscoelastic polyurethane & high-density vegan leather",
    weight: "22.5g"
  },
  {
    id: 8,
    name: "Miniature Hex-Screws Array",
    desc: "Precision micro-machined anchoring hardware providing high structural integrity against extreme vibrational shockwaves.",
    material: "Hardened black-oxide alloy steel",
    weight: "0.2g each"
  }
];

export default function HeadphonesVisualizer({ onRobotStateChange, videoIsStill }: HeadphonesVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "using" | "action" | "exploded">("hero");
  const [selectedPartId, setSelectedPartId] = useState<number>(1);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Dynamic telemetry states
  const [telemetry, setTelemetry] = useState({
    acousticIsolation: 98.4,
    neuralSync: 88.5,
    zeroGForce: 0.08,
    frequencyRange: "4Hz - 48,000Hz",
    batteryEfficiency: 100,
    structuralStress: 1.2
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fluctuating real-time telemetry numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        acousticIsolation: +(98.4 + (Math.random() - 0.5) * 0.2).toFixed(2),
        neuralSync: +(88.5 + Math.sin(Date.now() / 2000) * 1.5 + (Math.random() - 0.5) * 0.3).toFixed(1),
        zeroGForce: +(0.08 + Math.cos(Date.now() / 1500) * 0.02).toFixed(3),
        structuralStress: +(1.2 + Math.abs(Math.sin(Date.now() / 1000) * 0.1)).toFixed(2)
      }));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Drag and Drop files for Background Video
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file (mp4, webm, mov, etc.).");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    
    // Dispatch custom event to BackgroundVideo
    const customEvent = new CustomEvent("udo_bg_video_changed", {
      detail: {
        url: localUrl,
        opacity: 0.7,
        blur: false,
        play: true,
        mute: true
      }
    });
    window.dispatchEvent(customEvent);

    setSuccessMsg(`"${file.name}" has been loaded as your active cinematic backdrop!`);
    
    if (onRobotStateChange) {
      onRobotStateChange("HAPPY");
    }

    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const selectedPart = EXPLODED_PARTS.find(p => p.id === selectedPartId) || EXPLODED_PARTS[0];

  return (
    <div className="space-y-6" id="headphones-visualizer-root">
      
      {/* GLOWING HERO HEADLINE */}
      <div className="flex flex-col gap-1.5 animate-fade-in relative z-20">
        <span className="text-[10px] font-mono uppercase text-teal-400 tracking-widest font-bold flex items-center gap-1">
          <Sparkles size={12} className="animate-pulse text-teal-400" />
          AETHER-X // HIGH-END SPECIFICATION HARNESS
        </span>
        <h2 className="text-3xl font-light text-white font-serif tracking-wide">
          Interactive Headphone Assembly & Telemetry
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Examine the zero-gravity matte-black over-ear headphones built for autonomic processors inside the ruinscape. Hover, analyze, and synthesize acoustics live on top of the dynamic stream.
        </p>
      </div>

      {/* CORE GRID: Two Columns (Gallery + Diagnostics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        
        {/* LEFT COLUMN: The Interactive Gallery Scene (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          
          {/* Top Selection Bar */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex flex-wrap justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-2">
              <Headphones size={13} className="text-teal-400 animate-pulse" />
              <span className="text-slate-200 font-bold tracking-wider">AETHER-X ZERO GRAVITY DESIGN</span>
            </div>
            
            {/* Tab Toggles */}
            <div className="flex gap-1 mt-2 sm:mt-0">
              <button
                onClick={() => {
                  setActiveTab("hero");
                  if (onRobotStateChange) onRobotStateChange("WAVING");
                }}
                className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold transition-all ${
                  activeTab === "hero" 
                    ? "bg-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                    : "hover:bg-white/5 border border-transparent text-slate-400"
                }`}
              >
                Hero Shot
              </button>
              <button
                onClick={() => {
                  setActiveTab("using");
                  if (onRobotStateChange) onRobotStateChange("THINKING");
                }}
                className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold transition-all ${
                  activeTab === "using" 
                    ? "bg-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                    : "hover:bg-white/5 border border-transparent text-slate-400"
                }`}
              >
                Robot Interface
              </button>
              <button
                onClick={() => {
                  setActiveTab("action");
                  if (onRobotStateChange) onRobotStateChange("SURPRISED");
                }}
                className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold transition-all ${
                  activeTab === "action" 
                    ? "bg-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                    : "hover:bg-white/5 border border-transparent text-slate-400"
                }`}
              >
                In Motion
              </button>
              <button
                onClick={() => {
                  setActiveTab("exploded");
                  if (onRobotStateChange) onRobotStateChange("HAPPY");
                }}
                className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold transition-all ${
                  activeTab === "exploded" 
                    ? "bg-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                    : "hover:bg-white/5 border border-transparent text-slate-400"
                }`}
              >
                Exploded View
              </button>
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            
            {/* 1. Hero Shot Scene */}
            {activeTab === "hero" && (
              <div className="relative w-full h-full animate-fade-in">
                <img 
                  src={heroShotImg} 
                  alt="Aether-X Headphones Hero Shot"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hotspots Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Hotspot 1: Adjustable Frame */}
                <div className="absolute top-[25%] left-[50%] -translate-x-1/2 z-10 group/hot">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center cursor-pointer animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-slate-950/80 border border-teal-400 flex items-center justify-center cursor-pointer z-10 relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 p-2.5 rounded-lg w-48 shadow-xl opacity-0 group-hover/hot:opacity-100 transition-opacity pointer-events-none text-[10px] text-slate-300 font-sans">
                    <strong className="text-white block font-mono mb-0.5 font-bold uppercase tracking-wider">Zero-Gravity Arch Frame</strong>
                    Lightweight suspended magnesium-titanium structural headband prevents fatigue.
                  </div>
                </div>

                {/* Hotspot 2: Brushed hinge */}
                <div className="absolute top-[48%] left-[32%] z-10 group/hot">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center cursor-pointer animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-slate-950/80 border border-teal-400 flex items-center justify-center cursor-pointer z-10 relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                  <div className="absolute top-7 left-0 bg-slate-900/90 backdrop-blur-md border border-white/10 p-2.5 rounded-lg w-48 shadow-xl opacity-0 group-hover/hot:opacity-100 transition-opacity pointer-events-none text-[10px] text-slate-300 font-sans">
                    <strong className="text-white block font-mono mb-0.5 font-bold uppercase tracking-wider">Brushed Steel Hinge</strong>
                    Dual-axis mechanical articulation provides 180-degree swiveling earcups.
                  </div>
                </div>

                {/* Hotspot 3: Cushion */}
                <div className="absolute top-[68%] left-[52%] z-10 group/hot">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center cursor-pointer animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-slate-950/80 border border-teal-400 flex items-center justify-center cursor-pointer z-10 relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 p-2.5 rounded-lg w-48 shadow-xl opacity-0 group-hover/hot:opacity-100 transition-opacity pointer-events-none text-[10px] text-slate-300 font-sans">
                    <strong className="text-white block font-mono mb-0.5 font-bold uppercase tracking-wider">Plush Memory-Foam</strong>
                    Wrapping soft vegan protein leather providing acoustic isolation up to -42dB.
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-teal-400 bg-black/75 px-2 py-1 rounded border border-teal-500/20">
                  SCENE: ISOLATED HERO SHOT // CHAMBER: DEEP BLACK VOID
                </div>
              </div>
            )}

            {/* 2. Robot Using Scene */}
            {activeTab === "using" && (
              <div className="relative w-full h-full animate-fade-in">
                <img 
                  src={robotUsingImg} 
                  alt="Weathered Robot wearing headphones"
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Audio Frequency Spectrum Overlays */}
                <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-white/10 p-3 rounded-xl w-56 font-mono text-[9px] text-slate-300 space-y-1.5 shadow-2xl">
                  <div className="flex justify-between items-center text-[10px] text-teal-400 font-bold border-b border-white/10 pb-1 mb-1.5">
                    <span>NEURAL TELEMETRY LINK</span>
                    <span className="animate-pulse">● LOCKED</span>
                  </div>
                  <p>ACOUSTIC PRESSURE: 84.2 dB</p>
                  <p>PROCESSOR SYNC RATE: {telemetry.neuralSync}%</p>
                  <p>AETHER RESONANCE: ACTIVE</p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${telemetry.neuralSync}%` }} />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-teal-400 bg-black/75 px-2 py-1 rounded border border-teal-500/20">
                  SCENE: COGNITIVE DEEP PROCESS // LOCATION: DERELICT CONTROL CORE
                </div>
              </div>
            )}

            {/* 3. Robot in Motion Scene */}
            {activeTab === "action" && (
              <div className="relative w-full h-full animate-fade-in">
                <img 
                  src={robotActionImg} 
                  alt="Humanoid Robot sprinting with headphones clutched firmly"
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Velocity HUD widget overlay */}
                <div className="absolute bottom-16 right-4 bg-slate-950/85 backdrop-blur-md border border-white/10 p-3 rounded-xl font-mono text-[9.5px] text-slate-300 space-y-1">
                  <p className="font-bold text-amber-400 uppercase tracking-wide">SHOCKPROOF VERDICT</p>
                  <p>IMPACT G-FORCE: {(telemetry.zeroGForce * 12).toFixed(2)} G</p>
                  <p>STRUCTURAL INTEGRITY: 99.8%</p>
                  <p>STRESS THRESHOLD: {telemetry.structuralStress} N/mm</p>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-teal-400 bg-black/75 px-2 py-1 rounded border border-teal-500/20">
                  SCENE: KINETIC CANYON SPRINT // WEATHER: VOLUMETRIC ASH & SMOKE
                </div>
              </div>
            )}

            {/* 4. Exploded Blueprint Scene */}
            {activeTab === "exploded" && (
              <div className="relative w-full h-full animate-fade-in flex flex-col md:flex-row">
                
                {/* Left side image */}
                <div className="w-full md:w-3/5 h-full relative">
                  <img 
                    src={explodedViewImg} 
                    alt="Floating isometric exploded view"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating alignment markers mapping selectedPartId */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full relative">
                      {/* Interactive hot-zones for parts */}
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                        const topOffsets = ["45%", "52%", "40%", "33%", "60%", "25%", "68%", "18%"];
                        const leftOffsets = ["55%", "48%", "62%", "35%", "50%", "45%", "58%", "40%"];
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedPartId(idx)}
                            className="absolute p-1 w-6 h-6 rounded-full border bg-black/60 backdrop-blur-sm flex items-center justify-center text-[10px] font-mono pointer-events-auto transition-all cursor-pointer z-20"
                            style={{ 
                              top: topOffsets[idx - 1], 
                              left: leftOffsets[idx - 1],
                              borderColor: selectedPartId === idx ? "#2dd4bf" : "rgba(255,255,255,0.25)",
                              color: selectedPartId === idx ? "#2dd4bf" : "#fff",
                              boxShadow: selectedPartId === idx ? "0 0 10px rgba(45,212,191,0.3)" : "none"
                            }}
                          >
                            {idx}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side interactive descriptor */}
                <div className="w-full md:w-2/5 bg-[#05070a]/90 border-l border-white/10 p-4 font-mono flex flex-col justify-between text-xs space-y-4 overflow-y-auto">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase text-slate-500 block tracking-widest">
                      CHASSIS COMPONENTS DECONSTRUCTION:
                    </span>
                    
                    {/* List of components */}
                    <div className="grid grid-cols-2 gap-1 pb-2 border-b border-white/5">
                      {EXPLODED_PARTS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPartId(p.id)}
                          className={`text-left px-2 py-1 rounded text-[10px] transition-colors ${
                            selectedPartId === p.id 
                              ? "bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30"
                              : "hover:bg-white/5 text-slate-400 border border-transparent"
                          }`}
                        >
                          {p.id}. {p.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-1 animate-fade-in" key={selectedPart.id}>
                      <div className="flex justify-between items-center text-[11px] font-bold text-white">
                        <span>COMPONENT 0{selectedPart.id}</span>
                        <span className="text-teal-400 font-mono text-[10px] uppercase">READY</span>
                      </div>
                      <h4 className="font-bold text-teal-300 font-sans text-sm tracking-wide">
                        {selectedPart.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {selectedPart.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg space-y-1 text-[10px] text-slate-400">
                    <p>MATERIAL INTEGRITY: <strong className="text-slate-200">{selectedPart.material}</strong></p>
                    <p>SPECIFIC CORE MASS: <strong className="text-slate-200">{selectedPart.weight}</strong></p>
                  </div>
                </div>

              </div>
            )}

            {/* Quick telemetry coordinates */}
            <div className="absolute top-3 left-3 pointer-events-none font-mono text-[9px] text-teal-400 bg-black/85 px-2.5 py-1.5 rounded border border-teal-500/20 space-y-0.5 z-10">
              <p>AUDIO_CORES: ONLINE</p>
              <p>NOISE_ISOLATION: {telemetry.acousticIsolation} dB</p>
              <p>STREAM_FEED: {videoIsStill ? "PAUSED (STILL MOUSE)" : "STREAMING (ACTIVE MOUSE)"}</p>
            </div>
          </div>

          {/* Core Specs Footer Grid */}
          <div className="p-4 bg-[#05070a]/60 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono">
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">Acoustic Isolation</span>
              <span className="text-[13px] font-bold text-teal-300 font-sans">{telemetry.acousticIsolation} dB</span>
            </div>
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">Neural Sync Capacity</span>
              <span className="text-[13px] font-bold text-white font-sans">{telemetry.neuralSync}%</span>
            </div>
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">Response Latency</span>
              <span className="text-[13px] font-bold text-indigo-400 font-sans">0.02 ms</span>
            </div>
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">Ergonomic Weight</span>
              <span className="text-[13px] font-bold text-white font-sans">Zero-Gravity (Suspended)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sound Synthesizer & Drag-and-Drop Video Uploader (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A: Drag and Drop Backdrop Loader */}
          <div 
            className={`p-6 rounded-2xl border text-center transition-all flex flex-col justify-center items-center backdrop-blur-md relative overflow-hidden ${
              dragActive 
                ? "border-teal-400 bg-teal-950/20 shadow-[0_0_20px_rgba(45,212,191,0.2)]" 
                : "border-white/10 bg-black/60 hover:border-white/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Subtle light bar accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/30 to-indigo-500/30" />

            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 mb-4 animate-bounce">
              <Upload size={22} />
            </div>

            <h3 className="text-sm font-bold text-white font-sans mb-1 uppercase tracking-wide">
              EIGENES BACKDROP-VIDEO HOCHLADEN
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[210px] mx-auto mb-4 font-sans">
              Ziehen Sie Ihre Videodatei per Drag & Drop hierher oder wählen Sie sie manuell aus, um den 3D-Aether-Videohintergrund zu wechseln.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <button
              onClick={triggerUploadClick}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black font-sans text-[10.5px] uppercase rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              Video auswählen
            </button>

            {successMsg && (
              <div className="mt-4 p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-300 font-mono animate-fade-in flex items-center gap-1.5 justify-center">
                <Shield size={11} className="shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* C: Dystopian Background Context widget */}
          <div className="p-5 bg-teal-950/10 border border-teal-500/20 rounded-2xl text-[11px] space-y-3 relative">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase font-mono text-[9px]">
              <Shield size={12} className="animate-pulse" />
              <span>Dystopian World Protocol</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              In a post-apocalyptic era governed by autonomous humanoid automations, the zero-gravity headphones represent a rare artifact of pure sensory preservation, processing neural frequency streams directly without loss.
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER COGNITIVE CAUSAL CORRELATION MATRIX */}
      <div className="bg-black/60 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md relative z-20">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5 border-b border-white/5 pb-2 mb-4 uppercase tracking-wider">
          <Database size={15} className="text-teal-400" />
          Neural Cognitive Processing Matrix
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          
          <div className="p-3 bg-black/30 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Hologram Sector 01</span>
              <span className="text-teal-400">Ready</span>
            </div>
            <h4 className="font-bold text-white font-sans text-sm">Autonomous Audio Calibration</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              The headphone system matches acoustic decibels to biological-exoskeletal stress curves. It ensures that critical audio alerts are fed without brain-wave overload.
            </p>
          </div>

          <div className="p-3 bg-black/30 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Hologram Sector 02</span>
              <span className="text-indigo-400">Simulating</span>
            </div>
            <h4 className="font-bold text-white font-sans text-sm">Vibrational Shock Absorption</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Constructed out of aircraft-grade T6 titanium, the headphones can resist high structural shockwaves (up to 12G) occurring during leaps over city debris.
            </p>
          </div>

          <div className="p-3 bg-black/30 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Hologram Sector 03</span>
              <span className="text-amber-400">Synchronized</span>
            </div>
            <h4 className="font-bold text-white font-sans text-sm">Zero-Gravity Spatial Comfort</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Due to its innovative suspended headband mechanics, the headset distributes its weight evenly, making it weightless during swift robot maneuvers.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
