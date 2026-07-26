import { DeviceAdapter, DeviceSession, DeviceFileType } from '../../types/device';

export class MockDeviceAdapter implements DeviceAdapter {
  fileType: DeviceFileType = 'edf';
  private connected: boolean = false;

  private mockSessions: DeviceSession[] = [
    {
      id: 'dev-eeg-001',
      patientId: 'PAT-4829',
      patientName: 'Thomas Müller',
      deviceModel: 'Nihon Kohden EEG-1200 Neural Core',
      fileType: 'edf',
      fileUrl: '/docs/eeg-synthetic-summary.pdf',
      timestamp: '2026-07-25T14:30:00Z',
      isSynthetic: true,
      status: 'pending',
      findings: 'Theta-Wellen-Fokussierung temporo-mesial links unter Hyperventilation. Keine epileptiformen Potenziale.',
      structuredFindings: {
        'Grundrhythmus': '9.5 Hz Alpha-Rhythmus occipital symmetrisch',
        'Provokation': 'Leichte Theta-Zunahme temporo-parietal',
        'Artefakte': 'Augenbewegung und Myogramm gefiltert',
        'Klinische Relevanz': 'Vergleich mit Vorbefund empfohlen'
      }
    },
    {
      id: 'dev-ecg-002',
      patientId: 'PAT-1092',
      patientName: 'Sabine Weber',
      deviceModel: 'Schiller Cardiovit FT-1 12-Kanal EKG',
      fileType: 'pdf',
      fileUrl: '/docs/ecg-report-synthetic.pdf',
      timestamp: '2026-07-26T08:15:00Z',
      isSynthetic: true,
      status: 'reviewed',
      findings: 'Sinusrhythmus, HF 72/min, normokarder Lagetyp. Keine signifikanten ST-Streckenveränderungen.',
      structuredFindings: {
        'Herzfrequenz': '72 bpm',
        'PQ-Zeit': '152 ms',
        'QRS-Dauer': '88 ms',
        'QTc-Zeit': '412 ms'
      }
    },
    {
      id: 'dev-cog-003',
      patientId: 'PAT-3381',
      patientName: 'Klaus Hoffmann',
      deviceModel: 'Vienna Test System NeuroCognitive VTS-5',
      fileType: 'csv',
      fileUrl: '/docs/vts-cognitive-scores.csv',
      timestamp: '2026-07-24T11:45:00Z',
      isSynthetic: true,
      status: 'attached',
      findings: 'Reaktionszeit im Aufmerksamkeits-Belastungstest (d2-R) PR 42. Arbeitsgedächtnis leicht gemindert (PR 28).',
      structuredFindings: {
        'Ablenkbarkeit': 'PR 35 (durchschnittlich)',
        'Verarbeitungsgeschwindigkeit': 'PR 42 (durchschnittlich)',
        'Exekutive Funktionen': 'PR 28 (leicht unterdurchschnittlich)'
      }
    }
  ];

  async connect(): Promise<void> {
    this.connected = true;
    console.log('[MockDeviceAdapter] Connected to virtual medical device gateway.');
  }

  async fetchSession(id: string): Promise<DeviceSession> {
    const session = this.mockSessions.find((s) => s.id === id);
    if (!session) {
      throw new Error(`Device session ${id} not found.`);
    }
    return session;
  }

  async listSessions(patientId: string): Promise<DeviceSession[]> {
    if (!patientId || patientId === 'all') {
      return this.mockSessions;
    }
    return this.mockSessions.filter((s) => s.patientId === patientId);
  }
}

export const mockDeviceAdapter = new MockDeviceAdapter();
