// Structured Audit-Friendly Logger Service for UDO S2k Architecture (Pino-compatible schema)

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogPayload {
  requestId?: string;
  routing?: {
    agentId?: string;
    confidence?: number;
    intent?: string;
    route?: string;
  };
  toolExecution?: {
    toolName: string;
    status: 'started' | 'success' | 'failed';
    durationMs?: number;
    args?: Record<string, any>;
  };
  ttsEvents?: {
    event: 'start' | 'chunk' | 'end' | 'interrupted' | 'error';
    provider?: string;
    charCount?: number;
  };
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  [key: string]: any;
}

export interface StructuredLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  payload?: StructuredLogPayload;
}

const LOGGER_STORAGE_KEY = 'udo_structured_logs_v1';

class LoggerService {
  private static instance: LoggerService;
  private memoryLogs: StructuredLogEntry[] = [];
  private currentRequestId: string = '';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public generateRequestId(): string {
    this.currentRequestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    return this.currentRequestId;
  }

  public getRequestId(): string {
    if (!this.currentRequestId) {
      return this.generateRequestId();
    }
    return this.currentRequestId;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(LOGGER_STORAGE_KEY);
      if (stored) {
        this.memoryLogs = JSON.parse(stored);
      }
    } catch (e) {
      this.memoryLogs = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOGGER_STORAGE_KEY, JSON.stringify(this.memoryLogs.slice(0, 500)));
    } catch (e) {
      // Ignore storage errors
    }
  }

  public log(level: LogLevel, message: string, payload?: StructuredLogPayload): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      payload: {
        requestId: payload?.requestId || this.getRequestId(),
        ...payload,
      },
    };

    // Format output in Pino style for DevTools / Server console
    const consoleFormatted = `[${entry.timestamp}] [${level.toUpperCase()}] [REQ:${entry.payload?.requestId}] ${message}`;
    if (level === 'error') {
      console.error(consoleFormatted, entry.payload);
    } else if (level === 'warn') {
      console.warn(consoleFormatted, entry.payload);
    } else if (level === 'debug') {
      console.debug(consoleFormatted, entry.payload);
    } else {
      console.log(consoleFormatted, entry.payload);
    }

    this.memoryLogs.unshift(entry);
    if (this.memoryLogs.length > 500) {
      this.memoryLogs = this.memoryLogs.slice(0, 500);
    }
    this.saveToStorage();

    return entry;
  }

  public info(message: string, payload?: StructuredLogPayload): StructuredLogEntry {
    return this.log('info', message, payload);
  }

  public warn(message: string, payload?: StructuredLogPayload): StructuredLogEntry {
    return this.log('warn', message, payload);
  }

  public error(message: string, payload?: StructuredLogPayload): StructuredLogEntry {
    return this.log('error', message, payload);
  }

  public debug(message: string, payload?: StructuredLogPayload): StructuredLogEntry {
    return this.log('debug', message, payload);
  }

  public getLogs(): StructuredLogEntry[] {
    return [...this.memoryLogs];
  }

  public clearLogs() {
    this.memoryLogs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOGGER_STORAGE_KEY);
    }
  }
}

export const loggerService = LoggerService.getInstance();
