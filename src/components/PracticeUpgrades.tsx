import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  UserCheck, 
  Calendar, 
  ClipboardList, 
  Mail, 
  FileSignature, 
  Receipt, 
  FileSpreadsheet, 
  Database, 
  Archive, 
  LineChart as LucideLineChart, 
  Plus, 
  Check, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  User, 
  Trash2,
  RefreshCw,
  Search,
  BookOpen,
  Box,
  Coins
} from "lucide-react";
import { Appointment, KanbanTask, Invoice, Prescription, InventoryItem, WikiArticle } from "../types";

// --- PRELOADED MOCK DATA FOR 10 UPGRADE MODULES ---

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "apt-1", patientName: "Thomas Müller", date: "2026-07-12", time: "10:00", durationMin: 45, type: "Gutachtertermin", status: "Bestätigt", reminderSent: true },
  { id: "apt-2", patientName: "Sabine Becker", date: "2026-07-12", time: "11:30", durationMin: 30, type: "Erstuntersuchung", status: "Bestätigt", reminderSent: true },
  { id: "apt-3", patientName: "Dieter Janssen", date: "2026-07-15", time: "14:00", durationMin: 60, type: "Therapiegespräch", status: "Bestätigt", reminderSent: false }
];

const INITIAL_TASKS: KanbanTask[] = [
  { id: "tsk-1", title: "MRT-Dossier anfordern", description: "Fehlendes LWS-Schnittbild aus Köln-Nord anfordern.", assignee: "Schwester Sabine", priority: "Hoch", status: "Neu", dueDate: "2026-07-13", checklist: [{ id: "cl-1", text: "Fax senden", done: true }, { id: "cl-2", text: "Telefonische Nachfrage", done: false }] },
  { id: "tsk-2", title: "Gutachten-Konsens prüfen", description: "Multi-Modell-Votierung für Thomas Müller abgleichen.", assignee: "Dr. Altenberg", priority: "Hoch", status: "In Arbeit", dueDate: "2026-07-11", checklist: [{ id: "cl-3", text: "Gemini-Konflikte sichten", done: true }] },
  { id: "tsk-3", title: "Rechnung BG Holz/Metall", description: "Rechnungsstellung für Fall Müller abschließen.", assignee: "Praxis-KI", priority: "Mittel", status: "Prüfung", dueDate: "2026-07-14", checklist: [] }
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  { id: "rx-1", patientName: "Thomas Müller", medicationName: "Ibuprofen 600mg", dosage: "1-0-1", frequency: "Zweimal täglich nach dem Essen", substanceClass: "NSAID", interactionsChecked: true, conflicts: [], status: "Anforderung" },
  { id: "rx-2", patientName: "Sabine Becker", medicationName: "Aspirin 100mg", dosage: "1-0-0", frequency: "Einmal täglich morgens", substanceClass: "Salicylate", interactionsChecked: true, conflicts: [], status: "Genehmigt" }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv-1", name: "Sicherheits-Arztausweise QES", category: "Formulare", stock: 12, minStock: 15, unit: "Stück", supplier: "Bundesärztekammer" },
  { id: "inv-2", name: "Einmal-Schutzhandschuhe (Gr. L)", category: "Hygiene", stock: 180, minStock: 100, unit: "Stück", supplier: "MediMax Köln" },
  { id: "inv-3", name: "D-Arzt Meldebogen F1000", category: "Formulare", stock: 45, minStock: 50, unit: "Blatt", supplier: "DGUV-Verlag" }
];

const INITIAL_WIKI: WikiArticle[] = [
  { id: "wk-1", title: "AWMF S2k-Leitlinie: Spezifischer Kreuzschmerz", category: "AWMF-Leitlinie", summary: "Evidenzbasierte Empfehlungen für Diagnostik und konservative Therapie bei Bandscheibenvorfällen mit Radikulopathie.", content: "Die Leitlinie empfiehlt bei fehlenden neurologischen Ausfallerscheinungen ein primär konservatives Vorgehen für 6-12 Wochen unter engmaschiger Analgesie. Bildgebende Diagnostik (MRT) ist bei anhaltenden radikulären Schmerzen zwingend erforderlich." },
  { id: "wk-2", title: "ICD-10: M51.1 - Lendenbandscheibenschaden", category: "ICD-10 Hilfe", summary: "Spezifikationen zur Verschlüsselung von Bandscheibenvorfällen im Bereich LWS mit Radikulopathie.", content: "Der Code M51.1 erfordert den klinischen und radiologischen Nachweis eines lumbalen Bandscheibenschadens mit neurologischer Reizsymptomatik. Er bildet die Grundlage für BG-unfallbedingte Heilbehandlung." }
];

// --- ANALYTICS CHART DATA PRESETS ---
const MONTHLY_PATIENT_DATA = [
  { month: "Jan", gutachten: 28, revenue: 14000, speedHr: 12 },
  { month: "Feb", gutachten: 32, revenue: 16000, speedHr: 11 },
  { month: "Mär", gutachten: 45, revenue: 22500, speedHr: 9.5 },
  { month: "Apr", gutachten: 50, revenue: 25000, speedHr: 8.5 },
  { month: "Mai", gutachten: 62, revenue: 31000, speedHr: 7.2 },
  { month: "Jun", gutachten: 78, revenue: 39000, speedHr: 6.0 },
  { month: "Jul", gutachten: 90, revenue: 45000, speedHr: 4.8 }
];

export default function PracticeUpgrades() {
  const [activeUpgradeTab, setActiveUpgradeTab] = useState<number>(3); // Default to Kanban Task Board for instant action

  // State managers
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [wiki, setWiki] = useState<WikiArticle[]>(INITIAL_WIKI);

  // Form input variables
  const [newAptName, setNewAptName] = useState("");
  const [newAptType, setNewAptType] = useState<any>("Gutachtertermin");
  const [newAptDate, setNewAptDate] = useState("2026-07-12");
  const [newAptTime, setNewAptTime] = useState("12:00");

  const [newRxName, setNewRxName] = useState("");
  const [newRxMed, setNewRxMed] = useState("");
  const [rxConflictWarning, setRxConflictWarning] = useState<string | null>(null);

  const [wikiSearch, setWikiSearch] = useState("");

  const upgradeModules = [
    { id: 1, title: "1. Patienten-Portal", icon: UserCheck, desc: "Selbstbedienungs-Hub" },
    { id: 2, title: "2. Termin-Planung", icon: Calendar, desc: "SMS & Google Calendar Sync" },
    { id: 3, title: "3. Kanban Taskboard", icon: ClipboardList, desc: "Workflow-Management" },
    { id: 4, title: "4. Patienten-Notizen", icon: Mail, desc: "Automatisierte Kommunikation" },
    { id: 5, title: "5. Aufnahmeformulare", icon: FileSignature, desc: "Paperless Onboarding & OCR" },
    { id: 6, title: "6. ICD-10 Abrechnung", icon: Receipt, desc: "BG & GOÄ Rechnungen" },
    { id: 7, title: "7. Rezeptverwaltung", icon: FileSpreadsheet, desc: "Interaktions-Prüfung" },
    { id: 8, title: "8. Wissensdatenbank", icon: Database, desc: "AWMF & Leitlinien" },
    { id: 9, title: "9. Bestandsverwaltung", icon: Archive, desc: "Material & Praxisbedarf" },
    { id: 10, title: "10. Praxis-Analytik", icon: LucideLineChart, desc: "Erfolgsmetriken & ROI" }
  ];

  // Appointment creation
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptName) return;
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientName: newAptName,
      date: newAptDate,
      time: newAptTime,
      durationMin: 45,
      type: newAptType,
      status: "Bestätigt",
      reminderSent: true
    };
    setAppointments([...appointments, newApt]);
    setNewAptName("");
  };

  // Kanban task status updates
  const moveTaskStatus = (id: string, newStatus: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.map(item => item.id === itemId ? { ...item, done: !item.done } : item)
        };
      }
      return t;
    }));
  };

  // Prescription conflict drug checks
  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRxName || !newRxMed) return;

    // Simulate drug interaction conflict checks
    let conflicts: string[] = [];
    if (newRxMed.toLowerCase().includes("ibuprofen") && prescriptions.some(p => p.patientName === newRxName && p.medicationName.toLowerCase().includes("aspirin"))) {
      conflicts.push("Wechselwirkung: Ibuprofen schränkt die kardioprotektive Wirkung von Aspirin ein.");
      setRxConflictWarning("Konflikt erkannt! Ibuprofen interferiert mit der Aspirin-Therapie des Patienten.");
    } else {
      setRxConflictWarning(null);
    }

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      patientName: newRxName,
      medicationName: newRxMed,
      dosage: "1-0-1",
      frequency: "Zweimal täglich",
      substanceClass: newRxMed.toLowerCase().includes("ibu") ? "NSAID" : "Generisch",
      interactionsChecked: true,
      conflicts,
      status: "Anforderung"
    };

    setPrescriptions([...prescriptions, newRx]);
    setNewRxMed("");
  };

  const handleApprovePrescription = (id: string) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status: "Genehmigt" } : p));
  };

  // Inventory restocking
  const handleRestock = (id: string) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, stock: item.stock + 50 } : item));
  };

  // Wiki searches
  const filteredWiki = wiki.filter(article => 
    article.title.toLowerCase().includes(wikiSearch.toLowerCase()) || 
    article.content.toLowerCase().includes(wikiSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="practice-upgrades-engine">
      
      {/* Left Column: List of 10 Upgrades */}
      <div className="xl:col-span-3 flex flex-col gap-2 p-4 bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl max-h-[580px] overflow-y-auto">
        <h3 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold border-b border-white/10 pb-2 mb-2">
          Kleine Praxis Edition (v3.0)
        </h3>
        
        <div className="space-y-1">
          {upgradeModules.map((m) => {
            const Icon = m.icon;
            const isActive = activeUpgradeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveUpgradeTab(m.id)}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-lg text-xs border transition-all ${
                  isActive
                    ? "bg-blue-600/10 border-blue-500/40 text-blue-200 font-bold shadow-[0_0_12px_rgba(59,130,246,0.1)] scale-[1.01]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <div className={`p-1.5 rounded-md ${isActive ? "bg-blue-600/20 text-blue-300" : "bg-white/5 text-slate-400"}`}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] leading-tight font-sans">{m.title}</p>
                  <p className="text-[9px] text-slate-500 font-mono truncate leading-none mt-0.5">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active upgrade tab simulator */}
      <div className="xl:col-span-9 bg-black/40 border border-white/10 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between shadow-xl relative">
        
        {/* Upgrade 1: Patient-Portal */}
        {activeUpgradeTab === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-blue-400">Modul 1: Patienten-Portal</span>
              <h4 className="text-sm font-bold text-white">Sicheres Patienten-Selbstbedienungsportal</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Reduziert Rückfragen am Telefon um 60%. Patienten loggen sich ein, laden Vorbefunde hoch, prüfen den Freigabe-Status ihres Gutachtens und kommunizieren DSGVO-konform mit der Praxis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05070a]/90 border border-white/10 space-y-3 max-w-md mx-auto text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-blue-400 font-bold">Patienten-Ansicht (Demo)</span>
                <span className="h-2 w-2 rounded-full bg-green-500" />
              </div>

              <div className="space-y-2">
                <p className="text-slate-400">Angemeldet als: <strong className="text-white">Thomas Müller</strong></p>
                <div className="p-3 bg-white/5 rounded-lg space-y-1">
                  <p className="font-semibold text-white text-[11px]">Mein Gutachten (BG Holz und Metall)</p>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Status: <strong className="text-amber-400">In Prüfung</strong></span>
                    <span>Freigabe: ca. 12.07.2026</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg space-y-2">
                  <p className="font-semibold text-white text-[11px]">Dossier-Upload für Dr. Altenberg</p>
                  <div className="border border-dashed border-white/10 rounded p-4 text-center hover:bg-slate-850 cursor-pointer">
                    <p className="text-[10px] text-slate-400">Klicken Sie hier, um weitere Röntgen/MRT-Befunde hochzuladen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 2: Integrated Appointment Scheduler */}
        {activeUpgradeTab === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 2: Integrierte Terminplanung</span>
              <h4 className="text-sm font-bold text-white">Google Calendar-Sync & SMS-Erinnerung</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Schnittstelle für Online-Buchung und automatische Erinnerungen (24h vor dem Termin), um die Nichterscheinen-Quote auf unter 2% zu senken.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Form to add appointment */}
              <form onSubmit={handleAddAppointment} className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Neuen Termin eintragen</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Patientenname</label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Thomas Müller"
                    value={newAptName}
                    onChange={(e) => setNewAptName(e.target.value)}
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400">Datum</label>
                    <input
                      type="date"
                      value={newAptDate}
                      onChange={(e) => setNewAptDate(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400">Uhrzeit</label>
                    <input
                      type="time"
                      value={newAptTime}
                      onChange={(e) => setNewAptTime(e.target.value)}
                      className="w-full bg-[#05070a] border border-white/10 rounded px-2.5 py-1.5 text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Untersuchungs-Typ</label>
                  <select
                    value={newAptType}
                    onChange={(e) => setNewAptType(e.target.value as any)}
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2 py-1.5 text-slate-300"
                  >
                    <option value="Erstuntersuchung">Erstuntersuchung</option>
                    <option value="Gutachtertermin">Gutachtertermin</option>
                    <option value="Wiedervorstellung">Wiedervorstellung</option>
                    <option value="Therapiegespräch">Therapiegespräch</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded text-[10px] tracking-wider transition-all shadow-md shadow-blue-600/10"
                >
                  Termin buchen & SMS schalten
                </button>
              </form>

              {/* Booked Appointments Listing */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2 max-h-[250px] overflow-y-auto">
                <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Gebuchte Termine</span>
                
                {appointments.map((a) => (
                  <div key={a.id} className="p-2 bg-[#05070a] rounded border border-white/5 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-sans">{a.patientName}</strong>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono uppercase">{a.type}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-mono">📅 {a.date} um {a.time} Uhr ({a.durationMin} Min.)</p>
                    <div className="flex items-center gap-1.5 text-[9px]">
                      <span className="text-green-500 flex items-center gap-0.5">
                        <Check size={10} /> Sync Bestätigt
                      </span>
                      {a.reminderSent && (
                        <span className="text-indigo-400 flex items-center gap-0.5">
                          <Mail size={10} /> SMS-Erinnerung scharf
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 3: Kanban Board */}
        {activeUpgradeTab === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 3: Aufgaben-Board & Workflow</span>
              <h4 className="text-sm font-bold text-white">Visualisiertes Praxis-Kanban</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Verwalten Sie Gutachten-Zwischenstände, Anforderungen und QS-Prüfungen kollaborativ im Team. Jedes Ticket verfügt über separate Checklisten und Fälligkeiten.
              </p>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              {(["Neu", "In Arbeit", "Prüfung", "Erledigt"] as const).map((status) => {
                const columnTasks = tasks.filter(t => t.status === status);
                return (
                  <div key={status} className="p-3 bg-black/40 border border-white/10 rounded-2xl flex flex-col space-y-3 min-h-[220px]">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span className="font-bold text-[11px] text-slate-300 uppercase tracking-wide">{status}</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[9px] font-mono text-indigo-400 font-bold">{columnTasks.length}</span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {columnTasks.map((t) => (
                        <div key={t.id} className="p-2.5 bg-black/20 border border-white/5 rounded-xl space-y-2">
                          <div>
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-white leading-tight font-sans text-[11px]">{t.title}</h5>
                              <span className={`h-1.5 w-1.5 rounded-full ${t.priority === "Hoch" ? "bg-red-500" : "bg-blue-500"}`} />
                            </div>
                            <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">{t.description}</p>
                          </div>

                          {/* Mini checklist if exists */}
                          {t.checklist.length > 0 && (
                            <div className="space-y-1 border-t border-white/5 pt-1.5">
                              {t.checklist.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => toggleChecklistItem(t.id, item.id)}
                                  className="w-full text-left flex items-center gap-1.5 text-[9px] hover:text-white"
                                >
                                  <div className={`w-2.5 h-2.5 rounded border border-white/20 flex items-center justify-center ${item.done ? "bg-blue-600 text-white" : "bg-transparent"}`}>
                                    {item.done && <Check size={8} />}
                                  </div>
                                  <span className={item.done ? "line-through text-slate-500" : "text-slate-300"}>{item.text}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                            <span>Assignee: {t.assignee}</span>
                            <div className="flex gap-1">
                              {status !== "Neu" && (
                                <button onClick={() => moveTaskStatus(t.id, status === "In Arbeit" ? "Neu" : status === "Prüfung" ? "In Arbeit" : "Prüfung")} className="hover:text-white font-bold">&larr;</button>
                              )}
                              {status !== "Erledigt" && (
                                <button onClick={() => moveTaskStatus(t.id, status === "Neu" ? "In Arbeit" : status === "In Arbeit" ? "Prüfung" : "Erledigt")} className="hover:text-white font-bold">&rarr;</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upgrade 4: Automated Communication */}
        {activeUpgradeTab === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 4: Automatisierte Patientenkommunikation</span>
              <h4 className="text-sm font-bold text-white">Smarter Kommunikations-Sequenzer</h4>
              <p className="text-xs text-slate-300 leading-normal">
                U.D.O. hält Patienten über jeden Zwischenstand (Dossier-Eingang, anstehende Termine, Gutachten-Finalisierung) via SMS und E-Mail vollautomatisiert auf dem Laufenden. Das entlastet die Anmeldung massiv.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs max-w-lg mx-auto">
              <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Kommunikations-Log (Thomas Müller)</span>
              
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                <div className="p-2 bg-[#05070a] border-l-2 border-green-500 rounded space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-green-400 font-bold font-mono">E-Mail Versendet</span>
                    <span className="text-slate-500 font-mono">11.07.2026</span>
                  </div>
                  <p className="text-white font-bold">Gutachtenergebnisse & laienfreundliche Zusammenfassung</p>
                  <p className="text-[10px] text-slate-400 italic">Betreff: Dr. Altenberg - Ihr Gutachten liegt vor</p>
                </div>

                <div className="p-2 bg-[#05070a] border-l-2 border-green-500 rounded space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-green-400 font-bold font-mono">SMS Versendet</span>
                    <span className="text-slate-500 font-mono">10.07.2026</span>
                  </div>
                  <p className="text-white">Terminerinnerung für morgen früh 10:00 Uhr in Sachsenring-Praxis erhalten.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 5: Onboarding & intake forms */}
        {activeUpgradeTab === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 5: Digitale Aufnahmeformulare</span>
              <h4 className="text-sm font-bold text-white">Papierloses Onboarding & OCR-Scanner</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Patienten füllen Anamnese-Fragebögen digital auf dem Tablet aus. Die Software extrahiert Angaben automatisch, gleicht sie mit Vorberichten ab und legt Daten im Patienten-Dossier ab.
              </p>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3 max-w-md mx-auto text-xs">
              <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Aufnahme-Dokumentation (Vorschau)</span>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[#05070a] rounded border border-white/5 text-center">
                    <p className="font-bold text-white text-[11px]">D-Arzt Fragebogen</p>
                    <span className="text-[9px] text-slate-500 font-mono">PDF-Vorlage bereit</span>
                  </div>
                  <div className="p-2.5 bg-[#05070a] rounded border border-white/5 text-center">
                    <p className="font-bold text-white text-[11px]">LWS-Spezifischer Index</p>
                    <span className="text-[9px] text-slate-500 font-mono">Digitalisiert</span>
                  </div>
                </div>

                <div className="border border-dashed border-indigo-500/30 p-4 rounded-xl text-center hover:bg-indigo-500/5 cursor-pointer transition-colors">
                  <p className="font-bold text-indigo-300">Formular-Designer starten</p>
                  <p className="text-[9.5px] text-slate-400 font-mono mt-1">Eigene Anamnesebögen mit Drag-and-Drop erstellen.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 6: ICD-10 Billing & Invoice */}
        {activeUpgradeTab === 6 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 6: ICD-10 & GOÄ-Abrechnung</span>
              <h4 className="text-sm font-bold text-white">Zweckgebundene D-Arzt Rechnungsstellung</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Erstellen Sie Honorarabrechnungen für die Berufsgenossenschaften und privaten Kassen direkt aus dem Gutachten heraus nach ICD-10 und der Gebührenordnung für Ärzte (GOÄ).
              </p>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-4 text-xs max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 font-mono">
                <span className="text-slate-400 uppercase">Honorarrechnung: RG-2026-9022</span>
                <span className="text-indigo-400 font-bold">Thomas Müller</span>
              </div>

              {/* Fee listing */}
              <div className="space-y-1.5 text-[11px] font-sans">
                <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400 font-mono text-[10px]">
                  <span>GOÄ-Ziffer / Leistung</span>
                  <span>Betrag</span>
                </div>
                <div className="flex justify-between">
                  <span>Ziff. 80 (Eingehendes schriftliches Gutachten) - 2.3x</span>
                  <span className="font-mono">110,48 €</span>
                </div>
                <div className="flex justify-between">
                  <span>Ziff. 85 (Fachärztliche Stellungnahme) - 1.8x</span>
                  <span className="font-mono">42,50 €</span>
                </div>
                <div className="flex justify-between">
                  <span>Ziff. 95 (Schreibgebühren je Seite) - 5 Seiten</span>
                  <span className="font-mono">15,00 €</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-white">
                <span>Gesamtsumme (BG Holz und Metall)</span>
                <span className="font-mono text-blue-400 font-bold">167,98 €</span>
              </div>

              <div className="flex gap-2.5">
                <button className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded text-[10px] tracking-wider transition-colors shadow-md shadow-blue-600/10">
                  ICD-10 M51.1 buchen
                </button>
                <button className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[10px] uppercase font-bold transition-colors">
                  Rechnung senden (PADNeT)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 7: Prescription Refills */}
        {activeUpgradeTab === 7 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 7: Rezeptverwaltung & e-Rezept</span>
              <h4 className="text-sm font-bold text-white">Automatische Wechselwirkungs-Prüfung</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Verwalten Sie Folge- und Ein-Klick-Rezeptanforderungen. Das integrierte e-Rezept-System prüft Kontraindikationen und drug-drug Wechselwirkungen in Echtzeit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <form onSubmit={handleAddPrescription} className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Rezept anfordern</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-semibold">Patient</label>
                  <select
                    value={newRxName}
                    onChange={(e) => setNewRxName(e.target.value)}
                    required
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2 py-1.5 text-slate-300"
                  >
                    <option value="">Patient wählen...</option>
                    <option value="Thomas Müller">Thomas Müller (Nimmt Aspirin)</option>
                    <option value="Sabine Becker">Sabine Becker</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-semibold">Medikament</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Ibuprofen 600mg"
                    value={newRxMed}
                    onChange={(e) => setNewRxMed(e.target.value)}
                    className="w-full bg-[#05070a] border border-white/10 rounded px-2 py-1.5 text-slate-300"
                  />
                </div>

                {rxConflictWarning && (
                  <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 font-sans text-[10px] flex items-center gap-1.5 leading-normal animate-pulse">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{rxConflictWarning}</span>
                  </div>
                )}

                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded text-[10px] tracking-wider shadow-md shadow-blue-600/10">
                  Rezept einreichen & prüfen
                </button>
              </form>

              {/* Prescription list */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2 max-h-[250px] overflow-y-auto">
                <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Medikamentenliste</span>
                {prescriptions.map((p) => (
                  <div key={p.id} className="p-2.5 bg-[#05070a] rounded border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center font-sans">
                      <strong className="text-white">{p.patientName}</strong>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase ${
                        p.status === "Genehmigt" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                      }`}>{p.status}</span>
                    </div>
                    <p className="text-slate-300 font-semibold">{p.medicationName} ({p.dosage})</p>
                    {p.conflicts.length > 0 ? (
                      <div className="text-[9px] text-red-400 leading-normal italic font-mono">
                        {p.conflicts.join(", ")}
                      </div>
                    ) : (
                      <span className="text-[9px] text-green-400 flex items-center gap-0.5 font-semibold">
                        <ShieldCheck size={10} /> Keine Wechselwirkungen
                      </span>
                    )}
                    {p.status === "Anforderung" && (
                      <button
                        onClick={() => handleApprovePrescription(p.id)}
                        className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[9px] uppercase rounded transition-all"
                      >
                        Freigeben
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 8: Internal Knowledge Base */}
        {activeUpgradeTab === 8 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 8: Interne Wissensdatenbank & Leitlinien</span>
              <h4 className="text-sm font-bold text-white">Durchsuchbare AWMF-Bibliothek</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Durchsuchen Sie ICD-10-Hilfen und AWMF-Leitlinien direkt in Ihrer Praxissoftware. Neue Mitarbeiter erhalten schnellen Zugriff auf klinische Schulungsunterlagen.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 max-w-sm">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Suche in Leitlinien (z.B. LWS, Kreuzschmerz)..."
                  value={wikiSearch}
                  onChange={(e) => setWikiSearch(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-white placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {filteredWiki.map((article) => (
                  <div key={article.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5 font-mono">
                      <span className="text-indigo-400 text-[10px] uppercase">{article.category}</span>
                      <BookOpen size={12} className="text-slate-500" />
                    </div>
                    <h5 className="font-bold text-white font-sans text-xs leading-snug">{article.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">{article.summary}</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-mono italic p-2 bg-[#05070a] rounded border border-white/5">
                      {article.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 9: Inventory Management */}
        {activeUpgradeTab === 9 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 9: Bestandsverwaltung & Meldebestand</span>
              <h4 className="text-sm font-bold text-white">Intelligente Praxis-Logistik</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Verhindert das unvorhergesehene Ausgehen wichtiger Praxis- oder Büromaterialien. Bei Erreichen des Meldebestands schlägt U.D.O. automatisch eine Nachbestellung vor.
              </p>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3 text-xs max-w-xl mx-auto">
              <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-white/5 pb-1">Materialien & Bedarfs-Check</span>
              
              <div className="space-y-2">
                {inventory.map((item) => {
                  const isLow = item.stock < item.minStock;
                  return (
                    <div key={item.id} className="p-2.5 bg-[#05070a] rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
                      <div>
                        <p className="font-bold text-white font-sans">{item.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono">Kategorie: {item.category} | Lieferant: {item.supplier}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`font-mono font-bold ${isLow ? "text-red-400" : "text-green-400"}`}>
                            {item.stock} / {item.minStock} {item.unit}
                          </p>
                          {isLow && (
                            <span className="text-[8px] font-mono text-red-500 animate-pulse block">MELDEBESTAND UNTERSCHRITTEN</span>
                          )}
                        </div>
                        {isLow && (
                          <button
                            onClick={() => handleRestock(item.id)}
                            className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] uppercase rounded transition-all"
                          >
                            Restock +50
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade 10: Analytics Dashboard */}
        {activeUpgradeTab === 10 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400">Modul 10: Mitarbeiter- & Praxis-Analytik</span>
              <h4 className="text-sm font-bold text-white">Praxis-Performance & ROI Tracker</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Verfolgen Sie die monatliche Entwicklung Ihrer Gutachtenerstellung, Umsatzerlöse und zeitlichen Optimierung im Vergleich zum Vorjahr.
              </p>
            </div>

            {/* Recharts chart render */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Chart 1: Revenue & Gutachten Volume */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2 h-[220px]">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Umsatz & Fallzahlen (YTD)</span>
                <div className="w-full h-[160px] text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_PATIENT_DATA}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" />
                      <YAxis yAxisId="left" stroke="rgba(59,130,246,0.8)" />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(99,102,241,0.8)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)" }} />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" name="Einnahmen (€)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Bar yAxisId="right" dataKey="gutachten" name="Gutachten" fill="#6366f1" opacity={0.6} radius={[2, 2, 0, 0]} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Time saved per expert opinion */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2 h-[220px]">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Erstellungszeit je Gutachten (Std.)</span>
                <div className="w-full h-[160px] text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MONTHLY_PATIENT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" />
                      <YAxis stroke="rgba(255,255,255,0.4)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)" }} />
                      <Line type="monotone" dataKey="speedHr" name="Erstellungszeit (h)" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap justify-between items-center gap-2 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Coins size={12} className="text-indigo-400" />
            <span>Kleine Praxis Edition: <strong>Zertifiziert für unbegrenzte Abrechnung</strong></span>
          </div>
          <div>
            <span>Version 3.0-Beta | Juli 2026</span>
          </div>
        </div>

      </div>
    </div>
  );
}
