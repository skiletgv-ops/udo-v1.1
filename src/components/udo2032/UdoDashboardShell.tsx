import React, { useState, useEffect } from 'react';
import { UdoSidebar } from './UdoSidebar';
import { UdoFloatingChat } from './UdoFloatingChat';

import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { BioHealthPage } from './pages/BioHealthPage';
import { FinanceLegalPage } from './pages/FinanceLegalPage';
import { EnterprisePage } from './pages/EnterprisePage';
import { PersonalSecurityPage } from './pages/PersonalSecurityPage';
import { DevCreativePage } from './pages/DevCreativePage';
import { MobilityInfraPage } from './pages/MobilityInfraPage';
import { SettingsPage } from './pages/SettingsPage';

export interface UdoDashboardShellProps {
  onNavigateToPortal: () => void;
}

export function UdoDashboardShell({ onNavigateToPortal }: UdoDashboardShellProps) {
  const [subRoute, setSubRoute] = useState<string>('/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/dashboard')) {
        setSubRoute(path);
      }
    }
  }, []);

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    }
    setSubRoute(path);
  };

  const renderActivePage = () => {
    if (subRoute === '/dashboard/bio') return <BioHealthPage />;
    if (subRoute === '/dashboard/finance') return <FinanceLegalPage />;
    if (subRoute === '/dashboard/enterprise') return <EnterprisePage />;
    if (subRoute === '/dashboard/personal') return <PersonalSecurityPage />;
    if (subRoute === '/dashboard/dev') return <DevCreativePage />;
    if (subRoute === '/dashboard/mobility') return <MobilityInfraPage />;
    if (subRoute === '/dashboard/settings') return <SettingsPage />;
    return <DashboardOverviewPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_900px_at_center,rgba(6,182,212,0.05),transparent)] pointer-events-none" />

      {/* Navigation Sidebar */}
      <UdoSidebar
        activeSubRoute={subRoute}
        onNavigate={handleNavigate}
        onNavigatePortal={onNavigateToPortal}
      />

      {/* Main Sub-Page Content Area */}
      <main className="pl-20 md:pl-72 transition-all duration-300 p-6 md:p-10 max-w-7xl mx-auto relative z-10">
        {renderActivePage()}
      </main>

      {/* Global Floating AI Chat Overlay */}
      <UdoFloatingChat />
    </div>
  );
}
