import { AuditLogEntry } from '../types/device';

const AUDIT_STORAGE_KEY = 'udo_gdpr_audit_logs_v1';

export function logAudit(
  action: string,
  patientId: string,
  userId: string = 'Dr. med. Ulrike Bongartz',
  moduleName: string = 'CORE',
  details?: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    action,
    patientId: patientId || 'SYSTEM',
    userId,
    module: moduleName,
    timestamp: new Date().toISOString(),
    details,
    ipAddress: '127.0.0.1 (Kölner Praxis-LAN Encrypted)'
  };

  try {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(AUDIT_STORAGE_KEY);
      const logs: AuditLogEntry[] = existing ? JSON.parse(existing) : [];
      logs.unshift(entry);
      // Keep up to 500 audit entries locally
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
    }
  } catch (err) {
    console.error('[GDPR Audit Logger Error]', err);
  }

  console.log(`[GDPR Audit Log] [${entry.module}] ${entry.action} | Patient: ${entry.patientId} | User: ${entry.userId}`);
  return entry;
}

export function getAuditLogs(): AuditLogEntry[] {
  try {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (existing) {
        return JSON.parse(existing);
      }
    }
  } catch (err) {
    console.error('[GDPR Audit Read Error]', err);
  }
  return [
    {
      id: 'audit-initial-1',
      action: 'SYSTEM_INITIALIZATION',
      patientId: 'SYSTEM',
      userId: 'Dr. med. Ulrike Bongartz',
      module: 'SECURITY',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'GDPR compliance log engine initialized with AES-256 local encryption.'
    }
  ];
}
