import React from 'react';
import {
  Home,
  BarChart3,
  Mic,
  FolderOpen,
  FileText,
  Activity,
  Video,
  Calendar,
  Key,
  ShieldCheck,
  X,
  FileCheck2,
  Lock,
  UserPlus,
  ClipboardList,
  Sparkles,
  BookOpen
} from 'lucide-react';
import DeviceIcon from './dock/DeviceIcon';
import { ActiveTab } from '../types';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';

interface BottomDockProps {
  activeTab: ActiveTab | null;
  onSelectTab: (tab: ActiveTab | null) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTab,
  onSelectTab
}) => {
  const { isAdmin } = useRoleContext();
  const { pendingCount } = usePrescriptionContext();

  const dockItems: { id: ActiveTab | null; label: string; icon: React.ReactNode; colorClass: string; title: string; badge?: number }[] = [
    { id: null, label: 'Hauptraum', icon: <Home className="w-4 h-4 text-cyan-400 shrink-0" />, colorClass: 'text-cyan-400', title: 'Hauptraum Canvas' },
    { id: 'devices', label: 'Geräte', icon: <DeviceIcon size={16} className="text-cyan-400" />, colorClass: 'text-cyan-400', title: 'Medizinische Geräte-Integration & Queue' },
    { id: 'dictate', label: 'Diktat', icon: <Mic className="w-4 h-4 text-violet-400 shrink-0 animate-pulse" />, colorClass: 'text-violet-400', title: 'Sprach-Diktat & AI-S2k-Drafting' },
    { id: 'gutachten', label: 'Gutachten', icon: <FileText className="w-4 h-4 text-emerald-400 shrink-0" />, colorClass: 'text-emerald-400', title: 'S2k Gutachten Generator' },
    { id: 'insurance', label: 'Kosten', icon: <FileCheck2 className="w-4 h-4 text-cyan-300 shrink-0" />, colorClass: 'text-cyan-300', title: 'Versicherungs- & Kostenübernahme' },
    { id: 'analytics', label: 'KPIs', icon: <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />, colorClass: 'text-indigo-400', title: 'Praxis Performance Analytics' },
    { id: 'retention', label: 'DSGVO Fristen', icon: <Lock className="w-4 h-4 text-rose-400 shrink-0" />, colorClass: 'text-rose-400', title: '10 Jahre Retention Monitor' },
    { id: 'audit', label: 'Audit Log', icon: <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />, colorClass: 'text-emerald-400', title: 'Unveränderbares Revisions-Protokoll' },
    { id: 'portal', label: 'Portal', icon: <ClipboardList className="w-4 h-4 text-violet-300 shrink-0" />, colorClass: 'text-violet-300', title: 'Patienten-Portal & Screening' },
    { id: 'intake', label: 'Intake', icon: <UserPlus className="w-4 h-4 text-teal-300 shrink-0" />, colorClass: 'text-teal-300', title: 'Patienten-Aufnahmebogen' },
    { id: 'calendar', label: 'Kalender', icon: <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />, colorClass: 'text-indigo-400', title: 'Kalender & Termine' },
    { id: 'documents', label: 'OCR', icon: <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />, colorClass: 'text-cyan-400', title: 'Dokumenten OCR Board' },
    { id: 'whitepaper', label: 'Whitepaper', icon: <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />, colorClass: 'text-violet-400', title: 'System Whitepaper & Spezifikationen' },
    { id: 'admin', label: 'Admin', icon: <Key className="w-4 h-4 text-rose-400 shrink-0" />, colorClass: 'text-rose-400', title: 'Admin & API Keys' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/10 px-4 flex items-center justify-center shadow-[0_-4px_30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
        {dockItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.label}
              onClick={() => onSelectTab(item.id)}
              className={`bg-white/5 backdrop-blur-md border rounded-xl px-3.5 py-2 text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 active:shadow-[0_0_8px_rgba(0,212,170,0.15)] hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,212,170,0.25)] hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-[0_0_20px_rgba(0,212,170,0.35)] font-semibold'
                  : 'border-white/10 text-slate-300'
              }`}
              title={item.title}
            >
              {item.icon}
              <span className="uppercase text-[11px] font-mono tracking-wider">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold rounded-md animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* CLOSE / X BUTTON IN DOCK WHEN A TAB IS ACTIVE */}
        {activeTab !== null && (
          <button
            onClick={() => onSelectTab(null)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:text-rose-300 transition-all duration-200 active:scale-90 cursor-pointer shrink-0 ml-1"
            title="Panel Schließen & Zurück zum Hauptraum"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </footer>
  );
};
