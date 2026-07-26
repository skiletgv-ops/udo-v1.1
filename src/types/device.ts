export type DeviceFileType = 'edf' | 'pdf' | 'csv' | 'proprietary';

export interface DeviceSession {
  id: string;
  patientId: string;
  patientName?: string;
  deviceModel: string;
  fileType: DeviceFileType | string;
  fileUrl: string;
  timestamp: string;
  isSynthetic: boolean;
  status: 'pending' | 'reviewed' | 'attached';
  findings?: string;
  structuredFindings?: Record<string, string>;
}

export interface DeviceAdapter {
  connect(): Promise<void>;
  fetchSession(id: string): Promise<DeviceSession>;
  listSessions(patientId: string): Promise<DeviceSession[]>;
  fileType: DeviceFileType;
}

export interface IntakeForm {
  id: string;
  patientId: string;
  patientName: string;
  birthDate: string;
  insuranceType: 'private' | 'gesetzlich';
  medicalHistory: string;
  currentMedications: string;
  consents: {
    gdprConsent: boolean;
    telehealthConsent: boolean;
    dataSharingConsent: boolean;
  };
  submittedAt: string;
  isSynthetic: boolean;
}

export interface BillingCode {
  id: string;
  code: string;
  system: 'GOÄ' | 'EBM' | 'ICD-10';
  description: string;
  confidence: number;
  price: number;
  status: 'suggested' | 'confirmed' | 'rejected';
  reasoning?: string;
}

export interface PortalDoc {
  id: string;
  patientId: string;
  title: string;
  category: 'Gutachten' | 'Befund' | 'Überweisung' | 'AU-Bescheinigung' | 'Rechnung';
  fileUrl: string;
  uploadedAt: string;
  signedBy?: string;
  requiresAction?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  patientId: string;
  userId: string;
  module: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}
