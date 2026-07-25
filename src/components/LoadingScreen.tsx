import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PHASES = [
  'INITIALIZING NEURAL CORE...',
  'LOADING FORENSIC DATABASES...',
  'CALIBRATING AI AGENTS...',
  'SYNCING CUPRA GEOMETRY...',
  'U.D.O. S2k READY',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Random increments over 4-6 seconds total
      const increment = Math.floor(Math.random() * 8) + 3;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Phase calculation based on progress
      if (currentProgress < 25) {
        setPhaseIndex(0);
      } else if (currentProgress < 50) {
        setPhaseIndex(1);
      } else if (currentProgress < 75) {
        setPhaseIndex(2);
      } else if (currentProgress < 95) {
        setPhaseIndex(3);
      } else {
        setPhaseIndex(4);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 800); // 800ms fade out duration
        }, 600); // 600ms pause at 100%
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-md px-4"
        >
          {/* LOGO CONTAINER WITH PULSING RINGS */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer cyan border circle */}
            <div className="absolute w-40 h-40 rounded-full border border-[#00D4AA]/30 animate-ping opacity-25" />
            
            {/* Outer copper border circle */}
            <div className="absolute w-32 h-32 rounded-full border-2 border-[#B87333]/50 animate-pulse shadow-[0_0_20px_rgba(184,115,51,0.3)]" />

            {/* CUPRA TRIANGLE LOGO SVG */}
            <svg width="96" height="96" viewBox="0 0 96 96" className="relative z-10">
              <defs>
                <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B87333" />
                  <stop offset="50%" stopColor="#CD7F32" />
                  <stop offset="100%" stopColor="#E8A87C" />
                </linearGradient>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#00a884" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <polygon
                points="48,8 88,80 8,80"
                fill="none"
                stroke="url(#copperGrad)"
                strokeWidth="2.5"
                filter="url(#glow)"
              />
              <polygon
                points="48,28 72,68 24,68"
                fill="url(#copperGrad)"
                opacity="0.15"
              />
              <polygon
                points="48,44 56,56 48,68 40,56"
                fill="url(#cyanGrad)"
                filter="url(#glow)"
              />
              <line
                x1="48"
                y1="8"
                x2="48"
                y2="44"
                stroke="url(#cyanGrad)"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* BRAND TEXT BELOW LOGO */}
          <div className="text-center mb-8 space-y-1">
            <h1 className="text-3xl font-bold tracking-[0.3em] font-sans">
              <span className="text-white">U.D.O. </span>
              <span className="text-[#B87333]">S2k</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-mono font-medium">
              Forensic Hub · Neural Diagnostic Core
            </p>
          </div>

          {/* PROGRESS BAR SECTION */}
          <div className="w-80 max-w-full space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono">
              <span className="tracking-widest text-[#B87333] font-semibold">
                {PHASES[phaseIndex]}
              </span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>

            {/* BAR TRACK */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#B87333] via-[#CD7F32] to-[#00D4AA] shadow-[0_0_10px_rgba(184,115,51,0.5)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
