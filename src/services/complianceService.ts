export interface ConsentRecord {
  given: boolean;
  timestamp: string;
  method: "voice" | "chat" | "form";
  scope: "processing" | "processing_and_storage";
  withdrawn: boolean;
  withdrawn_timestamp: string | null;
}

export interface RetentionRecord {
  created_at: string;
  retention_period_days: number; // default 365
  scheduled_deletion_date: string;
  deletion_status: "active" | "scheduled" | "deleted";
}

export interface DataExportLog {
  requested_at: string;
  fulfilled_at: string;
  requested_by: string;
}

export interface CompliancePatient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  insurance: string;
  reason: string;
  lastActivity: string;
  consent: ConsentRecord;
  retention: RetentionRecord;
  dataExportLog: DataExportLog[];
  status: "active" | "flagged_for_deletion" | "deleted" | "consent_withdrawn";
  medicalNotes?: string;
  transcriptHistory?: Array<{ sender: string; text: string; time: string }>;
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

class ComplianceService {
  private patients: Map<string, CompliancePatient> = new Map();
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    // Seed initial patients with varying retention & consent states
    const now = new Date();
    
    // Active Patient 1
    const p1Id = "pat-101";
    const p1Created = new Date(now.getTime() - 45 * 24 * 3600 * 1000).toISOString(); // 45 days ago
    const p1ScheduledDel = new Date(now.getTime() + (365 - 45) * 24 * 3600 * 1000).toISOString();

    this.patients.set(p1Id, {
      id: p1Id,
      name: "Thomas Müller",
      dob: "14.05.1978",
      phone: "+49 221 889210",
      insurance: "statutory",
      reason: "Bandscheibenvorfall L5/S1 mit Radikulopathie",
      lastActivity: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
      consent: {
        given: true,
        timestamp: p1Created,
        method: "voice",
        scope: "processing_and_storage",
        withdrawn: false,
        withdrawn_timestamp: null
      },
      retention: {
        created_at: p1Created,
        retention_period_days: 365,
        scheduled_deletion_date: p1ScheduledDel,
        deletion_status: "active"
      },
      dataExportLog: [],
      status: "active",
      medicalNotes: "Gutachtenerstellung S2k eingeleitet."
    });

    // Patient 2: Past Retention Period (380 days old - Flagged for deletion)
    const p2Id = "pat-102";
    const p2Created = new Date(now.getTime() - 380 * 24 * 3600 * 1000).toISOString();
    const p2ScheduledDel = new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString();

    this.patients.set(p2Id, {
      id: p2Id,
      name: "Sabine Becker",
      dob: "22.11.1965",
      phone: "+49 221 44556",
      insurance: "private",
      reason: "Erstuntersuchung Polyneuropathie",
      lastActivity: new Date(now.getTime() - 370 * 24 * 3600 * 1000).toISOString(),
      consent: {
        given: true,
        timestamp: p2Created,
        method: "chat",
        scope: "processing_and_storage",
        withdrawn: false,
        withdrawn_timestamp: null
      },
      retention: {
        created_at: p2Created,
        retention_period_days: 365,
        scheduled_deletion_date: p2ScheduledDel,
        deletion_status: "scheduled"
      },
      dataExportLog: [],
      status: "flagged_for_deletion",
      medicalNotes: "Behandlung abgeschlossen. Vorhaltefrist überschritten."
    });

    // Patient 3: Consent Withdrawn
    const p3Id = "pat-103";
    const p3Created = new Date(now.getTime() - 120 * 24 * 3600 * 1000).toISOString();
    const p3ScheduledDel = new Date(now.getTime() + (365 - 120) * 24 * 3600 * 1000).toISOString();

    this.patients.set(p3Id, {
      id: p3Id,
      name: "Klaus Hoffmann",
      dob: "03.02.1982",
      phone: "+49 221 77112",
      insurance: "statutory",
      reason: "Anfrage Zweitmeinung Zervikobrachialgie",
      lastActivity: new Date(now.getTime() - 10 * 24 * 3600 * 1000).toISOString(),
      consent: {
        given: false,
        timestamp: p3Created,
        method: "voice",
        scope: "processing",
        withdrawn: true,
        withdrawn_timestamp: new Date(now.getTime() - 10 * 24 * 3600 * 1000).toISOString()
      },
      retention: {
        created_at: p3Created,
        retention_period_days: 365,
        scheduled_deletion_date: p3ScheduledDel,
        deletion_status: "active"
      },
      dataExportLog: [],
      status: "consent_withdrawn",
      medicalNotes: "Einwilligung am 12.07.2026 widerrufen. KI-Verarbeitung gestoppt."
    });

    // Audit logs initial seeding
    this.addAuditEntry("CONSENT_GIVEN", p1Id, "Thomas Müller", "System (UDO Voice)", "Einwilligung per Sprache erteilt (DSGVO Art. 6 Abs. 1a)");
    this.addAuditEntry("CONSENT_GIVEN", p2Id, "Sabine Becker", "System (UDO Chat)", "Einwilligung per Chat erteilt");
    this.addAuditEntry("RETENTION_EXPIRED_FLAGGED", p2Id, "Sabine Becker", "System Cron (Retention Check)", "365-Tage Vorhaltefrist überschritten. Zur Löschung vorgemerkt.");
    this.addAuditEntry("CONSENT_WITHDRAWN", p3Id, "Klaus Hoffmann", "Patient via Hotline", "Einwilligung zur Datenverarbeitung widerrufen (DSGVO Art. 7 Abs. 3)");
  }

  private addAuditEntry(action: AuditLogEntry["action"], patientId: string, patientName: string, performedBy: string, details: string) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      patientId,
      patientName,
      performedBy,
      details
    });
  }

  public registerPatientConsent(
    name: string,
    dob: string,
    phone: string,
    insurance: string,
    reason: string,
    method: "voice" | "chat" | "form"
  ): CompliancePatient {
    const id = `pat-${Date.now()}`;
    const now = new Date();
    const created_at = now.toISOString();
    const scheduled_deletion_date = new Date(now.getTime() + 365 * 24 * 3600 * 1000).toISOString();

    const patient: CompliancePatient = {
      id,
      name: name || "Unbenannter Patient",
      dob: dob || "Nicht angegeben",
      phone: phone || "Nicht angegeben",
      insurance: insurance || "statutory",
      reason: reason || "Erstkontakt",
      lastActivity: created_at,
      consent: {
        given: true,
        timestamp: created_at,
        method,
        scope: "processing_and_storage",
        withdrawn: false,
        withdrawn_timestamp: null
      },
      retention: {
        created_at,
        retention_period_days: 365,
        scheduled_deletion_date,
        deletion_status: "active"
      },
      dataExportLog: [],
      status: "active"
    };

    this.patients.set(id, patient);
    this.addAuditEntry("CONSENT_GIVEN", id, patient.name, `System (UDO ${method})`, "Informing statement accepted & consent recorded");
    return patient;
  }

  public getPatients(): CompliancePatient[] {
    // Run retention check before returning
    this.checkRetentionExpiries();
    return Array.from(this.patients.values()).filter(p => p.status !== "deleted");
  }

  public getPatientById(id: string): CompliancePatient | undefined {
    return this.patients.get(id);
  }

  public exportPatientData(id: string, requestedBy: string): { success: boolean; data?: any; error?: string } {
    const patient = this.patients.get(id);
    if (!patient) return { success: false, error: "Patient nicht gefunden" };

    const nowIso = new Date().toISOString();
    patient.dataExportLog.push({
      requested_at: nowIso,
      fulfilled_at: nowIso,
      requested_by: requestedBy
    });

    this.addAuditEntry("DATA_EXPORTED", id, patient.name, requestedBy, `DSGVO Art. 15 Datenauskunft exportiert (JSON & PDF Dossier Paket)`);

    return {
      success: true,
      data: {
        complianceHeader: {
          standard: "EU GDPR Art. 15 - Right of Access by Data Subject",
          practice: "Praxis Dr. Bongartz - Neurologie & Psychiatrie Köln",
          generatedAt: nowIso,
          requestedBy
        },
        patientRecord: patient,
        gutachtenDraftsAssociated: [
          { draftId: `gut-${patient.id}`, title: `S2k-Gutachten Entwurf ${patient.name}`, status: "Entwurf" }
        ],
        transcripts: patient.transcriptHistory || [
          { sender: "UDO", text: "Guten Tag, wie kann ich Ihnen helfen?", time: patient.consent.timestamp }
        ]
      }
    };
  }

  public withdrawConsent(id: string, performedBy: string): boolean {
    const patient = this.patients.get(id);
    if (!patient) return false;

    const now = new Date().toISOString();
    patient.consent.withdrawn = true;
    patient.consent.withdrawn_timestamp = now;
    patient.consent.given = false;
    patient.status = "consent_withdrawn";

    this.addAuditEntry("CONSENT_WITHDRAWN", id, patient.name, performedBy, "Einwilligung widerrufen. Weitere KI-Verarbeitung gestoppt.");
    return true;
  }

  public deletePatientData(id: string, reason: string, performedBy: string): boolean {
    const patient = this.patients.get(id);
    if (!patient) return false;

    // Full erasure (GDPR Art. 17 Right to be Forgotten)
    patient.status = "deleted";
    patient.retention.deletion_status = "deleted";
    
    // Scrub sensitive PII from record while keeping anonymized audit entry
    const name = patient.name;
    patient.name = "[GELÖSCHT - DSGVO ART. 17]";
    patient.phone = "[GELÖSCHT]";
    patient.dob = "[GELÖSCHT]";
    patient.reason = "[GELÖSCHT]";
    patient.medicalNotes = undefined;
    patient.transcriptHistory = [];

    this.addAuditEntry("DATA_DELETED", id, name, performedBy, `Vollständige Löschung gem. Art. 17 DSGVO. Grund: ${reason}`);
    return true;
  }

  public checkRetentionExpiries(): number {
    let flaggedCount = 0;
    const nowMs = Date.now();

    this.patients.forEach(patient => {
      if (patient.status === "active" && patient.retention.deletion_status === "active") {
        const scheduledMs = new Date(patient.retention.scheduled_deletion_date).getTime();
        if (nowMs >= scheduledMs) {
          patient.status = "flagged_for_deletion";
          patient.retention.deletion_status = "scheduled";
          flaggedCount++;
          this.addAuditEntry("RETENTION_EXPIRED_FLAGGED", patient.id, patient.name, "System Cron", "Vorhaltefrist überschritten. Zur Löschungsfreigabe vorgemerkt.");
        }
      }
    });

    return flaggedCount;
  }

  public approveScheduledDeletion(id: string, performedBy: string): boolean {
    return this.deletePatientData(id, "Manuelle Freigabe nach Ablauf der Aufbewahrungsfrist", performedBy);
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }
}

export const complianceService = new ComplianceService();
