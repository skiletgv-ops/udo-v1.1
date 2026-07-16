export interface Card {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  category: string;
  moduleId: string;
  moduleName: string;
  numberLabel: string; // e.g. "n1", "n2"
  detailedDescription?: string;
}

export const FUNCTIONS_CARDS: Card[] = [
  {
    id: "1",
    imageUrl: "https://i.ibb.co/4ZWcP129/1.png",
    alt: "Kollateralschaden-Sicherheitsprüfung",
    title: "Kollateralschaden-Check",
    category: "RICHTLINIE",
    moduleId: "workflow",
    moduleName: "6-Phasen-Workflow",
    numberLabel: "n1",
    detailedDescription: "Systematische Prüfung potentieller Folgeschäden und unerwünschter Nebenwirkungen von gutachterlichen Stellungnahmen anhand der AWMF-Leitlinien."
  },
  {
    id: "2",
    imageUrl: "https://i.ibb.co/TMbhBRcL/2.png",
    alt: "Segment L4/L5 Biomechanik-Scan",
    title: "Segment L4/L5 Scan",
    category: "DIAGNOSTIK",
    moduleId: "video",
    moduleName: "3D-Video-Analyse",
    numberLabel: "n2",
    detailedDescription: "Präzise biomechanische Lastenverteilungsanalyse der lumbalen Segmente L4 und L5 bei Flexion und Rotation zur Bestimmung funktioneller Defizite."
  },
  {
    id: "3",
    imageUrl: "https://i.ibb.co/spXBFdSm/3.png",
    alt: "Dr. Altenberg Live-Konsultation",
    title: "Dr. Altenberg Live-Konsil",
    category: "BERATUNG",
    moduleId: "chat",
    moduleName: "Dr. Altenberg Chat",
    numberLabel: "n3",
    detailedDescription: "Direktes interaktives Konsil mit dem Experten-System für sozialmedizinische Spezialfragen und medizinisch-rechtliche Absicherung."
  },
  {
    id: "4",
    imageUrl: "https://i.ibb.co/N2TCN0bC/4.png",
    alt: "QES-Signaturerstellung",
    title: "QES-Signaturerstellung",
    category: "SIGNATUR",
    moduleId: "upgrades",
    moduleName: "Praxis-Upgrades",
    numberLabel: "n4",
    detailedDescription: "Qualifizierte elektronische Signatur gem. eIDAS-Verordnung für rechtssichere digitale Unterschriften von medizinischen Gutachten."
  },
  {
    id: "5",
    imageUrl: "https://i.ibb.co/jZkh6q1M/5.png",
    alt: "MdE-Minderungsprozente",
    title: "MdE-Prozentkalkulator",
    category: "KALKULATOR",
    moduleId: "analytics",
    moduleName: "Analytik & ROI",
    numberLabel: "n5",
    detailedDescription: "Präziser Rechner für die Minderung der Erwerbsfähigkeit (MdE) nach berufsgenossenschaftlichen Richtlinien und Tabellenwerken."
  },
  {
    id: "6",
    imageUrl: "https://i.ibb.co/6cc7mksr/6.png",
    alt: "Wirbelsäulen 3D-Rekonstruktion",
    title: "3D-Skelett-Rekonstruktion",
    category: "DIAGNOSTIK",
    moduleId: "video",
    moduleName: "3D-Video-Analyse",
    numberLabel: "n6",
    detailedDescription: "Dreidimensionale Rekonstruktion der Wirbelsäulengeometrie aus Multi-Kamera-Perspektiven zur Visualisierung struktureller Schäden."
  },
  {
    id: "7",
    imageUrl: "https://i.ibb.co/bjV35jNQ/7.png",
    alt: "AWMF-S2k Leitlinienprüfung",
    title: "S2k-Leitlinienprüfung",
    category: "RICHTLINIE",
    moduleId: "workflow",
    moduleName: "6-Phasen-Workflow",
    numberLabel: "n7",
    detailedDescription: "Echtzeit-Validierung medizinischer Beurteilungen gegen die aktuellen S2k/S3-Leitlinien der wissenschaftlich-medizinischen Fachgesellschaften."
  },
  {
    id: "8",
    imageUrl: "https://i.ibb.co/PZ7WLs7g/8.png",
    alt: "Kölner Konsens KI-Votum",
    title: "KI-Konsens-Votum",
    category: "CONSENSUS",
    moduleId: "chat",
    moduleName: "Dr. Altenberg Chat",
    numberLabel: "n8",
    detailedDescription: "Mehrheits-Abstimmung und Konsens-Konsolidierung verschiedener KI-Modelle zur Minimierung von Fehldiagnosen und Fehlinterpretationen."
  },
  {
    id: "9",
    imageUrl: "https://i.ibb.co/qLR5bQRM/9.png",
    alt: "Rezeptor- & Heilmittel-Upgrades",
    title: "Heilmittel-Verordnung",
    category: "MANAGEMENT",
    moduleId: "upgrades",
    moduleName: "Praxis-Upgrades",
    numberLabel: "n9",
    detailedDescription: "Rechtssichere Erstellung und Prüfung von Heilmittel-Verordnungen unter Berücksichtigung des Heilmittelkatalogs und Wirtschaftlichkeitsprüfungen."
  },
  {
    id: "10",
    imageUrl: "https://i.ibb.co/PdNhw3K/10.png",
    alt: "ROI & Abrechnungsprognose",
    title: "Abrechnungsprognose",
    category: "ANALYTIK",
    moduleId: "analytics",
    moduleName: "Analytik & ROI",
    numberLabel: "n10",
    detailedDescription: "Finanzielle Simulationen, Abrechnungsoptimierung nach GOÄ und UV-GOÄ, sowie Amortisationsprognosen für Gutachterpraxen."
  },
  {
    id: "11",
    imageUrl: "https://i.ibb.co/zWpN1nqJ/11.png",
    alt: "Skelett-Trajektorienverfolgung",
    title: "Trajektorienverfolgung",
    category: "DIAGNOSTIK",
    moduleId: "video",
    moduleName: "3D-Video-Analyse",
    numberLabel: "n11",
    detailedDescription: "Automatisches Tracking von Bewegungsknotenpunkten zur Erfassung von Ausweichbewegungen und funktionellen Bewegungseinschränkungen."
  },
  {
    id: "12",
    imageUrl: "https://i.ibb.co/fVYnCXgR/12.png",
    alt: "Haftungs-Präventionssystem",
    title: "Haftungs-Prävention",
    category: "RECHTLICH",
    moduleId: "workflow",
    moduleName: "6-Phasen-Workflow",
    numberLabel: "n12",
    detailedDescription: "Präventives Prüfsystem zur Erkennung formeller und materieller Fehler in Gutachten zur drastischen Senkung des Haftungsrisikos."
  },
  {
    id: "13",
    imageUrl: "https://i.ibb.co/1G6jZWcZ/13.png",
    alt: "Fachbegriffs-Buster & Übersetzung",
    title: "Fachbegriffs-Buster",
    category: "AUFKLÄRUNG",
    moduleId: "chat",
    moduleName: "Dr. Altenberg Chat",
    numberLabel: "n13",
    detailedDescription: "Übersetzung hochkomplexer medizinischer Befundberichte und lateinischer Fachausdrücke in allgemeinverständliche und lesbare Sprache."
  },
  {
    id: "14",
    imageUrl: "https://i.ibb.co/xKG7m905/14.png",
    alt: "BG-Fristenwächter & Termine",
    title: "BG-Fristenwächter",
    category: "FRISTEN",
    moduleId: "upgrades",
    moduleName: "Praxis-Upgrades",
    numberLabel: "n14",
    detailedDescription: "Automatisches Monitoring gesetzlicher Bearbeitungsfristen bei Berufsgenossenschaften und Unfallversicherungsträgern zur Terminsicherung."
  },
  {
    id: "15",
    imageUrl: "https://i.ibb.co/7dJzR3xK/15.png",
    alt: "Patienten-Zufriedenheits-KPI",
    title: "Zufriedenheits-Index",
    category: "ANALYTIK",
    moduleId: "analytics",
    moduleName: "Analytik & ROI",
    numberLabel: "n15",
    detailedDescription: "Strukturierte Erfassung, Konsolidierung und Auswertung der Patientenzufriedenheit und des Net Promoter Scores (NPS) der Gutachterstelle."
  },
  {
    id: "16",
    imageUrl: "https://i.ibb.co/NdJ1csXB/16.png",
    alt: "Radiologische Befundanalyse",
    title: "Radiologie-Befunder",
    category: "DIAGNOSTIK",
    moduleId: "video",
    moduleName: "3D-Video-Analyse",
    numberLabel: "n16",
    detailedDescription: "KI-gestützte anatomische Strukturprüfung radiologischer Bilddaten (Röntgen, CT, MRT) zur Validierung gutachterlicher Befunde."
  },
  {
    id: "17",
    imageUrl: "https://i.ibb.co/8L2Sdt5Q/17.png",
    alt: "Abrechnungs-Autopilot & Entwurf",
    title: "Abrechnungs-Autopilot",
    category: "RECHNUNG",
    moduleId: "workflow",
    moduleName: "6-Phasen-Workflow",
    numberLabel: "n17",
    detailedDescription: "Automatisierte Generierung von Rechnungsentwürfen auf Basis von erbrachten Leistungen, Ziffernvorschlägen und Leitlinieneinhaltung."
  },
  {
    id: "18",
    imageUrl: "https://i.ibb.co/mC1zxJYq/18.png",
    alt: "Cologne Dialekt-Patiententrost",
    title: "Dialekt-Trost-Modul",
    category: "HUMAN TOUCH",
    moduleId: "chat",
    moduleName: "Dr. Altenberg Chat",
    numberLabel: "n18",
    detailedDescription: "Empathische Patientenaufklärung mit rheinischer Herzlichkeit und traditionellem Kölner Zuspruch für stressfreie Gutachtensituationen."
  },
  {
    id: "19",
    imageUrl: "https://i.ibb.co/wryzsKs4/20.png",
    alt: "ePA-Schnittstelle & Sync",
    title: "ePA-Schnittstelle & Sync",
    category: "INTEGRATION",
    moduleId: "upgrades",
    moduleName: "Praxis-Upgrades",
    numberLabel: "n19",
    detailedDescription: "Direkte zertifizierte Schnittstellenanbindung zur elektronischen Patientenakte (ePA) für nahtlosen, datenschutzkonformen Datenaustausch."
  },
  {
    id: "20",
    imageUrl: "https://i.ibb.co/1fvnxL3L/19.png",
    alt: "BG-Kausalitätsvalidator",
    title: "BG-Kausalitätsprüfung",
    category: "VALIDIERUNG",
    moduleId: "analytics",
    moduleName: "Analytik & ROI",
    numberLabel: "n20",
    detailedDescription: "Wissenschaftliche Prüfung des ursächlichen Zusammenhangs zwischen Unfallereignis und Gesundheitsschaden gem. den Standards der gesetzlichen Unfallversicherung."
  }
];
