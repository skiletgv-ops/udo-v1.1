import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, BookOpen, Cpu, HelpCircle, Download, RefreshCw, Presentation } from 'lucide-react';
import { SplineBackground } from '../../components/SplineBackground';
import { LoadingScreen } from '../../components/LoadingScreen';
import { WhitepaperModal } from '../../components/WhitepaperModal';
import { UdoPresentationModal } from '../../components/udo2032/UdoPresentationModal';
import { useRoleContext, ROLE_DEFINITIONS } from '../../context/RoleContext';

export function WelcomePage({ onNavigateToApp }: { onNavigateToApp?: () => void }) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const { selectRole } = useRoleContext();

  const handleSelectRole = (role: 'main' | 'admin') => {
    selectRole(role);
    if (onNavigateToApp) {
      onNavigateToApp();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* LAYER 1: LIVE 3D SPLINE BACKGROUND */}
      <SplineBackground />

      {/* LAYER 2: LOADING SCREEN */}
      {!isLoadingComplete && (
        <LoadingScreen onComplete={() => setIsLoadingComplete(true)} />
      )}

      {/* LAYER 3: WELCOME UI */}
      {isLoadingComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative z-20 w-full max-w-2xl px-6 py-8 flex flex-col items-center text-center space-y-8"
        >
          {/* 1. LOGO & HEADER */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 96 96">
                <defs>
                  <linearGradient id="copperGradWel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B87333" />
                    <stop offset="50%" stopColor="#CD7F32" />
                    <stop offset="100%" stopColor="#E8A87C" />
                  </linearGradient>
                  <linearGradient id="cyanGradWel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4AA" />
                    <stop offset="100%" stopColor="#00a884" />
                  </linearGradient>
                </defs>
                <polygon points="48,8 88,80 8,80" fill="none" stroke="url(#copperGradWel)" strokeWidth="3" />
                <polygon points="48,28 72,68 24,68" fill="url(#copperGradWel)" opacity="0.2" />
                <polygon points="48,44 56,56 48,68 40,56" fill="url(#cyanGradWel)" />
              </svg>
              <span className="text-xl font-bold tracking-[0.25em] font-sans">
                UDO <span className="text-[#B87333]">S2k</span>
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Willkommen im Forensic Hub
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-sans">
                Medizinische KI-Begutachtung auf höchstem Niveau
              </p>
            </div>
          </div>

          {/* 2. ROLE SELECTION CARDS */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MAIN ACCOUNT CARD */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole('main')}
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/80 hover:shadow-[0_0_30px_rgba(0,212,170,0.2)] transition-all cursor-pointer text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <User className="w-24 h-24 text-cyan-400" />
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 group-hover:bg-cyan-500/20 transition-all">
                <User className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1">
                HAUPTACCOUNT
              </span>

              <h3 className="text-lg font-bold text-white mb-1">
                {ROLE_DEFINITIONS.main.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                Rezepte erstellen, Befunde bewerten & Berichte speichern
              </p>
            </motion.button>

            {/* ADMIN CARD */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole('admin')}
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-[#B87333]/30 hover:border-[#B87333]/80 hover:shadow-[0_0_30px_rgba(184,115,51,0.2)] transition-all cursor-pointer text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-24 h-24 text-[#B87333]" />
              </div>

              <div className="w-full flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#B87333]/10 border border-[#B87333]/30 text-[#E8A87C] group-hover:bg-[#B87333]/20 transition-all">
                  <Shield className="w-6 h-6" />
                </div>
                {/* QUEUE BADGE */}
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                  Queue: 3
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8A87C] font-bold mb-1">
                ADMINISTRATION
              </span>

              <h3 className="text-lg font-bold text-white mb-1">
                {ROLE_DEFINITIONS.admin.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                Rezepte genehmigen, Praxis-Upgrades & Revisionsverwaltung
              </p>
            </motion.button>
          </div>

          {/* 3. DASHBOARD, PRESENTATION, WHITEPAPER & DOWNLOAD UDO APP BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* TRON NEON ENTRY BUTTON FOR UDO V2 DASHBOARD */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.pushState({}, '', '/udo-v2');
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950/90 border-2 border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.6),inset_0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>UDO V2 DASHBOARD</span>
            </motion.button>

            {/* GREEN PRESENTATION BUTTON - BETWEEN DASHBOARD AND WHITEPAPER */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPresentationOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950/90 border-2 border-emerald-400 text-emerald-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.6),inset_0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>PRESENTATION</span>
            </motion.button>

            {/* WHITEPAPER LESEN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWhitepaperOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B87333]/20 via-[#CD7F32]/30 to-[#B87333]/20 border border-[#B87333]/50 hover:border-[#B87333] text-[#E8A87C] hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(184,115,51,0.2)] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#00D4AA]" />
              <span>WHITEPAPER LESEN</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/api/download/udo-installer.exe';
                link.download = 'UDO_2032_Medical_Command_Setup_v2.0.0.exe';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B87333]/20 via-[#CD7F32]/30 to-[#B87333]/20 border border-[#B87333]/50 hover:border-[#B87333] text-[#E8A87C] hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(184,115,51,0.2)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#00D4AA]" />
              <span>DOWNLOAD UDO APP (.EXE)</span>
            </motion.button>

            {/* BILINGUAL USER GUIDE HELP BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.pushState({}, '', '/help');
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 backdrop-blur-sm font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>HELP</span>
            </motion.button>

            {/* RESTART/SHOW LOADING SCREEN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLoadingComplete(false)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>SHOW LOADING SCREEN</span>
            </motion.button>
          </div>

          {/* 4. FOOTER */}
          <footer className="pt-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            © 2026 UDO Medical Systems · AES-256 · ISO 13485
          </footer>
        </motion.div>
      )}

      {/* WHITEPAPER MODAL */}
      <WhitepaperModal
        isOpen={isWhitepaperOpen}
        onClose={() => setIsWhitepaperOpen(false)}
      />

      {/* UDO PRESENTATION MODAL */}
      <UdoPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}

export default WelcomePage;
