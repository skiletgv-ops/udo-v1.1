export interface Demographics {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'männlich' | 'weiblich' | 'divers';
  insuranceNumber: string;
  address: string;
  phone: string;
  email: string;
  insuranceProvider: string;
  commissioningEntity: string;
  caseId: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'bereit' | 'wird_analysiert' | 'fehler';
  category: 'MRT' | 'CT' | 'Histologie' | 'Labor' | 'Anamnese' | 'Sonstiges';
}

export type SeverityType = 'critical' | 'high' | 'medium' | 'low';

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: 'main' | 'admin';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  category: 'Bildgebung' | 'Diagnose' | 'Symptom' | 'Medikation' | 'Labor';
  severity: SeverityType;
  date: string;
  sourceDocument: string;
  pageNumber: number;
  confidence: number;
  icdCode?: string;
  confirmed?: boolean;
  contested?: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  iconName: string;
  progress: number;
  status: 'idle' | 'scanning' | 'complete' | 'error';
  confidence: number;
  findingsCount: number;
  findings: Finding[];
}

export interface GutachtenSection {
  id: string;
  number: number;
  title: string;
  content: string;
  citations: {
    docName: string;
    date: string;
    page: number;
  }[];
}

export interface GutachtenReport {
  id: string;
  patient: Demographics;
  findings: Finding[];
  consensusScore: number;
  generatedAt: string;
  sections: GutachtenSection[];
  doctorSignature: {
    name: string;
    title: string;
    licenseNumber: string;
    date: string;
    hash: string;
  };
}

export type ActiveTab =
  | 'upload'
  | 'scan'
  | 'review'
  | 'gutachten'
  | 'dashboard'
  | 'consult'
  | 'documents'
  | 'eeg'
  | 'video'
  | 'calendar'
  | 'admin'
  | 'approvals'
  | 'devices'
  | 'intake'
  | 'insurance'
  | 'dictate'
  | 'retention'
  | 'audit'
  | 'analytics'
  | 'portal'
  | 'whitepaper';
