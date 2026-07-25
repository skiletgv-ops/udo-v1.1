export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type PipelineStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'ready';

export type MedicalDocumentCategory =
  | 'hospital_report'
  | 'gp_report'
  | 'specialist_report'
  | 'lab_report'
  | 'radiology_xray'
  | 'mri_scan'
  | 'ct_scan'
  | 'prescriptions'
  | 'rehabilitation'
  | 'insurance_corr'
  | 'sick_leave'
  | 'psychiatric'
  | 'operative_report'
  | 'referrals';

export interface MedicalDocumentItem {
  id: string;
  filename: string;
  category: MedicalDocumentCategory;
  categoryLabel: string;
  date: string;
  facility: string;
  physician: string;
  pages: number;
  fileSizeMb: number;
  ocrQuality: number; // 0 to 100
  language: string;
  isScanned: boolean;
  duplicateDetected?: boolean;
  summary: string;
  keyDiagnoses: string[];
}

export interface ExtractedEntity {
  id: string;
  type: 'hospital' | 'clinic' | 'physician' | 'specialty' | 'diagnosis' | 'medication' | 'procedure' | 'imaging' | 'lab' | 'surgery' | 'rehab';
  value: string;
  icdCode?: string;
  date?: string;
  sourceDocId: string;
  sourcePage: number;
}

export interface TimelineEventItem {
  id: string;
  date: string;
  doctor: string;
  hospital: string;
  specialty: string;
  complaint: string;
  diagnosis: string;
  icd10?: string;
  treatment: string;
  medication: string;
  outcome: string;
  followUp: string;
  sourceDocId: string;
  sourceDocName: string;
  sourcePage: number;
  confidence: number; // 0 to 100
}

export type SpecialtyType =
  | 'internal_medicine'
  | 'orthopedics'
  | 'neurology'
  | 'psychiatry'
  | 'cardiology'
  | 'oncology'
  | 'pain_medicine'
  | 'rehabilitation';

export interface SpecialtySummaryItem {
  id: SpecialtyType;
  title: string;
  iconName: string;
  majorFindings: string[];
  diagnoses: { code: string; name: string; status: 'acute' | 'chronic' | 'resolved' }[];
  progression: string;
  treatmentResponse: string;
  unresolvedIssues: string[];
  evidenceReferences: { docId: string; docName: string; page: number; excerpt: string }[];
}

export interface FunctionalCapacityItem {
  id: string;
  dimension: string; // e.g., 'Mobility & Gait', 'Standing & Posture', 'Lifting & Carrying'
  category: 'physical' | 'cognitive' | 'psychological' | 'social';
  status: 'Normal' | 'Gering eingeschränkt' | 'Mäßig eingeschränkt' | 'Schwer eingeschränkt' | 'Aufgehoben';
  description: string;
  factualEvidence: string;
  aiInference: string;
  confidenceLevel: number; // e.g. 96%
  citedRecords: { docName: string; page: number }[];
}

export interface GutachtenSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface GutachtenDraftVariant {
  id: 'detailed_expert' | 'insurance_oriented' | 'court_friendly' | 'concise_executive';
  title: string;
  subtitle: string;
  pageEstimate: string; // e.g. "7 Pages"
  isRecommended: boolean;
  completenessScore: number; // e.g. 98%
  evidenceCoverageScore: number; // e.g. 96%
  sections: GutachtenSectionItem[];
}

export interface TrackChangeItem {
  id: string;
  sectionId: string;
  author: string;
  timestamp?: string;
  type: 'addition' | 'deletion' | 'modification' | 'insertion';
  originalText?: string;
  suggestedText?: string;
  oldText?: string;
  newText?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CommentItem {
  id: string;
  sectionId: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface QualityControlItem {
  id: string;
  severity: 'high' | 'medium' | 'low';
  type: 'conflicting_diagnoses' | 'duplicate_report' | 'inconsistent_date' | 'missing_record' | 'medication_conflict' | 'contradictory_opinion';
  title: string;
  description: string;
  affectedDocs: string[];
  suggestedResolution: string;
  isResolved: boolean;
}

export interface ConsensusModelOutput {
  modelId: 'clara_gemini' | 'eric_claude' | 'marcus_gpt4' | 'gratsiano_deepseek';
  modelName: string;
  avatarColor: string;
  findingTitle: string;
  assessmentText: string;
  confidenceScore: number; // e.g., 95%
  agreesWithConsensus: boolean;
}

export interface PatientDossier {
  patientId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  insuranceNumber: string;
  caseId: string;
  insuranceProvider: string;
  commissioningEntity: string;
  accidentDate: string;
  subjectTitle: string;
  totalPages: number;
  totalSizeMb: number;
  uploadedDocuments: MedicalDocumentItem[];
}
