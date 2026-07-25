export type IngestionStatus =
  | 'PENDING_WORK'
  | 'WORK_REVIEWED'
  | 'ADMIN_APPROVED'
  | 'DOCTOR_SIGNED'
  | 'REJECTED';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceScore<T> {
  value: T;
  confidence: number; // 0 - 100
  status: 'pending' | 'confirmed' | 'flagged' | 'corrected';
  originalAiValue?: T;
  workValue?: T;
  adminValue?: T;
  doctorValue?: T;
  flagReason?: string;
}

export interface AlbisMappedDemographics {
  patientId: ConfidenceScore<string>;
  firstName: ConfidenceScore<string>;
  lastName: ConfidenceScore<string>;
  birthDate: ConfidenceScore<string>;
  gender: ConfidenceScore<'männlich' | 'weiblich' | 'divers'>;
  insuranceNumber: ConfidenceScore<string>;
  insuranceProvider: ConfidenceScore<string>;
  address: ConfidenceScore<string>;
}

export interface Icd10Entry {
  code: string;
  description: string;
  isPrimary: boolean;
  confidence: number;
}

export interface GoaeBillingEntry {
  code: string;
  factor: number;
  priceEuro: number;
  description: string;
  confidence: number;
}

export interface ExtractedMedicalDocument {
  id: string;
  caseId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadTimestamp: string;
  scanImageUrl?: string;
  rawOcrText: string;
  isSynthetic: boolean; // MANDATORY: constraint 1

  status: IngestionStatus;
  currentRoleHandler?: 'WORK' | 'ADMIN' | 'DOCTOR';

  // Structured entities (ALBIS compatible)
  demographics: AlbisMappedDemographics;
  icd10Codes: ConfidenceScore<Icd10Entry[]>;
  goaeBillingCodes: ConfidenceScore<GoaeBillingEntry[]>;
  anamnesisText: ConfidenceScore<string>;
  clinicalFindingsText: ConfidenceScore<string>;
  doctorNotes?: string;

  // Review & Rejection notes
  workReviewNotes?: string;
  adminReviewNotes?: string;
  doctorSignNotes?: string;
  rejectionReason?: string;

  // Timestamps
  workReviewedAt?: string;
  workReviewerId?: string;
  adminApprovedAt?: string;
  adminReviewerId?: string;
  doctorSignedAt?: string;
  doctorReviewerId?: string;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  patientName: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'WORK' | 'ADMIN' | 'DOCTOR';
  action:
    | 'DOCUMENT_INGESTED'
    | 'FIELD_CONFIRMED'
    | 'FIELD_FLAGGED'
    | 'FIELD_CORRECTED'
    | 'WORK_SUBMITTED'
    | 'ADMIN_APPROVED'
    | 'ADMIN_REJECTED'
    | 'ADMIN_SENT_BACK'
    | 'DOCTOR_SIGNED_AND_BILLED'
    | 'DOCTOR_CLINICAL_EDIT';
  fieldName?: string;
  beforeValue?: string;
  afterValue?: string;
  comment?: string;
}
