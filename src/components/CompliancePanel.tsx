import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  Lock, 
  UserX, 
  Info,
  Calendar,
  Check
} from "lucide-react";

export interface CompliancePatient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  insurance: string;
  reason: string;
  lastActivity: string;
  consent: {
    given: boolean;
    timestamp: string;
    method: "voice" | "chat" | "form";
    scope: "processing" | "processing_and_storage";
    withdrawn: boolean;
    withdrawn_timestamp: string | null;
  };
  retention: {
    created_at: string;
    retention_period_days: number;
    scheduled_deletion_date: string;
    deletion_status: "active" | "scheduled" | "deleted";
  };
  dataExportLog: Array<{ requested_at: string; fulfilled_at: string; requested_by: string }>;
  status: "active" | "flagged_for_deletion" | "deleted" | "consent_withdrawn";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "CONSENT_GIVEN" | "CONSENT_WITHDRAWN" | "DATA_EXPORTED" | "DATA_DELETED" | "RETENTION_EXPIRED_FLAGGED" | "DELETION_APPROVED";
  patientId: string;
  patientName: string;
  performedBy: string;
  details: string;
}

export default function CompliancePanel() {
  const [patients, setPatients] = useState<CompliancePatient[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<"patients" | "audit" | "settings">("patients");
  
  // Search and Filter
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [deleteModalPatient, setDeleteModalPatient] = useState<CompliancePatient | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>("Patientenwunsch (Art. 17 DSGVO)");
  const [exportModalData, setExportModalData] = useState<any | null>(null);

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const [resPatients, resAudit] = await Promise.all([
        fetch("/api/compliance/patients"),
        fetch("/api/compliance/audit-log")
      ]);
      const patientsData = await resPatients.json();
      const auditData = await resAudit.json();
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAuditLogs(Array.isArray(auditData) ? auditData : []);
    } catch (e) {
      console.error("Error fetching compliance data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Handle Export (Art. 15)
  const handleExportPatient = async (patient: CompliancePatient) => {
    try {
      const res = await fetch(`/api/compliance/patients/${patient.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedBy: "Dr. Bongartz (Praxisinhaber)" })
      });
      const result = await res.json();
      if (result.success) {
        setExportModalData(result.data);
        
        // Trigger file download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.data, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `DSGVO_Auskunft_${patient.name.replace(/\s+/g, "_")}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        fetchComplianceData();
      }
    } catch (e) {
      console.error("Error exporting patient data:", e);
    }
  };

  // Handle Consent Withdrawal
  const handleWithdrawConsent = async (patientId: string) => {
    if (!confirm("Möchten Sie die Einwilligung für diesen Patienten wirklich widerrufen? Jegliche KI-Verarbeitung wird sofort gestoppt.")) return;

    try {
      await fetch(`/api/compliance/patients/${patientId}/withdraw-consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ performedBy: "Dr. Bongartz" })
      });
      fetchComplianceData();
    } catch (e) {
      console.error("Error withdrawing consent:", e);
    }
  };

  // Handle Complete Deletion (Art. 17)
  const handleConfirmDelete = async () => {
    if (!deleteModalPatient) return;

    try {
      await fetch(`/api/compliance/patients/${deleteModalPatient.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason, performedBy: "Dr. Bongartz" })
      });
      setDeleteModalPatient(null);
      fetchComplianceData();
    } catch (e) {
      console.error("Error deleting patient:", e);
    }
  };

  // Handle Scheduled Deletion Approval
  const handleApproveDeletion = async (patientId: string) => {
    try {
      await fetch("/api/compliance/approve-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId, performedBy: "Dr. Bongartz" })
      });
      fetchComplianceData();
    } catch (e) {
      console.error("Error approving deletion:", e);
    }
  };

  const flaggedPatients = patients.filter(p => p.status === "flagged_for_deletion");

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.reason.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && p.status === "active";
    if (statusFilter === "flagged") return matchesSearch && p.status === "flagged_for_deletion";
    if (statusFilter === "withdrawn") return matchesSearch && p.status === "consent_withdrawn";
    return matchesSearch;
  });

  const calculateDaysRemaining = (scheduledDelDate: string) => {
    const diff = new Date(scheduledDelDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner Alert if records are past retention */}
      {flaggedPatients.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                DSGVO Vorhaltefrist abgelaufen ({flaggedPatients.length} Datensatz/Datensätze)
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Die gesetzliche 365-Tage Aufbewahrungsfrist ist abgelaufen. Bitte bestätigen Sie die endgültige Löschung.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleApproveDeletion(flaggedPatients[0].id)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-amber-500/20"
          >
            <Trash2 size={14} />
            Löschung jetzt freigeben
          </button>
        </div>
      )}

      {/* Control Panel Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Datenschutz & DSGVO Compliance Center
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  EU DSGVO Konform (Art. 15, 17)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Zentrale Steuerung für Einwilligung, Datenexporte, Löschfristen und lückenloses Audit-Log.
              </p>
            </div>
          </div>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10">
          <button
            onClick={() => setActiveSubTab("patients")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "patients"
                ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck size={14} />
            Patientenverwaltung ({patients.length})
          </button>
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "audit"
                ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock size={14} />
            Audit-Log ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "settings"
                ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock size={14} />
            Sicherheit & Richtlinien
          </button>
        </div>
      </div>

      {/* MAIN CONTENT VIEW */}
      {activeSubTab === "patients" && (
        <div className="space-y-4">
          {/* Filters & Refresh Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Patient oder Grund suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-teal-400/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <Filter size={13} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">Alle Status</option>
                  <option value="active">Aktiv / Gültig</option>
                  <option value="flagged">Zur Löschung vorgemerkt</option>
                  <option value="withdrawn">Einwilligung widerrufen</option>
                </select>
              </div>

              <button
                onClick={fetchComplianceData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Aktualisieren"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-teal-400" : ""} />
              </button>
            </div>
          </div>

          {/* Patients Directory Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Patient / Stammdaten</th>
                    <th className="px-5 py-3.5">Einwilligung (Art. 6)</th>
                    <th className="px-5 py-3.5">Vorhaltefrist (365 Tage)</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                        Keine passenden Datensätze gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map(patient => {
                      const daysLeft = calculateDaysRemaining(patient.retention.scheduled_deletion_date);
                      return (
                        <tr key={patient.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-100">{patient.name}</div>
                            <div className="text-[11px] text-slate-400">Geb.: {patient.dob} • Tel: {patient.phone}</div>
                            <div className="text-[10px] text-teal-400/80 mt-0.5 truncate max-w-xs">{patient.reason}</div>
                          </td>

                          <td className="px-5 py-4">
                            {patient.consent.withdrawn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-[10px]">
                                <XCircle size={12} /> Widerrufen
                              </span>
                            ) : patient.consent.given ? (
                              <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-[10px]">
                                  <CheckCircle2 size={12} /> Erteilt ({patient.consent.method})
                                </span>
                                <div className="text-[10px] text-slate-500 mt-1">
                                  {new Date(patient.consent.timestamp).toLocaleDateString("de-DE")}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                                Ausstehend
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {daysLeft <= 0 ? (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <AlertTriangle size={13} /> Abgelaufen
                              </span>
                            ) : (
                              <div>
                                <div className="font-mono text-slate-200">{daysLeft} Tage verbleibend</div>
                                <div className="text-[10px] text-slate-500">
                                  Löschung am: {new Date(patient.retention.scheduled_deletion_date).toLocaleDateString("de-DE")}
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {patient.status === "active" && (
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px]">
                                Aktiv
                              </span>
                            )}
                            {patient.status === "flagged_for_deletion" && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                Zur Löschung vorgemerkt
                              </span>
                            )}
                            {patient.status === "consent_withdrawn" && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                                Gestoppt (Widerruf)
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Export Art. 15 */}
                              <button
                                onClick={() => handleExportPatient(patient)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                                title="DSGVO Art. 15 Datenauskunft als Paket herunterladen"
                              >
                                <Download size={13} /> Export
                              </button>

                              {/* Withdraw Consent */}
                              {!patient.consent.withdrawn && (
                                <button
                                  onClick={() => handleWithdrawConsent(patient.id)}
                                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                                  title="Einwilligung widerrufen"
                                >
                                  <UserX size={14} />
                                </button>
                              )}

                              {/* Delete Art. 17 */}
                              <button
                                onClick={() => setDeleteModalPatient(patient)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                                title="Endgültige Löschung gem. Art. 17 DSGVO"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG VIEW */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-teal-400" />
              Revisionssicheres DSGVO Audit-Protokoll (Art. 5 Abs. 2)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Unveränderliche Protokollierung</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Zeitstempel</th>
                    <th className="px-5 py-3.5">Aktion</th>
                    <th className="px-5 py-3.5">Patient</th>
                    <th className="px-5 py-3.5">Ausgeführt von</th>
                    <th className="px-5 py-3.5">Protokolldetails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[11px]">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("de-DE")}
                      </td>

                      <td className="px-5 py-3">
                        {log.action === "CONSENT_GIVEN" && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            CONSENT_GIVEN
                          </span>
                        )}
                        {log.action === "CONSENT_WITHDRAWN" && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            CONSENT_WITHDRAWN
                          </span>
                        )}
                        {log.action === "DATA_EXPORTED" && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                            DATA_EXPORTED
                          </span>
                        )}
                        {log.action === "DATA_DELETED" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                            DATA_DELETED
                          </span>
                        )}
                        {log.action === "RETENTION_EXPIRED_FLAGGED" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            EXPIRED_FLAGGED
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-slate-200 font-bold">{log.patientName}</td>
                      <td className="px-5 py-3 text-slate-400">{log.performedBy}</td>
                      <td className="px-5 py-3 text-slate-300 max-w-md truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* POLICY & SETTINGS VIEW */}
      {activeSubTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-teal-400" />
              Sicherheits- & Aufbewahrungsrichtlinie
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konfiguration der automatischen Aufbewahrungsfristen für Patientendaten im System gem. Art. 5 DSGVO.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-300 font-medium">Standard-Vorhaltefrist (Tage)</label>
                <input
                  type="number"
                  defaultValue={365}
                  className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none"
                  disabled
                />
                <span className="text-[10px] text-slate-500">Eingestellt auf 365 Tage nach dem letzten Behandlungskontakt.</span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Verschlüsselung at Rest (AES-256)
                </div>
                <p className="text-[11px] text-teal-300/80">
                  Alle gespeicherten Transkripte und Gutachtenentwürfe sind mit AES-256 verschlüsselt.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-teal-400" />
              Verarbeitungsverzeichnis (Art. 30 DSGVO)
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <span className="font-bold text-teal-400">Verantwortlicher:</span> Dr. med. Bongartz, Köln
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <span className="font-bold text-teal-400">Zweck der Verarbeitung:</span> Unterstützung der klinischen Diagnostik, Gutachtenerstellung & Terminmanagement
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <span className="font-bold text-teal-400">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a (Einwilligung) & lit. f (berechtigtes Interesse)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-white">Endgültige Löschung (Art. 17)</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Möchten Sie die Daten von <strong className="text-white">{deleteModalPatient.name}</strong> unwiderruflich löschen? Alle Transkripte, Notizen und Verknüpfungen werden gelöscht.
            </p>

            <div>
              <label className="text-xs text-slate-400 font-medium">Grund der Löschung</label>
              <input
                type="text"
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalPatient(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <Trash2 size={14} /> Jetzt unwiderruflich löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
