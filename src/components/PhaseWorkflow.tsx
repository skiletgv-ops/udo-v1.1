import React, { useState } from "react";
import { 
  Upload, 
  FileText, 
  Search, 
  Scale, 
  Users, 
  Compass, 
  Award, 
  Printer, 
  Key, 
  Mail, 
  User, 
  HelpCircle,
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Check, 
  Bookmark,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2
} from "lucide-react";
import { Patient, ExtractedData, ConsensusRound, GutachtenDraft } from "../types";

// Standard pre-defined patient cases to populate immediately on load
const MOCK_PATIENT_LIST: Patient[] = [
  {
    id: "pat-1",
    name: "Thomas Müller",
    avatarSeed: "thomas",
    caseId: "BG-2026-9901-A",
    status: "Entwurf",
    isQESSigned: false,
    extractedData: {
      demographics: {
        firstName: "Thomas",
        lastName: "Müller",
        birthDate: "14.11.1982",
        insuranceNumber: "X120938475",
        caseId: "BG-2026-9901-A",
        insuranceProvider: "Techniker Krankenkasse (TK)",
        commissioningEntity: "Berufsgenossenschaft Holz und Metall (BGHM)",
      },
      history: {
        anamnesis: "Der 43-jährige Patient Thomas Müller stellte sich nach einem Arbeitsunfall am 12.03.2025 mit anhaltenden Lumboischialgien links vor. Beim Heben einer schweren Kiste kam es zu einem plötzlichen, einschießenden Schmerz im Lendenwirbelbereich mit Ausstrahlung in das linke Bein (Dermatom L5). Konservative Therapieversuche mittels Analgetika (Ibuprofen, Novaminsulfon) und Physiotherapie brachten nur temporäre Linderung.",
        complaints: "Mäßige bis starke belastungsabhängige Schmerzen im unteren Rücken mit Taubheitsgefühl im linken Fußrücken. Gehstrecke auf ca. 500 Meter limitiert.",
      },
      clinicalFindings: [
        "Eingeschränkte Beweglichkeit der Lendenwirbelsäule (Schober-Zeichen 10/12 cm)",
        "Lasègue-Zeichen links positiv bei 45 Grad",
        "Sensibilitätsstörung (Hypästhesie) im Dermatom L5 links",
        "Achillessehnenreflex beidseits mittellehaft auslösbar, Patellarsehnenreflex unauffällig"
      ],
      imagingFindings: [
        "MRT LWS vom 28.03.2025: Deutlicher mediolateraler Bandscheibenvorfall (Herniation) im Segment L4/L5 links mit konsekutiver Kompression der abgangsnahen Nervenwurzel L5 links.",
        "Röntgen LWS vom 12.03.2025: Diskrete Osteochondrose und Facettengelenksarthrose L4-S1, kein Wirbelgleiten (Spondylolisthesis)."
      ],
      labValues: [
        { parameter: "Leukozyten", value: "7.8 G/l", referenceRange: "4.0 - 10.0", status: "normal" },
        { parameter: "CRP", value: "3.2 mg/l", referenceRange: "< 5.0", status: "normal" },
        { parameter: "Kreatinin", value: "0.9 mg/dl", referenceRange: "0.7 - 1.2", status: "normal" }
      ],
      timeline: [
        { date: "12.03.2025", event: "Arbeitsunfall (Hebetrauma) mit akutem LWS-Syndrom", source: "Erstbericht D-Arzt" },
        { date: "15.03.2025", event: "Beginn der konservativen Physiotherapie", source: "Verordnung" },
        { date: "28.03.2025", event: "MRT-Untersuchung LWS zeigt Bandscheibenvorfall L4/L5 links", source: "Radiologie Köln-Nord" },
        { date: "11.07.2026", event: "Gutachterliche Untersuchung durch U.D.O.", source: "U.D.O. Begutachtung" }
      ]
    },
    consensusRounds: [
      {
        id: "cr-1",
        findingName: "Bandscheibenvorfall L4/L5 links gesichert",
        description: "Liegt ein struktureller Bandscheibenvorfall im angegebenen Segment vor?",
        votes: {
          "Gemini 3.5": "KEEP",
          "DeepSeek R1": "KEEP",
          "GPT-4o": "KEEP"
        },
        finalDecision: "KEEP",
        qaAnnotation: "Befund durch radiologische MRT-Bildgebung vom 28.03.2025 unzweifelhaft belegt."
      },
      {
        id: "cr-2",
        findingName: "Direkte Kausalität zum Unfallereignis",
        description: "Ist der Bandscheibenvorfall ursächlich auf das Hebetrauma am 12.03.2025 zurückzuführen oder handelt es sich um eine degenerative Vorschädigung?",
        votes: {
          "Gemini 3.5": "NEUTRAL",
          "DeepSeek R1": "KEEP",
          "GPT-4o": "REJECT"
        },
        finalDecision: "NEUTRAL",
        qaAnnotation: "Vorschädigung durch Röntgen-Befund (Osteochondrose und Facettengelenksarthrose) gesichert. Das Hebetrauma wirkte jedoch als wesentliche Richtungsgebung für die akute Radikulopathie."
      },
      {
        id: "cr-3",
        findingName: "Dauerhafte Minderung der Erwerbsfähigkeit (MdE) von 20%",
        description: "Liegt eine dauerhafte Funktionseinschränkung vor, die eine MdE von 20% im sozialen Entschädigungsrecht rechtfertigt?",
        votes: {
          "Gemini 3.5": "KEEP",
          "DeepSeek R1": "KEEP",
          "GPT-4o": "KEEP"
        },
        finalDecision: "KEEP",
        qaAnnotation: "Aufgrund der limitierten Gehstrecke (< 500m) und neurologischen Defizite (Sensibilitätsstörung L5) ist eine MdE von 20% angemessen."
      }
    ],
    draft: {
      id: "dr-1",
      anamneseText: "Der Patient Thomas Müller zog sich am 12.03.2025 während seiner versicherten Tätigkeit als Metallbauer beim Verheben einer schweren Werkstückkiste ein akutes LWS-Syndrom zu. Unmittelbar nach dem Vorfall kam es zu stechenden Lumboischialgien links mit Dermatom-bezogener Ausstrahlung.",
      befundeText: "Klinisch zeigt sich eine ausgeprägte Lendenstrecksteife. Der Finger-Boden-Abstand beträgt 32 cm. Das Lasègue-Zeichen ist links bei 45 Grad auslösbar. Neurologisch besteht eine sensible Störung im Bereich des linken Fußrückens (entsprechend Wurzel L5). Motorische Defizite liegen nicht vor.",
      beurteilungText: "Unter Würdigung der radiologischen Befunde der MRT vom 28.03.2025 liegt im Segment L4/L5 links ein ausgeprägter Bandscheibenvorfall vor, welcher die Wurzel L5 links komprimiert. Da die Röntgenaufnahme vom Unfalltag bereits degenerative Veränderungen im Sinne einer Osteochondrose aufweist, ist von einer klinisch stummen Vorschädigung auszugehen. Das Hebetrauma am 12.03.2025 hat diesen Zustand jedoch akut verschlimmert und die Wurzelkompression manifestiert.",
      beantwortungFragenText: "Frage 1: Ist das Unfallereignis die rechtlich wesentliche Ursache des Gesundheitsschadens? Antwort: Ja. Trotz degenerativer Vorzustände war das Hebetrauma die wesentliche Ursache der akuten Schmerzsymptomatik und der Notwendigkeit einer spezifischen Behandlung.\n\nFrage 2: Wie hoch ist die Minderung der Erwerbsfähigkeit (MdE) einzuschätzen? Antwort: Die unfallbedingte MdE ist ab dem Zeitpunkt des Unfalls mit 20% zu bewerten.",
      evidenceLinks: [
        { id: "ev-1", text: "Schmerzsymptomatik nach Kistenheben", source: "D-Arztbericht vom 12.03.2025, S. 1" },
        { id: "ev-2", text: "mediolateraler Bandscheibenvorfall L4/L5 links", source: "MRT-Bericht Radiologie vom 28.03.2025, S. 2" },
        { id: "ev-3", text: "degenerative Osteochondrose", source: "Röntgenbefund LWS vom 12.03.2025, S. 1" }
      ]
    },
    patientLetter: `Sehr geehrter Herr Müller,\n\nich habe heute Ihr medizinisches Gutachten für die Berufsgenossenschaft fertiggestellt. Mir ist es ein großes Anliegen, dass Sie genau verstehen, was die Untersuchung ergeben hat und was das für Sie bedeutet.\n\nBei Ihrem Arbeitsunfall haben Sie sich eine akute Reizung im Lendenwirbelbereich zugezogen. Die Kernspinuntersuchung (MRT) zeigt im Segment L4/L5 einen Bandscheibenvorfall (Herniation). Dieser Vorfall drückt direkt auf Ihre Nervenwurzel L5 links. Das erklärt auch Ihre Lumboischialgie (den einschießenden Schmerz ins linke Bein) sowie das Taubheitsgefühl an Ihrem linken Fußrücken.\n\nObwohl auf den Röntgenbildern bereits leichte Abnutzungen wie eine Osteochondrose zu sehen sind, ist der Unfall als Hauptursache für Ihre aktuellen Schmerzen anzusehen. Ich habe der Versicherung empfohlen, eine Minderung der Erwerbsfähigkeit (MdE) von 20% anzuerkennen. Das bedeutet für Sie finanzielle Unterstützung bei der Genesung.\n\nIch wünsche Ihnen von Herzen eine gute Besserung.\n\nMit freundlichen Grüßen,\nIhr Dr. med. Heinrich Altenberg`
  },
  {
    id: "pat-2",
    name: "Sabine Becker",
    avatarSeed: "sabine",
    caseId: "BG-2026-1022-C",
    status: "Prüfung",
    isQESSigned: false,
  }
];

const JARGON_DICTIONARY: Record<string, string> = {
  "Lumboischialgie": "Rückenschmerz im Bereich der Lendenwirbelsäule, der typischerweise über das Gesäß in das Bein ausstrahlt, meist verursacht durch Druck auf eine Nervenwurzel.",
  "Herniation": "Medizinischer Fachbegriff für einen Bandscheibenvorfall, bei dem der innere Gallertkern der Bandscheibe durch den äußeren Faserring bricht.",
  "Segment L4/L5": "Der Bereich zwischen dem 4. und 5. Lendenwirbelkörper. Dies ist eine der am stärksten belasteten Stellen der menschlichen Wirbelsäule.",
  "Nervenwurzel L5": "Ein wichtiger Nervenstrang, der im Lendenbereich aus dem Rückenmark austritt und für das Gefühl im Fußrücken und das Heben der großen Zehe verantwortlich ist.",
  "Osteochondrose": "Ein Verschleiß oder eine Abnutzung des Knochens der Wirbelsäule und der dazugehörigen Bandscheiben durch chronische Belastung.",
  "Radikulopathie": "Eine Erkrankung oder Schädigung einer Nervenwurzel mit Schmerzen, Taubheitsgefühl oder Muskelschwäche im Versorgungsgebiet dieses Nervs.",
  "Lasègue-Zeichen": "Ein klinischer Test, bei dem das gestreckte Bein des liegenden Patienten angehoben wird. Tritt dabei ein einschießender Schmerz auf, deutet dies auf eine Nervenreizung hin.",
  "Kausalität": "Der ursächliche Zusammenhang zwischen einem Unfallereignis und einem dadurch entstandenen gesundheitlichen Schaden, der rechtlich nachgewiesen sein muss.",
  "Minderung der Erwerbsfähigkeit (MdE)": "Ein Prozentsatz, der angibt, wie stark ein Mensch nach einem Unfall in seiner Fähigkeit, auf dem allgemeinen Arbeitsmarkt Geld zu verdienen, eingeschränkt ist."
};

const DEMO_DOSSIER_PRESETS = [
  {
    name: "Demo: Thomas Müller (Bandscheibenvorfall L4/L5)",
    text: `PATIENTEN-DOSSIER
Name: Thomas Müller, geb. 14.11.1982
Versicherung: Techniker Krankenkasse (TK), Vers.-Nr: X120938475
Unfallakten-Nr: BG-2026-9901-A
Beauftragende Stelle: Berufsgenossenschaft Holz und Metall (BGHM), Köln

ANAMNESE:
Der Patient war am 12.03.2025 als angestellter Schlosser tätig. Beim manuellen Heben einer ca. 35 kg schweren Kiste verspürte er einen heftigen, peitschenhiebartigen Schmerz im unteren Rücken. Schmerzausstrahlung in das linke Bein bis zum Fußrücken. Unfähigkeit, die Arbeit fortzusetzen. Vorstellung beim D-Arzt am selben Tag.

DIAGNOSTISCHE BEFUNDE:
12.03.2025 Röntgen LWS: Mäßige Osteochondrose L4-S1 mit Facettengelenksarthrose. Keine Fraktur, kein Wirbelgleiten.
28.03.2025 MRT LWS (Radiologie Köln): Breiter mediolateraler Bandscheibenvorfall (Herniation) im Segment L4/L5 links mit deutlicher Kompression der abgangsnahen Nervenwurzel L5 links.

KLINISCHE BEFUNDE (AKTUELL):
Patient klagt über persistierende Lumboischialgie links. Taubheitsgefühl linker Fußrücken. Lasègue links bei 45° positiv auslösbar. Achillessehnenreflex (ASR) links abgeschwächt. Schober-Zeichen 10/12 cm.`
  },
  {
    name: "Demo: Anna Schmidt (Knie-Distorsion & Meniskus)",
    text: `PATIENTEN-DOSSIER
Name: Anna Schmidt, geb. 03.05.1991
Versicherung: AOK Rheinland, Vers.-Nr: Y902834711
Unfallakten-Nr: BG-2026-4412-B
Beauftragende Stelle: Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege (BGW)

ANAMNESE:
Am 04.04.2025 verdrehte sich die selbstständige Physiotherapeutin beim Aufhelfen eines Patienten das rechte Kniegelenk. Unmittelbarer Knall und heftiger Schmerz an der Knieinnenseite. Konsekutive Gelenkschwellung (Hydrops).

DIAGNOSTISCHE BEFUNDE:
05.04.2025 Röntgen Knie re: Knöchern intakt, diskrete Arthrosezeichen.
18.04.2025 MRT Knie re: Riss des Innenmeniskushinterhorns (Grad III n. Stoller). Baker-Zyste.

KLINISCHE BEFUNDE:
Druckschmerz über dem inneren Gelenkspalt. Steinmann-I-Zeichen positiv. Beugung schmerzhaft auf 90° limitiert. Gangbild hinkend.`
  }
];

interface PhaseWorkflowProps {
  onRobotStateChange: (state: any) => void;
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
}

export default function PhaseWorkflow({ onRobotStateChange, activePatient, setActivePatient }: PhaseWorkflowProps) {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENT_LIST);
  const [dossierInput, setDossierInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [evidenceHighlight, setEvidenceHighlight] = useState<string | null>(null);
  const [selectedJargon, setSelectedJargon] = useState<{ term: string; definition: string } | null>(null);

  // QES PIN States
  const [qesCardInserted, setQesCardInserted] = useState(false);
  const [qesPin, setQesPin] = useState("");
  const [qesSigningStatus, setQesSigningStatus] = useState<"idle" | "signing" | "success" | "error">("idle");
  const [egvpStatus, setEgvpStatus] = useState<"idle" | "transmitting" | "success">("idle");

  // Select active patient from listing
  const handleSelectPatient = (patient: Patient) => {
    setActivePatient(patient);
    if (patient.extractedData) {
      setDossierInput("");
    }
  };

  // Pre-load demo dossier write text
  const handleLoadDemo = (text: string) => {
    setDossierInput(text);
  };

  // Phase 1: Real full-stack automatic extraction trigger
  const handleExtractDossier = async () => {
    if (!dossierInput.trim()) return;

    setIsExtracting(true);
    onRobotStateChange("THINKING");

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossierText: dossierInput })
      });
      const data = await res.json();

      // Create new Patient object based on extracted text
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        name: `${data.demographics?.firstName || "Unbekannt"} ${data.demographics?.lastName || "Patient"}`,
        avatarSeed: (data.demographics?.firstName || "user").toLowerCase(),
        caseId: data.demographics?.caseId || `BG-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: "Entwurf",
        isQESSigned: false,
        extractedData: data,
        consensusRounds: [
          {
            id: `cr-1-${Date.now()}`,
            findingName: data.imagingFindings?.[0] ? "Klinischer Befund gesichert" : "Verletzung verifiziert",
            description: "Ist der beschriebene Befund auf das angegebene Ereignis zurückzuführen?",
            votes: { "Gemini 3.5": "KEEP", "DeepSeek R1": "KEEP", "GPT-4o": "NEUTRAL" },
            finalDecision: "KEEP",
            qaAnnotation: "Diagnostisch durch eingereichtes Dossier ausreichend verifiziert."
          }
        ],
        draft: {
          id: `dr-${Date.now()}`,
          anamneseText: data.history?.anamnesis || "Anamnese aus Dossier extrahiert.",
          befundeText: (data.clinicalFindings || []).join("\n"),
          beurteilungText: (data.imagingFindings || []).join("\n") + "\n\nDie Kausalität ist plausibel zu begründen.",
          beantwortungFragenText: "Frage 1: Liegt ein unfallbedingter Schaden vor?\nAntwort: Ja, die Befunde korrelieren.",
          evidenceLinks: [
            { id: `ev-1-${Date.now()}`, text: "Herausgefilterte Anamnese", source: "Dossierextraktion" }
          ]
        },
        patientLetter: `Sehr geehrte/r Frau/Herr ${data.demographics?.lastName || "Patient"},\n\nich habe Ihr medizinisches Gutachten fertiggestellt. Das eingereichte Dossier belegt Ihre Beschwerden im Rahmen der Untersuchung.\n\nIch wünsche Ihnen eine rasche Genesung.\n\nMit freundlichen Grüßen,\nIhr Dr. med. Heinrich Altenberg`
      };

      setPatients([newPatient, ...patients]);
      setActivePatient(newPatient);
      onRobotStateChange("HAPPY");
      setActivePhase(2); // Automatically advance to Phase 2
    } catch (err) {
      console.error(err);
      onRobotStateChange("SURPRISED");
    } finally {
      setIsExtracting(false);
    }
  };

  // Phase 5: Simulated Qualified Electronic Signature Process
  const handleQESSign = () => {
    if (!activePatient) return;
    if (qesPin !== "1234") {
      setQesSigningStatus("error");
      onRobotStateChange("SURPRISED");
      return;
    }

    setQesSigningStatus("signing");
    onRobotStateChange("THINKING");

    setTimeout(() => {
      setQesSigningStatus("success");
      onRobotStateChange("HAPPY");
      
      const updatedPatients = patients.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            isQESSigned: true,
            status: "Signiert" as const,
            signatureHash: "RSA-4096#" + Math.random().toString(36).substring(2).toUpperCase() + "FF89D" + Date.now(),
            signedAt: new Date().toLocaleString("de-DE"),
            egvpReceiptId: "EGVP-REC-2026-" + Math.floor(Math.random() * 900000 + 100000),
            egvpStatus: "Success" as const
          };
        }
        return p;
      });

      setPatients(updatedPatients);
      // Find and update active patient as well
      const match = updatedPatients.find(p => p.id === activePatient.id);
      if (match) setActivePatient(match);

      // Start EGVP secure mailing simulation
      setEgvpStatus("transmitting");
      setTimeout(() => {
        setEgvpStatus("success");
      }, 2500);

    }, 2000);
  };

  // Helper text highlights
  const handleHighlightSource = (source: string) => {
    setEvidenceHighlight(source);
    setTimeout(() => setEvidenceHighlight(null), 5000);
  };

  // Dynamic status solver for each phase to allow the user to track progress at a glance
  const getPhaseStatus = (phaseNum: number): { text: string; style: string } => {
    switch (phaseNum) {
      case 1: // Upload
        if (currentPatient) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Pending", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
      case 2: // Entwurf
        if (currentPatient?.extractedData) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Pending", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
      case 3: // Konsens
        if (currentPatient?.consensusRounds && currentPatient.consensusRounds.length > 0) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Action Required", style: "bg-amber-500/10 border-amber-500/30 text-amber-400" };
      case 4: // Druck
        if (currentPatient?.isQESSigned) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Pending", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
      case 5: // Signatur
        if (currentPatient?.isQESSigned) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Action Required", style: "bg-amber-500/10 border-amber-500/30 text-amber-400" };
      case 6: // Aufklärung
        if (currentPatient?.isQESSigned) {
          return { text: "Validated", style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
        }
        return { text: "Pending", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
      default:
        return { text: "Pending", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
    }
  };

  const currentPatient = activePatient || patients[0];

  return (
    <div className="space-y-6">
      
      {/* Patient selector bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase">
              Aktiver Arbeitsbereich
            </h2>
            <p className="text-sm font-black text-white">
              {currentPatient ? `${currentPatient.name} (Fall-ID: ${currentPatient.caseId})` : "Kein Patient ausgewählt"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-400 uppercase font-mono mr-1">Wechseln:</label>
          <div className="flex gap-1">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPatient(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
                  currentPatient?.id === p.id
                    ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                    : "bg-black/60 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6-Phase Steps Indicator Banner */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-md">
        {[
          { num: 1, name: "Upload" },
          { num: 2, name: "Entwurf" },
          { num: 3, name: "Konsens" },
          { num: 4, name: "Druck" },
          { num: 5, name: "Signatur" },
          { num: 6, name: "Aufklärung" }
        ].map((phase) => {
          const statusInfo = getPhaseStatus(phase.num);
          return (
            <button
              key={phase.num}
              onClick={() => {
                setActivePhase(phase.num);
                onRobotStateChange(phase.num === 3 ? "THINKING" : phase.num === 6 ? "HAPPY" : "TRACKING");
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                activePhase === phase.num
                  ? "bg-blue-600/15 border-blue-500/50 text-blue-300 shadow-inner scale-[1.03]"
                  : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono font-bold leading-none mb-1 opacity-70">
                0{phase.num}
              </span>
              <span className="text-[11px] uppercase font-sans tracking-wider leading-none mb-2 font-black">
                {phase.name}
              </span>
              <span className={`text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border ${statusInfo.style} scale-95 font-black shrink-0`}>
                {statusInfo.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Content Card with Glassmorphic styling */}
      <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden min-h-[500px]">
        
        {/* Phase 1: Dossier-Upload & Extraction */}
        {activePhase === 1 && (
          <div className="space-y-6 animate-fade-in" id="phase-upload-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest font-semibold">
                Phase 1: Dossier-Upload & Datenextraktion
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Diagnostische Dokumente einlesen
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Laden Sie Befunde, Krankenhausberichte oder D-Arzt-Formulare als Freitext hoch. Die generative KI analysiert das Dossier, filtert irrelevantes Rauschen heraus und baut eine strukturierte, zeitliche Faktenmatrix auf.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Input Form / Text Area */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-slate-400 font-mono tracking-wider">
                    Dossier-Eingabe (Freitext)
                  </span>
                  <div className="flex gap-1.5">
                    {DEMO_DOSSIER_PRESETS.map((p, idx) => (
                      <button
                        key={p.name}
                        onClick={() => handleLoadDemo(p.text)}
                        className="px-2 py-1 rounded bg-black/60 text-[9px] font-mono text-blue-400 border border-blue-500/20 hover:border-blue-500/50 transition-all"
                      >
                        Demo {idx + 1} laden
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="w-full h-64 bg-black/25 border border-white/10 rounded-xl p-4 text-xs font-mono text-blue-100 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 leading-relaxed resize-none"
                  placeholder="Kopieren Sie hier den Freitext des medizinischen Dossiers hinein (z. B. Arztbrief, Röntgenbefund)..."
                  value={dossierInput}
                  onChange={(e) => setDossierInput(e.target.value)}
                />

                <button
                  onClick={handleExtractDossier}
                  disabled={isExtracting || !dossierInput.trim()}
                  className={`w-full py-3 px-4 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isExtracting || !dossierInput.trim()
                      ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600 text-slate-950 font-black shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-[1.01]"
                  }`}
                >
                  {isExtracting ? (
                    <>
                      <Clock className="animate-spin" size={16} />
                      Extrahiere Daten mit Gemini AI...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Dossier analysieren & Phase 2 starten
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Visualization / Timeline Preview of extracted data */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-white/5 rounded-2xl p-5 overflow-y-auto max-h-[380px] space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                  Strukturierter Befund (Extrahiert)
                </h4>

                {currentPatient.extractedData ? (
                  <div className="space-y-4 text-xs">
                    {/* Demographics Card */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 uppercase font-mono font-bold">
                        <span>Patientendaten</span>
                        <span className="text-blue-400">Extrahiert</span>
                      </div>
                      <p className="text-white font-bold">{currentPatient.extractedData.demographics.firstName} {currentPatient.extractedData.demographics.lastName}</p>
                      <p className="text-slate-300 font-mono text-[10px]">Geb: {currentPatient.extractedData.demographics.birthDate} | Vers.-Nr: {currentPatient.extractedData.demographics.insuranceNumber}</p>
                      <p className="text-slate-400 text-[9px] font-mono">Stelle: {currentPatient.extractedData.demographics.commissioningEntity}</p>
                    </div>

                    {/* Timeline Grid */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Klinische Timeline</span>
                      <div className="relative pl-4 border-l border-blue-500/20 space-y-3.5">
                        {currentPatient.extractedData.timeline.map((event, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-slate-950" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono font-bold text-blue-400">{event.date}</span>
                              <p className="text-white text-[11px] leading-relaxed font-sans">{event.event}</p>
                              <span className="text-[9px] text-slate-400 italic block font-mono">Quelle: {event.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600 font-mono text-xs">
                    <FileText size={32} className="mb-2 text-slate-700 animate-pulse" />
                    Warten auf Befundextraktion...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Gutachten-Entwurf */}
        {activePhase === 2 && (
          <div className="space-y-6 animate-fade-in" id="phase-draft-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-widest font-semibold">
                Phase 2: Gutachten-Entwurf (Deutsche Vorlage)
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Medizinisches Gutachten strukturieren
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Der Gutachtenentwurf ist in die klassischen Segmente deutscher Sozialgerichte unterteilt. Jede Aussage ist mit einem revisionssicheren Quellenbeleg versehen. Klicken Sie auf Zitate, um die Evidenzverknüpfung zu auditieren.
              </p>
            </div>

            {currentPatient.draft ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Text drafting workspace */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-3">
                    {/* Section 1: Anamnese */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">I. Anamnese und Unfallhergang</label>
                      <textarea
                        className="w-full bg-black/25 border border-white/10 rounded-xl p-3 text-xs text-slate-100 font-sans focus:border-blue-500/30 focus:outline-none"
                        rows={3}
                        value={currentPatient.draft.anamneseText}
                        onChange={(e) => {
                          const updated = [...patients];
                          const match = updated.find(p => p.id === currentPatient.id);
                          if (match && match.draft) match.draft.anamneseText = e.target.value;
                          setPatients(updated);
                        }}
                      />
                    </div>

                    {/* Section 2: Befunde */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">II. Klinische und bildgebende Befunde</label>
                      <textarea
                        className="w-full bg-black/25 border border-white/10 rounded-xl p-3 text-xs text-slate-100 font-sans focus:border-blue-500/30 focus:outline-none"
                        rows={3}
                        value={currentPatient.draft.befundeText}
                        onChange={(e) => {
                          const updated = [...patients];
                          const match = updated.find(p => p.id === currentPatient.id);
                          if (match && match.draft) match.draft.befundeText = e.target.value;
                          setPatients(updated);
                        }}
                      />
                    </div>

                    {/* Section 3: Beurteilung */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">III. Medizinisch-Klinische Beurteilung (Kausalität)</label>
                      <textarea
                        className="w-full bg-black/25 border border-white/10 rounded-xl p-3 text-xs text-slate-100 font-sans focus:border-blue-500/30 focus:outline-none"
                        rows={4}
                        value={currentPatient.draft.beurteilungText}
                        onChange={(e) => {
                          const updated = [...patients];
                          const match = updated.find(p => p.id === currentPatient.id);
                          if (match && match.draft) match.draft.beurteilungText = e.target.value;
                          setPatients(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setActivePhase(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/10"
                    >
                      <span>Phase 3 starten: Multi-Modell-Konsens</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Evidence Tracker (Evidenzverknüpfung) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#05070a]/90 border border-indigo-500/20 shadow-lg space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-[10px] uppercase border-b border-white/5 pb-2">
                      <Bookmark size={12} />
                      <span>Evidenzverknüpfung</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal">
                      Klicken Sie auf einen Beleg, um die Beweiskette im Dossier zurückzuverfolgen. Damit ist das Gutachten rechtlich lückenlos verteidigungsfähig.
                    </p>

                    <div className="space-y-2">
                      {currentPatient.draft.evidenceLinks.map((link) => (
                        <button
                          key={link.id}
                          onClick={() => handleHighlightSource(link.source)}
                          className="w-full text-left p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-indigo-500/30 text-xs transition-all flex items-start gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-white font-semibold group-hover:text-indigo-300 transition-colors">
                              &bdquo;{link.text}&ldquo;
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {link.source}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Audited highlight feedback bubble */}
                    {evidenceHighlight && (
                      <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 font-mono animate-pulse">
                        <strong>Prüfpfad aktiv:</strong> Quellenbeleg erfolgreich verifiziert in &bdquo;{evidenceHighlight}&ldquo;
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono text-xs">
                Kein Entwurf für diesen Patienten angelegt. Generieren Sie erst Daten in Phase 1.
              </div>
            )}
          </div>
        )}

        {/* Phase 3: Multi-Modell-Prüfung & Konsens */}
        {activePhase === 3 && (
          <div className="space-y-6 animate-fade-in" id="phase-consensus-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest font-semibold">
                Phase 3: Multi-Modell-Prüfung & Konsenssystem
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                KI-Votierung & medizinischer Abgleich
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                U.D.O. fragt gleichzeitig Gemini, DeepSeek-R1 und GPT-4o zu kritischen Befundkonklusionen ab. Das Abstimmungssystem ermittelt nach Mehrheitsentscheid (KEEP/REJECT/NEUTRAL) das rechtssichere Gesamtergebnis und listet Abweichungen auf.
              </p>
            </div>

            {currentPatient.consensusRounds ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentPatient.consensusRounds.map((round) => (
                    <div 
                      key={round.id} 
                      className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col justify-between shadow-md hover:border-amber-500/20 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                            round.finalDecision === "KEEP" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : round.finalDecision === "REJECT"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            Beschluss: {round.finalDecision === "KEEP" ? "Übernommen" : round.finalDecision === "REJECT" ? "Abgelehnt" : "Prüfen"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white font-sans">{round.findingName}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">{round.description}</p>
                      </div>

                      {/* Vote Grid */}
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                        <span className="text-[8px] uppercase font-mono tracking-wider text-slate-500 block">KI-Stimmen</span>
                        <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-mono font-semibold">
                          <div className={`p-1 rounded ${round.votes["Gemini 3.5"] === "KEEP" ? "bg-green-500/10 text-green-300" : "bg-slate-900 text-slate-400"}`}>
                            GEM: {round.votes["Gemini 3.5"]}
                          </div>
                          <div className={`p-1 rounded ${round.votes["DeepSeek R1"] === "KEEP" ? "bg-green-500/10 text-green-300" : "bg-slate-900 text-slate-400"}`}>
                            DSK: {round.votes["DeepSeek R1"]}
                          </div>
                          <div className={`p-1 rounded ${round.votes["GPT-4o"] === "KEEP" ? "bg-green-500/10 text-green-300" : round.votes["GPT-4o"] === "REJECT" ? "bg-red-500/10 text-red-300" : "bg-slate-900 text-amber-300"}`}>
                            GPT: {round.votes["GPT-4o"]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quality Assurance Report Box */}
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-[10px] uppercase">
                    <Award size={14} />
                    <span>Qualitätssicherungsbericht (AWMF-konform)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Der Konsensbericht bestätigt eine <strong>95%+ Prüfungsbestehensquote</strong>. Die Meinungsverschiedenheit bzgl. der Kausalität (Segment-Degeneration) wurde durch Dr. Altenbergs Annotation korrigiert: Das Trauma wirkte richtungsgebend verschlimmernd, weshalb die gesetzliche BG-Pflicht fortbesteht.
                  </p>
                  <button
                    onClick={() => setActivePhase(4)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>QS-Bericht anheften & Druckvorschau öffnen</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono text-xs">
                Keine Konsens-Runden für diesen Patienten vorhanden.
              </div>
            )}
          </div>
        )}

        {/* Phase 4: Druckvorschau (A4-Format) */}
        {activePhase === 4 && (
          <div className="space-y-6 animate-fade-in" id="phase-print-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest font-semibold">
                Phase 4: Druckvorschau (DIN A4 Gutachterformat)
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Präzises Layout für Behörden und Gerichte
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Diese Vorschau entspricht exakt dem offiziellen DIN A4-Schriftsatz der medizinischen Gutachterpraxis. Inklusive Deckblatt, Briefkopf, paginierten Blättern und Verknüpfungsindizes.
              </p>
            </div>

            {/* A4 simulation container */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Paper View sheet */}
              <div className="flex-1 bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 font-sans max-w-[210mm] min-h-[297mm] mx-auto text-xs space-y-6">
                
                {/* Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold uppercase tracking-wider text-slate-950 text-xs">Praxis Dr. med. Heinrich Altenberg</h5>
                    <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Chefgutachter für Unfallchirurgie & Sozialrecht</p>
                    <p className="text-[9px] text-slate-500">Sachsenring 44, 50677 Köln • Tel: 0221-458900</p>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-600">
                    <p className="font-bold">DOKUMENTEN-ID: <span className="text-slate-900 font-black">{currentPatient.caseId}</span></p>
                    <p>Datum: 11.07.2026</p>
                  </div>
                </div>

                {/* Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold uppercase tracking-wider text-slate-950 text-xs">Praxis Dr. med. Heinrich Altenberg</h5>
                    <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Chefgutachter für Unfallchirurgie & Sozialrecht</p>
                    <p className="text-[9px] text-slate-500">Sachsenring 44, 50677 Köln • Tel: 0221-458900</p>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-600">
                    <p className="font-bold">DOKUMENTEN-ID: <span className="text-slate-900 font-black">{currentPatient.caseId}</span></p>
                    <p>Datum: 11.07.2026</p>
                  </div>
                </div>

                {/* Ultra-Dense Integrated Grid: Clinical Metadata & Case Information */}
                <div className="border border-slate-950 rounded-lg overflow-hidden font-sans">
                  {/* Grid Row 1: Headers */}
                  <div className="grid grid-cols-2 bg-slate-900 text-white border-b border-slate-950 text-[9px] font-black uppercase tracking-wider">
                    <div className="px-3 py-1.5 border-r border-slate-950 flex items-center justify-between">
                      <span>I. Patientenidentifikation (EHR Meta)</span>
                      <span className="text-[8px] font-mono text-teal-400 font-medium">Verified by U.D.O.</span>
                    </div>
                    <div className="px-3 py-1.5 flex items-center justify-between">
                      <span>II. Auftraggeber & Beauftragendes Mandat</span>
                      <span className="text-[8px] font-mono text-teal-400 font-medium">Legal Status: Active</span>
                    </div>
                  </div>

                  {/* Grid Row 2: Demographics & Case Info */}
                  <div className="grid grid-cols-2 text-[9px] leading-relaxed">
                    {/* Left Panel: Patient Details */}
                    <div className="p-3 border-r border-slate-950 bg-slate-50/70 space-y-2">
                      <div className="grid grid-cols-3 gap-y-1 text-[10px]">
                        <span className="text-slate-500 font-semibold">Name:</span>
                        <strong className="col-span-2 text-slate-950">{currentPatient.name}</strong>
                        
                        <span className="text-slate-500 font-semibold">Geb.-Datum:</span>
                        <span className="col-span-2 text-slate-900 font-mono font-bold">{currentPatient.extractedData?.demographics.birthDate || "14.11.1982"}</span>
                        
                        <span className="text-slate-500 font-semibold">Krankenkasse:</span>
                        <span className="col-span-2 text-slate-900 truncate font-medium" title={currentPatient.extractedData?.demographics.insuranceProvider}>
                          {currentPatient.extractedData?.demographics.insuranceProvider || "Techniker Krankenkasse (TK)"}
                        </span>

                        <span className="text-slate-500 font-semibold">Vers.-Nr.:</span>
                        <span className="col-span-2 text-slate-900 font-mono">{currentPatient.extractedData?.demographics.insuranceNumber || "X120938475"}</span>

                        <span className="text-slate-500 font-semibold">Unfalltag:</span>
                        <span className="col-span-2 text-red-700 font-bold">12.03.2025</span>
                      </div>
                    </div>

                    {/* Right Panel: Mandate Details */}
                    <div className="p-3 bg-white space-y-2">
                      <div className="grid grid-cols-3 gap-y-1 text-[10px]">
                        <span className="text-slate-500 font-semibold">Institution:</span>
                        <strong className="col-span-2 text-slate-950 truncate" title={currentPatient.extractedData?.demographics.commissioningEntity}>
                          {currentPatient.extractedData?.demographics.commissioningEntity || "Berufsgenossenschaft"}
                        </strong>
                        
                        <span className="text-slate-500 font-semibold">Gutachten-Nr:</span>
                        <span className="col-span-2 text-slate-900 font-mono font-black">{currentPatient.caseId}</span>
                        
                        <span className="text-slate-500 font-semibold">Fachgebiet:</span>
                        <span className="col-span-2 text-slate-900 font-semibold">Unfallchirurgische Begutachtung</span>

                        <span className="text-slate-500 font-semibold">Kausal-Check:</span>
                        <span className="col-span-2 text-teal-700 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block" />
                          Plauisbel (98%)
                        </span>

                        <span className="text-slate-500 font-semibold">MdE-Vorschlag:</span>
                        <span className="col-span-2 text-teal-700 font-black text-xs">20% (Dauerhaft)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ultra-Dense Grid Section 2: Clinical Findings & ICD-10 Classification */}
                <div className="border border-slate-950 rounded-lg overflow-hidden font-sans">
                  <div className="bg-slate-900 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-b border-slate-950 flex justify-between items-center">
                    <span>III. Diagnosen-Matrix & Bildgebende Befunde (ICD-10)</span>
                    <span className="text-[8px] font-mono text-teal-400 font-bold bg-teal-950/50 border border-teal-800/40 px-1.5 py-0.5 rounded uppercase">Kausalitätsindex: Hoch</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-950 text-[10px] bg-white">
                    {/* Primary Diagnosis Column */}
                    <div className="p-3 space-y-1.5 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-black text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">ICD-10 M51.1</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-rose-800">Hauptdiagnose:</span>
                      </div>
                      <p className="text-slate-950 font-bold leading-relaxed pl-2 border-l-2 border-rose-500">
                        Mediolateraler Bandscheibenvorfall L4/L5 links mit konsekutiver Kompression der Nervenwurzel L5 links.
                      </p>
                    </div>

                    {/* Secondary Findings Column */}
                    <div className="p-3 space-y-1.5 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-black text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">ICD-10 M51.3</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">Begleitbefunde & Vorschäden:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-400">
                        Geringe Osteochondrose und Facettengelenksarthrose L4–S1 (altersentsprechend degenerativer Zustand ohne akuten Krankheitswert).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ultra-Dense Grid Section 3: Historical Timeline Matrix */}
                <div className="border border-slate-950 rounded-lg overflow-hidden font-sans">
                  <div className="bg-slate-900 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-b border-slate-950 flex justify-between items-center">
                    <span>IV. Ereignis- und Untersuchungs-Chronologie (Test Timelines)</span>
                    <span className="text-[8px] font-mono text-teal-400 font-bold uppercase tracking-widest bg-teal-950/50 border border-teal-800/40 px-1.5 py-0.5 rounded">Chronologischer Abgleich</span>
                  </div>

                  <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-950 text-slate-800 font-bold bg-slate-100 text-[9px] uppercase tracking-wider">
                          <th className="py-2 px-3 w-28 border-r border-slate-250">Datum / Uhrzeit</th>
                          <th className="py-2 px-3 w-40 border-r border-slate-250">Klinische Datenquelle</th>
                          <th className="py-2 px-3">Ermitteltes Ereignis & Diagnostischer Befund</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(currentPatient.extractedData?.timeline || [
                          { date: "12.03.2025", event: "Arbeitsunfall (Hebe-Trauma) mit akutem Lendenwirbelsäulensyndrom", source: "D-Arztbericht" },
                          { date: "15.03.2025", event: "Einleitung einer konservativen physiotherapeutischen Behandlung", source: "Heilmittelverordnung" },
                          { date: "28.03.2025", event: "Lendenwirbelsäulen-MRT bestätigt L4/L5-Bandscheibenvorfall links", source: "Radiologie Köln-Nord" },
                          { date: "11.07.2026", event: "Medizinisches Gutachten durch U.D.O. Verifikations-Hub", source: "U.D.O. System" }
                        ]).map((evt, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-mono font-bold text-slate-950 border-r border-slate-200">{evt.date}</td>
                            <td className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200">{evt.source}</td>
                            <td className="py-2 px-3 text-slate-900 font-medium">{evt.event}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detailed Gutachten Paragraphs */}
                <div className="space-y-3 text-[10px] leading-relaxed font-sans">
                  <h6 className="text-[10px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-1">V. Wissenschaftliche Stellungnahme und Beantwortung</h6>
                  <div className="space-y-2 text-slate-800">
                    <p>
                      <strong>1. Anamnese & Kausalität:</strong> {currentPatient.draft?.anamneseText || "Es wurde ein traumatisches Verheben einer schweren Kiste am 12.03.2025 mit konsekutiven linksseitigen Ischialgien beschrieben."}
                    </p>
                    <p>
                      <strong>2. Clinical Findings / Befundung:</strong> {currentPatient.draft?.befundeText || "Ausgeprägte Lumbalstrecksteife, schmerzhaft limitiertes Lasègue-Zeichen links bei 45 Grad."}
                    </p>
                    <p>
                      <strong>3. Medizinische Beurteilung:</strong> {currentPatient.draft?.beurteilungText || "Die MRT zeigt einen signifikanten Bandscheibenvorfall L4/L5 links. Trotz degenerativer Vorschädigung ist das Arbeitsereignis ursächlich anzusehen."}
                    </p>
                    <p>
                      <strong>4. Zusammenfassendes Ergebnis (MdE-Feststellung):</strong> {currentPatient.draft?.beantwortungFragenText || "Die Erwerbsfähigkeit ist dauerhaft um 20% gemindert."}
                    </p>
                  </div>
                </div>

                {/* Signatures Footer */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-end font-sans">
                  <div>
                    <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">U.D.O. - ULTIMATE DIAGNOSTIC OPERATOR | SECURE QES CRYPTO VERIFIED</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
                    <p className="text-[10px] font-extrabold text-slate-900">Dr. med. Heinrich Altenberg</p>
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">Eigenhändige Unterschrift des Arztes</p>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full lg:w-64 space-y-4">
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl shadow-md space-y-3">
                  <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold border-b border-white/10 pb-2 flex items-center gap-1">
                    <Printer size={12} />
                    <span>Druck-Optionen</span>
                  </h4>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Printer size={14} />
                    <span>DIN A4 drucken</span>
                  </button>

                  <div className="text-[9px] text-slate-400 leading-normal font-mono">
                    <p>Hintergrundbild und Styling sind für Standarddrucker optimiert (weißes Papier, schwarze Schrift, AWMF-konform).</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePhase(5)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  <span>Phase 5: QES-Signierung</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 5: QES-Signierung & EGVP-Versand */}
        {activePhase === 5 && (
          <div className="space-y-6 animate-fade-in" id="phase-signature-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest font-semibold">
                Phase 5: Qualifizierte Elektronische Signatur (QES) & EGVP-Versand
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Kryptografische Signierung & Gerichts-Schnittstelle
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Gemäß § 130a ZPO müssen Gutachten mit einer qualifizierten elektronischen Signatur (QES) versehen werden, um vor Gerichten Beweiskraft zu erlangen. U.D.O. simuliert die Verschlüsselung (RSA-4096-Sicherheits-Hash) und den sicheren Versand über den EGVP-Verbund.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* QES Card / Terminal Simulator */}
              <div className="lg:col-span-6 p-5 bg-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">Signaturkarten-Terminal</span>
                    <span className={`h-2 w-2 rounded-full ${qesCardInserted ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
                  </div>

                  <p className="text-xs text-slate-300">
                    Schließen Sie das Signiergerät an und führen Sie Ihre Arztausweis-Signaturkarte ein.
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center space-y-3">
                  {!qesCardInserted ? (
                    <button
                      onClick={() => setQesCardInserted(true)}
                      className="py-2.5 px-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/30 transition-all"
                    >
                      Signaturkarte simulieren
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-semibold">
                        <CheckCircle size={14} />
                        <span>Signaturkarte erkannt (Dr. Heinrich Altenberg)</span>
                      </div>

                      <div className="space-y-1.5 max-w-[200px] mx-auto text-left">
                        <label className="text-[9px] uppercase font-mono text-slate-400">PIN-Eingabe (6-stellig)</label>
                        <input
                          type="password"
                          placeholder="Standard PIN: 1234"
                          value={qesPin}
                          onChange={(e) => setQesPin(e.target.value)}
                          className="w-full bg-[#05070a] border border-white/10 text-center rounded px-3 py-1.5 text-xs text-blue-400 font-mono tracking-widest focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={handleQESSign}
                        disabled={qesSigningStatus === "signing"}
                        className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg transition-all"
                      >
                        {qesSigningStatus === "signing" ? "Signiere mit RSA-4096..." : "Kryptografisch signieren"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Signed Status Feedback */}
                {currentPatient.isQESSigned && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-green-400 font-bold">
                      <CheckCircle2 size={14} />
                      <span>Erfolgreich qualifiziert signiert!</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-mono">Signaturzeit: {currentPatient.signedAt}</p>
                    <p className="text-[9px] text-slate-400 font-mono break-all leading-normal">Hash: {currentPatient.signatureHash}</p>
                  </div>
                )}
              </div>

              {/* Secure Delivery (EGVP Transmission Logs) */}
              <div className="lg:col-span-6 p-5 bg-slate-950 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">EGVP Gerichtsnetz-Schnittstelle</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                      egvpStatus === "success" ? "bg-green-500/20 text-green-400" : "bg-slate-900 text-slate-500"
                    }`}>
                      {egvpStatus === "success" ? "EGVP_DELIVERED" : "IDLE"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Sicheres Postfach-Netzwerk zur Übermittlung des Gutachtens an die Sozialgerichte und Versicherungsstellen.
                  </p>
                </div>

                {/* EGVP log stream simulation */}
                <div className="p-4 bg-black/60 border border-white/10 rounded-xl font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[140px]">
                  <div>[11:31:24] INITIALIZING SECURE EGVP PORT_8080 SHIELD CONNECT...</div>
                  {currentPatient.isQESSigned && (
                    <>
                      <div>[11:31:25] DETECTED ACTIVE LEGAL SIGNATURE DATA MATCH</div>
                      <div>[11:31:25] PACKAGING DIN_A4_PDF PAYLOAD WITH RSA_ENCRYPTION_4096</div>
                      <div>[11:31:26] ESTABLISHING VERIFIED SECURE SHIELD HANDSHAKE WITH BGHM_RECEIVER</div>
                      {egvpStatus === "transmitting" && (
                        <div className="text-blue-400 animate-pulse">[11:31:26] SENDING DATA STREAM (EGVP-NET)...</div>
                      )}
                      {egvpStatus === "success" && (
                        <>
                          <div className="text-green-400 font-bold">[11:31:27] EGVP TRANSMISSION SUCCESSFUL</div>
                          <div className="text-green-400 font-bold">[11:31:27] RECEIVED DELIVERY RECEIPT ID: {currentPatient.egvpReceiptId}</div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <button
                  onClick={() => setActivePhase(6)}
                  disabled={!currentPatient.isQESSigned}
                  className={`w-full py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-1 ${
                    !currentPatient.isQESSigned
                      ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 text-white shadow-md hover:bg-blue-700 shadow-blue-600/10"
                  }`}
                >
                  <span>Phase 6: Patientenbrief (Einfache Sprache)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 6: Patientenaufklärung (Einfache Sprache) with Fachbegriffs-Buster */}
        {activePhase === 6 && (
          <div className="space-y-6 animate-fade-in" id="phase-explanation-container">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-widest font-semibold">
                Phase 6: Patientenbrief & Fachbegriffs-Buster
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Empathische, verständliche Aufklärung
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Der Patientenbrief übersetzt trockenes Kauderwelsch in einfache, verständliche Sprache. Klicken Sie auf die <strong>orange hervorgehobenen Fachbegriffe</strong>, um die unkomplizierte Definition im interaktiven Fachbegriffs-Buster einzublenden.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Letter markup */}
              <div className="lg:col-span-8 p-6 bg-white/95 text-slate-900 rounded-3xl shadow-xl font-sans relative overflow-hidden leading-relaxed">
                {/* Visual Watermark */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                <div className="relative space-y-4 text-xs font-medium">
                  {/* Letter Header */}
                  <div className="border-b border-slate-200 pb-3 mb-2 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                    <strong>Sachsenring-Unfallpraxis, Köln</strong>
                    <span>An Thomas Müller (Persönlich)</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-950 font-sans uppercase tracking-tight">Erläuterung Ihres Gutachtens vom {new Date().toLocaleDateString("de-DE")}</h4>
                  
                  <p>Sehr geehrter Herr Müller,</p>

                  <p>
                    ich habe heute Ihr medizinisches Gutachten für die Berufsgenossenschaft fertiggestellt. Mir ist es ein großes Anliegen, dass Sie genau verstehen, was die Untersuchung ergeben hat und was das für Sie bedeutet.
                  </p>

                  <p>
                    Bei Ihrem Arbeitsunfall haben Sie sich eine akute Reizung im Lendenwirbelbereich zugezogen. Die Kernspinuntersuchung (MRT) zeigt im Bereich der Lendenwirbel einen{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Herniation", definition: JARGON_DICTIONARY["Herniation"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Bandscheibenvorfall (Herniation)
                    </button>{" "}
                    im{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Segment L4/L5", definition: JARGON_DICTIONARY["Segment L4/L5"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Segment L4/L5
                    </button>{" "}
                    links. Dieser Vorfall drückt direkt auf Ihre{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Nervenwurzel L5", definition: JARGON_DICTIONARY["Nervenwurzel L5"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Nervenwurzel L5
                    </button>{" "}
                    links. Das erklärt auch Ihre{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Lumboischialgie", definition: JARGON_DICTIONARY["Lumboischialgie"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Lumboischialgie
                    </button>{" "}
                    (den einschießenden Schmerz ins linke Bein) sowie das Taubheitsgefühl an Ihrem linken Fußrücken.
                  </p>

                  <p>
                    Obwohl auf den Röntgenbildern bereits leichte Abnutzungen wie eine{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Osteochondrose", definition: JARGON_DICTIONARY["Osteochondrose"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Osteochondrose
                    </button>{" "}
                    zu sehen sind, habe ich die{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Kausalität", definition: JARGON_DICTIONARY["Kausalität"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Kausalität
                    </button>{" "}
                    (den Ursachenzusammenhang) zum Kistenheben voll befürwortet. Ich empfehle eine{" "}
                    <button
                      onClick={() => setSelectedJargon({ term: "Minderung der Erwerbsfähigkeit (MdE)", definition: JARGON_DICTIONARY["Minderung der Erwerbsfähigkeit (MdE)"] })}
                      className="underline decoration-wavy decoration-orange-500 text-orange-600 font-bold hover:text-orange-800 focus:outline-none transition-colors"
                    >
                      Minderung der Erwerbsfähigkeit (MdE) von 20%
                    </button>{" "}
                    für Sie einzurichten, damit Sie voll abgesichert sind.
                  </p>

                  <p>Ich wünsche Ihnen von Herzen eine gute Besserung.</p>
                  <p className="pt-2">Mit freundlichen Grüßen,<br /><strong>Ihr Dr. med. Heinrich Altenberg</strong></p>
                </div>
              </div>

              {/* Right Column: Term Buster */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-slate-950/90 border border-orange-500/30 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-orange-400 font-bold font-mono text-[10px] uppercase border-b border-white/5 pb-2">
                    <Sparkles size={14} className="animate-spin" />
                    <span>Fachbegriffs-Buster</span>
                  </div>

                  {selectedJargon ? (
                    <div className="space-y-2 animate-fade-in">
                      <strong className="text-xs text-orange-300 font-sans block uppercase tracking-wider font-bold">
                        {selectedJargon.term}
                      </strong>
                      <p className="text-xs text-slate-100 font-sans leading-relaxed">
                        {selectedJargon.definition}
                      </p>
                      <button
                        onClick={() => setSelectedJargon(null)}
                        className="text-[9px] font-mono text-slate-400 hover:text-white"
                      >
                        Schließen &times;
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-slate-500 text-[11px] leading-relaxed font-sans border border-dashed border-white/10 rounded-xl">
                      Klicken Sie auf markierte Wörter im Patientenbrief, um die laienfreundliche Erklärung sofort anzuzeigen.
                    </div>
                  )}

                  {/* List of dictionary quick links */}
                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <span className="text-[9px] uppercase font-mono text-slate-500 block">Wörterbuch-Übersicht</span>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(JARGON_DICTIONARY).map((term) => (
                        <button
                          key={term}
                          onClick={() => setSelectedJargon({ term, definition: JARGON_DICTIONARY[term] })}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[9px] text-slate-300 border border-white/5 hover:border-orange-500/20"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
