export * from './types/index';

export interface MedicalHistory {
  anamnesis: string;
  complaints: string;
}

export interface LabValue {
  parameter: string;
  value: string;
  referenceRange: string;
  status: 'normal' | 'erhöht' | 'erniedrigt';
}

export interface TimelineEvent {
  date: string;
  event: string;
  source: string;
}

export interface ExtractedData {
  demographics: any;
  history: MedicalHistory;
  clinicalFindings: string[];
  imagingFindings: string[];
  labValues: LabValue[];
  timeline: TimelineEvent[];
}

export interface ConsensusModelResult {
  modelName: 'UDO Neuro' | 'UDO Cognitive' | 'UDO Biometrics';
  vote: 'KEEP' | 'REJECT' | 'NEUTRAL';
  findingName: string;
  statement: string;
  argument: string;
}

export interface ConsensusRound {
  id: string;
  findingName: string;
  description: string;
  votes: {
    'UDO Neuro': 'KEEP' | 'REJECT' | 'NEUTRAL';
    'UDO Cognitive': 'KEEP' | 'REJECT' | 'NEUTRAL';
    'UDO Biometrics': 'KEEP' | 'REJECT' | 'NEUTRAL';
  };
  finalDecision: 'KEEP' | 'REJECT' | 'NEUTRAL';
  qaAnnotation?: string;
}

export interface GutachtenDraft {
  id: string;
  anamneseText: string;
  befundeText: string;
  beurteilungText: string;
  beantwortungFragenText: string;
  evidenceLinks: {
    id: string;
    text: string;
    source: string;
  }[];
}

export interface Patient {
  id: string;
  name: string;
  avatarSeed: string;
  caseId: string;
  status: 'Entwurf' | 'Prüfung' | 'Druckfertig' | 'Signiert' | 'Archiviert';
  extractedData?: ExtractedData;
  consensusRounds?: ConsensusRound[];
  draft?: GutachtenDraft;
  patientLetter?: string;
  signatureHash?: string;
  signedAt?: string;
  isQESSigned: boolean;
  egvpReceiptId?: string;
  egvpStatus?: 'Pending' | 'Success' | 'Failed';
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  durationMin: number;
  type: 'Erstuntersuchung' | 'Gutachtertermin' | 'Wiedervorstellung' | 'Therapiegespräch';
  status: 'Bestätigt' | 'Abgesagt' | 'Beendet';
  reminderSent: boolean;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  patientId?: string;
  assignee: 'Dr. Altenberg' | 'Schwester Sabine' | 'Praxis-KI' | 'Herr Schmidt';
  priority: 'Hoch' | 'Mittel' | 'Niedrig';
  status: 'Neu' | 'In Arbeit' | 'Prüfung' | 'Erledigt';
  dueDate: string;
  checklist: { id: string; text: string; done: boolean }[];
}

export interface Invoice {
  id: string;
  patientName: string;
  caseId: string;
  date: string;
  amount: number;
  icd10Codes: string[];
  goeCodes: { code: string; factor: number; price: number; desc: string }[];
  status: 'Entwurf' | 'Offen' | 'Bezahlt' | 'Mahnung';
}

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

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Praxisbedarf' | 'Büromaterial' | 'Formulare' | 'Hygiene';
  stock: number;
  minStock: number;
  unit: string;
  supplier: string;
}

export interface WikiArticle {
  id: string;
  title: string;
  category: 'AWMF-Leitlinie' | 'ICD-10 Hilfe' | 'Sozialrecht' | 'Klinischer Ablauf';
  summary: string;
  content: string;
  link?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ActiveTab = 'upload' | 'scan' | 'review' | 'gutachten' | 'dashboard' | 'consult' | 'documents' | 'eeg' | 'video' | 'calendar' | 'admin' | 'approvals';

