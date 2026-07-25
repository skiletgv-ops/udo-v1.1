import { ExtractedMedicalDocument } from '../types/ingestionPipeline';

const FIRST_NAMES_MALE = ['Thomas', 'Hans-Jürgen', 'Markus', 'Michael', 'Christian', 'Andreas', 'Stefan', 'Wolfgang', 'Alexander'];
const FIRST_NAMES_FEMALE = ['Sandra', 'Sabine', 'Claudia', 'Monika', 'Karin', 'Petra', 'Ursula', 'Julia', 'Stefanie'];
const LAST_NAMES = ['Müller', 'Meyer', 'Weber', 'Becker', 'Fischer', 'Schneider', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter'];

const INSURANCES = [
  'AOK Bayern (BG Unfallkasse)',
  'Techniker Krankenkasse (TK)',
  'Barmer GEK',
  'BG ETEM (DGUV)',
  'BG BAU (Berufsgenossenschaft)',
  'DAK Gesundheit',
  'AOK Nordost'
];

const STREETS = [
  'Goethestraße 14',
  'Hauptstraße 88',
  'Bahnhofstraße 5a',
  'Schillerstraße 23',
  'Lindenallee 12',
  'Berliner Straße 104',
  'Krankenhausweg 3'
];

const CITIES = [
  '80336 München',
  '10115 Berlin',
  '50667 Köln',
  '20095 Hamburg',
  '60311 Frankfurt am Main',
  '70173 Stuttgart',
  '01067 Dresden'
];

const SAMPLE_ICD10 = [
  { code: 'S72.00', description: 'Schenkelhalsfraktur geschlossen (DGUV A 4200)', isPrimary: true, confidence: 98 },
  { code: 'M54.5', description: 'Lumbago mit Ischias / LWS-Syndrom L4/L5', isPrimary: false, confidence: 88 },
  { code: 'S83.2', description: 'Riss des Innenmeniskus Kniegelenk rechts', isPrimary: true, confidence: 94 },
  { code: 'S42.20', description: 'Fraktur des proximalen Humerus links', isPrimary: false, confidence: 82 },
  { code: 'G56.0', description: 'Karpaltunnelsyndrom rechts (BG-Berufskrankheit 2106)', isPrimary: false, confidence: 91 },
  { code: 'S62.6', description: 'Fraktur eines sonstigen Fingers', isPrimary: false, confidence: 96 }
];

const SAMPLE_GOAE = [
  { code: 'GOÄ 1', factor: 2.3, priceEuro: 10.72, description: 'Symptombezogene Untersuchung', confidence: 99 },
  { code: 'GOÄ 3', factor: 2.3, priceEuro: 20.11, description: 'Eingehende Beratung > 10 Min.', confidence: 95 },
  { code: 'GOÄ 60', factor: 2.3, priceEuro: 34.97, description: 'Konsilium mit einem anderen Facharzt', confidence: 87 },
  { code: 'GOÄ 5000', factor: 1.8, priceEuro: 22.15, description: 'Röntgen Extremität in 2 Ebenen', confidence: 92 },
  { code: 'GOÄ 800', factor: 2.3, priceEuro: 26.23, description: 'Eingehende neurologische Untersuchung', confidence: 94 },
  { code: 'GOÄ 2005', factor: 2.3, priceEuro: 18.65, description: 'Verbändewechsel / Wundversorgung BG', confidence: 89 }
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSyntheticPatientDocument(index: number): ExtractedMedicalDocument {
  const isFemale = Math.random() > 0.5;
  const firstName = isFemale ? getRandomElement(FIRST_NAMES_FEMALE) : getRandomElement(FIRST_NAMES_MALE);
  const lastName = getRandomElement(LAST_NAMES);
  const gender = isFemale ? 'weiblich' : 'männlich';
  
  const birthYear = getRandomInt(1955, 2001);
  const birthMonth = String(getRandomInt(1, 12)).padStart(2, '0');
  const birthDay = String(getRandomInt(1, 28)).padStart(2, '0');
  const birthDate = `${birthDay}.${birthMonth}.${birthYear}`;

  const insurance = getRandomElement(INSURANCES);
  const kvNum = `A${getRandomInt(100000000, 999999999)}`;
  const address = `${getRandomElement(STREETS)}, ${getRandomElement(CITIES)}`;
  const caseId = `BG-2026-${getRandomInt(1000, 9999)}`;
  const docId = `DOC-SYNTH-${Date.now()}-${index}`;

  const selectedIcd = [getRandomElement(SAMPLE_ICD10), getRandomElement(SAMPLE_ICD10)];
  const selectedGoae = [getRandomElement(SAMPLE_GOAE), getRandomElement(SAMPLE_GOAE), getRandomElement(SAMPLE_GOAE)];

  // Vary confidence levels to demonstrate WORK confidence flags
  const isLowConfidenceDoc = index % 3 === 0;

  return {
    id: docId,
    caseId,
    fileName: `Befund_DGUV_${lastName}_${caseId}.pdf`,
    fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
    fileType: 'application/pdf',
    uploadTimestamp: new Date(Date.now() - getRandomInt(1, 48) * 3600 * 1000).toLocaleString('de-DE'),
    rawOcrText: `ÄRZTLICHER ENTLASSUNGSBERICHT / DGUV FORMULARGUTACHTEN
Patient: ${firstName} ${lastName}, geb. ${birthDate}
Gleichzeitig BG-Unfallanzeige Aktenzeichen: ${caseId}
Kostenträger: ${insurance} (KV-Nr.: ${kvNum})
Anschrift: ${address}

Anamnese & Unfallhergang:
Sturz am Arbeitsplatz aus 2.5m Höhe auf das rechte Kniegelenk und die Lendenwirbelsäule. Erstversorgung durch D-Arzt vor Ort. Stationäre Aufnahme im BG-Klinikum.

Klinischer Befund:
Spontanschmerz und Belastungsschmerz im Kniegelenk rechts (NRS 6/10). Beweglichkeit nach Neutral-0: Fle x/Extr 90/0/0°. Kein Errguss, Meniskustests positiv. Wirbelsäule Klopffehler über L4/L5.

Diagnosen (ICD-10):
1. ${selectedIcd[0].code} - ${selectedIcd[0].description}
2. ${selectedIcd[1].code} - ${selectedIcd[1].description}

GOÄ/GNR Abrechnungspositionen:
- ${selectedGoae[0].code}: ${selectedGoae[0].description} (${selectedGoae[0].priceEuro} €)
- ${selectedGoae[1].code}: ${selectedGoae[1].description} (${selectedGoae[1].priceEuro} €)
- ${selectedGoae[2].code}: ${selectedGoae[2].description} (${selectedGoae[2].priceEuro} €)
`,
    // MANDATORY CONSTRAINT 1
    isSynthetic: true,

    status: index === 0 ? 'PENDING_WORK' : index === 1 ? 'WORK_REVIEWED' : 'PENDING_WORK',
    currentRoleHandler: index === 1 ? 'ADMIN' : 'WORK',

    demographics: {
      patientId: { value: `P-${getRandomInt(10000, 99999)}`, confidence: 99, status: 'pending' },
      firstName: { value: firstName, confidence: isLowConfidenceDoc ? 78 : 96, status: isLowConfidenceDoc ? 'flagged' : 'pending' },
      lastName: { value: lastName, confidence: 98, status: 'pending' },
      birthDate: { value: birthDate, confidence: 95, status: 'pending' },
      gender: { value: gender, confidence: 99, status: 'pending' },
      insuranceNumber: { value: kvNum, confidence: isLowConfidenceDoc ? 74 : 92, status: isLowConfidenceDoc ? 'flagged' : 'pending' },
      insuranceProvider: { value: insurance, confidence: 94, status: 'pending' },
      address: { value: address, confidence: 89, status: 'pending' }
    },

    icd10Codes: {
      value: selectedIcd,
      confidence: isLowConfidenceDoc ? 79 : 94,
      status: isLowConfidenceDoc ? 'flagged' : 'pending'
    },

    goaeBillingCodes: {
      value: selectedGoae,
      confidence: 93,
      status: 'pending'
    },

    anamnesisText: {
      value: `Sturz am Arbeitsplatz aus 2.5m Höhe auf das rechte Kniegelenk. Erstversorgung im BG-Klinikum.`,
      confidence: 95,
      status: 'pending'
    },

    clinicalFindingsText: {
      value: `Kniegelenk rechts: Beugung/Streckung nach Neutral-0: 90/0/0°. Druckschmerz über Gelenkspalt. LWS L4/L5 druckschmerzhaft.`,
      confidence: 91,
      status: 'pending'
    }
  };
}

export function generateInitialSyntheticDataset(): ExtractedMedicalDocument[] {
  return [
    generateSyntheticPatientDocument(0),
    generateSyntheticPatientDocument(1),
    generateSyntheticPatientDocument(2)
  ];
}
