import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelsTopLeft, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Type, 
  Eye, 
  Radio, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  Globe, 
  Music, 
  CheckCircle2, 
  Trash2, 
  RefreshCw,
  Sliders,
  Layers,
  Activity,
  X
} from 'lucide-react';
import { StatusBar } from '../StatusBar';
import SynapseBackground from '../ui/synapse-background';
import { useGlobalSystem } from '../GlobalSystemContext';
import { triggerAudioCue } from '../../services/audioFeedbackService';

import ColognePhoneTriage from '../ColognePhoneTriage';
import CologneChatbot from '../CologneChatbot';
import { AlbisGdtBridgePanel } from '../AlbisGdtBridgePanel';
import CompliancePanel from '../CompliancePanel';

export interface WorkspaceShellProps {
  children?: React.ReactNode;
  onNavigateToPortal?: () => void;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  children,
  onNavigateToPortal
}) => {
  const {
    fontScale,
    setFontScale,
    lineHeightScale,
    setLineHeightScale,
    fontWeightScale,
    setFontWeightScale,
    eyeWarmthScale,
    setEyeWarmthScale,
    colorblindMode,
    setColorblindMode,
    language,
    setLanguage,
    isVoiceMuted,
    setIsVoiceMuted,
    speechRate,
    setSpeechRate,
    radioKolnActive,
    setRadioKolnActive,
    memoryRecords,
    addMemoryRecord,
    clearMemory,
    syncStatus,
    setSyncStatus,
    robotState,
    setRobotState,
    robotBubble,
    setRobotBubble
  } = useGlobalSystem();

  // Active Modals
  const [activeModal, setActiveModal] = useState<'triage' | 'chatbot' | 'albis' | 'compliance' | null>(null);

  // Radio Stream Audio State
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('Radio Köln');
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);

  const STATIONS: Record<string, string> = {
    'Radio Köln': 'https://radiokoeln.stream46.radiohost.de/radiokoeln-live_mp3-192',
    '1LIVE': 'https://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3',
    'WDR 2 Köln': 'https://wdr-wdr2-koln.icecast.wdr.de/wdr/wdr2/koln/mp3/128/stream.mp3',
    'WDR 4': 'https://wdr-wdr4-live.icecast.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3'
  };

  const toggleRadioPlay = (stationName: string = 'Radio Köln') => {
    const url = STATIONS[stationName];
    if (!url) return;

    if (isPlayingRadio && selectedStation === stationName) {
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
        radioAudioRef.current = null;
      }
      setIsPlayingRadio(false);
      setRadioKolnActive(false);
    } else {
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.play().then(() => {
        setIsPlayingRadio(true);
        setSelectedStation(stationName);
        if (stationName === 'Radio Köln') setRadioKolnActive(true);
      }).catch((err) => {
        console.error('Radio stream playback failed:', err);
        setIsPlayingRadio(false);
      });
      radioAudioRef.current = audio;
    }
  };

  useEffect(() => {
    return () => {
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
        radioAudioRef.current = null;
      }
    };
  }, []);

  const resetTypography = () => {
    setFontScale(1.0);
    setLineHeightScale(1.5);
    setFontWeightScale(1);
    setEyeWarmthScale(0);
  };

  const handleAddSampleMemory = () => {
    addMemoryRecord({
      type: 'text',
      patientName: 'Max Mustermann (50667 Köln)',
      problemSolved: 'S2k Neurologisches Gutachten verifiziert',
      rawText: 'Anamnese und MRT-Befund wurden per KI-Konsens erfolgreich analysiert.'
    });
    triggerAudioCue('approval-complete', 'Speicher Aktualisiert', 'Neuer KI-Gedächtniseintrag hinzugefügt.');
  };

  return (
    <SynapseBackground
      lineColor={0x0ea5e9}
      particleColor={0x38bdf8}
      pulseColor={0xd946ef}
      connectionDistance={75}
      particleCount={1200}
      className="fixed inset-0 bg-[#020813] text-white overflow-y-auto font-sans min-h-screen"
    >
      <div className="relative z-10 w-full min-h-screen flex flex-col p-4 sm:p-6 md:p-8 space-y-6">
        {/* SHARED STATUS BAR WITH BACK BUTTON */}
        <StatusBar
          onBack={onNavigateToPortal}
          backLabel="Portal"
          className="shrink-0"
        />

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 w-full max-w-7xl mx-auto space-y-8 pb-12">
          {children ? (
            children
          ) : (
            <>
              {/* WORKSPACE HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.25)]">
                    <PanelsTopLeft className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400 font-bold block">
                        UDO SYSTEM WORKSPACE
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                        SYSTEM READY
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Workspace Utility & Function Suite
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Direkter Zugriff auf Systemwerkzeuge, Zoom & Schriftart-Skalierung, Radio Köln Livestream, Barrierefreiheit & Klinische Module.
                    </p>
                  </div>
                </div>

                {onNavigateToPortal && (
                  <button
                    onClick={onNavigateToPortal}
                    className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 hover:border-indigo-400/50 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-300 transition-all text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-400" />
                    <span>Return to Portal</span>
                  </button>
                )}
              </div>

              {/* GRID OF WORKSPACE TOOL PANELS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* PANEL 1: ZOOM & TYPOGRAPHY ENGINE */}
                <div className="p-6 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                          <Type className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Zoom & Typografie</h2>
                          <p className="text-[10px] font-mono text-slate-400">Schriftgröße & Anzeigeskalierung</p>
                        </div>
                      </div>
                      <button
                        onClick={resetTypography}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all text-xs font-mono"
                        title="Zurücksetzen"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* FONT SCALE / ZOOM */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">Schrift Zoom:</span>
                        <span className="font-bold text-sky-400">{Math.round(fontScale * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFontScale(Math.max(0.7, Number((fontScale - 0.1).toFixed(1))))}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <ZoomOut className="w-3.5 h-3.5 text-sky-400" />
                          <span>-10%</span>
                        </button>
                        <button
                          onClick={() => setFontScale(1.0)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-all cursor-pointer text-slate-300"
                        >
                          100%
                        </button>
                        <button
                          onClick={() => setFontScale(Math.min(1.8, Number((fontScale + 0.1).toFixed(1))))}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                          <span>+10%</span>
                        </button>
                      </div>
                    </div>

                    {/* LINE HEIGHT SCALE */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">Zeilenabstand:</span>
                        <span className="font-bold text-sky-400">{lineHeightScale}x</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Kompakt', val: 1.2 },
                          { label: 'Normal', val: 1.5 },
                          { label: 'Groß', val: 1.8 }
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => setLineHeightScale(opt.val)}
                            className={`py-1.5 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                              lineHeightScale === opt.val
                                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* EYE WARMTH / BLUE LIGHT FILTER */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">Augenschonen (Warmfilter):</span>
                        <span className="font-bold text-amber-400">{eyeWarmthScale === 0 ? 'Aus' : `Stufe ${eyeWarmthScale}`}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 1, 3, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setEyeWarmthScale(lvl)}
                            className={`py-1.5 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                              eyeWarmthScale === lvl
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {lvl === 0 ? 'Aus' : `${lvl}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PANEL 2: RADIO KÖLN & AUDIO OPERATIONS */}
                <div className="p-6 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Radio Köln & Audio</h2>
                          <p className="text-[10px] font-mono text-slate-400">Livestream & Audio-Feedback</p>
                        </div>
                      </div>
                      {isPlayingRadio && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold animate-pulse">
                          <Music className="w-3 h-3" />
                          <span>LIVE STREAM</span>
                        </span>
                      )}
                    </div>

                    {/* MAIN RADIO KÖLN BUTTON */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-red-400 font-bold uppercase block tracking-wider">
                            LOKALRADIO KÖLN
                          </span>
                          <span className="text-base font-extrabold text-white block">
                            Radio Köln 107.1
                          </span>
                        </div>
                        <button
                          onClick={() => toggleRadioPlay('Radio Köln')}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                            isPlayingRadio && selectedStation === 'Radio Köln'
                              ? 'bg-red-600 text-white shadow-red-600/50 scale-105'
                              : 'bg-white/10 hover:bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {isPlayingRadio && selectedStation === 'Radio Köln' ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* OTHER RADIO STATIONS QUICK SELECT */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10">
                        {['1LIVE', 'WDR 2 Köln', 'WDR 4'].map((st) => (
                          <button
                            key={st}
                            onClick={() => toggleRadioPlay(st)}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-mono truncate transition-all cursor-pointer ${
                              isPlayingRadio && selectedStation === st
                                ? 'bg-red-500/20 border-red-400 text-red-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* VOICE MUTE & SPEECH RATE */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">Sprachausgabe:</span>
                        <button
                          onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                          className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isVoiceMuted
                              ? 'bg-red-500/20 border-red-500/40 text-red-300'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isVoiceMuted ? 'STUMM' : 'AKTIV'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono text-slate-400">Tempo:</span>
                        <div className="flex gap-1">
                          {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => setSpeechRate(rate)}
                              className={`px-2 py-1 rounded-md border text-[10px] font-mono transition-all cursor-pointer ${
                                speechRate === rate
                                  ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300 font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* S2K AUDIO CUE TESTERS */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        S2k KI Audio Feedback Signale:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => triggerAudioCue('scan-complete', 'Scan Erfolgreich', '4 Fachärzte Analyse abgeschlossen')}
                          className="p-2 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-[11px] font-mono text-left transition-all cursor-pointer text-slate-300 hover:text-indigo-300"
                        >
                          ▶ Scan Signal
                        </button>
                        <button
                          onClick={() => triggerAudioCue('approval-complete', 'Freigabe Votum', 'Kölner KI-Votum bestätigt')}
                          className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-[11px] font-mono text-left transition-all cursor-pointer text-slate-300 hover:text-emerald-300"
                        >
                          ▶ Votum Signal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PANEL 3: ACCESSIBILITY & COLOR VISION */}
                <div className="p-6 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Barrierefreiheit & Sprache</h2>
                        <p className="text-[10px] font-mono text-slate-400">Farbschwäche-Filter & Sprache</p>
                      </div>
                    </div>

                    {/* LANGUAGE SWITCHER */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">System Sprache:</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setLanguage('de')}
                            className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                              language === 'de'
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            DE (Deutsch)
                          </button>
                          <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                              language === 'en'
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            EN (English)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* COLORBLIND MODES */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-xs font-mono text-slate-300 block">
                        Farbsicht-Anpassung:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'normal', name: 'Normal' },
                          { id: 'deuteranopia', name: 'Deuteranopie' },
                          { id: 'protanopia', name: 'Protanopie' },
                          { id: 'tritanopia', name: 'Tritanopie' },
                          { id: 'monochrome', name: 'Monochrom' },
                          { id: 'high-contrast', name: 'Hoher Kontrast' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setColorblindMode(m.id as any)}
                            className={`p-2 rounded-xl border text-[11px] font-mono text-left transition-all cursor-pointer ${
                              colorblindMode === m.id
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PANEL 4: CLINICAL KÖLN MODULES & MODALS */}
                <div className="p-6 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5 flex flex-col justify-between md:col-span-2 lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Klinische Werkzeuge & Kölner Module</h2>
                        <p className="text-[10px] font-mono text-slate-400">Starten Sie spezialisierte Diagnose- und Compliance-Anwendungen</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* BUTTON 1: KÖLN TELEFON TRIAGE */}
                      <button
                        onClick={() => setActiveModal('triage')}
                        className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-900/30 text-left transition-all space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
                            <PhoneCall className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold">MODUL</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase group-hover:text-indigo-300 transition-colors">
                            Köln Telefon-Triage
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400 leading-snug pt-0.5">
                            Rheinisches Triage-System mit Dringlichkeits-Einstufung.
                          </p>
                        </div>
                      </button>

                      {/* BUTTON 2: KÖLN CHATBOT */}
                      <button
                        onClick={() => setActiveModal('chatbot')}
                        className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/30 text-left transition-all space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold">MODUL</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                            Kölner KI-Assistenz
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400 leading-snug pt-0.5">
                            Empathische Patientenaufklärung mit Kölner Herzlichkeit.
                          </p>
                        </div>
                      </button>

                      {/* BUTTON 3: ALBIS GDT BRIDGE */}
                      <button
                        onClick={() => setActiveModal('albis')}
                        className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/30 text-left transition-all space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                            <Sliders className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 font-bold">PRAXIS GDT</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase group-hover:text-purple-300 transition-colors">
                            ALBIS GDT Bridge
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400 leading-snug pt-0.5">
                            Praxis-Schnittstelle zur Übertragung strukturierter Befunde.
                          </p>
                        </div>
                      </button>

                      {/* BUTTON 4: COMPLIANCE & AUDIT PANEL */}
                      <button
                        onClick={() => setActiveModal('compliance')}
                        className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/30 text-left transition-all space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">DSGVO / S2K</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase group-hover:text-emerald-300 transition-colors">
                            Compliance & Audit Log
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400 leading-snug pt-0.5">
                            Audit-Protokollierung & rechtliche Konformitätsprüfung.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* PANEL 5: AI AGENT MEMORY & SYNC STATUS */}
                <div className="p-6 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-wider text-white">KI-Gedächtnis & Sync</h2>
                          <p className="text-[10px] font-mono text-slate-400">Lokale Speicherung & Synchronisation</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-[10px] font-mono font-bold">
                        {memoryRecords.length} Einträge
                      </span>
                    </div>

                    <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300">Sync Status:</span>
                        <span className={`font-bold uppercase ${
                          syncStatus === 'synced' ? 'text-emerald-400' : syncStatus === 'saving' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {syncStatus}
                        </span>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => setSyncStatus('synced')}
                          className="flex-1 py-1 rounded border text-[10px] font-mono bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          Synced
                        </button>
                        <button
                          onClick={() => setSyncStatus('saving')}
                          className="flex-1 py-1 rounded border text-[10px] font-mono bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                        >
                          Saving
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleAddSampleMemory}
                        className="w-full py-2.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 hover:bg-fuchsia-500/30 text-fuchsia-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>Test-Gedächtniseintrag Erstellen</span>
                      </button>

                      {memoryRecords.length > 0 && (
                        <button
                          onClick={clearMemory}
                          className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-red-300 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Gedächtnis Leeren</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </main>

        {/* MODAL OVERLAYS FOR CLINICAL TOOLS */}
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-white/15 rounded-3xl shadow-2xl overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
                  UDO WORKSPACE SYSTEM MODUL
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeModal === 'triage' && <ColognePhoneTriage />}
              {activeModal === 'chatbot' && (
                <CologneChatbot
                  onRobotStateChange={(st) => setRobotState(st)}
                  onDrBubbleTrigger={(msg) => setRobotBubble(msg)}
                  onMinimize={() => setActiveModal(null)}
                />
              )}
              {activeModal === 'albis' && <AlbisGdtBridgePanel />}
              {activeModal === 'compliance' && <CompliancePanel />}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="w-full max-w-7xl mx-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
          <span>UDO WORKSPACE ENGINE & UTILITIES</span>
          <span>SYSTEM READY</span>
        </footer>
      </div>
    </SynapseBackground>
  );
};

export default WorkspaceShell;
