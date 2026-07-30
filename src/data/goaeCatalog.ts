export interface GoaeCatalogItem {
  code: string;
  type: 'GOÄ' | 'EBM' | 'JVEG';
  description: string;
  pointsOrFactor: number;
  amountEur: number;
  section: string;
}

export const GOAE_CATALOG: GoaeCatalogItem[] = [
  { code: 'GOÄ-1', type: 'GOÄ', description: 'Beratung - auch telefonisch', pointsOrFactor: 2.3, amountEur: 10.72, section: 'Allgemein' },
  { code: 'GOÄ-5', type: 'GOÄ', description: 'Symptombezogene Untersuchung', pointsOrFactor: 2.3, amountEur: 10.72, section: 'Allgemein' },
  { code: 'GOÄ-800', type: 'GOÄ', description: 'Eingehende neurologische Untersuchung', pointsOrFactor: 2.3, amountEur: 26.23, section: 'Neurologie' },
  { code: 'GOÄ-801', type: 'GOÄ', description: 'Ganzkörperstatus Neurologie/Psychiatrie', pointsOrFactor: 2.3, amountEur: 33.52, section: 'Neurologie' },
  { code: 'GOÄ-827', type: 'GOÄ', description: 'Elektromyographische Untersuchung (EMG)', pointsOrFactor: 2.3, amountEur: 42.84, section: 'Elektrophysiologie' },
  { code: 'GOÄ-828', type: 'GOÄ', description: 'Bestimmung der Nervenleitgeschwindigkeit (NLG)', pointsOrFactor: 2.3, amountEur: 31.48, section: 'Elektrophysiologie' },
  { code: 'GOÄ-80', type: 'GOÄ', description: 'Schriftlicher Befundbericht / Arztbrief', pointsOrFactor: 2.3, amountEur: 17.49, section: 'Berichte' },
  { code: 'GOÄ-85', type: 'GOÄ', description: 'Eingehendes schriftliches Gutachten (S2k)', pointsOrFactor: 2.3, amountEur: 87.43, section: 'Gutachten' },
  { code: 'JVEG-M1', type: 'JVEG', description: 'Einfaches medizinisches Gutachten nach Aktenlage', pointsOrFactor: 1.0, amountEur: 85.00, section: 'JVEG Stundensatz' },
  { code: 'JVEG-M2', type: 'JVEG', description: 'Eingehendes Fachgutachten (LWS/HWS/Nerven)', pointsOrFactor: 1.0, amountEur: 100.00, section: 'JVEG Stundensatz' },
  { code: 'EBM-16220', type: 'EBM', description: 'Neurologische Grundpauschale', pointsOrFactor: 1.0, amountEur: 28.50, section: 'EBM GKV' },
  { code: 'EBM-16310', type: 'EBM', description: 'Zusatzpauschale Neurologisches Gutachten', pointsOrFactor: 1.0, amountEur: 45.00, section: 'EBM GKV' }
];
