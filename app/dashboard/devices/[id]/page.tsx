// REQUIRES: MDR/CE certification before clinical use

'use client';

import React from 'react';
import DeviceDetailView from '../../../../src/components/devices/DeviceDetailView';
import { useUdoStore } from '../../../../src/store/useUdoStore';

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const { deviceSessions } = useUdoStore();
  const session = deviceSessions.find((s) => s.id === params.id) || deviceSessions[0];

  return (
    <DeviceDetailView
      session={session}
      onBack={() => {
        if (typeof window !== 'undefined') window.history.back();
      }}
    />
  );
}
