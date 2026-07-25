export interface UdoDiagnose {
  code: string;
  name: string;
}

export interface UdoTermin {
  datum: string;
  uhrzeit: string;
  art: string;
}

export interface UdoBefund {
  datum: string;
  text: string;
  arzt: string;
}

export interface UdoAbrechnung {
  gnr: number;
  leistung: string;
  betrag_eur: number;
}

export interface UdoPatientRecord {
  pat_nr: number;
  name: string;
  vorname: string;
  geschlecht: 'm' | 'w';
  geburt: string;
  versicherung: string;
  versicherten_id: string;
  adresse: string;
  eintritt: string;
  hausarzt: string;
  status: string;
  diagnosen: string[];
  termine: UdoTermin[];
  befunde: UdoBefund[];
  abrechnung: UdoAbrechnung[];
}

const MALE_FIRST_NAMES = [
  "Thomas", "Michael", "Andreas", "Stefan", "Christian", "Jan", "Markus", "Alexander", "Frank", "Martin", "Maximilian", "Paul", "Leon", "Felix", "Lukas"
];

const FEMALE_FIRST_NAMES = [
  "Erika", "Sabine", "Monika", "Julia", "Stefanie", "Anna", "Maria", "Katharina", "Nicole", "Claudia", "Laura", "Sophie", "Emma", "Hannah", "Sandra"
];

const SURNAMES = [
  "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein"
];

const STREETS = [
  "Hauptstraße", "Bahnhofstraße", "Schulstraße", "Gartenstraße", "Dorfstraße", "Lindenstraße", "Ringstraße", "Wiesenweg", "Goethestraße", "Schillerstraße"
];

const CITIES = [
  "10115 Berlin", "80331 München", "50667 Köln", "20095 Hamburg", "60311 Frankfurt am Main", "70173 Stuttgart", "01067 Dresden", "04109 Leipzig", "40213 Düsseldorf", "90402 Nürnberg"
];

const INSURANCES = ["AOK", "BARMER", "TK", "DAK", "hkk"];

const STATUSES = ["Mitglied", "Familienversichert", "Rentner"];

const ICD10_LIST = [
  { code: "M54.5", name: "Kreuzschmerz (Lumbago)" },
  { code: "I10", name: "Essentielle (primäre) Hypertonie" },
  { code: "E11.9", name: "Diabetes mellitus, Typ 2: Ohne Komplikationen" },
  { code: "J06.9", name: "Akute Infektion der oberen Atemwege, nicht näher bezeichnet" },
  { code: "M51.1", name: "Lenden- und sonstige Bandscheibenschäden mit Radikulopathie" },
  { code: "G43.9", name: "Migräne, nicht näher bezeichnet" },
  { code: "F41.1", name: "Generalisierte Angststörung" }
];

const GNR_LIST = [
  { gnr: 16215, leistung: "Neurologische Grundpauschale", betrag_eur: 24.50 },
  { gnr: 16217, leistung: "Neurologische Zusatzpauschale Untersuchung", betrag_eur: 18.20 },
  { gnr: 16220, leistung: "Zusatzpauschale Kontinuitätsbetreuung", betrag_eur: 14.80 },
  { gnr: 16222, leistung: "EEG-Ableitung und Befundung", betrag_eur: 42.10 },
  { gnr: 32001, leistung: "Grundleistung Labor", betrag_eur: 5.60 },
  { gnr: 33011, leistung: "Ultraschalluntersuchung Säuglingshüfte / Gefäße", betrag_eur: 31.40 }
];

const APPOINTMENT_TYPES = [
  "Kontrolluntersuchung", "S2k Gutachten Erstgespräch", "EEG Messung", "Rezeptabholung", "Befundbesprechung"
];

const BEFUND_TEXTS = [
  "Lendenwirbelsäule L4/L5 unauffällig, diskrete Protrusion ohne Radikulopathie.",
  "EEG ohne paroxysmale Potenziale. Altersentsprechender Normalbefund.",
  "Blutdruck gut eingestellt, Laborwerte im Normbereich.",
  "Neurologischer Befund unauffällig, Sensibilität und Motorik intakt.",
  "Verlaufskontrolle nach Therapieansatz zeigt deutliche Besserung."
];

function getRandomElem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function generateUdoPatientRecord(): UdoPatientRecord {
  const geschlecht: 'm' | 'w' = Math.random() < 0.5 ? 'm' : 'w';
  const vorname = geschlecht === 'm' ? getRandomElem(MALE_FIRST_NAMES) : getRandomElem(FEMALE_FIRST_NAMES);
  const name = getRandomElem(SURNAMES);
  const pat_nr = getRandomInt(10000, 99999);

  // Geburtsdatum (18 - 85 Jahre alt)
  const now = new Date();
  const ageYears = getRandomInt(18, 85);
  const birthYear = now.getFullYear() - ageYears;
  const birthMonth = getRandomInt(0, 11);
  const maxDays = new Date(birthYear, birthMonth + 1, 0).getDate();
  const birthDay = getRandomInt(1, maxDays);
  const geburtDate = new Date(birthYear, birthMonth, birthDay);
  const geburt = formatDate(geburtDate);

  const versicherung = getRandomElem(INSURANCES);
  
  // Versicherten ID: P + 10 random digits
  let digits = '';
  for (let i = 0; i < 10; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  const versicherten_id = `P${digits}`;

  // Adresse
  const street = getRandomElem(STREETS);
  const streetNum = getRandomInt(1, 140);
  const cityPLZ = getRandomElem(CITIES);
  const adresse = `${street} ${streetNum}, ${cityPLZ}`;

  // Eintritt (within last 90 days)
  const eintrittDaysAgo = getRandomInt(1, 90);
  const eintrittDate = new Date(now.getTime() - eintrittDaysAgo * 24 * 60 * 60 * 1000);
  const eintritt = formatDate(eintrittDate);

  // Hausarzt
  const hausarzt = `Dr. med. ${getRandomElem(SURNAMES)}`;

  // Status
  const status = getRandomElem(STATUSES);

  // Diagnosen (0-3 items: string like "M54.5 - Kreuzschmerz (Lumbago)")
  const countDiagnosen = getRandomInt(0, 3);
  const shuffledICD = [...ICD10_LIST].sort(() => 0.5 - Math.random());
  const selectedICD = shuffledICD.slice(0, countDiagnosen);
  const diagnosen = selectedICD.map(item => `${item.code} - ${item.name}`);

  // Termine (0-2 items, within +30d)
  const countTermine = getRandomInt(0, 2);
  const termine: UdoTermin[] = [];
  for (let i = 0; i < countTermine; i++) {
    const termInDays = getRandomInt(1, 30);
    const termDate = new Date(now.getTime() + termInDays * 24 * 60 * 60 * 1000);
    const hours = String(getRandomInt(8, 17)).padStart(2, '0');
    const minutes = getRandomElem(["00", "15", "30", "45"]);
    termine.push({
      datum: formatDate(termDate),
      uhrzeit: `${hours}:${minutes}`,
      art: getRandomElem(APPOINTMENT_TYPES)
    });
  }

  // Befunde (0-2 items, past 60 days)
  const countBefunde = getRandomInt(0, 2);
  const befunde: UdoBefund[] = [];
  for (let i = 0; i < countBefunde; i++) {
    const befDaysAgo = getRandomInt(2, 60);
    const befDate = new Date(now.getTime() - befDaysAgo * 24 * 60 * 60 * 1000);
    befunde.push({
      datum: formatDate(befDate),
      text: getRandomElem(BEFUND_TEXTS),
      arzt: `Dr. med. ${getRandomElem(SURNAMES)}`
    });
  }

  // Abrechnung (1-3 items)
  const countAbrechnung = getRandomInt(1, 3);
  const shuffledGNR = [...GNR_LIST].sort(() => 0.5 - Math.random());
  const abrechnung: UdoAbrechnung[] = shuffledGNR.slice(0, countAbrechnung);

  return {
    pat_nr,
    name,
    vorname,
    geschlecht,
    geburt,
    versicherung,
    versicherten_id,
    adresse,
    eintritt,
    hausarzt,
    status,
    diagnosen,
    termine,
    befunde,
    abrechnung
  };
}

export function udo(): string {
  return JSON.stringify(generateUdoPatientRecord(), null, 2);
}

// Attach udo to global window if in browser
if (typeof window !== 'undefined') {
  (window as any).udo = udo;
}
