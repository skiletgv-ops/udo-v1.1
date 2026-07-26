export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface TriageScoreResult {
  urgency: UrgencyLevel;
  matchedKeywords: string[];
  reason: string;
}

export function calculateTriageScore(symptomText: string): TriageScoreResult {
  const text = (symptomText || '').toLowerCase();

  const emergencyKeywords = ['herzinfarkt', 'schlaganfall', 'bewusstlos', 'suizid', 'atemnot', 'brustschmerz', 'lähmung'];
  const highKeywords = ['starke schmerzen', 'fieber', 'verwirrtheit', 'krampfanfall', 'sehstörung', 'taubheitsgefühl'];
  const mediumKeywords = ['kopfschmerzen', 'schwindel', 'schlafstörungen', 'unruhe', 'migräne', 'tinnitus'];

  const matchedEmergency = emergencyKeywords.filter((kw) => text.includes(kw));
  if (matchedEmergency.length > 0) {
    return {
      urgency: 'emergency',
      matchedKeywords: matchedEmergency,
      reason: 'Kritische Notfallsymptome identifiziert.'
    };
  }

  const matchedHigh = highKeywords.filter((kw) => text.includes(kw));
  if (matchedHigh.length > 0) {
    return {
      urgency: 'high',
      matchedKeywords: matchedHigh,
      reason: 'Dringender Behandlungsbedarf für den gleichen Tag.'
    };
  }

  const matchedMedium = mediumKeywords.filter((kw) => text.includes(kw));
  if (matchedMedium.length > 0) {
    return {
      urgency: 'medium',
      matchedKeywords: matchedMedium,
      reason: 'Standardmäßige neurologische/psychiatrische Abklärung.'
    };
  }

  return {
    urgency: 'low',
    matchedKeywords: [],
    reason: 'Routinekonsultation ohne zeitkritische Symptomatik.'
  };
}
