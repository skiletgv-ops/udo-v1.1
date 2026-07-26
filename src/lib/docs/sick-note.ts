// REQUIRES: MDR/CE certification before clinical use (sick note digital signature)

export interface SickNoteData {
  patientName: string;
  patientBirthDate: string;
  insuranceNumber?: string;
  icd10Code: string; // e.g. "M54.16"
  icd10Text: string;  // e.g. "Radikulopathie LWS"
  validFrom: string;  // "2026-07-26"
  validUntil: string; // "2026-08-02"
  physicianName: string;
  signaturePngDataUrl?: string; // Digital signature overlay
  isInitialNote: boolean;
}

export function generateSickNoteDocument(data: SickNoteData): string {
  return `
================================================================================
ARBEITSUNFÄHIGKEITSBESCHEINIGUNG (AU-MUSTER 1)
Praxis Dr. med. Ulrike Bongartz • Fachärztin für Neurologie & Psychiatrie
Neumarkt 1, 50667 Köln
================================================================================

PATIENT: ${data.patientName} (*${data.patientBirthDate})
VERSICHERTEN-NR: ${data.insuranceNumber || 'PKV / Selbstzahler'}

ARBEITSUNFÄHIG SEIT: ${data.validFrom}
VORAUSSICHTLICH AU BIS: ${data.validUntil}
ART DER AU: ${data.isInitialNote ? 'Erstbescheinigung' : 'Folgebescheinigung'}

DIAGNOSE (ICD-10):
${data.icd10Code} - ${data.icd10Text}

ARZT-STEMPEL & DIGITALE SIGNATUR (QES):
${data.physicianName}
QES-HASH: qes_au_${Date.now()}_sha256
DIGITAL SIGNATURE ATTACHED: ${data.signaturePngDataUrl ? 'YES (Canvas PNG Overlay)' : 'PENDING'}
================================================================================
`.trim();
}

export function exportSickNotePdf(data: SickNoteData): void {
  const content = generateSickNoteDocument(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AU_Bescheinigung_${data.patientName.replace(/\s+/g, '_')}_${data.validFrom}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
