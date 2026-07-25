import { AuditLogEntry } from '../types/ingestionPipeline';

const AUDIT_LOG_STORAGE_KEY = 'udo_audit_log_entries_v1';

export class AuditLoggerService {
  private static instance: AuditLoggerService;
  private logs: AuditLogEntry[] = [];

  private constructor() {
    this.loadLogsFromStorage();
  }

  public static getInstance(): AuditLoggerService {
    if (!AuditLoggerService.instance) {
      AuditLoggerService.instance = new AuditLoggerService();
    }
    return AuditLoggerService.instance;
  }

  private loadLogsFromStorage() {
    try {
      const stored = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load audit logs from storage:', e);
      this.logs = [];
    }
  }

  private saveLogsToStorage() {
    try {
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Could not save audit logs to storage:', e);
    }
  }

  public logEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    this.logs.unshift(newEntry);
    this.saveLogsToStorage();
    return newEntry;
  }

  public getLogsForDocument(documentId: string): AuditLogEntry[] {
    return this.logs.filter((log) => log.documentId === documentId);
  }

  public getAllLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  public clearLogsForDemo(): void {
    this.logs = [];
    localStorage.removeItem(AUDIT_LOG_STORAGE_KEY);
  }
}

export const auditLogger = AuditLoggerService.getInstance();
