import fs from 'fs';
import path from 'path';
import {
  parseGdt,
  writeGdt,
  generateSampleAlbisGdtIn,
  GdtInboundRecord,
  GdtOutboundInput,
} from '../lib/gdt';

export interface AlbisSyncLog {
  id: string;
  type: 'inbound' | 'outbound';
  timestamp: string;
  patientId: string;
  caseId?: string;
  patientName: string;
  fileName: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  isSynthetic: boolean;
  parseErrors?: string[];
  rawGdtSample?: string;
}

export interface AlbisBridgeStatus {
  exchangeFolderPath: string;
  watcherActive: boolean;
  lastSyncTimestamp: string | null;
  totalInboundCount: number;
  totalOutboundCount: number;
  syntheticModeActive: boolean;
  parseErrorCount: number;
  recentLogs: AlbisSyncLog[];
}

class AlbisGdtService {
  private exchangeFolderPath: string = path.join(process.cwd(), 'albis_exchange');
  private logs: AlbisSyncLog[] = [];
  private albisCasesMap = new Map<string, { patientId: string; caseId: string; record: GdtInboundRecord; createdAt: string }>();

  constructor() {
    this.ensureExchangeStructure();
    this.seedDefaultLogs();
  }

  public getExchangePath(): string {
    return this.exchangeFolderPath;
  }

  public setExchangePath(newPath: string): string {
    if (newPath && newPath.trim()) {
      this.exchangeFolderPath = newPath.trim();
      this.ensureExchangeStructure();
    }
    return this.exchangeFolderPath;
  }

  private ensureExchangeStructure() {
    const dirs = [
      this.exchangeFolderPath,
      path.join(this.exchangeFolderPath, 'inbound'),
      path.join(this.exchangeFolderPath, 'outbound'),
      path.join(this.exchangeFolderPath, 'processed'),
      path.join(this.exchangeFolderPath, 'errors'),
    ];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
          console.warn(`Could not create directory ${dir}:`, e);
        }
      }
    });
  }

  private seedDefaultLogs() {
    // Seed initial synthetic test log so the admin panel has rich demonstration state
    this.logs.push({
      id: `log-${Date.now()}-1`,
      type: 'inbound',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      patientId: 'SYN-90412',
      caseId: 'BG-2026-9901-A',
      patientName: 'Müller, Hans',
      fileName: 'ARZT2UDO_SAMPLE.GDT',
      status: 'success',
      message: 'ALBIS GDT-IN (Satzart 6302) erfolgreich verarbeitet. Fallakte #BG-2026-9901-A verknüpft.',
      isSynthetic: true,
      parseErrors: [],
      rawGdtSample: generateSampleAlbisGdtIn('SYN-90412', 'Müller', 'Hans'),
    });
  }

  /**
   * Process Inbound GDT (Satzart 6302) received from ALBIS watcher
   */
  public processInboundGdt(payload: {
    fileName: string;
    parsedRecord: GdtInboundRecord;
    rawText?: string;
  }): { success: boolean; caseId: string; patientId: string; isSynthetic: boolean } {
    const { fileName, parsedRecord, rawText } = payload;
    const patientId = parsedRecord.patientId;
    const isSynthetic = parsedRecord.isSynthetic;

    // Generate or lookup Case ID for UDO
    const existing = this.albisCasesMap.get(patientId);
    const caseId = existing?.caseId || `BG-2026-${Math.floor(1000 + Math.random() * 9000)}-A`;

    // Store in internal ALBIS-UDO lookup table
    this.albisCasesMap.set(patientId, {
      patientId,
      caseId,
      record: parsedRecord,
      createdAt: new Date().toISOString(),
    });

    const hasWarnings = parsedRecord.parseErrors && parsedRecord.parseErrors.length > 0;
    const status = hasWarnings ? 'warning' : 'success';
    const message = hasWarnings
      ? `GDT-IN verarbeitet mit ${parsedRecord.parseErrors.length} Warnung(en). Fallakte #${caseId}`
      : `GDT-IN (Satzart 6302) erfolgreich eingelesen. Fallakte #${caseId} zugewiesen.`;

    // Log event
    const logItem: AlbisSyncLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'inbound',
      timestamp: new Date().toISOString(),
      patientId,
      caseId,
      patientName: `${parsedRecord.lastName}, ${parsedRecord.firstName}`,
      fileName,
      status,
      message,
      isSynthetic,
      parseErrors: parsedRecord.parseErrors,
      rawGdtSample: rawText || JSON.stringify(parsedRecord.rawFields),
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 100) this.logs.pop();

    return { success: true, caseId, patientId, isSynthetic };
  }

  /**
   * Process Outbound GDT (Satzart 6310) when UDO finalizes a Gutachten
   */
  public processOutboundGdt(payload: {
    caseId: string;
    statusMessage?: string;
    customPatientId?: string;
  }): { success: boolean; fileName: string; filePath: string; rawText: string; isSynthetic: boolean } {
    const { caseId, statusMessage, customPatientId } = payload;

    // Find patientId associated with caseId
    let patientId = customPatientId || '';
    let lastName = 'Müller';
    let firstName = 'Hans';
    let isSynthetic = true;

    for (const [pId, item] of this.albisCasesMap.entries()) {
      if (item.caseId === caseId) {
        patientId = pId;
        lastName = item.record.lastName;
        firstName = item.record.firstName;
        isSynthetic = item.record.isSynthetic;
        break;
      }
    }

    if (!patientId) {
      patientId = `SYN-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    const defaultStatus = `Gutachten erstellt, siehe UDO-Fallakte #${caseId}`;
    const resultStatus = statusMessage || defaultStatus;

    // Generate GDT-OUT (Satzart 6310) using writer module
    const outboundInput: GdtOutboundInput = {
      patientId,
      caseId,
      lastName,
      firstName,
      resultStatus,
      isSynthetic,
    };

    const { buffer, rawText } = writeGdt(outboundInput);

    // Save outbound file to disk
    this.ensureExchangeStructure();
    const fileName = `UDO2ARZT_${Date.now()}.GDT`;
    const outboundFolder = path.join(this.exchangeFolderPath, 'outbound');
    const filePath = path.join(outboundFolder, fileName);
    const rootPath = path.join(this.exchangeFolderPath, 'UDO2ARZT.GDT');

    try {
      fs.writeFileSync(filePath, buffer);
      fs.writeFileSync(rootPath, buffer);
    } catch (e) {
      console.warn('Could not write outbound GDT file to disk:', e);
    }

    // Log outbound event
    const logItem: AlbisSyncLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'outbound',
      timestamp: new Date().toISOString(),
      patientId,
      caseId,
      patientName: `${lastName}, ${firstName}`,
      fileName,
      status: 'success',
      message: `GDT-OUT (Satzart 6310) exportiert für ALBIS. Status: "${resultStatus}"`,
      isSynthetic,
      rawGdtSample: rawText,
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 100) this.logs.pop();

    return { success: true, fileName, filePath, rawText, isSynthetic };
  }

  /**
   * Trigger synthetic test file round-trip
   */
  public triggerSyntheticTest(): {
    inboundResult: ReturnType<AlbisGdtService['processInboundGdt']>;
    outboundResult: ReturnType<AlbisGdtService['processOutboundGdt']>;
    sampleInGdtText: string;
  } {
    const testPatientId = `SYN-${Math.floor(10000 + Math.random() * 90000)}`;
    const sampleInGdtText = generateSampleAlbisGdtIn(testPatientId, 'Mustermann', 'Erika');

    const parseRes = parseGdt(sampleInGdtText);
    if (!parseRes.success || !parseRes.record) {
      throw new Error('Synthetic sample generation failed parse check.');
    }

    // Write file to inbound folder
    this.ensureExchangeStructure();
    const inboundFile = path.join(this.exchangeFolderPath, 'inbound', `ARZT2UDO_TEST_${Date.now()}.GDT`);
    try {
      fs.writeFileSync(inboundFile, sampleInGdtText, 'utf-8');
    } catch (e) {
      console.warn('Could not write test file to inbound folder:', e);
    }

    // Process inbound
    const inboundResult = this.processInboundGdt({
      fileName: path.basename(inboundFile),
      parsedRecord: parseRes.record,
      rawText: sampleInGdtText,
    });

    // Process outbound response
    const outboundResult = this.processOutboundGdt({
      caseId: inboundResult.caseId,
      statusMessage: `Gutachten erstellt, siehe UDO-Fallakte #${inboundResult.caseId}`,
      customPatientId: testPatientId,
    });

    return { inboundResult, outboundResult, sampleInGdtText };
  }

  /**
   * Returns current bridge status, folder stats, and recent sync logs
   */
  public getBridgeStatus(): AlbisBridgeStatus {
    const parseErrorLogs = this.logs.filter((l) => l.status === 'error' || (l.parseErrors && l.parseErrors.length > 0));
    const inboundLogs = this.logs.filter((l) => l.type === 'inbound');
    const outboundLogs = this.logs.filter((l) => l.type === 'outbound');

    return {
      exchangeFolderPath: this.exchangeFolderPath,
      watcherActive: true,
      lastSyncTimestamp: this.logs.length > 0 ? this.logs[0].timestamp : null,
      totalInboundCount: inboundLogs.length,
      totalOutboundCount: outboundLogs.length,
      syntheticModeActive: true,
      parseErrorCount: parseErrorLogs.length,
      recentLogs: this.logs.slice(0, 30),
    };
  }
}

export const albisGdtService = new AlbisGdtService();
