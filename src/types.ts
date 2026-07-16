export interface Demographics {
  firstName: string;
  lastName: string;
  birthDate: string;
  insuranceNumber: string;
  caseId: string;
  insuranceProvider: string;
  commissioningEntity: string;
}

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
  demographics: Demographics;
  history: MedicalHistory;
  clinicalFindings: string[];
  imagingFindings: string[];
  labValues: LabValue[];
  timeline: TimelineEvent[];
}

export interface ConsensusModelResult {
  modelName: 'Gemini 3.5' | 'DeepSeek R1' | 'GPT-4o';
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
    'Gemini 3.5': 'KEEP' | 'REJECT' | 'NEUTRAL';
    'DeepSeek R1': 'KEEP' | 'REJECT' | 'NEUTRAL';
    'GPT-4o': 'KEEP' | 'REJECT' | 'NEUTRAL';
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

// -------------------------------------------------------------
// Upgrade Types (Kleine Praxis Edition)
// -------------------------------------------------------------

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
  patientName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  substanceClass: string;
  interactionsChecked: boolean;
  conflicts: string[];
  status: 'Anforderung' | 'Genehmigt' | 'Gedruckt';
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
