import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  Sliders, 
  Check, 
  Activity, 
  Cpu, 
  Clock, 
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Bookmark,
  TrendingUp,
  CornerDownRight,
  Shield,
  Eye,
  Database
} from "lucide-react";
import { Patient } from "../types";

interface VideoAnalysePortalProps {
  onRobotStateChange?: (state: any) => void;
  activePatient?: Patient | null;
  setActivePatient?: (patient: Patient) => void;
}

const PRESET_VIDEOS = [
  {
    name: "U.D.O. Cybernetic Walk (Default)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-robot-walking-in-a-futuristic-city-43187-large.mp4",
    desc: "3D-Gangbildanalyse zur Beurteilung segmentaler Instabilitäten der Lendenwirbelsäule (L4/L5).",
    category: "Gait Analysis"
  },
  {
    name: "Sci-Fi Neon Grid Tunnel",
    url: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-futuristic-tunnel-with-neon-lights-38854-large.mp4",
    desc: "Aether-Grid Tunnel zur Kalibrierung des neuronalen Diagnose-Prozessors.",
    category: "System Calibration"
  },
  {
    name: "Aether Flow Hologram Core",
    url: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-numbers-31907-large.mp4",
    desc: "Echtzeit-Hologramm der konsensbasierten KI-Datenströme von U.D.O.",
    category: "Hologram Core"
  },
];

export default function VideoAnalysePortal({ onRobotStateChange, activePatient, setActivePatient }: VideoAnalysePortalProps) {
  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem("udo_bg_video_url") || PRESET_VIDEOS[0].url;
  });
  const [videoName, setVideoName] = useState("U.D.O. Cybernetic Walk (Default)");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Video render config
  const [opacity, setOpacity] = useState(40);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(110);
  const [blur, setBlur] = useState(false);
  const [hueRotate, setHueRotate] = useState(0);

  // Simulation Metrics
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    syncRate: 99.4,
    spineLoad: 42.5,
    l4l5Angle: 12.8,
    gaitSymmetry: 96.2,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync video source change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Video block:", err));
      }
    }
  }, [videoUrl]);

  // Telemetry noise updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        fps: Math.random() > 0.85 ? Math.floor(Math.random() * 5) + 57 : prev.fps,
        syncRate: +(prev.syncRate + (Math.random() - 0.5) * 0.1).toFixed(2),
        spineLoad: +(42.5 + Math.sin(Date.now() / 1500) * 8.4 + (Math.random() - 0.5) * 1.5).toFixed(1),
        l4l5Angle: +(12.8 + Math.cos(Date.now() / 1200) * 2.2).toFixed(1),
        gaitSymmetry: +(96.2 + (Math.random() - 0.5) * 0.3).toFixed(1),
      }));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Overlay Canvas 3D landmarker tracking simulation
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let mousePos = { x: canvas.width / 2, y: canvas.height / 2 };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();

    // Landmark nodes
    const nodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      baseX: Math.random(),
      baseY: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      label: ["L3 Spine", "L4 Disc", "L5 Root", "S1 Joint", "Left Hip", "Right Hip", "Knee L", "Knee R", "Ankle L", "Ankle R", "Center Gravity", "Pelvis Line"][i],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!isPlaying) {
        animFrameId = requestAnimationFrame(draw);
        return;
      }

      const time = Date.now() / 1000;
      const computedNodes = nodes.map(n => {
        // Animate based on sine waves and some drift
        const dx = Math.sin(time + n.id * 1.5) * 0.08;
        const dy = Math.cos(time * 0.8 + n.id * 2) * 0.08;
        return {
          x: (n.baseX + dx) * canvas.width,
          y: (n.baseY + dy) * canvas.height,
          label: n.label,
        };
      });

      // 1. Draw grid background lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.06)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Connect spinal vertebrae nodes
      ctx.strokeStyle = "rgba(99, 102, 241, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Draw a "spine" line
      for (let i = 0; i < 4; i++) {
        const node = computedNodes[i];
        if (i === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      }
      ctx.stroke();

      // 3. Connect legs and hips
      ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
      ctx.lineWidth = 1.2;
      // Hip line
      ctx.beginPath();
      ctx.moveTo(computedNodes[4].x, computedNodes[4].y);
      ctx.lineTo(computedNodes[5].x, computedNodes[5].y);
      ctx.stroke();

      // Left leg
      ctx.beginPath();
      ctx.moveTo(computedNodes[4].x, computedNodes[4].y);
      ctx.lineTo(computedNodes[6].x, computedNodes[6].y);
      ctx.lineTo(computedNodes[8].x, computedNodes[8].y);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(computedNodes[5].x, computedNodes[5].y);
      ctx.lineTo(computedNodes[7].x, computedNodes[7].y);
      ctx.lineTo(computedNodes[9].x, computedNodes[9].y);
      ctx.stroke();

      // 4. Draw node dots
      computedNodes.forEach((node, i) => {
        const isSpine = i < 4;
        ctx.fillStyle = isSpine ? "#6366f1" : "#2dd4bf";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node aura pulse
        ctx.strokeStyle = isSpine ? "rgba(99, 102, 241, 0.3)" : "rgba(45, 212, 191, 0.3)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6 + Math.sin(time * 5 + i) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Node labels
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "8px monospace";
        ctx.fillText(node.label, node.x + 8, node.y + 3);
      });

      // 5. User scanning crosshair targeting the mouse
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair center dot
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw dashed crosshair lines
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, canvas.height);
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(canvas.width, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Coordinates text next to cursor
      ctx.fillStyle = "#3b82f6";
      ctx.font = "8px monospace";
      ctx.fillText(`X:${Math.round(mousePos.x)} Y:${Math.round(mousePos.y)}`, mousePos.x + 20, mousePos.y - 10);
      ctx.fillText(`LANDMARK_SCANNER_READY`, mousePos.x + 20, mousePos.y + 18);

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [isPlaying]);

  // Audio frequency graph visualizer simulation
  useEffect(() => {
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    canvas.width = 180;
    canvas.height = 36;

    const drawAudio = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() / 400;
      const barCount = 18;
      const barWidth = 6;
      const gap = 3;

      ctx.fillStyle = "rgba(59, 130, 246, 0.65)";
      for (let i = 0; i < barCount; i++) {
        let height = 0;
        if (isPlaying) {
          height = Math.abs(Math.sin(time + i * 0.4)) * 26 + (Math.random() * 4);
          if (isMuted) {
            height = Math.abs(Math.sin(time * 0.1 + i * 0.15)) * 4 + 1; // quiet state
          }
        } else {
          height = 1; // flatline
        }

        const x = i * (barWidth + gap);
        const y = canvas.height - height;

        // Custom gradient for frequency
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, "#2dd4bf"); // teal
        grad.addColorStop(1, "#3b82f6"); // blue

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, height);
      }

      animFrameId = requestAnimationFrame(drawAudio);
    };

    drawAudio();

    return () => cancelAnimationFrame(animFrameId);
  }, [isPlaying, isMuted]);

  // Video local drag and drop handlers
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
      alert("Bitte wählen Sie eine gültige Videodatei (mp4, webm, mov etc.)");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setVideoName(file.name);
    setIsLocalFile(true);
    setSuccessMsg(`"${file.name}" erfolgreich geladen!`);
    
    if (onRobotStateChange) {
      onRobotStateChange("HAPPY");
    }

    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Set as global background
  const applyAsBackground = () => {
    const customEvent = new CustomEvent("udo_bg_video_changed", {
      detail: {
        url: videoUrl,
        opacity: opacity / 100,
        blur: blur,
        play: isPlaying,
        mute: isMuted
      }
    });
    window.dispatchEvent(customEvent);
    
    // Notify user in mascot state
    if (onRobotStateChange) {
      onRobotStateChange("WAVING");
    }
    setSuccessMsg("Dieses Video wurde als globaler 3D-Aether-Hintergrund angewendet!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(err => console.log(err));
      setIsPlaying(!isPlaying);
      
      // Sync global background if matched
      window.dispatchEvent(new CustomEvent("udo_bg_video_changed", {
        detail: { play: !isPlaying }
      }));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      
      window.dispatchEvent(new CustomEvent("udo_bg_video_changed", {
        detail: { mute: !isMuted }
      }));
    }
  };

  return (
    <div className="space-y-6" id="video-analyse-portal-root">
      
      {/* HEADER STATEMENT */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase text-teal-400 tracking-widest font-semibold flex items-center gap-1">
          <Sparkles size={11} className="animate-pulse text-teal-400" />
          AETHER-VIDEO-PORTAL & LANDMARK-TRACKING
        </span>
        <h2 className="text-2xl font-light text-white font-serif tracking-wide">
          Echtzeit-Video-Dossier & 3D-Biomechanik-Analyse
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Laden Sie beliebige Patientenvideos zur automatischen Bewegungserfassung hoch oder konfigurieren Sie das Cyberpunk-Interface. Nutzen Sie die Videofrequenz zur Generierung medizinischer Kausalzusammenhänge.
        </p>
      </div>

      {/* THREE BENTO PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* PANEL 1: Immersive Video Viewport (Col span 8) */}
        <div className="lg:col-span-8 flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
          {/* Viewport Top Bar */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-2">
              <Video size={13} className="text-teal-400 animate-pulse" />
              <span className="text-slate-200 font-bold max-w-[240px] truncate">{videoName}</span>
              {isLocalFile && (
                <span className="px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[9px] text-teal-300">
                  Lokal geladen
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-slate-400 text-[10px]">
              <div className="flex items-center gap-1">
                <Activity size={10} className="text-indigo-400" />
                <span>3D LANDMARK TRACER: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Actual Video Canvas Center Container */}
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
            
            {/* The underlying video element */}
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover transition-all"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${blur ? "blur(5px)" : ""} hue-rotate(${hueRotate}deg)`
              }}
            />

            {/* Overlaid canvas for landmark skeletal tracking lines */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-10"
            />

            {/* Scanning Laser Line effect */}
            {isPlaying && (
              <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_8px_#2dd4bf] z-20 pointer-events-none animate-scan-laser top-0" />
            )}

            {/* Quick calibration overlay overlay */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none font-mono text-[9px] text-teal-400 bg-black/75 px-2.5 py-1.5 rounded border border-teal-500/20 space-y-0.5">
              <p>SYS.MATRIX: LOCKED</p>
              <p>L4/L5 COMPRESSION: {telemetry.spineLoad > 45 ? "HIGH" : "NORMAL"}</p>
              <p>SYNC_RATE: {telemetry.syncRate}%</p>
            </div>

            {/* Overlay controller for video controls */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                Ebene 3D-Rekonstruktion
              </span>

              <button
                onClick={applyAsBackground}
                className="px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold font-mono text-[9px] uppercase tracking-wider transition-colors"
              >
                Als App-Hintergrund anwenden
              </button>
            </div>
          </div>

          {/* Video Control Sliders & presets */}
          <div className="p-4 bg-[#05070a]/60 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            
            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider">
                Video-Presets wählen:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESET_VIDEOS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setVideoUrl(p.url);
                      setVideoName(p.name);
                      setIsLocalFile(false);
                    }}
                    className={`w-full text-left p-2 rounded border text-[11px] transition-all flex justify-between items-center ${
                      videoUrl === p.url
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                        : "bg-black/20 hover:bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div>
                      <span className="font-bold font-sans block text-[11.5px]">{p.name}</span>
                      <span className="text-[9.5px] opacity-75">{p.desc}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] uppercase">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom visual filter sliders */}
            <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-200 text-[10px] uppercase tracking-wider border-b border-white/5 pb-1 mb-2">
                <Sliders size={12} className="text-teal-400" />
                <span>3D Rendereinstellungen (Echtzeit Filters)</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Hintergrund Deckkraft</span>
                  <span className="text-teal-300 font-bold">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={opacity}
                  onChange={(e) => setOpacity(+e.target.value)}
                  className="w-full accent-teal-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Helligkeit</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(+e.target.value)}
                    className="w-full accent-teal-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Kontrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(+e.target.value)}
                    className="w-full accent-teal-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px]">
                <button
                  onClick={() => {
                    setBrightness(100);
                    setContrast(110);
                    setOpacity(40);
                    setBlur(false);
                    setHueRotate(0);
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
                >
                  <RotateCcw size={10} />
                  Zurücksetzen
                </button>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={blur}
                    onChange={(e) => setBlur(e.target.checked)}
                    className="rounded border-white/10 text-teal-500 bg-black/40 focus:ring-0 cursor-pointer"
                  />
                  <span>Gaußscher Weichzeichner</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 2: File Upload Box & Biomechanics (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A: File Dropper Box */}
          <div 
            className={`p-6 rounded-2xl border text-center transition-all flex flex-col justify-center items-center ${
              dragActive 
                ? "border-teal-400 bg-teal-950/20 shadow-[0_0_20px_rgba(45,212,191,0.15)]" 
                : "border-white/10 bg-black/40 hover:border-white/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 mb-4 animate-bounce">
              <Upload size={22} />
            </div>

            <h3 className="text-sm font-bold text-white font-sans mb-1">
              Eigenes Patientenvideo hochladen
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-normal max-w-[200px] mx-auto mb-4 font-sans">
              Ziehen Sie Ihre Videodatei per Drag & Drop hierher oder wählen Sie sie manuell aus.
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
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black font-sans text-[10.5px] uppercase rounded-xl transition-all shadow-md shadow-teal-500/10"
            >
              Datei auswählen
            </button>

            {successMsg && (
              <div className="mt-4 p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-300 font-mono animate-fade-in flex items-center gap-1 justify-center">
                <Check size={11} className="shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* B: Interactive Telemetry HUD Card */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider font-semibold">
                BIOMECHANIK TELEMETRIE
              </span>
              <Cpu size={12} className="text-indigo-400" />
            </div>

            {/* Core gauges */}
            <div className="space-y-3.5 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Vertebrale Last L4/L5</span>
                  <span className={`font-bold ${telemetry.spineLoad > 48 ? "text-amber-400" : "text-emerald-400"}`}>
                    {telemetry.spineLoad} N/cm²
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${telemetry.spineLoad > 48 ? "bg-amber-400" : "bg-emerald-400"}`}
                    style={{ width: `${Math.min(100, telemetry.spineLoad * 1.5)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Gangsymmetrie (YTD)</span>
                  <span className="text-teal-300 font-bold">{telemetry.gaitSymmetry}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-400 transition-all duration-300"
                    style={{ width: `${telemetry.gaitSymmetry}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2 bg-black/20 border border-white/5 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">Rotationswinkel</span>
                  <span className="text-[13px] font-bold text-white font-sans">{telemetry.l4l5Angle}°</span>
                </div>
                <div className="p-2 bg-black/20 border border-white/5 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">KI Sync-Rate</span>
                  <span className="text-[13px] font-bold text-teal-300 font-sans">{telemetry.syncRate}%</span>
                </div>
              </div>
            </div>

            {/* Animated FFT audio voice frequencies */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-[9.5px] font-mono text-slate-400 mb-2">
                <span>Vokale Frequenzanalyse (Patient)</span>
                <span className="text-emerald-400 text-[8px] animate-pulse">● SAMPLING</span>
              </div>
              <div className="flex justify-center bg-black/30 p-2 rounded-xl border border-white/5">
                <canvas ref={audioCanvasRef} className="h-9 w-full" />
              </div>
            </div>
          </div>

          {/* C: Medical guidelines integration info */}
          <div className="p-4 bg-indigo-950/15 border border-indigo-500/20 rounded-2xl text-[11px] space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase font-mono text-[9px]">
              <Shield size={12} />
              <span>Geringere Fehlerquote durch Kriterien</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Das Einspielen von klinischem Bild- oder Videomaterial in d'r Kölner Cloud ermöglicht U.D.O. einen automatischen Abgleich der Funktionsdefizite nach den <strong className="text-slate-200">AWMF Leitlinien für Begutachtung</strong>.
            </p>
          </div>

        </div>

      </div>

      {/* DETAILED DIAGNOSTIC TIMELINE / RESULTS SYNC */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5 border-b border-white/5 pb-2 mb-4">
          <Database size={15} className="text-teal-400" />
          Extraktion medizinischer Sequenzen aus dem Videomaterial
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          
          <div className="p-3 bg-black/20 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Sequenz 01 - 04:12</span>
              <span className="text-teal-400">Erkannt</span>
            </div>
            <h4 className="font-bold text-white font-sans">Vermeidungshaltung beim Hebeversuch</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Patient bückt sich unter erkennbarer Schonung der Lendenwirbelsäule mit gerundetem Brustbereich, um Krafteinflüsse am betroffenen Segment L4/L5 links auszuweichen.
            </p>
          </div>

          <div className="p-3 bg-black/20 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Sequenz 02 - 08:35</span>
              <span className="text-teal-400">Erkannt</span>
            </div>
            <h4 className="font-bold text-white font-sans">Eingeschränkte Beugung (Lasègue-Entsprechung)</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Schrittweite links im Gangbild um ca. 12% verkürzt. Der Winkel des linken Hüftgelenks erreicht in der Schwungphase maximal 38 Grad, was mit der klinischen Hypästhesie L5 korreliert.
            </p>
          </div>

          <div className="p-3 bg-black/20 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase">
              <span>Sequenz 03 - 12:50</span>
              <span className="text-indigo-400">Symmetrie-Check</span>
            </div>
            <h4 className="font-bold text-white font-sans">Reflex-Korrelation & Gehstreckenanalyse</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Die im Video dokumentierte, verlangsamte Fußhebung links bei Hindernissen belegt die motorische Schwäche, welche die gutachtliche MdE-Einstufung von 20% zusätzlich untermauert.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
