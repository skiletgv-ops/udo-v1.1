import React from 'react';
import { useGlobalSystem } from './GlobalSystemContext';

interface StatusBarProps {
  isBooted?: boolean;
  className?: string;
  onBack?: () => void;
  backLabel?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isBooted = true,
  className = '',
  onBack,
  backLabel
}) => {
  const { language, setLanguage } = useGlobalSystem();

  return (
    <header className={`w-full flex justify-between items-center font-mono text-[11px] text-slate-300 tracking-[0.15em] uppercase py-2 px-2 border-b border-white/10 ${className}`}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all text-xs font-mono cursor-pointer pointer-events-auto"
          >
            <span className="text-cyan-400 font-bold">&larr;</span>
            <span>{backLabel || 'Portal'}</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full ${isBooted ? "bg-emerald-400" : "bg-teal-400 animate-pulse"} flex items-center justify-center`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
          </span>
          <span className="font-extrabold text-white">
            {isBooted ? (language === 'de' ? "UDO ONLINE" : "UDO ONLINE") : "SYSTEM BOOTING..."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-slate-400 hidden sm:inline">PORTAL VER: 2.1.0</span>
        <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1 shadow-inner pointer-events-auto">
          <button
            onClick={() => setLanguage('de')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider font-extrabold cursor-pointer transition-all ${
              language === 'de'
                ? 'bg-cyan-400 text-slate-950 font-black shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            DE
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider font-extrabold cursor-pointer transition-all ${
              language === 'en'
                ? 'bg-cyan-400 text-slate-950 font-black shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default StatusBar;
