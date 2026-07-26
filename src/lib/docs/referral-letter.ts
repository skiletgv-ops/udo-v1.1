export interface ReferralLetterData {
  patientName: string;
  patientBirthDate: string;
  insuranceNumber?: string;
  diagnosisIcd10: string;
  diagnosisText: string;
  targetSpecialty: string; // e.g. "Radiologie / Neuroradiologie"
  clinicalQuestion: string; // e.g. "Ausschluss LWS-Bandscheibenprofall mit Nervenwurzelkompression L5/S1 links"
  physicianName: string;
  date: string;
}

export function generateReferralLetterText(data: ReferralLetterData): string {
  return `
================================================================================
ÄRZTLICHES ÜBERWEISUNGSSCHREIBEN (ARZTBRIEF)
Praxis Dr. med. Ulrike Bongartz • Fachärztin für Neurologie & Psychiatrie
Neumarkt 1, 50667 Köln
================================================================================

PATIENTENDATEN:
Name: ${data.patientName}
Geburtsdatum: ${data.patientBirthDate}
Versicherungsnr.: ${data.insuranceNumber || 'PKV / Selbstzahler'}
Datum: ${data.date}

ÜBERWEISUNG AN:
Fachgebiet: ${data.targetSpecialty}

DIAGNOSE (ICD-10):
${data.diagnosisIcd10} - ${data.diagnosisText}

FRAGESTELLUNG / AUFTRAG:
${data.clinicalQuestion}

BEFUND / ANAMNESE:
Eingehende neurologische Untersuchung in unserer Praxis. Zur weiteren differenzialdiagnostischen
Abklärung bitten wir um die oben genannte Zusatzuntersuchung und Zusendung des Befundberichtes.

Mit freundlichen kollegialen Grüßen,

Dr. med. Ulrike Bongartz
(Qualifizierte Elektronische Signatur / QES)
================================================================================
`.trim();
}

export function exportReferralLetterPdf(data: ReferralLetterData): void {
  const content = generateReferralLetterText(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ueberweisung_${data.patientName.replace(/\s+/g, '_')}_${data.date}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
