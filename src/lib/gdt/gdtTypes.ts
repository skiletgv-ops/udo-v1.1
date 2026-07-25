/**
 * GDT 2.1 Specification Types (Qualitätsring Medizinische Software e.V.)
 */

export interface GdtField {
  code: string;       // 4-digit Feldkennung (e.g., "3000", "3101")
  label: string;      // Human-readable description
  value: string;      // Field content
  length: number;     // 3-digit record line length
  rawLine?: string;   // Full original record line
}

export interface GdtInboundRecord {
  satzart: string;          // Field 8000 (e.g., "6302" = Anforderung Untersuchung)
  satzlaenge?: number;      // Field 8100
  senderId?: string;        // Field 8316 (e.g., "ALBIS")
  receiverId?: string;      // Field 8315 (e.g., "UDO")
  gdtVersion?: string;      // Field 9218 (e.g., "02.10")
  patientId: string;        // Field 3000 (Patientennummer - join key to ALBIS)
  lastName: string;         // Field 3101
  firstName: string;        // Field 3102
  birthDate: string;        // Field 3103 (TTMMJJJJ)
  birthDateFormatted: string; // YYYY-MM-DD
  gender: '1' | '2' | '3' | 'unknown'; // Field 3110 (1=male, 2=female, 3=divers)
  insuranceId?: string;     // Field 3105
  examDate: string;         // Field 6200 (TTMMJJJJ)
  examDateFormatted: string; // YYYY-MM-DD
  examName?: string;        // Field 8402
  requestText?: string;     // Field 8410 / custom 6xxx freitext fields
  rawFields: GdtField[];
  encoding: 'CP850' | 'IBM437' | 'UTF-8' | 'ISO-8859-1';
  isSynthetic: boolean;     // Flag for test patients
  parseErrors: string[];    // Array of warnings or malformed line details
  parsedAt: string;         // ISO timestamp
}

export interface GdtOutboundInput {
  patientId: string;        // Field 3000 (must match inbound exactly)
  caseId: string;           // UDO Fallakten ID (e.g., "BG-2026-9901-A")
  lastName?: string;        // Field 3101
  firstName?: string;       // Field 3102
  examName?: string;        // Field 8402 (default: "UDO Gutachten")
  resultStatus?: string;    // Field 6221 (Short status string, max 60 chars per line, NO PHI/diagnosis)
  resultDate?: string;      // Field 6220 (TTMMJJJJ, default: current date)
  senderId?: string;        // Field 8316 (default: "UDO")
  receiverId?: string;      // Field 8315 (default: "ALBIS")
  encoding?: 'CP850' | 'UTF-8';
  isSynthetic?: boolean;
}

export interface GdtParseResult {
  success: boolean;
  record?: GdtInboundRecord;
  error?: string;
  rawText: string;
}

export const GDT_FIELD_DESCRIPTIONS: Record<string, string> = {
  '8000': 'Satzart Identifier',
  '8100': 'Satzlänge in Bytes',
  '8315': 'GDT-ID des Empfängers',
  '8316': 'GDT-ID des Senders',
  '9218': 'GDT-Version',
  '3000': 'Patientennummer (ALBIS Primary Key)',
  '3101': 'Nachname des Patienten',
  '3102': 'Vorname des Patienten',
  '3103': 'Geburtsdatum (TTMMJJJJ)',
  '3105': 'Versichertennummer',
  '3110': 'Geschlecht (1=männlich, 2=weiblich, 3=divers)',
  '6200': 'Untersuchungsdatum (TTMMJJJJ)',
  '6201': 'Uhrzeit der Untersuchung (HHMMSS)',
  '6220': 'Befund-Datum (TTMMJJJJ)',
  '6221': 'Befund-Text / Statuszeile',
  '8402': 'Untersuchungsbezeichnung',
  '8410': 'Test / Anforderung Freitext',
};
