import React, { useState, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TopSystemBar } from './TopSystemBar';
import { BottomDock } from './BottomDock';
import { ParticleBackground } from './ParticleBackground';
import { ActiveTab } from '../types';
import { useWakeWord } from '../hooks/useWakeWord';
import { VoiceChatPanel } from './VoiceChatPanel';
import { SideDocsPanel } from './SideDocsPanel';

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
        onResetToMain={() => onSelectTab(null)}
        onDrBubbleTrigger={onDrBubbleTrigger}
        onSelectTab={onSelectTab}
        micState={wakeWord.micState}
        onOpenVoicePanel={() => {
          setVoicePanelOpen(true);
          wakeWord.manualWakeTrigger();
        }}
        onToggleSideDocs={() => setSideDocsOpen(!sideDocsOpen)}
        onOpenSideDocsTab={() => setSideDocsOpen(true)}
        sideDocsOpen={sideDocsOpen}
      />

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
      <BottomDock activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
};
