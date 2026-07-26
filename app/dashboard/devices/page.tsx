'use client';

import React, { useState } from 'react';
import DevicesQueueView from '../../../src/components/devices/DevicesQueueView';
import DeviceDetailView from '../../../src/components/devices/DeviceDetailView';
import { DeviceSession } from '../../../src/types/device';

export default function DevicesDashboardPage() {
  const [selectedSession, setSelectedSession] = useState<DeviceSession | null>(null);

  if (selectedSession) {
    return (
      <DeviceDetailView
        session={selectedSession}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  return <DevicesQueueView onSelectSession={(session) => setSelectedSession(session)} />;
}
