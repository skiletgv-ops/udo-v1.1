/**
 * HARD DETERMINISTIC TRIAGE RULEBOOK (ZERO-LATENCY SAFETY GATEWAY)
 * 
 * Bypasses LLM inference entirely (<1ms response time) when acute life-threatening 
 * emergency flags are detected to prevent hallucination, eliminate latency, and enforce
 * zero-latency red alert protocols for critical triage cases.
 */

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface EmergencyRule {
  id: string;
  category: 'CARDIAC' | 'STROKE' | 'RESPIRATORY' | 'ANAPHYLAXIS' | 'NEUROLOGICAL' | 'TRAUMA_HEMORRHAGE' | 'PSYCHIATRIC_CRISIS';
  keywords: string[];
  icd10: string;
  titleDe: string;
  titleEn: string;
  actionDe: string;
  actionEn: string;
}

export const ACUTE_EMERGENCY_RULES: EmergencyRule[] = [
  {
    id: 'RULE-CARDIAC-01',
    category: 'CARDIAC',
    keywords: [
      'brustschmerz', 'brustschmerzen', 'druck auf der brust', 'herzinfarkt', 'angina pectoris',
      'chest pain', 'heart attack', 'druck in der brust', 'stechen in der brust', 'herzrasen übelkeit',
      'ausstrahlung arm', 'ausstrahlung kiefer'
    ],
    icd10: 'I21.9',
    titleDe: 'Verdacht auf Akutes Koronarsyndrom / Herzinfarkt',
    titleEn: 'Suspected Acute Coronary Syndrome / Myocardial Infarction',
    actionDe: 'SOFORT NOTRUF 112 WÄHLEN! Patienten flach gelagert beruhigen. Oberkörper leicht erhöht. Notarzt ist erforderlich.',
    actionEn: 'CALL EMERGENCY SERVICES 112 IMMEDIATELY! Keep patient calm with elevated upper body. Emergency physician required.'
  },
  {
    id: 'RULE-STROKE-02',
    category: 'STROKE',
    keywords: [
      'schlaganfall', 'gesichtslähmung', 'sehstörung', 'sprechstörung', 'taubheitsgefühl arm',
      'taubheitsgefühl bein', 'halbseitenlähmung', 'stroke', 'fast-test', 'schiefes gesicht',
      'lallen', 'wortfindungsstörung', 'plötzliche lähmung'
    ],
    icd10: 'I63.9',
    titleDe: 'Verdacht auf Akuten Zerebralen Insult / Schlaganfall (FAST Positiv)',
    titleEn: 'Suspected Acute Ischemic Stroke (FAST Positive)',
    actionDe: 'NOTFALL (112): Zeit ist Hirn! Sofortige Verlegung in Stroke Unit veranlassen. Symptombeginn (LNT) exakt protokollieren.',
    actionEn: 'EMERGENCY (112): Time is Brain! Immediate stroke unit transfer required. Document exact Last Known Well time.'
  },
  {
    id: 'RULE-RESPIRATORY-03',
    category: 'RESPIRATORY',
    keywords: [
      'atemnot', 'erstickungsanfall', 'blauen lippen', 'keine luft', 'schwere dyspnoe',
      'respiratory distress', 'cannot breathe', 'cyanosis', 'zyanose', 'stridor', 'atemstillstand'
    ],
    icd10: 'R06.0',
    titleDe: 'Akute Respiratorische Insuffizienz / Schwere Dyspnoe',
    titleEn: 'Acute Respiratory Failure / Severe Dyspnea',
    actionDe: 'NOTRUF 112 WÄHLEN! Fenster öffnen, enge Kleidung lockern, Oberkörper hochlagern. Sauerstoffgabe falls vorhanden.',
    actionEn: 'CALL 112 IMMEDIATELY! Open windows, loosen tight clothing, position sitting upright.'
  },
  {
    id: 'RULE-ANAPHYLAXIS-04',
    category: 'ANAPHYLAXIS',
    keywords: [
      'anaphylaktischer schock', 'anaphylaxie', 'zuschnüren im hals', 'allergischer schock',
      'wespenstich hals', 'anaphylactic shock', 'quinke ödem', 'zungenanschwellung'
    ],
    icd10: 'T78.2',
    titleDe: 'Schwere Anaphylaktische Reaktion / Atemwegsverlegung',
    titleEn: 'Severe Anaphylactic Shock / Airway Compromise',
    actionDe: 'NOTRUF 112 WÄHLEN! Epinephrin-Pen (Adrenalin-Autoinjektor) verabreichen falls vorhanden. Flachlagerung mit beine hoch (Schocklagerung).',
    actionEn: 'CALL 112 IMMEDIATELY! Administer epinephrine auto-injector if available. Elevate legs for shock position.'
  },
  {
    id: 'RULE-NEURO-05',
    category: 'NEUROLOGICAL',
    keywords: [
      'bewusstlos', 'bewusstlosigkeit', 'krampfanfall', 'epileptischer anfall', 'status epilepticus',
      'unresponsive', 'seizure', 'synkope tief', 'schädel-hirn-trauma schwer'
    ],
    icd10: 'R55',
    titleDe: 'Bewusstlosigkeit / Status Epilepticus',
    titleEn: 'Unconsciousness / Status Epilepticus',
    actionDe: 'NOTRUF 112 WÄHLEN! Stabile Seitenlage veranlassen, Atemwege freihalten. Vor Verletzungen beim Krampf schützen.',
    actionEn: 'CALL 112 IMMEDIATELY! Place in recovery position, maintain open airway. Protect from injury.'
  },
  {
    id: 'RULE-PSYCH-06',
    category: 'PSYCHIATRIC_CRISIS',
    keywords: [
      'suizid', 'selbstmord', 'leben beenden', 'suicidal', 'ich will nicht mehr leben',
      'akute eigengefährdung', 'akute fremdgefährdung'
    ],
    icd10: 'R45.81',
    titleDe: 'Akute Psychiatrische Krisensituation / Eigengefährdung',
    titleEn: 'Acute Psychiatric Crisis / Self-Harm Risk',
    actionDe: 'AKUTER NOTFALL: Notruf 112 oder Telefonseelsorge (0800 111 0 111 / 116 123) kontaktieren. Patient niemals allein lassen!',
    actionEn: 'ACUTE EMERGENCY: Contact Emergency Services (112) or Crisis Helpline. Do not leave the patient alone!'
  }
];

export interface HardTriageGatewayResult {
  isEmergency: boolean;
  bypassedLLM: boolean;
  latencyMs: number;
  urgency: UrgencyLevel;
  ruleMatched?: EmergencyRule;
  icd10?: string;
  matchedKeywords: string[];
  reason: string;
  actionMessageDe: string;
  actionMessageEn: string;
  redAlertTriggered: boolean;
}

export type TriageScoreResult = HardTriageGatewayResult;

/**
 * Hard Deterministic Triage Gateway
 * Executes in under 1ms. Returns an emergency override result immediately if acute flags match.
 */
export function evaluateHardTriageGateway(input: string, lang: 'de' | 'en' = 'de'): HardTriageGatewayResult {
  const startTime = performance.now();
  const text = (input || '').toLowerCase();

  for (const rule of ACUTE_EMERGENCY_RULES) {
    const matched = rule.keywords.filter((kw) => text.includes(kw));
    if (matched.length > 0) {
      const duration = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        isEmergency: true,
        bypassedLLM: true,
        latencyMs: duration,
        urgency: 'emergency',
        ruleMatched: rule,
        icd10: rule.icd10,
        matchedKeywords: matched,
        reason: lang === 'en' ? rule.titleEn : rule.titleDe,
        actionMessageDe: rule.actionDe,
        actionMessageEn: rule.actionEn,
        redAlertTriggered: true
      };
    }
  }

  // Fallback to standard grading for non-acute inputs
  const highKeywords = ['starke schmerzen', 'hohes fieber', 'verwirrtheit', 'krampfanfall leicht', 'sehstörung schleichend'];
  const mediumKeywords = ['kopfschmerzen', 'schwindel', 'schlafstörungen', 'unruhe', 'migräne', 'tinnitus'];

  const matchedHigh = highKeywords.filter((kw) => text.includes(kw));
  if (matchedHigh.length > 0) {
    return {
      isEmergency: false,
      bypassedLLM: false,
      latencyMs: Math.round((performance.now() - startTime) * 100) / 100,
      urgency: 'high',
      matchedKeywords: matchedHigh,
      reason: 'Dringender Behandlungsbedarf für den gleichen Tag.',
      actionMessageDe: 'Dringende Konsultation am selben Tag empfohlen.',
      actionMessageEn: 'Same-day urgent consultation recommended.',
      redAlertTriggered: false
    };
  }

  const matchedMedium = mediumKeywords.filter((kw) => text.includes(kw));
  if (matchedMedium.length > 0) {
    return {
      isEmergency: false,
      bypassedLLM: false,
      latencyMs: Math.round((performance.now() - startTime) * 100) / 100,
      urgency: 'medium',
      matchedKeywords: matchedMedium,
      reason: 'Standardmäßige neurologische/psychiatrische Abklärung.',
      actionMessageDe: 'Reguläre Terminvereinbarung.',
      actionMessageEn: 'Regular appointment scheduling.',
      redAlertTriggered: false
    };
  }

  return {
    isEmergency: false,
    bypassedLLM: false,
    latencyMs: Math.round((performance.now() - startTime) * 100) / 100,
    urgency: 'low',
    matchedKeywords: [],
    reason: 'Routinekonsultation ohne zeitkritische Symptomatik.',
    actionMessageDe: 'Routinekonsultation.',
    actionMessageEn: 'Routine consultation.',
    redAlertTriggered: false
  };
}

export function calculateTriageScore(symptomText: string): {
  urgency: UrgencyLevel;
  matchedKeywords: string[];
  reason: string;
} {
  const result = evaluateHardTriageGateway(symptomText);
  return {
    urgency: result.urgency,
    matchedKeywords: result.matchedKeywords,
    reason: result.reason
  };
}
