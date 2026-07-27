import React from 'react';
import {
  Home,
  BarChart3,
  Mic,
  FolderOpen,
  FileText,
  Activity,
  Calendar,
  Key,
  ShieldCheck,
  X,
  FileCheck2,
  Lock,
  UserPlus,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import DeviceIcon from './dock/DeviceIcon';
import { ActiveTab } from '../types';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { useGlobalSystem } from './GlobalSystemContext';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock';

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
  const { language } = useGlobalSystem();

  const isDe = language === 'de';

  const dockItems: { id: ActiveTab | null; label: string; icon: React.ReactNode; title: string; badge?: number }[] = [
    { id: null, label: isDe ? 'Hauptraum' : 'Home', icon: <Home className="w-5 h-5 text-cyan-400 shrink-0" />, title: isDe ? 'Hauptraum Übersicht' : 'Home Dashboard' },
    { id: 'devices', label: isDe ? 'Geräte' : 'Devices', icon: <DeviceIcon size={20} className="text-cyan-400 shrink-0" />, title: isDe ? 'Medizinische Geräte' : 'Medical Devices' },
    { id: 'dictate', label: isDe ? 'Diktat' : 'Dictate', icon: <Mic className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />, title: isDe ? 'Sprach-Diktat' : 'Voice Dictation' },
    { id: 'gutachten', label: isDe ? 'Gutachten' : 'Reports', icon: <FileText className="w-5 h-5 text-emerald-400 shrink-0" />, title: isDe ? 'S2k Gutachten' : 'S2k Reports' },
    { id: 'insurance', label: isDe ? 'Kosten' : 'Costs', icon: <FileCheck2 className="w-5 h-5 text-cyan-300 shrink-0" />, title: isDe ? 'Kostenübernahme' : 'Costs & Insurance' },
    { id: 'analytics', label: isDe ? 'Statistik' : 'Analytics', icon: <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" />, title: isDe ? 'Praxis Performance' : 'Practice Analytics' },
    { id: 'retention', label: isDe ? 'DSGVO' : 'GDPR', icon: <Lock className="w-5 h-5 text-rose-400 shrink-0" />, title: isDe ? 'Fristen & Retention' : 'GDPR Retention' },
    { id: 'audit', label: isDe ? 'Audit' : 'Audit', icon: <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />, title: isDe ? 'Revisions-Protokoll' : 'Audit Protocol' },
    { id: 'portal', label: isDe ? 'Portal' : 'Portal', icon: <ClipboardList className="w-5 h-5 text-violet-300 shrink-0" />, title: isDe ? 'Patienten-Portal' : 'Patient Portal', badge: pendingCount },
    { id: 'intake', label: isDe ? 'Aufnahme' : 'Intake', icon: <UserPlus className="w-5 h-5 text-teal-300 shrink-0" />, title: isDe ? 'Patienten-Aufnahme' : 'Patient Intake' },
    { id: 'calendar', label: isDe ? 'Kalender' : 'Calendar', icon: <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />, title: isDe ? 'Terminkalender' : 'Appointment Calendar' },
    { id: 'documents', label: isDe ? 'Dokumente' : 'Documents', icon: <FolderOpen className="w-5 h-5 text-cyan-400 shrink-0" />, title: isDe ? 'Dokumente & OCR' : 'Documents & OCR' },
    { id: 'whitepaper', label: isDe ? 'Whitepaper' : 'Whitepaper', icon: <BookOpen className="w-5 h-5 text-violet-400 shrink-0" />, title: isDe ? 'System Whitepaper' : 'System Whitepaper' },
    { id: 'admin', label: isDe ? 'Admin' : 'Admin', icon: <Key className="w-5 h-5 text-rose-400 shrink-0" />, title: isDe ? 'System Einstellungen' : 'System Admin' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[100] pb-3 pt-1 px-2 bg-transparent pointer-events-none flex items-center justify-center overflow-x-auto no-scrollbar">
      <Dock magnification={160} distance={200} panelHeight={64} className="items-end bg-[#11131f]/95 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl px-3 py-1.5 gap-2 sm:gap-3 rounded-2xl max-w-full pointer-events-auto">
        {dockItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <DockItem
              key={item.id ?? 'home'}
              onClick={() => onSelectTab(item.id)}
              title={item.title}
              className={`aspect-square rounded-2xl transition-all duration-200 flex flex-col items-center justify-center relative ${
                isActive
                  ? 'bg-gradient-to-b from-cyan-500/35 to-cyan-700/25 border border-cyan-400 text-white shadow-[0_0_22px_rgba(0,212,170,0.45)] scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15 hover:border-white/20 hover:text-white'
              }`}
            >
              <DockLabel className="font-bold tracking-wider uppercase text-[10px] text-cyan-200 bg-[#0c0e17] border border-cyan-500/30">
                {item.label}
              </DockLabel>
              <DockIcon className="w-full h-full flex items-center justify-center">
                {item.icon}
              </DockIcon>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold rounded-full border border-cyan-200 animate-pulse shadow-[0_0_8px_#00d4aa]">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d4aa]" />
              )}
            </DockItem>
          );
        })}

        {/* CLOSE BUTTON DOCK ITEM WHEN A TAB IS ACTIVE */}
        {activeTab !== null && (
          <DockItem
            onClick={() => onSelectTab(null)}
            title={isDe ? "Schließen & Zurück" : "Close & Back"}
            className="aspect-square rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/35 hover:border-rose-400 hover:text-white transition-all duration-200 ml-1"
          >
            <DockLabel className="text-rose-200 bg-[#170a0d] border border-rose-500/40 font-bold uppercase text-[10px]">
              {isDe ? 'Schließen' : 'Close'}
            </DockLabel>
            <DockIcon className="w-full h-full flex items-center justify-center">
              <X className="w-5 h-5 text-rose-300" />
            </DockIcon>
          </DockItem>
        )}
      </Dock>
    </footer>
  );
};


