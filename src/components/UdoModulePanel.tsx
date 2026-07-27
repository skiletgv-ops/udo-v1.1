import React, { useState } from 'react';
import {
  BrainCircuit,
  X,
  Mic,
  Activity,
  Video,
  Sparkles,
  BarChart3,
  ShieldCheck,
  FolderUp,
  FileSearch,
  Eye,
  Zap
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock';

interface UdoModulePanelProps {
  activeTab: ActiveTab | null;
  onSelectTab: (tab: ActiveTab | null) => void;
  onClose: () => void;
  onDrBubbleTrigger?: (msg: string) => void;
}

export const UdoModulePanel: React.FC<UdoModulePanelProps> = ({
  activeTab,
  onSelectTab,
  onClose,
  onDrBubbleTrigger
}) => {
  const { isAdmin } = useRoleContext();
  const { pendingCount } = usePrescriptionContext();
  const [showMatrixCard, setShowMatrixCard] = useState(false);

  // Non-repeating specialized workspace functions (distinct from bottom dock)
  const leftDockFunctions = [
    {
      id: 'scan' as ActiveTab,
      label: 'KI-Agenten Scan',
      title: 'Neuraler S2k Scan Engine',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'review' as ActiveTab,
      label: 'Befunde Review',
      title: 'Multimodale Befundanalyse',
      icon: <Eye className="w-5 h-5 text-teal-300" />
    },
    {
      id: 'eeg' as ActiveTab,
      label: 'EEG Workspace',
      title: 'Echtzeit EEG Signalverarbeitung',
      icon: <Activity className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'video' as ActiveTab,
      label: 'Video Analyse',
      title: 'Biometrische Bewegungsanalyse',
      icon: <Video className="w-5 h-5 text-violet-400" />
    },
    {
      id: 'consult' as ActiveTab,
      label: 'Voice Consult',
      title: 'U.D.O. S2k Sprach-Konsil',
      icon: <Mic className="w-5 h-5 text-rose-400 animate-pulse" />
    },
    {
      id: 'upload' as ActiveTab,
      label: 'Patient Upload',
      title: 'Akte & DICOM Import',
      icon: <FolderUp className="w-5 h-5 text-cyan-300" />
    },
    ...(isAdmin
      ? [
          {
            id: 'approvals' as ActiveTab,
            label: 'Genehmigungen',
            title: 'QES Rezept-Freigabe',
            icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
            badge: pendingCount
          }
        ]
      : []),
    {
      id: 'dashboard' as ActiveTab,
      label: 'Executive Board',
      title: 'Praxis KPI & Management',
      icon: <BarChart3 className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <aside className="fixed left-3 top-18 z-[95] flex items-start gap-3 pointer-events-auto max-h-[calc(100vh-10rem)]">
      {/* VERTICAL LEFT DOCK */}
      <Dock
        orientation="vertical"
        magnification={160}
        distance={200}
        panelWidth={64}
        className="bg-[#11131f]/95 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-2 gap-3 rounded-2xl"
      >
        {/* CLOSE LEFT MENU BUTTON */}
        <DockItem
          onClick={onClose}
          title="Menü Schließen"
          className="aspect-square rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/35 hover:border-rose-400 hover:text-white transition-all"
        >
          <DockLabel className="text-rose-200 bg-[#170a0d] border border-rose-500/40 font-bold uppercase text-[10px]">
            Schließen
          </DockLabel>
          <DockIcon className="w-full h-full flex items-center justify-center">
            <X className="w-5 h-5 text-rose-300" />
          </DockIcon>
        </DockItem>

        {/* 4-KI KONSENS TOGGLE ITEM */}
        <DockItem
          onClick={() => setShowMatrixCard(!showMatrixCard)}
          title="4-KI-Konsens Status"
          className={`aspect-square rounded-2xl transition-all ${
            showMatrixCard
              ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,212,170,0.4)]'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15'
          }`}
        >
          <DockLabel className="text-cyan-300 bg-[#0c1420] border border-cyan-500/30 font-bold uppercase text-[10px]">
            4-KI Matrix
          </DockLabel>
          <DockIcon className="w-full h-full flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
          </DockIcon>
        </DockItem>

        {/* FUNCTION ITEMS */}
        {leftDockFunctions.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <DockItem
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
              }}
              title={item.title}
              className={`aspect-square rounded-2xl transition-all relative ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500/35 to-violet-700/30 border border-cyan-400 text-white shadow-[0_0_22px_rgba(0,212,170,0.45)]'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15 hover:border-white/20 hover:text-white'
              }`}
            >
              <DockLabel className="text-cyan-200 bg-[#0c0e17] border border-cyan-500/30 font-bold uppercase text-[10px]">
                {item.label}
              </DockLabel>
              <DockIcon className="w-full h-full flex items-center justify-center">
                {item.icon}
              </DockIcon>
              {(item as any).badge !== undefined && (item as any).badge > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold rounded-full border border-cyan-200 animate-pulse shadow-[0_0_8px_#00d4aa]">
                  {(item as any).badge}
                </span>
              )}
              {isActive && (
                <span className="absolute -right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d4aa]" />
              )}
            </DockItem>
          );
        })}
      </Dock>

      {/* OPTIONAL POPUP CARD FOR 4-KI CONSENSUS MATRIX */}
      {showMatrixCard && (
        <div className="w-64 p-4 rounded-2xl bg-[#0e1017]/95 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-2xl space-y-3 font-sans animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              4-KI-KONSENS MATRIX
            </span>
            <button
              onClick={() => setShowMatrixCard(false)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300 font-bold">Dr. Clara (Vision)</span>
              <span className="text-cyan-400 font-bold">99.8%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300 font-bold">Dr. Eric (NLP S2k)</span>
              <span className="text-violet-400 font-bold">99.4%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300 font-bold">Dr. Marcel (Signal)</span>
              <span className="text-teal-400 font-bold">97.9%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300 font-bold">Dr. Gratsiano (Logic)</span>
              <span className="text-amber-400 font-bold">99.6%</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onDrBubbleTrigger) {
                onDrBubbleTrigger('4-KI-Konsens-Validierung gestartet. 99.2% Übereinstimmung.');
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-mono font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer text-center"
          >
            Konsens-Prüfung Starten
          </button>
        </div>
      )}
    </aside>
  );
};
