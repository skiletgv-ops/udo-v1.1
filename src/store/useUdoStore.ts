import { create } from 'zustand';
import { DeviceSession, IntakeForm, BillingCode, PortalDoc, AuditLogEntry } from '../types/device';
import { logAudit, getAuditLogs } from '../lib/auditLogger';
import { mockDeviceAdapter } from '../lib/devices/MockDeviceAdapter';

interface UdoState {
  deviceSessions: DeviceSession[];
  intakeForms: IntakeForm[];
  billingCodes: BillingCode[];
  patientPortalDocs: PortalDoc[];
  auditLogs: AuditLogEntry[];

  // Actions
  fetchDeviceSessions: () => Promise<void>;
  updateSessionStatus: (id: string, status: 'pending' | 'reviewed' | 'attached', findings?: string) => void;
  attachSessionToGutachten: (id: string, section?: string) => void;
  
  addIntakeForm: (form: Omit<IntakeForm, 'id' | 'submittedAt'>) => void;
  
  setBillingCodes: (codes: BillingCode[]) => void;
  updateBillingCodeStatus: (id: string, status: 'confirmed' | 'rejected') => void;
  
  addPortalDoc: (doc: Omit<PortalDoc, 'id' | 'uploadedAt'>) => void;
  
  logAuditAction: (action: string, patientId: string, moduleName: string, details?: string) => void;
  refreshAuditLogs: () => void;
}

export const useUdoStore = create<UdoState>((set, get) => ({
  deviceSessions: [
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
        'Artefakte': 'Augenbewegung und Myogramm gefiltered'
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
      findings: 'Sinusrhythmus, HF 72/min, normokarder Lagetyp.',
      structuredFindings: {
        'Herzfrequenz': '72 bpm',
        'PQ-Zeit': '152 ms'
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
      findings: 'Reaktionszeit im Aufmerksamkeits-Belastungstest (d2-R) PR 42.',
      structuredFindings: {
        'Arbeitsgedächtnis': 'PR 28'
      }
    }
  ],

  intakeForms: [
    {
      id: 'intake-101',
      patientId: 'PAT-4829',
      patientName: 'Thomas Müller',
      birthDate: '1982-04-12',
      insuranceType: 'private',
      medicalHistory: 'LWS-Syndrom mit Ausstrahlung links seit Arbeitsunfall.',
      currentMedications: 'Ibuprofen 600mg 1-0-1, Pregabalin 75mg 0-0-1',
      consents: {
        gdprConsent: true,
        telehealthConsent: true,
        dataSharingConsent: true
      },
      submittedAt: '2026-07-25T09:00:00Z',
      isSynthetic: true
    }
  ],

  billingCodes: [
    {
      id: 'goae-800',
      code: 'GOÄ 800',
      system: 'GOÄ',
      description: 'Eingehende neurologische Untersuchung',
      confidence: 0.95,
      price: 26.23,
      status: 'suggested',
      reasoning: 'Ganzkörperlicher Status & Hirnnervenbefund in Anamnese dokumentiert'
    },
    {
      id: 'goae-825',
      code: 'GOÄ 825',
      system: 'GOÄ',
      description: 'Elektroenzephalographische Untersuchung (EEG)',
      confidence: 0.91,
      price: 64.12,
      status: 'suggested',
      reasoning: 'EEG Session dev-eeg-001 importiert & bewertet'
    },
    {
      id: 'goae-80',
      code: 'GOÄ 80',
      system: 'GOÄ',
      description: 'Schriftliche Gutachtliche Äußerung (S2k)',
      confidence: 0.88,
      price: 120.00,
      status: 'suggested',
      reasoning: 'S2k Gutachtenentwurf generiert'
    }
  ],

  patientPortalDocs: [
    {
      id: 'pdoc-1',
      patientId: 'PAT-4829',
      title: 'Neurologisches S2k-Gutachten (Vorläufig)',
      category: 'Gutachten',
      fileUrl: '/docs/gutachten-mueller-2026.pdf',
      uploadedAt: '2026-07-26T08:00:00Z',
      signedBy: 'Dr. med. Ulrike Bongartz'
    }
  ],

  auditLogs: getAuditLogs(),

  fetchDeviceSessions: async () => {
    try {
      const sessions = await mockDeviceAdapter.listSessions('all');
      set({ deviceSessions: sessions });
    } catch (err) {
      console.error('Failed to fetch device sessions', err);
    }
  },

  updateSessionStatus: (id, status, findings) => {
    set((state) => {
      const updated = state.deviceSessions.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status,
            findings: findings !== undefined ? findings : s.findings
          };
        }
        return s;
      });
      return { deviceSessions: updated };
    });
    logAudit(`DEVICE_SESSION_STATUS_UPDATE_${status.toUpperCase()}`, id, 'Dr. med. Ulrike Bongartz', 'DEVICES');
    get().refreshAuditLogs();
  },

  attachSessionToGutachten: (id, section = 'Section 3: Befunde') => {
    set((state) => {
      const updated = state.deviceSessions.map((s) => (s.id === id ? { ...s, status: 'attached' as const } : s));
      return { deviceSessions: updated };
    });
    logAudit(`DEVICE_SESSION_ATTACHED_TO_GUTACHTEN`, id, 'Dr. med. Ulrike Bongartz', 'GUTACHTEN', `Attached to ${section}`);
    get().refreshAuditLogs();
  },

  addIntakeForm: (form) => {
    const newForm: IntakeForm = {
      ...form,
      id: `intake-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    set((state) => ({ intakeForms: [newForm, ...state.intakeForms] }));
    logAudit('INTAKE_FORM_SUBMITTED', newForm.patientId, 'PATIENT', 'INTAKE', `Insurance: ${newForm.insuranceType}`);
    get().refreshAuditLogs();
  },

  setBillingCodes: (codes) => {
    set({ billingCodes: codes });
  },

  updateBillingCodeStatus: (id, status) => {
    set((state) => ({
      billingCodes: state.billingCodes.map((c) => (c.id === id ? { ...c, status } : c))
    }));
    logAudit(`BILLING_CODE_${status.toUpperCase()}`, id, 'Dr. med. Ulrike Bongartz', 'BILLING');
    get().refreshAuditLogs();
  },

  addPortalDoc: (doc) => {
    const newDoc: PortalDoc = {
      ...doc,
      id: `pdoc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    set((state) => ({ patientPortalDocs: [newDoc, ...state.patientPortalDocs] }));
    logAudit('PORTAL_DOCUMENT_UPLOADED', doc.patientId, 'PATIENT', 'PORTAL', doc.title);
    get().refreshAuditLogs();
  },

  logAuditAction: (action, patientId, moduleName, details) => {
    logAudit(action, patientId, 'Dr. med. Ulrike Bongartz', moduleName, details);
    get().refreshAuditLogs();
  },

  refreshAuditLogs: () => {
    set({ auditLogs: getAuditLogs() });
  }
}));
