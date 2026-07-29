import React, { useState, useEffect } from 'react';
import { RoleProvider, useRoleContext } from './context/RoleContext';
import { PrescriptionProvider } from './context/PrescriptionContext';
import { ToastContainer } from './components/ToastContainer';
import { WelcomePage } from './app/welcome/page';
import IntroPresentation from './components/IntroPresentation';
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
import DevicesQueueView from './components/devices/DevicesQueueView';
import DictatePage from './components/gutachten/DictatePage';
import InsurancePage from './components/insurance/InsurancePage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import RetentionPage from './components/compliance/RetentionPage';
import AuditViewPage from './components/compliance/AuditViewPage';
import PortalPage from './components/portal/PortalPage';
import IntakePage from './components/intake/IntakePage';
import SystemWhitepaper from './components/SystemWhitepaper';
import PresentationSlideDeck from './components/PresentationSlideDeck';
import WorkTableShell from './components/worktable/WorkTableShell';
import WorkspaceShell from './components/workspace/WorkspaceShell';
import WhitepaperPage from './components/WhitepaperPage';

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
        return '3-STUFEN AUDIT PIPELINE & OCR';
      case 'eeg':
        return 'EEG SIGNAL CORE';
      case 'video':
        return 'VIDEO DIAGNOSTICS';
      case 'calendar':
        return 'TERMINKALENDER';
      case 'admin':
        return 'ADMIN & SECURITY';
      case 'devices':
        return 'GERÄTE-INTEGRATION & QUEUE';
      case 'dictate':
        return 'SPRACH-DIKTAT & AI-DRAFTING';
      case 'insurance':
        return 'VERSICHERUNG & KOSTENÜBERNAHME';
      case 'analytics':
        return 'PRAXIS ANALYTICS & KPIS';
      case 'retention':
        return 'DSGVO RETENTION MONITOR (10 JAHRE)';
      case 'audit':
        return 'REVISIONS-AUDIT TRAIL';
      case 'portal':
        return 'GESCHÜTZTES PATIENTEN-PORTAL';
      case 'intake':
        return 'PATIENTEN-AUFNAHMEBOGEN';
      case 'whitepaper':
        return 'SYSTEM WHITEPAPER & KLINISCHE SPEZIFIKATIONEN';
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
      {activeTab === 'devices' && <DevicesQueueView />}
      {activeTab === 'dictate' && <DictatePage />}
      {activeTab === 'insurance' && <InsurancePage />}
      {activeTab === 'analytics' && <AnalyticsPage />}
      {activeTab === 'retention' && <RetentionPage />}
      {activeTab === 'audit' && <AuditViewPage />}
      {activeTab === 'portal' && <PortalPage />}
      {activeTab === 'intake' && <IntakePage />}
      {activeTab === 'whitepaper' && <SystemWhitepaper />}
    </NavigationShell>
  );
}

function getInitialRoute(): string {
  if (typeof window === 'undefined') return '/portal';
  const path = window.location.pathname;
  if (path === '/presentation' || path.startsWith('/presentation')) {
    return '/presentation';
  }
  if (path === '/whitepaper' || path.startsWith('/whitepaper')) {
    return '/whitepaper';
  }
  if (path === '/worktable' || path.startsWith('/worktable')) {
    return '/worktable';
  }
  if (path === '/workspace' || path.startsWith('/workspace') || path.startsWith('/app/workspace')) {
    return '/workspace';
  }
  if (path === '/app' || path.startsWith('/app')) {
    return '/app';
  }
  return '/portal';
}

export function App() {
  const [route, setRoute] = useState<string>(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newRoute: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== newRoute) {
        window.history.pushState({}, '', newRoute);
      }
    }
    setRoute(newRoute);
  };

  return (
    <RoleProvider>
      <PrescriptionProvider>
        <ToastContainer />
        {route === '/presentation' ? (
          <PresentationSlideDeck />
        ) : route === '/whitepaper' ? (
          <WhitepaperPage onNavigateToPortal={() => navigateTo('/portal')} />
        ) : route === '/worktable' ? (
          <WorkTableShell onNavigateToPortal={() => navigateTo('/portal')} />
        ) : route === '/workspace' ? (
          <WorkspaceShell onNavigateToPortal={() => navigateTo('/portal')} />
        ) : route === '/app' ? (
          <MainAppContent />
        ) : (
          <IntroPresentation
            onComplete={() => navigateTo('/app')}
            onOpenWhitepaper={() => navigateTo('/whitepaper')}
            onOpenWorkspace={() => navigateTo('/workspace')}
          />
        )}
      </PrescriptionProvider>
    </RoleProvider>
  );
}

export default App;
