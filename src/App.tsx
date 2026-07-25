import React, { useState } from 'react';
import { RoleProvider, useRoleContext } from './context/RoleContext';
import { PrescriptionProvider } from './context/PrescriptionContext';
import { ToastContainer } from './components/ToastContainer';
import { WelcomePage } from './app/welcome/page';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { NavigationShell } from './components/NavigationShell';
import { HauptraumCanvas } from './components/views/HauptraumCanvas';
import { UploadPage } from './pages/UploadPage';
import { ScanPage } from './pages/ScanPage';
import { ReviewPage } from './pages/ReviewPage';
import { GutachtenPage } from './pages/GutachtenPage';
import { DashboardView } from './components/views/DashboardView';
import { ConsultView } from './components/views/ConsultView';
import { DocumentsView } from './components/views/DocumentsView';
import { EegView } from './components/views/EegView';
import { VideoView } from './components/views/VideoView';
import { CalendarView } from './components/views/CalendarView';
import { AdminView } from './components/views/AdminView';

import { ActiveTab, Demographics, DocumentItem, Finding, AIAgent } from './types';
import { DEFAULT_DEMOGRAPHICS, DEMO_DOCUMENTS, DEMO_FINDINGS, INITIAL_AGENTS } from './lib/agents';

function MainAppContent() {
  const { role } = useRoleContext();
  const [activeTab, setActiveTab] = useState<ActiveTab | null>(null);
  const [demographics, setDemographics] = useState<Demographics>(DEFAULT_DEMOGRAPHICS);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEMO_DOCUMENTS);
  const [findings, setFindings] = useState<Finding[]>(DEMO_FINDINGS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [drBubbleMessage, setDrBubbleMessage] = useState<string | null>(null);

  if (!role) {
    return <WelcomePage />;
  }

  const handleDrBubbleTrigger = (msg: string) => {
    setDrBubbleMessage(msg);
  };

  const getActiveModuleName = (): string => {
    if (!activeTab) return 'HAUPTRAUM HUB';
    switch (activeTab) {
      case 'upload':
        return '1. PATIENT & DOKUMENTE';
      case 'scan':
        return '2. 4-KI-AGENTEN SCAN';
      case 'review':
        return '3. BEFUND BEWERTUNG';
      case 'gutachten':
        return '4. S2k GUTACHTEN';
      case 'approvals':
        return 'GENEHMIGUNGS-QUEUE';
      case 'dashboard':
        return 'EXECUTIVE BOARD';
      case 'consult':
        return 'VOICE & CONSULT';
      case 'documents':
        return 'DOKUMENTEN OCR';
      case 'eeg':
        return 'EEG SIGNAL CORE';
      case 'video':
        return 'VIDEO DIAGNOSTICS';
      case 'calendar':
        return 'TERMINKALENDER';
      case 'admin':
        return 'ADMIN & SECURITY';
      default:
        return 'HAUPTRAUM HUB';
    }
  };

  return (
    <NavigationShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      activeModuleName={getActiveModuleName()}
      drBubbleMessage={drBubbleMessage}
      onCloseDrBubble={() => setDrBubbleMessage(null)}
      onDrBubbleTrigger={handleDrBubbleTrigger}
    >
      {activeTab === null && (
        <HauptraumCanvas
          onSelectTab={setActiveTab}
          onDrBubbleTrigger={handleDrBubbleTrigger}
        />
      )}

      {activeTab === 'upload' && (
        <UploadPage
          demographics={demographics}
          setDemographics={setDemographics}
          documents={documents}
          setDocuments={setDocuments}
          onStartScan={() => setActiveTab('scan')}
        />
      )}

      {activeTab === 'scan' && (
        <ScanPage
          agents={agents}
          setAgents={setAgents}
          findings={findings}
          onFinishScan={() => setActiveTab('review')}
        />
      )}

      {activeTab === 'review' && (
        <ReviewPage
          findings={findings}
          setFindings={setFindings}
          onGenerateGutachten={() => setActiveTab('gutachten')}
        />
      )}

      {activeTab === 'gutachten' && (
        <GutachtenPage
          demographics={demographics}
          findings={findings}
        />
      )}

      {activeTab === 'approvals' && (
        <ApprovalsPage onRedirectHome={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'consult' && <ConsultView />}
      {activeTab === 'documents' && <DocumentsView />}
      {activeTab === 'eeg' && <EegView />}
      {activeTab === 'video' && <VideoView />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'admin' && <AdminView />}
    </NavigationShell>
  );
}

export function App() {
  return (
    <RoleProvider>
      <PrescriptionProvider>
        <ToastContainer />
        <MainAppContent />
      </PrescriptionProvider>
    </RoleProvider>
  );
}

export default App;
