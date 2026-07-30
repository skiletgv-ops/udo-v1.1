export interface SyntheticPatient {
  id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: 'M' | 'F' | 'D';
  insuranceNumber: string; // KV/IK
  insuranceType: 'GKV' | 'PKV' | 'BG_DGUV';
  locationId: string;
  locationName: string;
  caseId: string;
  status: 'Waiting' | 'In-Consultation' | 'Gutachten-Draft' | 'Completed' | 'Checked-Out';
  triagePriority: 'High' | 'Medium' | 'Low';
  triageReason?: string;
  diagnoses: Array<{ icdCode: string; description: string; status: 'acute' | 'chronic' }>;
  labResults: Array<{ parameter: string; value: string; unit: string; referenceRange: string; status: 'normal' | 'high' | 'critical' }>;
  clinicalNotes: string;
  recentReportTitle?: string;
  commissioningEntity?: string;
  lanrDoctor?: string;
}

export interface PracticeLocation {
  id: string;
  name: string;
  city: string;
  doctorCount: number;
  lanrList: string[];
}

export const PRACTICE_LOCATIONS: PracticeLocation[] = [
  { id: 'loc-berlin', name: 'MVZ Praxis Berlin-Mitte', city: 'Berlin', doctorCount: 4, lanrList: ['LANR-1029384', 'LANR-9920182'] },
  { id: 'loc-munich', name: 'Praxisklinik München Bogenhausen', city: 'München', doctorCount: 3, lanrList: ['LANR-4019283'] },
  { id: 'loc-hamburg', name: 'Zentrum Neurologie Hamburg', city: 'Hamburg', doctorCount: 2, lanrList: ['LANR-5510293'] },
  { id: 'loc-cologne', name: 'Orthopädisches MVZ Köln Dom', city: 'Köln', doctorCount: 5, lanrList: ['LANR-8819203'] },
  { id: 'loc-frankfurt', name: 'BG Unfallpraxis Frankfurt', city: 'Frankfurt', doctorCount: 3, lanrList: ['LANR-7729102'] }
];

export const SYNTHETIC_PATIENTS: SyntheticPatient[] = [
  {
    id: 'PAT-1001',
    lastName: 'Müller',
    firstName: 'Hans',
    birthDate: '14.05.1978',
    gender: 'M',
    insuranceNumber: 'A123456789',
    insuranceType: 'BG_DGUV',
    locationId: 'loc-berlin',
    locationName: 'MVZ Praxis Berlin-Mitte',
    caseId: 'UDO-2026-901',
    status: 'Waiting',
    triagePriority: 'High',
    triageReason: 'Akuter Arbeitsunfall: Sturz aus 3m Höhe, V.a. LWS-Fraktur & Parästhesie L5',
    diagnoses: [
      { icdCode: 'M51.1', description: 'Lendenwirbelsäulenschaden mit Radikulopathie L4/L5', status: 'acute' },
      { icdCode: 'S32.0', description: 'Fraktur eines Lendenwirbels (BG-Unfall)', status: 'acute' }
    ],
    labResults: [
      { parameter: 'CK-MM', value: '380', unit: 'U/I', referenceRange: '< 190', status: 'high' },
      { parameter: 'CRP', value: '14.2', unit: 'mg/l', referenceRange: '< 5.0', status: 'high' },
      { parameter: 'Leukozyten', value: '11.8', unit: 'Gpt/l', referenceRange: '4.0 - 10.0', status: 'high' }
    ],
    clinicalNotes: 'Patient klagt über ausstrahlende Schmerzen ins linke Bein. Taubheitsgefühl im Fußrücken L5. MRT zeigt Sequester bei L4/L5 mit Bedrängung der L5-Wurzel.',
    recentReportTitle: 'S2k-Neurologisches Unfallgutachten L4/L5',
    commissioningEntity: 'BG BAU Bezirksverwaltung Berlin',
    lanrDoctor: 'LANR-1029384 (Dr. med. A. Voss)'
  },
  {
    id: 'PAT-1002',
    lastName: 'Schneider',
    firstName: 'Sabine',
    birthDate: '22.11.1985',
    gender: 'F',
    insuranceNumber: 'B987654321',
    insuranceType: 'GKV',
    locationId: 'loc-berlin',
    locationName: 'MVZ Praxis Berlin-Mitte',
    caseId: 'UDO-2026-902',
    status: 'In-Consultation',
    triagePriority: 'Medium',
    triageReason: 'Chronische Zervikobrachialgie nach Auffahrunfall vor 6 Monaten',
    diagnoses: [
      { icdCode: 'M53.1', description: 'Zervikobrachial-Syndrom C6/C7', status: 'chronic' },
      { icdCode: 'G44.2', description: 'Spannungskopfschmerz posttraumatisch', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'BSG', value: '12', unit: 'mm/h', referenceRange: '< 20', status: 'normal' },
      { parameter: 'HbA1c', value: '5.4', unit: '%', referenceRange: '< 5.7', status: 'normal' }
    ],
    clinicalNotes: 'Bewegungseinschränkung der HWS bei Rotation. Neurologisch unauffällig im Arm reflexes. Wärme- und Physiotherapie verordnet.',
    recentReportTitle: 'HWS-Schleudertrauma Folgegutachten',
    commissioningEntity: 'Allianz Versicherungs-AG',
    lanrDoctor: 'LANR-1029384 (Dr. med. A. Voss)'
  },
  {
    id: 'PAT-1003',
    lastName: 'Weber',
    firstName: 'Klaus',
    birthDate: '03.02.1965',
    gender: 'M',
    insuranceNumber: 'C456789123',
    insuranceType: 'PKV',
    locationId: 'loc-munich',
    locationName: 'Praxisklinik München Bogenhausen',
    caseId: 'UDO-2026-903',
    status: 'Gutachten-Draft',
    triagePriority: 'Low',
    triageReason: 'Routinekontrolle MdE-Neubewertung',
    diagnoses: [
      { icdCode: 'M17.1', description: 'Gonarthrose beidseits Stadium III', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'Harnsäure', value: '6.8', unit: 'mg/dl', referenceRange: '3.5 - 7.0', status: 'normal' }
    ],
    clinicalNotes: 'Postoperative Kontrolle nach Knietotalendoprothese re. Beugefähigkeit 110 Grad.',
    recentReportTitle: 'MdE-Kniegelenk Neubewertung',
    commissioningEntity: 'Signal Iduna Krankenversicherung',
    lanrDoctor: 'LANR-4019283 (Prof. Dr. H. Lindner)'
  },
  {
    id: 'PAT-1004',
    lastName: 'Fischer',
    firstName: 'Elena',
    birthDate: '19.08.1992',
    gender: 'F',
    insuranceNumber: 'D654321987',
    insuranceType: 'BG_DGUV',
    locationId: 'loc-hamburg',
    locationName: 'Zentrum Neurologie Hamburg',
    caseId: 'UDO-2026-904',
    status: 'Waiting',
    triagePriority: 'High',
    triageReason: 'Notfall-Einweisung: V.a. Karpaltunnelsyndrom akut rechts nach Schnittverletzung',
    diagnoses: [
      { icdCode: 'G56.0', description: 'Karpaltunnelsyndrom re. Hand', status: 'acute' }
    ],
    labResults: [
      { parameter: 'NLG N. medianus', value: '28', unit: 'm/s', referenceRange: '> 48', status: 'critical' }
    ],
    clinicalNotes: 'Massiver Hoffmann-Tinel Positivitätsbefund. Akute OP-Indikation DGUV Eilfall.',
    recentReportTitle: 'Handchirurgisches DGUV Notfallgutachten',
    commissioningEntity: 'BG Handel und Warenlogistik Hamburg',
    lanrDoctor: 'LANR-5510293 (Dr. K. Franke)'
  },
  {
    id: 'PAT-1005',
    lastName: 'Hoffmann',
    firstName: 'Michael',
    birthDate: '30.10.1970',
    gender: 'M',
    insuranceNumber: 'E789123456',
    insuranceType: 'GKV',
    locationId: 'loc-cologne',
    locationName: 'Orthopädisches MVZ Köln Dom',
    caseId: 'UDO-2026-905',
    status: 'Completed',
    triagePriority: 'Low',
    triageReason: 'Kontroll-EEG & Befundbesprechung',
    diagnoses: [
      { icdCode: 'G40.1', description: 'Lokalisationsbezogene Epilepsie', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'Levetiracetam-Spiegel', value: '24.5', unit: 'µg/ml', referenceRange: '12 - 46', status: 'normal' }
    ],
    clinicalNotes: 'EEG zeigt keine fokalen Verlangsamungen oder Anfallsmuster. Anfallsfrei seit 18 Monaten.',
    recentReportTitle: 'Neurologischer Verlaufskontrollbericht',
    commissioningEntity: 'AOK Rheinland/Hamburg',
    lanrDoctor: 'LANR-8819203 (Dr. M. Bongartz)'
  },
  {
    id: 'PAT-1006',
    lastName: 'Wagner',
    firstName: 'Claudia',
    birthDate: '11.04.1981',
    gender: 'F',
    insuranceNumber: 'F321987654',
    insuranceType: 'BG_DGUV',
    locationId: 'loc-frankfurt',
    locationName: 'BG Unfallpraxis Frankfurt',
    caseId: 'UDO-2026-906',
    status: 'In-Consultation',
    triagePriority: 'High',
    triageReason: 'D-Arzt Erstbericht nach BG Wegeunfall mit Distorsion Sprunggelenk',
    diagnoses: [
      { icdCode: 'S93.4', description: 'Verstauchung und Zerrung des Sprunggelenks', status: 'acute' }
    ],
    labResults: [
      { parameter: 'Röntgen OSG', value: 'Keine Fraktur', unit: '-', referenceRange: 'o.B.', status: 'normal' }
    ],
    clinicalNotes: 'Bandstruktur intakt. Ruhigstellung in MalleoLoc-Orthese für 3 Wochen verordnet.',
    recentReportTitle: 'D-Arzt Erstbericht DGUV-Formular 2026',
    commissioningEntity: 'BG ETEM Frankfurt',
    lanrDoctor: 'LANR-7729102 (Dr. E. Richter)'
  },
  {
    id: 'PAT-1007',
    lastName: 'Becker',
    firstName: 'Stefan',
    birthDate: '05.07.1959',
    gender: 'M',
    insuranceNumber: 'G159357246',
    insuranceType: 'GKV',
    locationId: 'loc-[#0d1322]',
    locationName: 'MVZ Praxis Berlin-Mitte',
    caseId: 'UDO-2026-907',
    status: 'Waiting',
    triagePriority: 'Medium',
    triageReason: 'Vorsorge Reha-Antrag & Gutachteneinsicht',
    diagnoses: [
      { icdCode: 'I10', description: 'Essentielle Hypertonie', status: 'chronic' },
      { icdCode: 'E11.9', description: 'Diabetes mellitus Typ 2', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'HbA1c', value: '7.8', unit: '%', referenceRange: '< 6.5', status: 'high' }
    ],
    clinicalNotes: 'Medikation angepasst: Metformin auf 1000mg gesteigert.',
    recentReportTitle: 'Sozialmedizinische Leistungsbeurteilung DRV',
    commissioningEntity: 'Deutsche Rentenversicherung Berlin',
    lanrDoctor: 'LANR-1029384 (Dr. med. A. Voss)'
  },
  {
    id: 'PAT-1008',
    lastName: 'Schulz',
    firstName: 'Laura',
    birthDate: '17.09.1996',
    gender: 'F',
    insuranceNumber: 'H951753852',
    insuranceType: 'PKV',
    locationId: 'loc-munich',
    locationName: 'Praxisklinik München Bogenhausen',
    caseId: 'UDO-2026-908',
    status: 'Checked-Out',
    triagePriority: 'Low',
    triageReason: 'Privatärztliche Zweitmeinung Migräne',
    diagnoses: [
      { icdCode: 'G43.0', description: 'Migräne ohne Aura', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'Magnesium Serum', value: '0.85', unit: 'mmol/l', referenceRange: '0.7 - 1.1', status: 'normal' }
    ],
    clinicalNotes: 'Prophylaxe mit CGRP-Antikörper besprochen.',
    recentReportTitle: 'Neurologischer Privatbericht',
    commissioningEntity: 'DKV Deutsche Krankenversicherung',
    lanrDoctor: 'LANR-4019283 (Prof. Dr. H. Lindner)'
  },
  {
    id: 'PAT-1009',
    lastName: 'Koch',
    firstName: 'Alexander',
    birthDate: '28.12.1973',
    gender: 'M',
    insuranceNumber: 'I753951456',
    insuranceType: 'BG_DGUV',
    locationId: 'loc-cologne',
    locationName: 'Orthopädisches MVZ Köln Dom',
    caseId: 'UDO-2026-909',
    status: 'Waiting',
    triagePriority: 'High',
    triageReason: 'BG-Dauerrente Überprüfung MdE > 30%',
    diagnoses: [
      { icdCode: 'T92.2', description: 'Spätfolgen einer Fraktur der Speiche', status: 'chronic' }
    ],
    labResults: [
      { parameter: 'Kraftmessung Jamar', value: '18', unit: 'kg', referenceRange: '> 42', status: 'critical' }
    ],
    clinicalNotes: 'Kraftminderung der rechten Hand um 55% im Vergleich zur Gegenseite. Belastungsschmerz bei Pronation.',
    recentReportTitle: 'S2k Rentengutachten DGUV JVEG',
    commissioningEntity: 'Verwaltungs-BG Köln',
    lanrDoctor: 'LANR-8819203 (Dr. M. Bongartz)'
  },
  {
    id: 'PAT-1010',
    lastName: 'Bauer',
    firstName: 'Monika',
    birthDate: '09.01.1968',
    gender: 'F',
    insuranceNumber: 'J852963147',
    insuranceType: 'GKV',
    locationId: 'loc-hamburg',
    locationName: 'Zentrum Neurologie Hamburg',
    caseId: 'UDO-2026-910',
    status: 'Gutachten-Draft',
    triagePriority: 'Medium',
    triageReason: 'Polyneuropathie Abklärung',
    diagnoses: [
      { icdCode: 'G62.9', description: 'Polyneuropathie unklarer Genese', status: 'acute' }
    ],
    labResults: [
      { parameter: 'Vitamin B12', value: '140', unit: 'pg/ml', referenceRange: '200 - 900', status: 'critical' }
    ],
    clinicalNotes: 'Hypästhesie strumpfförmig beidseits. Vitamin-B12 Substitutionstherapie veranlasst.',
    recentReportTitle: 'Nervenleitgeschwindigkeits-Befundbericht',
    commissioningEntity: 'Barmer GEK Hamburg',
    lanrDoctor: 'LANR-5510293 (Dr. K. Franke)'
  }
];
