// ALBIS Exchange Folder Watcher Service for Automatic Document Detection & Workflow Triggering
import { albisGdtService } from './albisGdtService';
import { documentUnderstandingService } from './documentUnderstandingService';
import { loggerService } from './loggerService';

export interface AlbisWatchedFile {
  fileName: string;
  detectedAt: string;
  status: 'detected' | 'processing' | 'processed' | 'failed';
  workflowTriggered?: string;
  processedDetails?: any;
}

export type AlbisFileDetectedListener = (file: AlbisWatchedFile) => void;

class AlbisWatcherService {
  private static instance: AlbisWatcherService;
  private isWatching: boolean = false;
  private watchIntervalMs: number = 5000;
  private intervalTimer: any = null;
  private watchedFiles: Map<string, AlbisWatchedFile> = new Map();
  private listeners: Set<AlbisFileDetectedListener> = new Set();

  private constructor() {}

  public static getInstance(): AlbisWatcherService {
    if (!AlbisWatcherService.instance) {
      AlbisWatcherService.instance = new AlbisWatcherService();
    }
    return AlbisWatcherService.instance;
  }

  public startWatching(intervalMs: number = 5000): void {
    if (this.isWatching) return;
    this.isWatching = true;
    this.watchIntervalMs = intervalMs;

    loggerService.info('[ALBIS WATCHER] Started polling ALBIS GDT exchange folder');

    this.intervalTimer = setInterval(() => {
      this.checkExchangeFolder();
    }, this.watchIntervalMs);
  }

  public stopWatching(): void {
    if (!this.isWatching) return;
    this.isWatching = false;
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    loggerService.info('[ALBIS WATCHER] Stopped polling ALBIS GDT exchange folder');
  }

  public subscribe(listener: AlbisFileDetectedListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async checkExchangeFolder(): Promise<void> {
    try {
      const bridgeStatus = albisGdtService.getBridgeStatus();
      if (!bridgeStatus.watcherActive) return;

      const recentLogs = bridgeStatus.recentLogs || [];
      for (const log of recentLogs) {
        const key = `${log.fileName || 'GDT_FILE'}_${log.timestamp}`;
        if (!this.watchedFiles.has(key)) {
          const watchedFile: AlbisWatchedFile = {
            fileName: log.fileName || 'UDO2ARZT.GDT',
            detectedAt: log.timestamp || new Date().toISOString(),
            status: 'detected',
            workflowTriggered: 'S2k Gutachten & Befundextraktion',
          };

          this.watchedFiles.set(key, watchedFile);
          this.notifyListeners(watchedFile);
          this.processWatchedFile(watchedFile);
        }
      }
    } catch (err) {
      loggerService.warn('[ALBIS WATCHER] Error checking exchange folder:', { error: { message: String(err) } });
    }
  }

  public async simulateNewDocumentArrival(fileName: string = 'ARZT2UDO.GDT'): Promise<AlbisWatchedFile> {
    loggerService.info(`[ALBIS WATCHER] Simulating new document arrival: ${fileName}`);

    albisGdtService.triggerSyntheticTest();

    const watchedFile: AlbisWatchedFile = {
      fileName,
      detectedAt: new Date().toISOString(),
      status: 'detected',
      workflowTriggered: 'S2k Gutachten & Automatische Befundextraktion',
    };

    const key = `sim_${fileName}_${Date.now()}`;
    this.watchedFiles.set(key, watchedFile);
    this.notifyListeners(watchedFile);

    await this.processWatchedFile(watchedFile);
    return watchedFile;
  }

  private async processWatchedFile(file: AlbisWatchedFile): Promise<void> {
    file.status = 'processing';
    loggerService.info(`[ALBIS WATCHER] Processing document ${file.fileName}...`);

    try {
      const extracted = await documentUnderstandingService.analyzeDocument(file.fileName);
      file.status = 'processed';
      file.processedDetails = extracted;

      loggerService.info(`[ALBIS WATCHER] Document ${file.fileName} processed successfully. Workflow completed.`);
      this.notifyListeners(file);
    } catch (err) {
      file.status = 'failed';
      loggerService.error(`[ALBIS WATCHER] Failed processing document ${file.fileName}:`, { error: { message: String(err) } });
      this.notifyListeners(file);
    }
  }

  private notifyListeners(file: AlbisWatchedFile) {
    this.listeners.forEach((listener) => {
      try {
        listener(file);
      } catch (err) {
        // Ignore listener errors
      }
    });
  }

  public getWatchedFiles(): AlbisWatchedFile[] {
    return Array.from(this.watchedFiles.values());
  }
}

export const albisWatcherService = AlbisWatcherService.getInstance();
