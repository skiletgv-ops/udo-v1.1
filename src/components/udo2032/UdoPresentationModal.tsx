import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Presentation,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  HardDrive,
  Globe,
  Radio,
  Sliders,
  Check,
  Mic
} from 'lucide-react';

interface UdoPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  scriptDe: string;
  scriptEn: string;
  emotionDe: string;
  emotionEn: string;
  emotionIcon: string;
  pitch: number;
  rate: number;
  emotionBg: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "MEDEA V1.7 (U D O. Media)",
    subtitle: "Local AI Clinical OS — Automating Documentation & Medical-Legal Reporting",
    category: "TITLE",
    emotionDe: "Visionär & Inspiriert",
    emotionEn: "Visionary & Inspiring",
    emotionIcon: "🚀",
    pitch: 1.02,
    rate: 0.96,
    emotionBg: "from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300",
    scriptDe: "Willkommen zu MEDEA V1.7! Dem revolutionären lokalen KI-Klinik-Betriebssystem von U.D.O. Media! Es integriert sich nahtlos in Ihr ALBIS-System, um Ihre medizinische Dokumentation und Gutachtenerstellung vollkommen zu automatisieren!",
    scriptEn: "Welcome to MEDEA V1.7! The revolutionary local AI clinical operating system by U.D.O. Media! It seamlessly integrates into your ALBIS system to completely automate medical documentation and report generation!"
  },
  {
    id: 2,
    title: "The Clinical Bottleneck We Solve",
    subtitle: "Overcoming Admin Overload & Medical-Legal Delays in German Practices",
    category: "PROBLEM",
    emotionDe: "Empathisch & Dringlich",
    emotionEn: "Empathetic & Urgent",
    emotionIcon: "⚠️",
    pitch: 0.90,
    rate: 0.92,
    emotionBg: "from-rose-500/20 to-amber-500/20 border-rose-400/50 text-rose-300",
    scriptDe: "Lassen Sie mich das ganz klar auf den Punkt bringen! Ich möchte mit einer einfachen Frage beginnen: Wie viel von Ihrem Tag — Ihrer wertvollsten Lebenszeit — geht fürs Tippen, Formularausfüllen und Berichtsschreiben drauf? Nicht für die Behandlung von Patienten, sondern für Papierkram! Das Erschreckende daran: Studien zeigen, dass Ärztinnen und Ärzte ganze 40 Prozent ihrer Arbeitszeit mit administrativen Aufgaben verschwenden! Und für viele Ärztinnen und Ärzte in Deutschland dauert ein einziges Gutachten Stunden! Stellen Sie sich nun vor, was Sie mit dieser gewonnenen Zeit anfangen könnten: Mehr Patienten versorgen. Früher Feierabend machen. Oder — ganz ehrlich — einfach mal tief durchatmen!",
    scriptEn: "Let me bring this straight to the point! I'd like to start with a simple question: How much of your day — your most valuable time — goes to typing, filling out forms, and writing reports? Not for treating patients, but for paperwork! The shocking part: Studies show doctors spend a full 40% of their working hours on administrative tasks! And writing a single report takes hours! Imagine what you could do with this gained time: treat more patients, leave early, or just take a deep breath!"
  },
  {
    id: 3,
    title: "MEDEA V1.7 - Local AI OS Architecture",
    subtitle: "End-to-End On-Premise Data Processing Flow",
    category: "ARCHITECTURE",
    emotionDe: "Souverän & Vertrauensvoll",
    emotionEn: "Authoritative & Confident",
    emotionIcon: "🛡️",
    pitch: 0.94,
    rate: 0.94,
    emotionBg: "from-emerald-500/20 to-cyan-500/20 border-emerald-400/50 text-emerald-300",
    scriptDe: "MEDEA V1.7 fungiert als Ihr hochsicheres, lokales Klinik-Betriebssystem! Ihre Spracheingaben werden direkt auf Ihrem eigenen dedizierten KI-Kern verarbeitet. Sie aktualisieren augenblicklich Ihre ALBIS-Patientenfelder — für strukturierte SOAP-Notizen und rechtssichere Gutachten mit 100% Datenschutz garantiert!",
    scriptEn: "MEDEA V1.7 operates as your highly secure, local clinical operating system! Voice inputs are processed directly on your dedicated local AI core. They instantly update your ALBIS patient fields for structured SOAP notes and legal reports with 100% data privacy guaranteed!"
  },
  {
    id: 4,
    title: "MEDEA V1.7: On-Premise Hardware Appliance",
    subtitle: "Zero-Cloud Compact Medical Unit (< 50W Ultra Low Power)",
    category: "HARDWARE",
    emotionDe: "Begeisternd & Genial Einfach",
    emotionEn: "Enthusiastic & Simple",
    emotionIcon: "💡",
    pitch: 1.04,
    rate: 0.98,
    emotionBg: "from-purple-500/20 to-cyan-500/20 border-purple-400/50 text-purple-300",
    scriptDe: "Wie genial einfach ist die Hardware? Ein kompakter Server, der in einer Ecke steht und weniger Strom verbraucht als eine Glühbirne — gerade einmal vier bis fünf Euro Stromkosten im Monat! Er verbindet sich niemals mit dem Internet, sodass Ihre Patientendaten absolut sicher im Gebäude bleiben. Einstecken, Netzwerkkabel anschließen, fertig! So einfach muss moderne Medizin-Technik sein!",
    scriptEn: "How brilliantly simple is the hardware? A compact server sitting in a corner that consumes less power than a light bulb — just 4 to 5 euros of electricity per month! It never connects to the internet, keeping your data completely safe inside your building. Plug it in, connect the LAN cable, done! That's how simple modern medical tech should be!"
  },
  {
    id: 5,
    title: "Seamless ALBIS Medical System Integration",
    subtitle: "One-Time Configuration & Zero-Friction Remote Scenarios",
    category: "ALBIS SETUP",
    emotionDe: "Dynamisch & Innovativ",
    emotionEn: "Dynamic & Innovative",
    emotionIcon: "⚡",
    pitch: 1.03,
    rate: 1.00,
    emotionBg: "from-cyan-500/20 to-emerald-500/20 border-cyan-400/50 text-cyan-300",
    scriptDe: "Stellen Sie sich vor: Sie sind spät abends zu Hause und Ihnen fällt ein, dass noch ein Gutachten angefordert werden muss. Handy herausholen, kurze Nachricht tippen: 'Starte Gutachten für Patient Schmidt, Fall 482' — und BUMM! MEDEA V1.7 übernimmt, verarbeitet die Akten und hält am Morgen den perfekten Entwurf bereit! Ganz ohne Hürden. Ohne Ausreden!",
    scriptEn: "Imagine this: You're at home late at night and remember a medical report needs to be started. Pull out your phone, send a quick text: 'Start report for Patient Schmidt, Case 482' — and BOOM! MEDEA V1.7 takes over, processes the records, and has the perfect draft ready by morning! Zero hassle. Zero excuses!"
  },
  {
    id: 6,
    title: "The 4-AI Ensemble Gutachten Voting Engine",
    subtitle: "Parallel Models, Synthesis Router & S2k Precision in 2-3 Minutes",
    category: "4-AI GUTACHTEN",
    emotionDe: "Phänomenal & Revolutionär",
    emotionEn: "Phenomenal & Revolutionary",
    emotionIcon: "🔥",
    pitch: 1.08,
    rate: 1.02,
    emotionBg: "from-amber-500/20 to-rose-500/20 border-amber-400/50 text-amber-300",
    scriptDe: "Und hier ist das absolute Highlight — ein fehlerfreies medizinisches Gutachten in Sekundenschnelle! Unser System führt vier verschiedene KI-Modelle parallel aus! Jedes Modell analysiert die gesamte Akte und schreibt einen Entwurf. Ein zentraler Synthese-Router wählt die besten Passagen aus. In unter 30 Sekunden erhalten Sie das perfekte Ergebnis! Nur noch zwei Minuten drüberschauen — fertig! Das ist die absolute Zukunft der Medizin!",
    scriptEn: "And here is the absolute highlight — a flawless medical report in seconds! Our system runs 4 different AI models in parallel! Each model analyzes the entire file and drafts a report. A central synthesis router picks the best passages. In under 30 seconds you get the perfect result! Just 2 minutes to review — done! This is the absolute future of medicine!"
  }
];

export function UdoPresentationModal({ isOpen, onClose }: UdoPresentationModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const [activeModel, setActiveModel] = useState<'medea' | 'udo' | 'albis'>('medea');
  const [voiceType, setVoiceType] = useState<'human' | 'neural'>('human');
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  const currentSlide = SLIDES[currentSlideIndex];

  // Speech synthesis reference & refs to avoid stale closure in onend
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSlideIndexRef = useRef(currentSlideIndex);
  const autoAdvanceRef = useRef(autoAdvance);
  const isPlayingRef = useRef(isPlaying);

  // Dynamically load system voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    currentSlideIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsGeneratingVoice(false);
  };

  const playSpeechForCurrentSlide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsGeneratingVoice(true);

    setTimeout(() => {
      setIsGeneratingVoice(false);
      const text = lang === 'de' ? currentSlide.scriptDe : currentSlide.scriptEn;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';

      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const targetLang = lang === 'de' ? 'de' : 'en';
      const langVoices = voices.filter(v => v.lang.startsWith(targetLang));

      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (selectedVoiceURI && selectedVoiceURI !== 'JONAS_MAIN') {
        chosenVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      }

      if (!chosenVoice || !chosenVoice.lang.startsWith(targetLang)) {
        // ALWAYS PRIORITIZE JONAS GERMAN MALE NATURAL VOICE FIRST
        if (lang === 'de') {
          chosenVoice =
            langVoices.find(v => /jonas/i.test(v.name)) ||
            voices.find(v => /jonas/i.test(v.name)) ||
            langVoices.find(v => /conrad|killian|stefan|daniel|male|natural|neural|online|guy/i.test(v.name)) ||
            langVoices.find(v => !/katja|marlene|zira|hedda|eva|female/i.test(v.name)) ||
            langVoices[0] ||
            voices[0];
        } else {
          chosenVoice =
            langVoices.find(v => /guy|christopher|ryan|eric|neural|natural|male/i.test(v.name)) ||
            langVoices[0] ||
            voices[0];
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Apply Expressive Per-Slide Emotional Vocal Dynamics (Pitch & Rate modulation)
      utterance.pitch = currentSlide.pitch;
      utterance.rate = speechRate * currentSlide.rate;
      utterance.volume = 1.0; // MAX VOLUME 100%

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        // Video auto-advance logic
        if (autoAdvanceRef.current) {
          if (currentSlideIndexRef.current < SLIDES.length - 1) {
            setTimeout(() => {
              setCurrentSlideIndex(prev => prev + 1);
            }, 600);
          } else {
            // Reached end of presentation video - loop back to slide 1
            setTimeout(() => {
              setCurrentSlideIndex(0);
            }, 1200);
          }
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 200);
  };

  // Autoplay video presentation when modal opens or slide/lang/voice/rate changes
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      playSpeechForCurrentSlide();
    } else {
      stopSpeech();
    }
    return () => {
      stopSpeech();
    };
  }, [isOpen, currentSlideIndex, lang, selectedVoiceURI, speechRate]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      playSpeechForCurrentSlide();
    }
  };

  const handleNext = () => {
    stopSpeech();
    setCurrentSlideIndex(prev => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    stopSpeech();
    setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={() => {
          stopSpeech();
          onClose();
        }}
        className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="w-full max-w-7xl h-[92vh] max-h-[920px] bg-[#050914] border-2 border-cyan-500/50 rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.4)] flex flex-col overflow-hidden text-slate-100 font-sans pointer-events-auto relative z-[10000]"
        >
          {/* VIDEO TOP TIMELINE PROGRESS BAR */}
          <div className="w-full h-1.5 bg-slate-900 relative overflow-hidden shrink-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${((currentSlideIndex + 1) / SLIDES.length) * 100}%` }}
            />
          </div>

          {/* TOP HEADER BAR */}
          <div className="px-4 py-3 bg-[#03060f] border-b border-cyan-900/40 flex items-center justify-between shrink-0 font-mono text-xs flex-wrap gap-2">
            {/* Left badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                <Presentation size={15} className="animate-pulse text-cyan-400" />
                <span className="font-bold tracking-wider">U. D. O. Media V1 Video Presentation</span>
              </div>

              {/* Model Switcher */}
              <div className="hidden md:flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveModel('medea')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer ${
                    activeModel === 'medea' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MEDEA V1.7
                </button>
                <button
                  onClick={() => setActiveModel('udo')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer ${
                    activeModel === 'udo' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  UDO Media
                </button>
                <button
                  onClick={() => setActiveModel('albis')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer ${
                    activeModel === 'albis' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ALBIS Integration
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switch */}
              <button
                onClick={() => setLang(l => (l === 'de' ? 'en' : 'de'))}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-bold transition-all cursor-pointer"
              >
                {lang.toUpperCase()}
              </button>

              {/* Natural Human Voice Dropdown Selector */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <Mic size={13} className="text-emerald-400 animate-pulse" />
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none cursor-pointer max-w-[170px] truncate text-[11px] font-semibold"
                  title="Wähle eine echten natürlichen Sprecher (Standard: Jonas)"
                >
                  <option value="" className="bg-slate-900 text-emerald-300 font-bold">
                    🎙 JONAS (Hauptstimme - Natürlicher KI-Sprecher)
                  </option>
                  {availableVoices
                    .filter(v => v.lang.startsWith(lang === 'de' ? 'de' : 'en'))
                    .map(v => (
                      <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-slate-200">
                        {v.name.replace(/Microsoft|Google|Apple|Desktop|Online \(Natural\)/gi, '').trim()}
                      </option>
                    ))}
                </select>
              </div>

              {/* Audio Visualizer & Volume Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-[11px] font-mono">
                <Volume2 size={13} className="text-emerald-400 animate-pulse" />
                <span>MAX VOL 100%</span>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-3 ml-1">
                    <span className="w-0.5 h-2 bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3 bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-1.5 bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              {/* Play/Pause Speech Video */}
              <button
                onClick={handleTogglePlay}
                className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-emerald-400'
                }`}
              >
                {isGeneratingVoice ? (
                  <>
                    <Sparkles size={14} className="animate-spin text-cyan-300" />
                    <span>KI-Stimme wird generiert...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause size={14} />
                    <span>Video pausieren</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Video abspielen</span>
                  </>
                )}
              </button>

              {/* Slide Counter */}
              <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <button onClick={handlePrev} className="p-0.5 hover:text-white cursor-pointer">
                  <ChevronLeft size={14} />
                </button>
                <span className="font-bold px-1">{currentSlideIndex + 1} / {SLIDES.length}</span>
                <button onClick={handleNext} className="p-0.5 hover:text-white cursor-pointer">
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopSpeech();
                  onClose();
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MAIN CANVAS & SCRIPT SIDEBAR */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            {/* LEFT / CENTER: SLIDE STAGE */}
            <div className="flex-1 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#050c1e] to-[#02050c] relative">
              {/* Background ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

              {/* Big central Play overlay when video paused */}
              {!isPlaying && !isGeneratingVoice && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-[2px] transition-all group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.8)] group-hover:scale-110 transition-transform">
                    <Play size={38} className="ml-1" />
                  </div>
                  <span className="mt-4 px-5 py-2 rounded-full bg-slate-900/90 border border-emerald-400/80 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider shadow-xl">
                    ▶ CLICK TO PLAY VIDEO PRESENTATION WITH VOICE (MAX VOL)
                  </span>
                </button>
              )}

              {/* Slide Header Category & Emotion Badge */}
              <div className="flex items-center justify-between z-10 font-mono text-xs gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest">
                    SLIDE {currentSlide.id} • {currentSlide.category}
                  </span>

                  {/* EMOTION BADGE */}
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${currentSlide.emotionBg} border font-bold text-[11px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse`}>
                    <span>{currentSlide.emotionIcon}</span>
                    <span>{lang === 'de' ? currentSlide.emotionDe : currentSlide.emotionEn}</span>
                  </span>

                  {isPlaying && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      EXPRESSIVE VOICE NARRATION
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>S2k Medical AI Verified</span>
                </div>
              </div>

              {/* SLIDE CONTENT RENDERING BASED ON SLIDE ID */}
              <div className="my-auto py-6 z-10 max-w-4xl mx-auto w-full">
                {currentSlide.id === 1 && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-cyan-950/60 border-2 border-cyan-500/50 text-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.3)] mb-2">
                      <Sparkles size={48} className="animate-pulse" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                      MEDEA V1.7 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">(U D O . Media)</span>
                    </h1>
                    <p className="text-lg sm:text-2xl text-cyan-200 font-mono font-medium max-w-2xl mx-auto leading-relaxed">
                      Local AI Clinical OS — Automating Documentation & Medical-Legal Reporting
                    </p>
                    <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
                      Willkommen zu MEDEA V1.7 — dem lokalen KI-Klinik-Betriebssystem von U.D.O. Media, das sich nahtlos in ALBIS integriert, um die medizinische Dokumentation und Gutachtenerstellung vollkommen zu automatisieren.
                    </p>
                  </div>
                )}

                {currentSlide.id === 2 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">The Clinical Bottleneck We Solve</h2>
                      <p className="text-slate-400 text-sm font-mono">Administrative Burden vs. Patient Care Hours</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 space-y-2">
                        <div className="text-3xl font-black text-rose-400 font-mono">40% Time Lost</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Doctors spend nearly half their day typing, managing EHR fields, and assembling manual reports instead of patient care.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 space-y-2">
                        <div className="text-3xl font-black text-amber-400 font-mono">40% Of Doctor Hours</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Consumed by Admin. Medical-legal reports (Gutachten) require 2h+ hours each to search patient histories and write, causing severe overtime and burnout.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.id === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">MEDEA V1.7 — Local AI Operating System Architecture</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center space-y-2">
                        <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 w-fit mx-auto">
                          <Volume2 size={24} />
                        </div>
                        <h4 className="font-bold text-white">Voice & Text Input</h4>
                        <p className="text-[11px] text-slate-400">Encrypted local microphone & mobile audio text stream.</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-cyan-950/50 border-2 border-cyan-500/60 text-center space-y-2 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <div className="p-3 rounded-xl bg-cyan-900 border border-cyan-400 text-cyan-300 w-fit mx-auto">
                          <Cpu size={24} />
                        </div>
                        <h4 className="font-bold text-cyan-300">On-Premise Medea AI</h4>
                        <p className="text-[11px] text-slate-300">Zero Cloud Zero Data Leakage local hardware processing.</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center space-y-2">
                        <div className="p-3 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 w-fit mx-auto">
                          <Layers size={24} />
                        </div>
                        <h4 className="font-bold text-white">ALBIS Gateway</h4>
                        <p className="text-[11px] text-slate-400">Automated EHM entry & DGUV form synchronization.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.id === 4 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">MEDEA V1.7: On-Premise Hardware Appliance</h2>
                      <p className="text-slate-400 text-xs font-mono">Compact server box operating locally inside your practice. Never connects to external cloud servers.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-cyan-400 font-bold block">Dedicated Local Unit</span>
                        <p className="text-[11px] text-slate-400">Operates 100% inside your building. No cloud dependence.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-emerald-400 font-bold block">Consent & Privacy Visual</span>
                        <p className="text-[11px] text-slate-400">Consistently monitors visual recording indicators for GDPR.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-amber-400 font-bold block">Ultra Low Power (&lt;50W)</span>
                        <p className="text-[11px] text-slate-400">Consumes less electricity than a lightbulb (~4-5 EUR/month).</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-purple-400 font-bold block">Plug-and-Play Setup</span>
                        <p className="text-[11px] text-slate-400">Connect power and LAN cable. Zero complex configuration.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.id === 5 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">Seamless ALBIS Medical System Integration</h2>
                    </div>

                    <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-cyan-900/50 pb-2">
                        <span>LATE-NIGHT SCENARIO</span>
                        <span className="text-emerald-400">REMOTE / MOBILE TRIGGER</span>
                      </div>
                      <p className="text-slate-300 italic text-sm leading-relaxed">
                        "At home late at night. Send a short text: 'Start medical report for Patient Schmidt, Case 482'. MEDEA V1.7 processes the history and has the draft ready by morning."
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide.id === 6 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">The 4-AI Ensemble Gutachten Voting Engine</h2>
                      <p className="text-cyan-400 text-xs font-mono font-bold">Parallel Models &amp; High Precision Synthesis</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                      <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-rose-300 space-y-2">
                        <span className="text-rose-400 font-bold block">Traditional Gutachten Assembly:</span>
                        <div className="text-3xl font-black text-rose-400">2+ Hours</div>
                        <p className="text-[11px] text-slate-400">Manual review of hundreds of pages, typing legal texts.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/60 text-cyan-300 space-y-2 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <span className="text-cyan-400 font-bold block">With MEDEA V1.7 Voting Router:</span>
                        <div className="text-3xl font-black text-emerald-400">2 - 3 Minutes</div>
                        <p className="text-[11px] text-slate-300">4 AI models review parallel &amp; central router selects optimum paragraphs.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SLIDE NAVIGATION CONTROL BAR AT BOTTOM */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 z-10 font-mono text-xs">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Previous Slide</span>
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2 py-1">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        stopSpeech();
                        setCurrentSlideIndex(idx);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        idx === currentSlideIndex
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {idx + 1}. {s.category}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <span>Next Slide</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* RIGHT SIDEBAR: PRESENTER SPEECH SCRIPT */}
            <div className="w-full md:w-80 bg-[#03060f] border-t md:border-t-0 md:border-l border-cyan-900/40 p-4 sm:p-5 flex flex-col justify-between shrink-0 font-sans">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <FileText size={16} />
                    <span>Presenter Speech Script</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">
                    Folie {currentSlideIndex + 1} Redeskript
                  </span>
                </div>

                {/* SCRIPT TEXT BOX WITH ACTIVE SPEECH HIGHLIGHT */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 font-mono text-xs leading-relaxed max-h-[340px] overflow-y-auto">
                  <p className={`transition-colors duration-300 ${isPlaying ? 'text-cyan-300 font-semibold' : 'text-slate-300'}`}>
                    {lang === 'de' ? currentSlide.scriptDe : currentSlide.scriptEn}
                  </p>
                </div>
              </div>

              {/* SCRIPT SETTINGS & AUTO ADVANCE */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Auto-Advance Speech</span>
                  <button
                    onClick={() => setAutoAdvance(a => !a)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      autoAdvance
                        ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {autoAdvance ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <button
                  onClick={handleTogglePlay}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={16} />
                      <span>PAUSE SPEECH NARRATION</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>PLAY SPEECH NARRATION</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
