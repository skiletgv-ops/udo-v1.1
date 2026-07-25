import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { parseGdt, writeGdt, generateSampleAlbisGdtIn } from '../src/lib/gdt/gdtParser';
import { GdtInboundRecord, GdtOutboundInput } from '../src/lib/gdt/gdtTypes';

// Configuration
const CONFIG = {
  // Exchange folder path (Default C:\ALBIS\GDT\UDO_EXCHANGE\ or local fallback)
  EXCHANGE_DIR: process.env.ALBIS_EXCHANGE_DIR || path.join(process.cwd(), 'albis_exchange'),
  UDO_API_URL: process.env.UDO_API_URL || 'http://localhost:3000',
  DEBOUNCE_MS: 500, // Debounce time waiting for file size stabilization
  POLL_INTERVAL_MS: 3000,
};

// Derived subdirectories
const INBOUND_DIR = path.join(CONFIG.EXCHANGE_DIR, 'inbound');
const OUTBOUND_DIR = path.join(CONFIG.EXCHANGE_DIR, 'outbound');
const PROCESSED_DIR = path.join(CONFIG.EXCHANGE_DIR, 'processed');
const ERROR_DIR = path.join(CONFIG.EXCHANGE_DIR, 'errors');

// Ensure all directories exist
function ensureDirectories() {
  [CONFIG.EXCHANGE_DIR, INBOUND_DIR, OUTBOUND_DIR, PROCESSED_DIR, ERROR_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[ALBIS Watcher] Subfolder initialisiert: ${dir}`);
    }
  });
}

// Track file size stabilization to handle chunked file writes from ALBIS
const fileWriteDebounceMap = new Map<string, { size: number; timer: NodeJS.Timeout }>();

/**
 * Wait for file size to remain constant before processing
 */
function processInboundFileWithDebounce(filePath: string) {
  const fileName = path.basename(filePath);

  // Ignore non-GDT files or temporary files
  if (!fileName.toLowerCase().endsWith('.gdt') && !fileName.toLowerCase().endsWith('.dat')) {
    return;
  }

  // Clear existing timer if file is still being written
  if (fileWriteDebounceMap.has(filePath)) {
    const entry = fileWriteDebounceMap.get(filePath)!;
    clearTimeout(entry.timer);
  }

  try {
    const stats = fs.statSync(filePath);
    const currentSize = stats.size;

    const timer = setTimeout(async () => {
      fileWriteDebounceMap.delete(filePath);
      // Double check stats
      if (fs.existsSync(filePath)) {
        const finalStats = fs.statSync(filePath);
        if (finalStats.size === currentSize && currentSize > 0) {
          console.log(`[ALBIS Watcher] File size stabilized (${currentSize} bytes). Processing: ${fileName}`);
          await handleInboundGdtFile(filePath);
        } else {
          // Re-trigger debounce if size changed
          processInboundFileWithDebounce(filePath);
        }
      }
    }, CONFIG.DEBOUNCE_MS);

    fileWriteDebounceMap.set(filePath, { size: currentSize, timer });
  } catch (err) {
    console.error(`[ALBIS Watcher] Fehler beim Auslesen von File-Stats für ${fileName}:`, err);
  }
}

/**
 * Process inbound GDT file, POST to UDO API, move to processed/ or errors/
 */
async function handleInboundGdtFile(filePath: string) {
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const parseResult = parseGdt(fileBuffer);

    if (!parseResult.success || !parseResult.record) {
      console.error(`[ALBIS Watcher] GDT Parsing-Fehler in ${fileName}: ${parseResult.error}`);
      moveToFolder(filePath, ERROR_DIR, `${timestamp}_${fileName}`);
      writeErrorLog(ERROR_DIR, `${timestamp}_${fileName}.err.log`, parseResult.error || 'Unbekannter Fehler');
      return;
    }

    const record: GdtInboundRecord = parseResult.record;
    console.log(`[ALBIS Watcher] GDT-IN erfolgreich geparst!`);
    console.log(`  - Satzart: ${record.satzart}`);
    console.log(`  - Patientennummer: ${record.patientId}`);
    console.log(`  - Name: ${record.lastName}, ${record.firstName}`);
    console.log(`  - Geburtsdatum: ${record.birthDateFormatted}`);
    console.log(`  - Synthetic Testpatient: ${record.isSynthetic}`);

    // POST to UDO inbound API endpoint
    const response = await fetch(`${CONFIG.UDO_API_URL}/api/integrations/albis/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'albis',
        fileName,
        parsedRecord: record,
        rawText: parseResult.rawText,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`UDO API Sync fehlgeschlagen HTTP ${response.status}: ${errText}`);
    }

    const resJson = await response.json();
    console.log(`[ALBIS Watcher] Sync mit UDO erfolgreich! Fallakte #${resJson.caseId} zugewiesen.`);

    // Move file to processed directory
    moveToFolder(filePath, PROCESSED_DIR, `${timestamp}_${fileName}`);
  } catch (err: any) {
    console.error(`[ALBIS Watcher] Fehler beim Verarbeiten von ${fileName}:`, err.message);
    moveToFolder(filePath, ERROR_DIR, `${timestamp}_${fileName}`);
    writeErrorLog(ERROR_DIR, `${timestamp}_${fileName}.err.log`, err.message || String(err));
  }
}

function moveToFolder(srcPath: string, destFolder: string, newFileName?: string) {
  try {
    const destName = newFileName || path.basename(srcPath);
    const destPath = path.join(destFolder, destName);
    fs.renameSync(srcPath, destPath);
    console.log(`[ALBIS Watcher] Datei verschoben nach: ${destPath}`);
  } catch (err) {
    console.error(`[ALBIS Watcher] Konnte Datei nicht verschieben:`, err);
  }
}

function writeErrorLog(folder: string, logFileName: string, errorMessage: string) {
  try {
    const logPath = path.join(folder, logFileName);
    const content = `[${new Date().toISOString()}] ALBIS GDT Watcher Parse/Sync Error\n${errorMessage}\n`;
    fs.writeFileSync(logPath, content, 'utf-8');
  } catch (e) {
    console.error('Error writing error log:', e);
  }
}

/**
 * Writes an outbound GDT-OUT (Satzart 6310) file into ALBIS outbound directory
 */
export function writeOutboundGdtFile(outboundData: GdtOutboundInput): { success: boolean; filePath: string; fileName: string } {
  ensureDirectories();
  const { buffer, rawText } = writeGdt(outboundData);

  // ALBIS standard outbound file name e.g. UDO2ARZT.GDT or UDO_OUT.GDT
  const fileName = `UDO2ARZT_${Date.now()}.GDT`;
  const filePath = path.join(OUTBOUND_DIR, fileName);

  fs.writeFileSync(filePath, buffer);
  console.log(`[ALBIS Watcher] Outbound GDT-Datei erstellt für ALBIS: ${filePath}`);

  // Also write a copy to root exchange dir if ALBIS expects it directly in the root
  const rootFilePath = path.join(CONFIG.EXCHANGE_DIR, 'UDO2ARZT.GDT');
  fs.writeFileSync(rootFilePath, buffer);

  return { success: true, filePath, fileName };
}

/**
 * Start watching the exchange directories
 */
export function startWatcher() {
  ensureDirectories();

  console.log(`========================================================`);
  console.log(`  U.D.O. ALBIS GDT 2.1 File Exchange Watcher active`);
  console.log(`  Exchange Folder: ${CONFIG.EXCHANGE_DIR}`);
  console.log(`  Inbound Watcher: ${INBOUND_DIR}`);
  console.log(`  Target UDO API: ${CONFIG.UDO_API_URL}/api/integrations/albis/inbound`);
  console.log(`========================================================\n`);

  // Watch both root exchange folder and inbound subfolder
  const watcher = chokidar.watch([CONFIG.EXCHANGE_DIR, INBOUND_DIR], {
    persistent: true,
    ignoreInitial: false,
    depth: 1,
    awaitWriteFinish: false, // handled by custom debounce
  });

  watcher
    .on('add', (filePath) => {
      // Avoid watching files in processed or errors or outbound subfolders
      if (
        filePath.includes(PROCESSED_DIR) ||
        filePath.includes(ERROR_DIR) ||
        filePath.includes(OUTBOUND_DIR)
      ) {
        return;
      }
      processInboundFileWithDebounce(filePath);
    })
    .on('change', (filePath) => {
      if (
        filePath.includes(PROCESSED_DIR) ||
        filePath.includes(ERROR_DIR) ||
        filePath.includes(OUTBOUND_DIR)
      ) {
        return;
      }
      processInboundFileWithDebounce(filePath);
    })
    .on('error', (error) => console.error(`[ALBIS Watcher Error]: ${error}`));

  return watcher;
}

// Execute watcher if run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('watcher.ts')) {
  startWatcher();
}
