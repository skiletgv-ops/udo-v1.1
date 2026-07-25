import React from 'react';
import { RoleProvider } from '../context/RoleContext';
import { PrescriptionProvider } from '../context/PrescriptionContext';
import { SplineBackground } from '../components/SplineBackground';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <PrescriptionProvider>
        <div className="relative min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
          <SplineBackground />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </div>
      </PrescriptionProvider>
    </RoleProvider>
  );
}

export default RootLayout;
