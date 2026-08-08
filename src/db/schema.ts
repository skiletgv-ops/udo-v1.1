import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const triageAuditLogs = pgTable('triage_audit_logs', {
  id: serial('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  symptomSummary: text('symptom_summary').notNull(),
  urgencyLevel: text('urgency_level').notNull(),
  icd10Code: text('icd10_code'),
  bypassedLlm: boolean('bypassed_llm').default(false).notNull(),
  encryptedPayload: text('encrypted_payload').notNull(),
  complianceStatus: text('compliance_status').default('HIPAA_GDPR_VERIFIED').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: text('ip_address').default('127.0.0.1')
});

export const clinicalConsultations = pgTable('clinical_consultations', {
  id: serial('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  dob: text('dob'),
  practitionerId: text('practitioner_id').default('Dr. med. Ulrike Bongartz'),
  soapexSummary: text('soapex_summary').notNull(),
  encryptedNotes: text('encrypted_notes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
