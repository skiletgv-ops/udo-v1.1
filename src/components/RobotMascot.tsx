import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, AlertCircle, Heart, Radio, Smile, Volume2, VolumeX, Music, Bot } from "lucide-react";
import { RobotState, useGlobalSystem } from "./GlobalSystemContext";
import { audioService } from "../services/audioFeedbackService";
import { MascotChatAgentModal } from "./mascot/MascotChatAgentModal";

interface RobotMascotProps {
  state: RobotState;
  messageBubble?: string;
  onBubbleClick?: () => void;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

// Doctor Ulrike Bongartz (50 y.o. Neurologist / Psychiatrist) Jokes & Easter Eggs
const DR_ULRIKE_JOKES = {
  de: [
    "Frau Dr. Ulrike, warum trinken Neurologen am liebsten Espresso? Weil er die synaptische Leitgeschwindigkeit im Thalamus ohne GOÄ-Ziffernverzögerung verdoppelt! ☕⚡",
    "Patient bei Dr. Ulrike: 'Frau Doktor, mein Gedächtnis lässt nach!' Dr. Ulrike: 'Seit wann?' Patient: 'Seit wann was?' UDO: 'Keine Sorge, ich habe das EEG in ALBIS gesichert!' 🧠💾",
    "DGKN-Leitfaden #800: Ein Muskel-Artefakt im EEG ist so lange harmlos, bis der Oberarzt eine Dissertation darüber schreibt! 🔬📝",
    "GOÄ Ziffer 800 aktiviert: Automatische Effizienzsteigerung bei der Abrechnung psychiatrischer Tiefenanalysen! 💼💶",
    "Warum sind neurologische Konsile wie Kölner Karneval? Einmal im Jahr tanzen alle Neuronen im 10-Hz-Alpha-Rhythmus! 🎭🎉",
    "Frau Dr. Ulrike, Ihr Terminkalender meldet: 3-mal Spannungsmedizin, 2-mal Gutachten und 0 Sekunden Mittagspause! Kaffee wurde elektronisch angewiesen. ☕🩺"
  ],
  en: [
    "Dr. Ulrike, why do neurologists love espresso? Because it doubles synaptic conduction velocity in the thalamus without GOÄ billing delays! ☕⚡",
    "Patient: 'Dr. Ulrike, my memory is failing.' Dr. Ulrike: 'Since when?' Patient: 'Since when what?' UDO: 'Don't worry, ALBIS has it backed up!' 🧠💾",
    "DGKN Guideline #800: An EEG muscle artifact is only an artifact until someone writes a 50-page doctoral thesis about it! 🔬📝",
    "GOÄ Code 800 activated: Quadrupling billing efficiency for psychiatric deep-dive consultations! 💼💶",
    "Why are neurological consultations like Cologne Carnival? Once a year all your neurons dance in a synchronized 10 Hz alpha wave! 🎭🎉",
    "Dr. Ulrike, system alert: 3 headache consultations, 2 forensic reports, and 0 seconds for lunch! I have ordered espresso via AI. ☕🩺"
  ]
};

const RADIO_STATIONS = {
  de: [
    "Radio Workspace Köln FM 107.1",
    "Radio DGKN Neurologie 98.4 FM",
    "GOÄ Ziffer 800 Jazz Lounge",
    "10Hz Alpha Brainwave Chill"
  ],
  en: [
    "Radio Workspace Köln FM 107.1",
    "Radio DGKN Neurology 98.4 FM",
    "GOÄ Code 800 Jazz Lounge",
    "10Hz Alpha Brainwave Chill"
  ]
};

export default function RobotMascot({
  state,
  messageBubble,
  onBubbleClick,
  size = "md",
  showBadge = false,
  className = ""
}: RobotMascotProps) {
  const { language } = useGlobalSystem();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isRadioOn, setIsRadioOn] = useState(false);
  const [stationIndex, setStationIndex] = useState(0);
  const [radioNote, setRadioNote] = useState<string | null>(null);
  const [activeJoke, setActiveJoke] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Track cursor coordinates relative to the robot to animate head rotation
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

  const handleToggleRadio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stations = RADIO_STATIONS[language];
    const currStation = stations[stationIndex % stations.length];
    
    const newState = audioService.toggleRadio(currStation, (noteMsg) => {
      setRadioNote(noteMsg);
    });
    setIsRadioOn(newState);

    if (!newState) {
      setRadioNote(null);
    }
  };

  const handleChangeStation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stations = RADIO_STATIONS[language];
    const nextIdx = (stationIndex + 1) % stations.length;
    setStationIndex(nextIdx);

    if (isRadioOn) {
      audioService.startRadio(stations[nextIdx], (noteMsg) => {
        setRadioNote(noteMsg);
      });
    }
  };

  const handleTellJoke = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playJokeChime();
    const jokes = DR_ULRIKE_JOKES[language];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setActiveJoke(randomJoke);
  };

  const scaleFactor = size === "sm" ? 0.8 : size === "lg" ? 1.2 : 1;
  const stations = RADIO_STATIONS[language];

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center p-2 select-none pointer-events-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "800px" }}
    >
      {/* Dr. Altenberg / UDO Robot Chat Bubble (ABOVE THE ROBOT SO IT DOES NOT OBSCURE THE ROBOT) */}
      <AnimatePresence>
        {(messageBubble || activeJoke || radioNote) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => {
              if (onBubbleClick) onBubbleClick();
              setIsChatOpen(true);
            }}
            className="absolute bottom-[100%] mb-3 left-1/2 -translate-x-1/2 w-max max-w-[290px] min-w-[220px] bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl p-3.5 text-[11px] text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.15)] cursor-pointer hover:border-cyan-400 transition-all z-40 group font-sans"
          >
            {/* Pointer arrow pointing down to robot head */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-cyan-500/50 rotate-45" />

            <div className="flex items-center justify-between gap-1.5 mb-1.5 text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span>
                  {activeJoke ? (language === "de" ? "🤣 Dr. Ulrike Humor Engine" : "🤣 Dr. Ulrike Humor Engine") : 
                   radioNote ? (language === "de" ? "📻 UDO Cyber Radio 104.8" : "📻 UDO Cyber Radio 104.8") : 
                   (language === "de" ? "✨ UDO Zentralsystem Guide" : "✨ UDO Central System Guide")}
                </span>
              </div>
              {activeJoke && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveJoke(null); }}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  ✕
                </button>
              )}
            </div>

            <p className="line-clamp-5 text-left leading-relaxed font-sans text-slate-200 font-medium">
              {activeJoke || messageBubble || radioNote}
            </p>

            <div className="text-[9px] text-cyan-400 font-extrabold flex items-center justify-between mt-2 pt-1 border-t border-cyan-500/20 group-hover:text-cyan-300">
              <span className="text-[8px] font-mono text-slate-400">🖐️ {language === "de" ? "Ziehen zum Verschieben" : "Drag me anywhere"}</span>
              <span className="group-hover:translate-x-1 transition-transform">{language === "de" ? "Interagieren →" : "Interact →"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Framer Motion Interactive Robot Container */}
      <motion.div
        animate={{
          y: state === "IDLE" ? [0, -6, 0] : 0,
          rotate: state === "ATTENTION" ? [-4, 4, -4] : state === "ERROR" ? [5, -5, 5] : 0
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5, repeat: state === "ATTENTION" ? Infinity : 0 }
        }}
        whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
        whileTap={{ scale: 0.95 }}
        className="relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ scale: scaleFactor }}
      >
        {/* Futuristic Mechanical Robot Body */}
        <div className="relative w-28 h-32 flex flex-col items-center justify-center">
          {/* Glowing floating platform base */}
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute -bottom-2 w-16 h-3 rounded-full blur-sm ${
              state === "ERROR" ? "bg-red-500/50" : state === "SUCCESS" ? "bg-teal-400/60" : "bg-cyan-500/40"
            }`} 
          />

          {/* Antennas */}
          <div className="absolute top-1 flex justify-between w-6 h-4">
            <div 
              className={`w-[1px] h-4 bg-cyan-400/80 origin-bottom transition-all ${
                state === "THINKING" || state === "PROCESSING" ? "animate-pulse h-6 bg-purple-400" : state === "ATTENTION" ? "h-6 bg-cyan-300" : ""
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full -ml-[2px] -mt-[1px] ${
                state === "THINKING" || state === "PROCESSING" ? "bg-purple-400 animate-ping" : state === "ATTENTION" ? "bg-cyan-300 animate-pulse" : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
              }`} />
            </div>
            <div className="w-[1px] h-4 bg-cyan-400/80 origin-bottom">
              <div className={`w-1.5 h-1.5 rounded-full -ml-[2px] -mt-[1px] ${state === "ATTENTION" ? "bg-cyan-300" : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"}`} />
            </div>
          </div>

          {/* Head */}
          <div
            className={`relative w-16 h-14 bg-slate-950 border-2 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
              state === "THINKING" || state === "PROCESSING"
                ? "border-purple-500/80 shadow-purple-500/40"
                : state === "SURPRISED" || state === "ERROR"
                ? "border-red-500/80 shadow-red-500/40"
                : state === "HAPPY" || state === "SUCCESS"
                ? "border-teal-400/90 shadow-teal-400/50"
                : state === "ATTENTION"
                ? "border-cyan-400/90 shadow-cyan-400/50"
                : "border-cyan-500/70 shadow-cyan-500/40"
            }`}
            style={{
              transform: `
                rotateX(${mousePos.y * -15}deg)
                rotateY(${mousePos.x * 20}deg)
              `,
            }}
          >
            {/* Eyes Visor Screen */}
            <div className="relative w-12 h-8 bg-slate-950 border border-cyan-500/30 rounded-lg overflow-hidden flex items-center justify-around px-1">
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />

              {/* Animated Eyes */}
              {state === "SURPRISED" || state === "ERROR" ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-red-500 bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                  <div className="w-3.5 h-3.5 rounded-full border border-red-500 bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                </>
              ) : state === "THINKING" || state === "PROCESSING" ? (
                <>
                  <div className="w-4 h-1 bg-purple-400 rounded shadow-[0_0_6px_rgba(192,132,252,0.8)] animate-pulse" />
                  <div className="w-4 h-1 bg-purple-400 rounded shadow-[0_0_6px_rgba(192,132,252,0.8)] animate-pulse" />
                </>
              ) : state === "HAPPY" || state === "SUCCESS" ? (
                <>
                  <div className="text-teal-300 font-mono text-sm font-bold leading-none animate-bounce select-none">^</div>
                  <div className="text-teal-300 font-mono text-sm font-bold leading-none animate-bounce select-none">^</div>
                </>
              ) : state === "SPEAKING" ? (
                <>
                  <div className="w-2.5 h-3.5 bg-cyan-400 rounded shadow-[0_0_8px_rgba(34,211,238,0.9)] scale-y-125 transition-transform" />
                  <div className="w-2.5 h-2 bg-cyan-400 rounded shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-ping" />
                </>
              ) : (
                <>
                  <div 
                    className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)] transition-transform"
                    style={{ transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 1.5}px)` }}
                  />
                  <div 
                    className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)] transition-transform"
                    style={{ transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 1.5}px)` }}
                  />
                </>
              )}
            </div>

            {/* Monocle Tag */}
            <div className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-slate-950 rounded-full text-[7px] px-1 font-extrabold tracking-widest border border-slate-950 uppercase select-none shadow-[0_0_8px_#22d3ee]">
              UDO
            </div>
          </div>

          {/* Neck */}
          <div className="w-3 h-2 bg-slate-800 border-x border-cyan-500/40 z-[1]" />

          {/* Torso/Body */}
          <div className="relative w-12 h-14 bg-slate-950 border border-cyan-500/50 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
            {/* Cyber Chest Core Light */}
            <div 
              className={`w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center transition-all duration-300 ${
                state === "THINKING" || state === "PROCESSING" ? "bg-purple-500/20 border-purple-500" :
                state === "SURPRISED" || state === "ERROR" ? "bg-red-500/20 border-red-500" :
                state === "HAPPY" || state === "SUCCESS" ? "bg-teal-400/30 border-teal-400" :
                "bg-cyan-500/20 border-cyan-400"
              }`}
            >
              <div 
                className={`w-3.5 h-3.5 rounded-full shadow-inner animate-pulse ${
                  state === "THINKING" || state === "PROCESSING" ? "bg-purple-400 animate-ping" :
                  state === "SURPRISED" || state === "ERROR" ? "bg-red-400 animate-ping" :
                  state === "HAPPY" || state === "SUCCESS" ? "bg-teal-300" :
                  "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                }`} 
              />
            </div>

            <div className="absolute top-1 left-2 w-1.5 h-0.5 bg-cyan-400/40" />
            <div className="absolute top-1 right-2 w-1.5 h-0.5 bg-cyan-400/40" />
          </div>

          {/* Left Arm */}
          <div 
            className="absolute left-4 top-[62px] w-3 h-10 origin-top bg-slate-900 border-l border-cyan-500/40 rounded-full transition-all duration-500"
            style={{
              transform: `rotate(${state === "HAPPY" || state === "SUCCESS" ? "-150deg" : state === "WAVING" ? "-140deg" : "-15deg"})`,
            }}
          >
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mx-auto border border-cyan-500/40" />
          </div>

          {/* Right Arm */}
          <div 
            className="absolute right-4 top-[62px] w-3 h-10 origin-top bg-slate-900 border-r border-cyan-500/40 rounded-full transition-all duration-500"
            style={{
              transform: `rotate(${state === "HAPPY" || state === "SUCCESS" ? "150deg" : state === "POINTING" ? "110deg" : "15deg"})`,
            }}
          >
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mx-auto border border-cyan-500/40" />
          </div>
        </div>
      </motion.div>

      {/* Dr. Ulrike Entertainment Tools & Radio Controls Toolbar */}
      <div className="mt-2.5 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/40 rounded-full px-2.5 py-1 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md z-30">
        {/* Open Chat Agent Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsChatOpen(true);
          }}
          title={language === "de" ? "Mit UDO V2 AI Chat starten" : "Start Chat with UDO V2 AI"}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 transition-all cursor-pointer text-[9px] font-mono font-bold uppercase shadow-[0_0_10px_rgba(34,211,238,0.3)]"
        >
          <Bot size={11} className="text-cyan-400 animate-pulse" />
          <span>{language === "de" ? "UDO Agent" : "UDO Agent"}</span>
        </button>

        {/* Radio Turn On Button */}
        <button
          onClick={handleToggleRadio}
          title={isRadioOn ? (language === "de" ? "Radio Ausschalten" : "Turn Off Radio") : (language === "de" ? "Radio Einschalten" : "Turn On Radio")}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
            isRadioOn 
              ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_#22d3ee] animate-pulse" 
              : "bg-slate-900 text-cyan-300 hover:bg-slate-800 hover:text-white border border-cyan-500/30"
          }`}
        >
          <Radio size={11} className={isRadioOn ? "animate-spin" : ""} />
          <span>{isRadioOn ? "Radio ON" : "Radio OFF"}</span>
        </button>

        {/* Change Radio Station if On */}
        {isRadioOn && (
          <button
            onClick={handleChangeStation}
            title={language === "de" ? "Sender Wechseln" : "Switch Station"}
            className="p-1 rounded-full bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer text-[9px]"
          >
            <Music size={11} />
          </button>
        )}

        {/* Doctor Ulrike Joke Button */}
        <button
          onClick={handleTellJoke}
          title={language === "de" ? "Witz für Dr. Ulrike erzählen" : "Tell Joke to Dr. Ulrike"}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-500/30 transition-all cursor-pointer text-[9px] font-mono font-bold"
        >
          <Smile size={11} className="text-amber-400" />
          <span>{language === "de" ? "Witz" : "Joke"}</span>
        </button>
      </div>

      {showBadge && (
        <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-cyan-500/30 backdrop-blur-sm text-[9px] uppercase tracking-wider font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          UDO: <strong className="text-cyan-300">{state}</strong>
        </div>
      )}

      {/* MASCOT CHAT AGENT MODAL */}
      <MascotChatAgentModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
