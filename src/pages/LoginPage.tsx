import React from 'react';
import {
  BrainCircuit,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { selectRole } = useRoleContext();
  const { addToast } = usePrescriptionContext();

  const handleSelectMain = () => {
    selectRole('main');
    addToast('Angemeldet als Dr. med. A. Voss (Hauptaccount)', 'info');
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSelectAdmin = () => {
    selectRole('admin');
    addToast('Angemeldet als Prof. Dr. med. E. Bongartz (Admin)', 'success');
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* BACKGROUND GLOW ORBS */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#B87333]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#111217]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-8 relative z-10 animate-fade-in">
        {/* LOGO & TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 p-0.5 shadow-[0_0_15px_rgba(0,212,170,0.5)]">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-xs font-mono font-extrabold text-cyan-400 tracking-wider uppercase">
              UDO S2k Forensic Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rollenauswahl & System-Authentifizierung
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans">
            Wählen Sie Ihr Benutzerprofil für den gesicherten Zugang zum S2k-Gutachten-System und dem zweistufigen Rezept-Genehmigungsworkflow.
          </p>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. MAIN ACCOUNT CARD */}
          <div
            onClick={handleSelectMain}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,212,170,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,212,170,0.3)] group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  FACHARZT ROLE
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  Hauptaccount — Dr. med. A. Voss
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Facharzt für Orthopädie & Forensik
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-sans text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Alle Patientendaten & S2k-Akten einsehen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Rezepte erstellen & als Entwurf speichern</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Rezepte zur Chefärztin-Freigabe einreichen</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Keine direkte Freigabeberechtigung für Apotheke</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectMain}
              className="w-full py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,212,170,0.2)]"
            >
              <span>Als Hauptaccount anmelden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. ADMIN ACCOUNT CARD */}
          <div
            onClick={handleSelectAdmin}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-[#B87333]/40 hover:border-[#E8A87C] hover:shadow-[0_0_35px_rgba(184,115,51,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/15 rounded-full blur-2xl group-hover:bg-[#B87333]/25 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#B87333]/20 border border-[#B87333]/50 flex items-center justify-center text-[#E8A87C] shadow-[0_0_20px_rgba(184,115,51,0.3)] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-[#E8A87C]" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#B87333]/20 border border-[#B87333]/40 text-[#E8A87C]">
                  CHEFÄRZTIN ROLE
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-[#E8A87C] transition-colors">
                  Admin — Prof. Dr. med. E. Bongartz
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Chefärztin & Forensische Hauptgutachterin
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-sans text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E8A87C] shrink-0" />
                  <span>Vollzugriff auf alle System- & Aktenbereiche</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E8A87C] shrink-0" />
                  <span>Exklusiver Zugriff auf "Genehmigungs-Queue"</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E8A87C] shrink-0" />
                  <span>Rezept-Freigabe & Endgültige Ablehnung</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E8A87C] shrink-0" />
                  <span>QES-Signatur & eIDAS Ausführung</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectAdmin}
              className="w-full py-3 rounded-xl bg-[#B87333]/20 border border-[#B87333]/50 text-[#E8A87C] group-hover:bg-[#B87333] group-hover:text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(184,115,51,0.2)]"
            >
              <span>Als Admin anmelden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECURITY & COMPLIANCE FOOTER NOTE */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Lokale Rollenspeicherung im Browser-Kontext</span>
          </div>
          <span className="text-slate-500">UDO S2k v2026.2 Compliance Standard</span>
        </div>
      </div>
    </div>
  );
};
