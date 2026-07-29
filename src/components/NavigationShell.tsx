import React, { useState, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TopSystemBar } from './TopSystemBar';
import { BottomDock } from './BottomDock';
import { ParticleBackground } from './ParticleBackground';
import { ActiveTab } from '../types';
import { useWakeWord } from '../hooks/useWakeWord';
import { VoiceChatPanel } from './VoiceChatPanel';
import { SideDocsPanel } from './SideDocsPanel';
import { PatientOverview } from './PatientOverview';

interface NavigationShellProps {
  children: React.ReactNode;
  activeTab: ActiveTab | null;
  onSelectTab: (tab: ActiveTab | null) => void;
  activeModuleName?: string;
  drBubbleMessage?: string | null;
  onCloseDrBubble?: () => void;
  onDrBubbleTrigger?: (msg: string) => void;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({
  children,
  activeTab,
  onSelectTab,
  activeModuleName,
  drBubbleMessage,
  onCloseDrBubble,
  onDrBubbleTrigger
}) => {
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [sideDocsOpen, setSideDocsOpen] = useState(false);
  const [patientOverviewOpen, setPatientOverviewOpen] = useState(false);

  // Home button minimizes everything except background animation
  const handleSelectTab = useCallback((tab: ActiveTab | null) => {
    if (tab === null) {
      setVoicePanelOpen(false);
      setSideDocsOpen(false);
      setPatientOverviewOpen(false);
      if (onCloseDrBubble) {
        onCloseDrBubble();
      }
    }
    onSelectTab(tab);
  }, [onSelectTab, onCloseDrBubble]);

  React.useEffect(() => {
    if (activeTab === null) {
      setVoicePanelOpen(false);
      setSideDocsOpen(false);
      setPatientOverviewOpen(false);
      if (onCloseDrBubble) {
        onCloseDrBubble();
      }
    }
  }, [activeTab, onCloseDrBubble]);

  const handleWakeWordDetected = useCallback(() => {
    setVoicePanelOpen(true);
  }, []);

  const wakeWord = useWakeWord({
    onWakeWordDetected: handleWakeWordDetected
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 3D PARTICLE STARFIELD BACKGROUND */}
      <ParticleBackground />

      {/* TOP SYSTEM BAR */}
      <TopSystemBar
        activeModuleName={activeModuleName}
        onResetToMain={() => handleSelectTab(null)}
        onDrBubbleTrigger={onDrBubbleTrigger}
        onSelectTab={handleSelectTab}
        micState={wakeWord.micState}
        onOpenVoicePanel={() => {
          setVoicePanelOpen(true);
          wakeWord.manualWakeTrigger();
        }}
        onToggleSideDocs={() => setSideDocsOpen(!sideDocsOpen)}
        onOpenSideDocsTab={() => setSideDocsOpen(true)}
        sideDocsOpen={sideDocsOpen}
        onOpenPatientOverview={() => setPatientOverviewOpen(!patientOverviewOpen)}
        patientOverviewOpen={patientOverviewOpen}
      />

      {/* PATIENT OVERVIEW OVERLAY DRAWER */}
      {patientOverviewOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex justify-end animate-fade-in">
          <div className="w-full max-w-4xl h-full bg-[#0a0a0f] border-l border-cyan-500/30 p-6 overflow-y-auto shadow-2xl relative">
            <PatientOverview
              isModal={true}
              onClose={() => setPatientOverviewOpen(false)}
              onSelectTab={(tab) => {
                setPatientOverviewOpen(false);
                handleSelectTab(tab);
              }}
            />
          </div>
        </div>
      )}

      {/* SIDE DOCS & QUICK FUNCTIONS PANEL */}
      <SideDocsPanel
        isOpen={sideDocsOpen}
        onClose={() => setSideDocsOpen(false)}
        onToggle={() => setSideDocsOpen(!sideDocsOpen)}
        onTriggerDrBubble={onDrBubbleTrigger}
        onOpenVoicePanel={() => {
          setVoicePanelOpen(true);
          wakeWord.manualWakeTrigger();
        }}
      />

      {/* DR. BUBBLE ASSISTANT NOTIFICATION POPUP */}
      {drBubbleMessage && (
        <div className="fixed bottom-24 right-6 z-[110] max-w-sm bg-[#111217]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,212,170,0.3)] animate-fade-in flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,212,170,0.5)]">
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
          </div>
          <div className="flex-1 text-xs text-slate-200 font-sans leading-relaxed">
            <div className="font-mono text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider mb-0.5">
              UDO Forensic Assistant
            </div>
            {drBubbleMessage}
          </div>
          <button
            onClick={onCloseDrBubble}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 pt-16 pb-24 relative z-10 min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      {/* VOICE CHAT PANEL (WAKE WORD & DEEPSEEK) */}
      <VoiceChatPanel
        isOpen={voicePanelOpen}
        onClose={() => setVoicePanelOpen(false)}
        micState={wakeWord.micState}
        setMicState={wakeWord.setMicState}
        hasPermission={wakeWord.hasPermission}
        permissionError={wakeWord.permissionError}
        onRequestPermission={wakeWord.requestMicPermission}
        liveTranscript={wakeWord.liveTranscript}
        wakeMatchedPhrase={wakeWord.wakeMatchedPhrase}
        onSendPrompt={(prompt) => {
          setVoicePanelOpen(true);
        }}
        manualWakeTrigger={() => {
          setVoicePanelOpen(true);
          wakeWord.manualWakeTrigger();
        }}
      />

      {/* BOTTOM COMMAND DOCK */}
      <BottomDock activeTab={activeTab} onSelectTab={handleSelectTab} />
    </div>
  );
};
