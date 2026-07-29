import React from 'react';
import SystemWhitepaper from './SystemWhitepaper';
import { StatusBar } from './StatusBar';
import SynapseBackground from './ui/synapse-background';

export interface WhitepaperPageProps {
  onNavigateToPortal: () => void;
}

export const WhitepaperPage: React.FC<WhitepaperPageProps> = ({ onNavigateToPortal }) => {
  return (
    <SynapseBackground
      lineColor={0x0ea5e9}
      particleColor={0x38bdf8}
      pulseColor={0xd946ef}
      connectionDistance={75}
      particleCount={1200}
      className="fixed inset-0 bg-[#020813] text-white overflow-y-auto font-sans min-h-screen"
    >
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <StatusBar
          onBack={onNavigateToPortal}
          backLabel="Portal"
          className="pointer-events-auto"
        />

        <main className="pointer-events-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
          <SystemWhitepaper />
        </main>
      </div>
    </SynapseBackground>
  );
};

export default WhitepaperPage;
