import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, AlertCircle, Heart } from "lucide-react";
import { RobotState } from "./GlobalSystemContext";

interface RobotMascotProps {
  state: RobotState;
  messageBubble?: string;
  onBubbleClick?: () => void;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

export default function RobotMascot({
  state,
  messageBubble,
  onBubbleClick,
  size = "md",
  showBadge = false,
  className = ""
}: RobotMascotProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Track cursor coordinates relative to the robot to animate head rotation globally
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      animFrameRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const robotCenterX = rect.left + rect.width / 2;
        const robotCenterY = rect.top + rect.height / 2;

        // Normalize between -1 and 1
        const dx = (clientX - robotCenterX) / (window.innerWidth / 2);
        const dy = (clientY - robotCenterY) / (window.innerHeight / 2);

        setMousePos({ 
          x: Math.max(-1, Math.min(1, dx)), 
          y: Math.max(-1, Math.min(1, dy)) 
        });
      });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const scaleFactor = size === "sm" ? 0.75 : size === "lg" ? 1.25 : 1;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center p-2 select-none pointer-events-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "800px" }}
    >
      {/* Dr. Altenberg's Robot Chat Bubble (if active) */}
      {messageBubble && (
        <div
          onClick={onBubbleClick}
          className="absolute -top-14 max-w-[200px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-800 shadow-xl cursor-pointer hover:border-teal-500 transition-all z-20 group animate-fade-in"
        >
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
          <p className="line-clamp-3 text-left leading-relaxed font-sans">
            {messageBubble}
          </p>
          <span className="text-[8px] text-teal-600 font-extrabold block mt-1 text-right group-hover:underline">
            Antworten &rarr;
          </span>
        </div>
      )}

      {/* Futuristic Mechanical Robot Body */}
      <div 
        className="relative w-28 h-32 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          transform: `
            translateY(${state === "IDLE" ? Math.sin(Date.now() / 600) * 4 : 0}px)
            scale(${state === "SURPRISED" || state === "ERROR" ? 1.15 : state === "THINKING" || state === "PROCESSING" ? 0.95 : 1})
            rotate(${state === "ATTENTION" ? "-8deg" : state === "ERROR" ? "10deg" : "0deg"})
          `,
        }}
      >
        {/* Glowing floating platform base */}
        <div className={`absolute -bottom-2 w-16 h-3 rounded-full blur-sm animate-pulse ${
          state === "ERROR" ? "bg-red-500/30" : state === "SUCCESS" ? "bg-teal-400/40" : "bg-teal-500/20"
        }`} />
        
        {/* Antennas */}
        <div className="absolute top-1 flex justify-between w-6 h-4">
          <div 
            className={`w-[1px] h-4 bg-teal-500/60 origin-bottom transition-all ${
              state === "THINKING" || state === "PROCESSING" ? "animate-pulse h-6 bg-purple-400" : state === "ATTENTION" ? "h-6 bg-cyan-400" : ""
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full -ml-[2px] -mt-[1px] ${
              state === "THINKING" || state === "PROCESSING" ? "bg-purple-400 animate-ping" : state === "ATTENTION" ? "bg-cyan-300 animate-pulse" : "bg-teal-400"
            }`} />
          </div>
          <div className="w-[1px] h-4 bg-teal-500/60 origin-bottom">
            <div className={`w-1.5 h-1.5 rounded-full -ml-[2px] -mt-[1px] ${state === "ATTENTION" ? "bg-cyan-300" : "bg-teal-400"}`} />
          </div>
        </div>

        {/* Head */}
        <div
          className={`relative w-16 h-14 bg-slate-900 border-2 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            state === "THINKING" || state === "PROCESSING"
              ? "border-purple-500/70 shadow-purple-500/30"
              : state === "SURPRISED" || state === "ERROR"
              ? "border-red-500/70 shadow-red-500/30"
              : state === "HAPPY" || state === "SUCCESS"
              ? "border-teal-400/80 shadow-teal-400/40"
              : state === "ATTENTION"
              ? "border-cyan-400/80 shadow-cyan-400/40"
              : "border-teal-500/60 shadow-teal-500/30"
          }`}
          style={{
            transform: `
              rotateX(${mousePos.y * -15}deg)
              rotateY(${mousePos.x * 20}deg)
              translateY(${state === "THINKING" ? "2px" : "0px"})
            `,
          }}
        >
          {/* Eyes Visor Screen */}
          <div className="relative w-12 h-8 bg-slate-950 border border-white/5 rounded-lg overflow-hidden flex items-center justify-around px-1">
            {/* Pulsing visor grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />

            {/* Simulated Digital Eyes */}
            {state === "SURPRISED" || state === "ERROR" ? (
              <>
                {/* Huge wide surprised/error eyes */}
                <div className="w-3.5 h-3.5 rounded-full border border-red-500 bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                <div className="w-3.5 h-3.5 rounded-full border border-red-500 bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              </>
            ) : state === "THINKING" || state === "PROCESSING" ? (
              <>
                {/* Horizontal scanning light bars */}
                <div className="w-4 h-1 bg-purple-400 rounded shadow-[0_0_6px_rgba(192,132,252,0.8)] animate-pulse" />
                <div className="w-4 h-1 bg-purple-400 rounded shadow-[0_0_6px_rgba(192,132,252,0.8)] animate-pulse" />
              </>
            ) : state === "HAPPY" || state === "SUCCESS" ? (
              <>
                {/* Happy curved eyes */}
                <div className="text-teal-300 font-mono text-sm leading-none animate-bounce select-none">^</div>
                <div className="text-teal-300 font-mono text-sm leading-none animate-bounce select-none">^</div>
              </>
            ) : state === "SPEAKING" ? (
              <>
                {/* Sound wave visor dots */}
                <div className="w-2.5 h-3.5 bg-teal-400 rounded shadow-[0_0_8px_rgba(45,212,191,0.8)] scale-y-125 transition-transform" />
                <div className="w-2.5 h-2 bg-teal-400 rounded shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-ping" />
              </>
            ) : (
              <>
                {/* Normal cyan looking eyes */}
                <div 
                  className="w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_6px_rgba(45,212,191,0.8)] transition-transform"
                  style={{ transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 1.5}px)` }}
                />
                <div 
                  className="w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_6px_rgba(45,212,191,0.8)] transition-transform"
                  style={{ transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 1.5}px)` }}
                />
              </>
            )}
          </div>
          
          {/* Dr. Altenberg's Signature Monocle or Badge (Aesthetic Detail) */}
          <div className="absolute -top-1.5 -right-1.5 bg-teal-500 text-slate-950 rounded-full text-[7px] px-1 font-bold tracking-widest border border-slate-950 uppercase select-none">
            UDO
          </div>
        </div>

        {/* Neck */}
        <div className="w-3 h-2 bg-slate-700 border-x border-teal-500/30 z-[1]" />

        {/* Torso/Body */}
        <div 
          className={`relative w-12 h-14 bg-slate-900 border border-teal-500/40 rounded-xl flex items-center justify-center overflow-hidden shadow-md`}
        >
          {/* Cyber Chest Core Light */}
          <div 
            className={`w-6 h-6 rounded-full border border-teal-500/40 flex items-center justify-center transition-all duration-300 ${
              state === "THINKING" || state === "PROCESSING" ? "bg-purple-500/10 border-purple-500" :
              state === "SURPRISED" || state === "ERROR" ? "bg-red-500/10 border-red-500" :
              state === "HAPPY" || state === "SUCCESS" ? "bg-teal-400/20 border-teal-400" :
              "bg-teal-500/10 border-teal-500"
            }`}
          >
            <div 
              className={`w-3.5 h-3.5 rounded-full shadow-inner animate-pulse ${
                state === "THINKING" || state === "PROCESSING" ? "bg-purple-400 animate-ping" :
                state === "SURPRISED" || state === "ERROR" ? "bg-red-400 animate-ping" :
                state === "HAPPY" || state === "SUCCESS" ? "bg-teal-300" :
                "bg-teal-400"
              }`} 
            />
          </div>

          {/* Glowing panel lines */}
          <div className="absolute top-1 left-2 w-1.5 h-0.5 bg-teal-500/30" />
          <div className="absolute top-1 right-2 w-1.5 h-0.5 bg-teal-500/30" />
          <div className="absolute bottom-1 left-3 w-6 h-0.5 bg-teal-500/20" />
        </div>

        {/* Arms */}
        {/* Left Arm */}
        <div 
          className="absolute left-4 top-[62px] w-3 h-10 origin-top bg-slate-800 border-l border-teal-500/30 rounded-full transition-all duration-500"
          style={{
            transform: `
              rotate(${state === "HAPPY" || state === "SUCCESS" ? "-150deg" : state === "WAVING" ? "-140deg" : state === "PROCESSING" ? "-60deg" : "-15deg"} )
            `,
          }}
        >
          {/* Joint */}
          <div className="w-2.5 h-2.5 bg-slate-700 rounded-full mt-[-1px] mx-auto border border-teal-500/40" />
          {/* Hand Claw */}
          <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-700 rounded-sm border-t border-teal-500/30" />
        </div>

        {/* Right Arm */}
        <div 
          className="absolute right-4 top-[62px] w-3 h-10 origin-top bg-slate-800 border-r border-teal-500/30 rounded-full transition-all duration-500"
          style={{
            transform: `
              rotate(${state === "HAPPY" || state === "SUCCESS" ? "150deg" : state === "POINTING" || state === "EXPORT" ? "110deg" : state === "PROCESSING" ? "60deg" : "15deg"} )
            `,
          }}
        >
          {/* Joint */}
          <div className="w-2.5 h-2.5 bg-slate-700 rounded-full mt-[-1px] mx-auto border border-teal-500/40" />
          {/* Hand Claw */}
          <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-700 rounded-sm border-t border-teal-500/30" />
        </div>
      </div>

      {/* State Badge for Diagnostic Feedback (Interactive element) */}
      {showBadge && (
        <div className="mt-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/60 border border-white/5 backdrop-blur-sm shadow text-[9px] uppercase tracking-wider font-mono text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${
            state === "THINKING" || state === "PROCESSING" ? "bg-purple-400 animate-ping" :
            state === "SPEAKING" ? "bg-teal-400 animate-pulse" :
            state === "SURPRISED" || state === "ERROR" ? "bg-red-400 animate-bounce" :
            state === "HAPPY" || state === "SUCCESS" ? "bg-teal-300 animate-pulse" :
            "bg-teal-500"
          }`} />
          U.D.O. Modus: <strong className="text-teal-300 font-semibold">{state}</strong>
        </div>
      )}
    </div>
  );
}
