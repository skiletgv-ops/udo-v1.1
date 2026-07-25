import { AIAgent, Demographics, DocumentItem, Finding } from '../types';

export const DEFAULT_DEMOGRAPHICS: Demographics = {
  firstName: 'Hans',
  lastName: 'Müller',
  birthDate: '1968-05-14',
  gender: 'männlich',
  insuranceNumber: 'AOK-H-123456789',
  address: 'Friedrichstraße 102, 10117 Berlin',
  phone: '030 4829103',
  email: 'h.mueller@example.de',
  insuranceProvider: 'AOK Nordost',
  commissioningEntity: 'BG Bau / Sozialgericht Berlin',
  caseId: 'BG-2026-9901-A'
};

export const DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'MRT_LWS_14032024.pdf',
    type: 'application/pdf',
    size: '4.2 MB',
    uploadDate: '14.03.2024',
    status: 'bereit',
    category: 'MRT'
  },
  {
    id: 'doc-2',
    name: 'CT_Thorax_02022024.pdf',
    type: 'application/pdf',
    size: '12.8 MB',
    uploadDate: '02.02.2024',
    status: 'bereit',
    category: 'CT'
  },
  {
    id: 'doc-3',
    name: 'Histologie_Koloskopie_20012024.pdf',
    type: 'application/pdf',
    size: '1.8 MB',
    uploadDate: '20.01.2024',
    status: 'bereit',
    category: 'Histologie'
  },
  {
    id: 'doc-4',
    name: 'Laborwerte_15032024.pdf',
    type: 'application/pdf',
    size: '850 KB',
    uploadDate: '15.03.2024',
    status: 'bereit',
    category: 'Labor'
  },
  {
    id: 'doc-5',
    name: 'Anamnese_Medikation_10032024.pdf',
    type: 'application/pdf',
    size: '2.1 MB',
    uploadDate: '10.03.2024',
    status: 'bereit',
    category: 'Anamnese'
  }
];

export const DEMO_FINDINGS: Finding[] = [
  {
    id: 'find-1',
    title: 'Bandscheibenvorfall L4/L5 rechts mit Nervenwurzelkompression',
    description: 'Rechtslaterale Diskusprotrusion L4/L5 mit Pelottierung der Nervenwurzel L5 rechts. Verengung des Neuroforamens um ca. 65%. Korreliert mit Radikulopathie.',
    category: 'Bildgebung',
    severity: 'critical',
    date: '14.03.2024',
    sourceDocument: 'MRT_LWS_14032024.pdf',
    pageNumber: 2,
    confidence: 99.8,
    icdCode: 'M51.16',
    confirmed: true
  },
  {
    id: 'find-2',
    title: 'Chronisch-unspezifische Kolitis / M. Crohn V.a.',
    description: 'Histopathologischer Befund zeigt fokale Kryptenverzerrung und lymphoplasmozytäres Infiltrat der Lamina propria im terminalen Ileum.',
    category: 'Diagnose',
    severity: 'high',
    date: '20.01.2024',
    sourceDocument: 'Histologie_Koloskopie_20012024.pdf',
    pageNumber: 1,
    confidence: 99.4,
    icdCode: 'K51.9',
    confirmed: true
  },
  {
    id: 'find-3',
    title: 'Pulmonales Lungenemphysem GOLD II',
    description: 'Zentrilobuläres Emphysem mit bullösen Veränderungen in beiden Oberlappen. FEV1/FVC Verringerung auf 62%.',
    category: 'Bildgebung',
    severity: 'medium',
    date: '02.02.2024',
    sourceDocument: 'CT_Thorax_02022024.pdf',
    pageNumber: 3,
    confidence: 98.1,
    icdCode: 'J43.9',
    confirmed: true
  },
  {
    id: 'find-4',
    title: 'Entzündungsaktivität & Anämie-Symptomatik',
    description: 'CRP 18,4 mg/l (Ref < 5.0), BSG 42/78 mm, Hämoglobin erniedrigt auf 10,8 g/dl, HbA1c leicht erhöht auf 7,2%.',
    category: 'Labor',
    severity: 'high',
    date: '15.03.2024',
    sourceDocument: 'Laborwerte_15032024.pdf',
    pageNumber: 1,
    confidence: 99.9,
    icdCode: 'D64.9',
    confirmed: true
  },
  {
    id: 'find-5',
    title: 'Analgetika-NSAR Medikation bei Gastroenteritis-Risiko',
    description: 'Einnahme von Diclofenac 75mg retard bei bekannter Kolitis. KI-Konsens empfiehlt Umstellung auf COX-2-selektives Präparat oder Novaminsulfon.',
    category: 'Medikation',
    severity: 'critical',
    date: '10.03.2024',
    sourceDocument: 'Anamnese_Medikation_10032024.pdf',
    pageNumber: 1,
    confidence: 97.9,
    icdCode: 'Y57.9',
    confirmed: false
  },
  {
    id: 'find-6',
    title: 'Arterieller Hypertonus & Diabetes Mellitus Typ 2',
    description: 'Metformin 1000mg 1-0-1 und Ramipril 5mg 1-0-0. Gute metabolische Einstellung unter Metformin.',
    category: 'Symptom',
    severity: 'low',
    date: '10.03.2024',
    sourceDocument: 'Anamnese_Medikation_10032024.pdf',
    pageNumber: 2,
    confidence: 99.2,
    icdCode: 'I10.90 / E11.9',
    confirmed: true
  }
];

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'agent-clara',
    name: 'Dr. Clara Voss',
    title: 'Radiologie KI',
    specialty: 'Bildgebende Diagnostik (MRT / CT)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    iconName: 'Activity',
    progress: 0,
    status: 'idle',
    confidence: 99.8,
    findingsCount: 2,
    findings: [DEMO_FINDINGS[0], DEMO_FINDINGS[2]]
  },
  {
    id: 'agent-eric',
    name: 'Dr. Eric Thorne',
    title: 'Pathologie KI',
    specialty: 'Gewebeanalyse & Histologie',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Microscope',
    progress: 0,
    status: 'idle',
    confidence: 99.4,
    findingsCount: 2,
    findings: [DEMO_FINDINGS[1], DEMO_FINDINGS[3]]
  },
  {
    id: 'agent-marcel',
    name: 'Dr. Marcel Richter',
    title: 'Klinische KI',
    specialty: 'Symptomanalyse & Anamnese',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    iconName: 'Stethoscope',
    progress: 0,
    status: 'idle',
    confidence: 97.9,
    findingsCount: 2,
    findings: [DEMO_FINDINGS[4], DEMO_FINDINGS[5]]
  },
  {
    id: 'agent-gratsiano',
    name: 'Dr. Gratsiano Silva',
    title: 'Forschungs KI',
    specialty: 'Literatur & AWMF-Evidenzprüfung',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    iconName: 'BookOpen',
    progress: 0,
    status: 'idle',
    confidence: 99.6,
    findingsCount: 1,
    findings: [DEMO_FINDINGS[0]]
  }
];
