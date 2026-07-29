import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Check, Mic, Music, Bell } from 'lucide-react';
import { audioService, AudioCueDetail } from '../services/audioFeedbackService';

export const AudioFeedbackIndicator: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(audioService.isSoundEnabled());
  const [speechEnabled, setSpeechEnabled] = useState(audioService.isSpeechEnabled());
  const [volume, setVolume] = useState(audioService.getVolume());
  const [lastAnnouncement, setLastAnnouncement] = useState<string>('');
  const [activeCueAnimation, setActiveCueAnimation] = useState<string | null>(null);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

  useEffect(() => {
    const handleCueEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AudioCueDetail>;
      if (customEvent.detail) {
        const { type, title, message } = customEvent.detail;
        const text = message || title || `Audio-Feedback: ${type}`;
        setLastAnnouncement(text);
        setActiveCueAnimation(type);

        setTimeout(() => {
          setActiveCueAnimation(null);
        }, 1800);
      }
    };

    window.addEventListener('udo-audio-cue', handleCueEvent);
    return () => {
      window.removeEventListener('udo-audio-cue', handleCueEvent);
    };
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioService.setSoundEnabled(nextState);
  };

  const handleToggleSpeech = () => {
    const nextState = !speechEnabled;
    setSpeechEnabled(nextState);
    audioService.setSpeechEnabled(nextState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioService.setVolume(newVol);
  };

  const handleTestSound = (type: 'scan-complete' | 'audit-complete' | 'approval-complete') => {
    const label =
      type === 'scan-complete'
        ? 'KI-Scan 100% Abgeschlossen'
        : type === 'audit-complete'
        ? 'Dokumenten-Audit Stufe 3 Bestätigt'
        : 'Rezept / KBV-Gutachten Freigegeben';

    audioService.playCue(type, 'Test Signal', label);
    setLastAnnouncement(`[Test Signal] ${label}`);
    setActiveCueAnimation(type);
    setTimeout(() => setActiveCueAnimation(null), 1800);
  };

  return (
    <div className="relative inline-block font-sans">
      {/* SCREEN READER ACCESSIBILITY LIVE ANNOUNCER */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {lastAnnouncement}
      </div>

      {/* QUICK SOUND FEEDBACK BUTTON IN TOP BAR */}
      <button
        onClick={() => setShowSettingsPopover(!showSettingsPopover)}
        className={`relative px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
          activeCueAnimation
            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(0,212,170,0.6)] animate-pulse'
            : soundEnabled
            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
        }`}
        title="Barrierefreies Audio- & Sprach-Feedback Einstellungen"
      >
        {soundEnabled ? (
          <Volume2 className={`w-3.5 h-3.5 ${activeCueAnimation ? 'text-cyan-300 animate-bounce' : 'text-cyan-400'}`} />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
        )}
        <span className="hidden lg:inline text-[10px] uppercase tracking-wider">
          {soundEnabled ? 'Audio Cue' : 'Audio Stumm'}
        </span>

        {/* ACTIVE PULSE GLOW */}
        {activeCueAnimation && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        )}
      </button>

      {/* POPOVER EINSTELLUNGEN */}
      {showSettingsPopover && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-[#0f1017]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-[150] space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-extrabold text-white uppercase tracking-wider">
                Barrierefreie Audio-Cues
              </span>
            </div>
            <button
              onClick={() => setShowSettingsPopover(false)}
              className="text-slate-400 hover:text-white text-xs font-mono px-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* TOGGLE CONTROLS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-200 font-medium">Akustische Signale</span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/10 text-slate-400 border border-white/10'
                }`}
              >
                {soundEnabled ? 'Aktiv' : 'Inaktiv'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-slate-200 font-medium">Sprach-Ansage (Voice Cue)</span>
              </div>
              <button
                onClick={handleToggleSpeech}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  speechEnabled
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                    : 'bg-white/10 text-slate-400 border border-white/10'
                }`}
              >
                {speechEnabled ? 'Aktiv' : 'Inaktiv'}
              </button>
            </div>

            {/* VOLUME SLIDER */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Lautstärke</span>
                <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>
          </div>

          {/* TEST SIGNALS */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Audio Cues Testen:
            </span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
              <button
                onClick={() => handleTestSound('scan-complete')}
                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all cursor-pointer"
              >
                KI Scan
              </button>
              <button
                onClick={() => handleTestSound('audit-complete')}
                className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 text-center font-bold transition-all cursor-pointer"
              >
                Audit QS
              </button>
              <button
                onClick={() => handleTestSound('approval-complete')}
                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center font-bold transition-all cursor-pointer"
              >
                Freigabe
              </button>
            </div>
          </div>

          {lastAnnouncement && (
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
              <span className="truncate">{lastAnnouncement}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
