import React, { useRef, useState } from 'react';
import {
  BrainCircuit,
  Upload,
  Bell,
  Settings,
  X,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Mic,
  BookOpen,
  Zap,
  PanelRightOpen,
  FileText
} from 'lucide-react';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { useGlobalSystem } from './GlobalSystemContext';
import { ActiveTab } from '../types';
import { MicState } from '../hooks/useWakeWord';
import { AudioFeedbackIndicator } from './AudioFeedbackIndicator';

interface TopSystemBarProps {
  activeModuleName?: string;
  onResetToMain?: () => void;
  onDrBubbleTrigger?: (msg: string) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  micState?: MicState;
  onOpenVoicePanel?: () => void;
  onToggleSideDocs?: () => void;
  onOpenSideDocsTab?: (tab: 'docs' | 'functions' | 'voice_specs' | 'status_cases') => void;
  sideDocsOpen?: boolean;
  onOpenPatientOverview?: () => void;
  patientOverviewOpen?: boolean;
}

export const TopSystemBar: React.FC<TopSystemBarProps> = ({
  activeModuleName = 'HAUPTRAUM HUB',
  onResetToMain,
  onDrBubbleTrigger,
  onSelectTab,
  micState = 'idle',
  onOpenVoicePanel,
  onToggleSideDocs,
  onOpenSideDocsTab,
  sideDocsOpen = false,
  onOpenPatientOverview,
  patientOverviewOpen = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { language, setLanguage } = useGlobalSystem();

  const { role, user, isAdmin, selectRole, clearRole } = useRoleContext();
  const { pendingCount } = usePrescriptionContext();

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      if (onDrBubbleTrigger) {
        onDrBubbleTrigger(`Akte ${fileName} hochgeladen. S2k-Pipeline verarbeitet Dokument...`);
      }
    }
  };

  const isAnyModalOpen = notificationsOpen || settingsOpen || roleMenuOpen;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleDeviceUpload}
      />

      <div className="fixed top-0 left-0 right-0 z-[100] group/topbar pointer-events-auto">
        {/* TOP EDGE CURSOR SENSOR */}
        <div className="h-3 w-full absolute top-0 left-0 z-[101]" />

        <header
          className={`h-14 bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-cyan-500/30 px-2 sm:px-4 flex items-center justify-between max-w-[1920px] mx-auto w-full shadow-[0_8px_32px_rgba(0,0,0,0.95)] transition-all duration-300 ease-out transform ${
            isAnyModalOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-[calc(100%-6px)] group-hover/topbar:translate-y-0 hover:translate-y-0 focus-within:translate-y-0 opacity-90 hover:opacity-100'
          }`}
        >
          {/* TOP SLIDER INDICATOR BAR */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#00d4aa] group-hover/topbar:opacity-0 transition-opacity" />
        {/* TOP LEFT: BRAND & ACTIVE MODULE INDICATOR */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={onResetToMain}
            className="flex items-center gap-2 cursor-pointer group"
            title="Zurück zum Hauptraum"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 p-0.5 shadow-[0_0_15px_rgba(0,212,170,0.4)] group-hover:shadow-[0_0_20px_rgba(0,212,170,0.6)] transition-all duration-200 shrink-0">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="hidden md:block">
              <span className="font-extrabold text-white text-sm tracking-wide block leading-none font-sans">
                UDO S2k
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mt-0.5">
                Forensic Hub
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 mx-0.5 hidden md:block" />

          {/* ACTIVE MODULE PULSE INDICATOR */}
          <div className="hidden sm:flex items-center border border-cyan-500/30 shadow-[0_2px_10px_rgba(0,212,170,0.15)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-cyan-500/10">
            <span className="relative flex h-2 w-2 mr-1.5 sm:mr-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(0,212,170,0.6)]" />
            </span>
            <span className="text-cyan-300 font-bold tracking-wide uppercase text-[10px] sm:text-xs font-mono truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {activeModuleName}
            </span>
          </div>
        </div>

        {/* TOP CENTER: STATUS INDICATORS CHIPS WITH GLOW DOTS & ADMIN PENDING REZEPTE BADGE */}
        <div className="hidden xl:flex items-center gap-2 font-mono shrink-0">
          {/* TOP BAR BADGE FOR ADMIN WHEN LOGGED IN */}
          {isAdmin && (
            <div
              onClick={() => onSelectTab && onSelectTab('approvals')}
              className="flex items-center gap-1.5 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-md px-2.5 py-1 animate-pulse cursor-pointer hover:bg-cyan-500/20 transition-all"
              title="Zur Genehmigungs-Queue wechseln"
            >
              <Clock className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {pendingCount} REZEPTE AUSSTEHEND
              </span>
            </div>
          )}

          <button
            onClick={() => onOpenSideDocsTab?.('status_cases')}
            className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-md px-2.5 py-1 hover:bg-rose-500/10 hover:border-rose-500/30 cursor-pointer transition-all"
            title="Kritische Fälle im Seitenpanel öffnen"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
            <span className="text-xs font-mono text-rose-400 font-bold">2 KRITISCH</span>
          </button>
          <button
            onClick={() => onOpenSideDocsTab?.('status_cases')}
            className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-md px-2.5 py-1 hover:bg-amber-500/10 hover:border-amber-500/30 cursor-pointer transition-all"
            title="Prüffälle im Seitenpanel öffnen"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <span className="text-xs font-mono text-amber-400 font-bold">2 PRÜFUNG</span>
          </button>
        </div>

        {/* TOP RIGHT: ICON BUTTONS & ROLE CHIP */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PATIENT OVERVIEW MODAL/PANEL TRIGGER BUTTON */}
          <button
            onClick={onOpenPatientOverview}
            className={`px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              patientOverviewOpen
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,212,170,0.5)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300'
            }`}
            title="Patienten-Akte & KI-Scan Übersicht (Patient Overview)"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline uppercase text-[10px] tracking-wider">
              Pat-Akte
            </span>
          </button>

          {/* BARRIEREFREIES AUDIO FEEDBACK INDICATOR */}
          <AudioFeedbackIndicator />

          {/* DEDICATED S2K DOCS & QUICK TOOLS SIDE PANEL TRIGGER */}
          <button
            onClick={onToggleSideDocs}
            className={`px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              sideDocsOpen
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,212,170,0.5)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300'
            }`}
            title="S2k Dokumentation & Funktionen Seitenpanel (Side Docs)"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline uppercase text-[10px] tracking-wider">
              S2k Docs
            </span>
          </button>

          {/* ALWAYS-VISIBLE VOICE WAKE-WORD MIC STATUS BADGE */}
          <button
            onClick={onOpenVoicePanel}
            className={`px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              micState === 'listening'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse'
                : micState === 'processing'
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : micState === 'speaking'
                ? 'bg-[#B87333]/20 border-[#B87333]/50 text-[#E8A87C] shadow-[0_0_12px_rgba(184,115,51,0.4)]'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_8px_rgba(0,212,170,0.2)]'
            }`}
            title="UDO Voice Assistant 'Hey UDO' umschalten"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                micState === 'listening' ? 'bg-emerald-400' : micState === 'processing' ? 'bg-violet-400' : micState === 'speaking' ? 'bg-[#B87333]' : 'bg-cyan-400'
              } opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                micState === 'listening' ? 'bg-emerald-500' : micState === 'processing' ? 'bg-violet-500' : micState === 'speaking' ? 'bg-[#B87333]' : 'bg-cyan-500'
              }`} />
            </span>
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden md:inline tracking-wider uppercase text-[10px]">
              {micState === 'listening' ? 'HÖRT ZU' : micState === 'processing' ? 'ANALYSE' : micState === 'speaking' ? 'VOICE' : 'HEY UDO'}
            </span>
          </button>

          {/* ROLE SWITCHER CHIP */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={`px-2 sm:px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-[#B87333]/20 border-[#B87333]/50 text-[#E8A87C] shadow-[0_0_10px_rgba(184,115,51,0.2)] hover:border-[#E8A87C]'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.2)] hover:border-cyan-400'
              }`}
              title="Rolle umschalten"
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8A87C] shrink-0" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              <span className="hidden md:inline">
                {user ? user.name : 'Rolle wählen'}
              </span>
              <RefreshCw className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />
            </button>

            {/* ROLE DROPDOWN MENU */}
            {roleMenuOpen && (
              <div className="absolute right-0 top-11 w-64 bg-[#111217] border border-white/15 rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] space-y-2 z-[150] text-xs font-sans animate-fade-in">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-white/10 font-bold">
                  Aktuelles Profil: {user?.label}
                </div>

                <button
                  onClick={() => {
                    selectRole('main');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-mono ${
                    role === 'main'
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Dr. med. A. Voss (Haupt)</span>
                  </div>
                  {role === 'main' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                <button
                  onClick={() => {
                    selectRole('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-mono ${
                    role === 'admin'
                      ? 'bg-[#B87333]/20 border border-[#B87333]/50 text-[#E8A87C] font-bold'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#E8A87C]" />
                    <span>Frau Dr. med. Ulrike Bongartz (Admin)</span>
                  </div>
                  {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-[#E8A87C]" />}
                </button>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      clearRole();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-mono text-xs flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Abmelden / Rollenauswahl</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* GERÄT-UPLOAD GHOST BUTTON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-300 text-xs font-medium hover:text-cyan-300 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-cyan-500/30 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            title="Vom Gerät hochladen / Import"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline uppercase tracking-wider font-mono">
              Gerät-Upload
            </span>
          </button>

          {/* LANGUAGE TOGGLE */}
          <button
            onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer"
            title={language === 'de' ? "Sprache wechseln (EN)" : "Switch Language (DE)"}
          >
            {language.toUpperCase()}
          </button>

          {/* NOTIFICATION BELL */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,212,170,0.2)] transition-all duration-200 relative cursor-pointer"
            title="Benachrichtigungen"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {/* AVATAR */}
          <div
            onClick={() => setSettingsOpen(true)}
            className={`h-9 w-9 rounded-full text-white font-bold text-xs flex items-center justify-center border-2 border-white/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,212,170,0.4)] transition-all duration-200 cursor-pointer select-none ${
              isAdmin
                ? 'bg-gradient-to-br from-[#B87333] to-violet-600'
                : 'bg-gradient-to-br from-cyan-500 to-teal-500'
            }`}
            title={user ? user.label : 'Benutzer'}
          >
            {isAdmin ? 'EB' : 'AV'}
          </div>

          {/* SETTINGS GEAR */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,212,170,0.2)] transition-all duration-200 cursor-pointer"
            title="System Einstellungen"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>
      </div>

      {/* NOTIFICATIONS MODAL */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-md bg-[#111217] border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-sm">
                <Bell className="w-4 h-4" />
                <span>Forensische Meldungen (3)</span>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-rose-200">🚨 Fall Hans Müller:</span>
                  MRT L4/L5 Bandscheiben-Kompression erfordert unmittelbare S2k-Validierung.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-200">⚠️ QES-Signatur ausstehend:</span>
                  3 Entwürfe bereit für Qualifizierte Elektronische Signatur (eIDAS).
                </div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-cyan-200">✅ KI-Konsens Erreicht:</span>
                  99.2% Einstimmigkeit für BG-2026-9901-A erzielt.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setNotificationsOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase cursor-pointer hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,212,170,0.3)]"
              >
                Gelesen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-lg bg-[#111217] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-sm">
                <Cpu className="w-4 h-4" />
                <span>System Einstellungen & S2k Engine</span>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span>Passiver 'UDO' Voice Engine Scanner</span>
                <span className="text-cyan-400 font-bold">AKTIV (48 kHz)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span>KI-Konsens Modus (Clara, Eric, Marcel, Gratsiano)</span>
                <span className="text-emerald-400 font-bold">PARALLEL (S2k)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span>AWMF S2k-Leitlinien Database</span>
                <span className="text-teal-400 font-bold">v2026.2 (AWMF.org)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span>OCR Pipeline & Layout Detection</span>
                <span className="text-violet-400 font-bold">GPU ACCELERATED</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase cursor-pointer hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,212,170,0.3)]"
              >
                Speichern & Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
