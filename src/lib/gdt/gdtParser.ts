import {
  GdtField,
  GdtInboundRecord,
  GdtOutboundInput,
  GdtParseResult,
  GDT_FIELD_DESCRIPTIONS,
} from './gdtTypes';

// CP850 <-> Unicode Mapping Table for German Umlauts and special characters
const CP850_TO_UNICODE: Record<number, string> = {
  0x80: 'Ç', 0x81: 'ü', 0x82: 'é', 0x83: 'â', 0x84: 'ä', 0x85: 'à', 0x86: 'å', 0x87: 'ç',
  0x88: 'ê', 0x89: 'ë', 0x8a: 'è', 0x8b: 'ï', 0x8c: 'î', 0x8d: 'ì', 0x8e: 'Ä', 0x8f: 'Å',
  0x90: 'É', 0x91: 'æ', 0x92: 'Æ', 0x93: 'ô', 0x94: 'ö', 0x95: 'ò', 0x96: 'û', 0x97: 'ù',
  0x98: 'ÿ', 0x99: 'Ö', 0x9a: 'Ü', 0x9b: 'ø', 0x9c: '£', 0x9d: 'Ø', 0x9e: '×', 0x9f: 'ƒ',
  0xa0: 'á', 0xa1: 'í', 0xa2: 'ó', 0xa3: 'ú', 0xa4: 'ñ', 0xa5: 'Ñ', 0xa6: 'ª', 0xa7: 'º',
  0xa8: '¿', 0xa9: '®', 0xaa: '¬', 0xab: '½', 0xac: '¼', 0xad: '¡', 0xae: '«', 0xaf: '»',
  0xe1: 'ß', 0xe6: 'µ',
};

const UNICODE_TO_CP850: Record<string, number> = Object.entries(CP850_TO_UNICODE).reduce(
  (acc, [code, char]) => {
    acc[char] = parseInt(code, 10);
    return acc;
  },
  {} as Record<string, number>
);

/**
 * Decode CP850 Buffer to UTF-8 String
 */
export function decodeCp850(buf: Buffer): string {
  let str = '';
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    if (byte < 0x80) {
      str += String.fromCharCode(byte);
    } else if (CP850_TO_UNICODE[byte]) {
      str += CP850_TO_UNICODE[byte];
    } else {
      str += String.fromCharCode(byte);
    }
  }
  return str;
}

/**
 * Encode UTF-8 String to CP850 Buffer
 */
export function encodeCp850(str: string): Buffer {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);
    if (code < 0x80) {
      bytes.push(code);
    } else if (UNICODE_TO_CP850[char]) {
      bytes.push(UNICODE_TO_CP850[char]);
    } else {
      bytes.push(0x3f); // Fallback to '?'
    }
  }
  return Buffer.from(bytes);
}

/**
 * Helper to convert GDT date format TTMMJJJJ to ISO YYYY-MM-DD
 */
export function formatGdtDateToIso(gdtDate?: string): string {
  if (!gdtDate || gdtDate.length !== 8) return '';
  const day = gdtDate.slice(0, 2);
  const month = gdtDate.slice(2, 4);
  const year = gdtDate.slice(4, 8);
  return `${year}-${month}-${day}`;
}

/**
 * Helper to convert ISO Date YYYY-MM-DD or Date object to GDT format TTMMJJJJ
 */
export function formatIsoToGdtDate(isoOrDate?: string | Date): string {
  const d = isoOrDate ? (isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)) : new Date();
  if (isNaN(d.getTime())) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    return `${day}${month}${year}`;
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());
  return `${day}${month}${year}`;
}

/**
 * Parses raw GDT buffer or text string into a typed GdtInboundRecord
 */
export function parseGdt(input: Buffer | string): GdtParseResult {
  try {
    let rawText = '';
    let encoding: 'CP850' | 'UTF-8' = 'CP850';

    if (Buffer.isBuffer(input)) {
      // Check if text looks like UTF-8 or CP850
      const sampleUtf8 = input.toString('utf-8');
      if (sampleUtf8.includes('8000') && !/[\uFFFD]/.test(sampleUtf8)) {
        rawText = sampleUtf8;
        encoding = 'UTF-8';
      } else {
        rawText = decodeCp850(input);
        encoding = 'CP850';
      }
    } else {
      rawText = input;
    }

    if (!rawText.trim()) {
      return { success: false, error: 'GDT input buffer is empty.', rawText: '' };
    }

    // Split lines
    const lines = rawText.split(/\r?\n/).filter((l) => l.length > 0);
    const fields: GdtField[] = [];
    const parseErrors: string[] = [];

    const fieldMap: Record<string, string> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length < 7) {
        parseErrors.push(`Zeile ${i + 1} ist zu kurz für GDT-Format (Länge: ${line.length}): "${line}"`);
        continue;
      }

      const lengthStr = line.slice(0, 3);
      const expectedLen = parseInt(lengthStr, 10);
      const code = line.slice(3, 7);
      const value = line.slice(7);

      // Verify line length calculation according to QMS spec:
      // Line length = 3 (length) + 4 (code) + value.length + 2 (CRLF)
      const actualByteLen = 3 + 4 + Buffer.byteLength(value, 'utf-8') + 2;
      if (!isNaN(expectedLen) && expectedLen !== actualByteLen && expectedLen !== actualByteLen - 1) {
        parseErrors.push(
          `Satzlängen-Abweichung in Zeile ${i + 1} (Feld ${code}): Header gab ${expectedLen} Bytes an, tatsächlich ${actualByteLen} Bytes.`
        );
      }

      const label = GDT_FIELD_DESCRIPTIONS[code] || `Custom/Freitext Feld ${code}`;
      fields.push({
        code,
        label,
        value,
        length: isNaN(expectedLen) ? actualByteLen : expectedLen,
        rawLine: line,
      });

      // Save field value
      fieldMap[code] = value;
    }

    const satzart = fieldMap['8000'] || '6302';
    const patientId = fieldMap['3000'] || '';

    if (!patientId) {
      return {
        success: false,
        error: 'Fehlendes Pflichtfeld 3000 (Patientennummer) in GDT-Datei.',
        rawText,
      };
    }

    const lastName = fieldMap['3101'] || 'Unbekannt';
    const firstName = fieldMap['3102'] || 'Patient';
    const birthDateRaw = fieldMap['3103'] || '';
    const birthDateFormatted = formatGdtDateToIso(birthDateRaw);

    const genderRaw = fieldMap['3110'];
    let gender: '1' | '2' | '3' | 'unknown' = 'unknown';
    if (genderRaw === '1') gender = '1';
    else if (genderRaw === '2') gender = '2';
    else if (genderRaw === '3') gender = '3';

    const examDateRaw = fieldMap['6200'] || formatIsoToGdtDate(new Date());
    const examDateFormatted = formatGdtDateToIso(examDateRaw);

    // Detect synthetic test patients
    const isSynthetic =
      patientId.startsWith('SYN-') ||
      patientId.startsWith('TEST-') ||
      patientId.startsWith('DEMO-') ||
      patientId.startsWith('999') ||
      lastName.toUpperCase().includes('MUSTERMANN') ||
      lastName.toUpperCase().includes('SYNTHETIC');

    const record: GdtInboundRecord = {
      satzart,
      satzlaenge: fieldMap['8100'] ? parseInt(fieldMap['8100'], 10) : undefined,
      senderId: fieldMap['8316'] || 'ALBIS',
      receiverId: fieldMap['8315'] || 'UDO',
      gdtVersion: fieldMap['9218'] || '02.10',
      patientId,
      lastName,
      firstName,
      birthDate: birthDateRaw,
      birthDateFormatted,
      gender,
      insuranceId: fieldMap['3105'],
      examDate: examDateRaw,
      examDateFormatted,
      examName: fieldMap['8402'] || 'Anforderung UDO Gutachten',
      requestText: fieldMap['8410'] || fieldMap['6200'] || '',
      rawFields: fields,
      encoding,
      isSynthetic,
      parseErrors,
      parsedAt: new Date().toISOString(),
    };

    return { success: true, record, rawText };
  } catch (err: any) {
    return {
      success: false,
      error: `Kritischer Fehler beim Parsen der GDT-Datei: ${err.message || String(err)}`,
      rawText: typeof input === 'string' ? input : input.toString('utf-8'),
    };
  }
}

/**
 * Formats a single GDT record line with exact 3-digit length prefix
 * Format: [3-digit LLL][4-digit FK][value]\r\n
 */
export function formatGdtLine(code: string, value: string): string {
  // Length = 3 (length) + 4 (code) + value.length + 2 (CRLF)
  const lineContentLen = 3 + 4 + Buffer.byteLength(value, 'utf-8') + 2;
  const lenPrefix = String(lineContentLen).padStart(3, '0');
  return `${lenPrefix}${code}${value}\r\n`;
}

/**
 * Generates an outbound GDT-OUT (Satzart 6310) string or buffer for ALBIS
 */
export function writeGdt(input: GdtOutboundInput): { rawText: string; buffer: Buffer } {
  const patientId = input.patientId;
  const caseId = input.caseId;
  const examName = input.examName || 'UDO Gutachten';
  const resultDate = input.resultDate || formatIsoToGdtDate(new Date());

  // HARD CONSTRAINT 5: NO PHI or report content in GDT-OUT.
  // Pointer + status ONLY!
  const defaultStatus = `Gutachten erstellt, siehe UDO-Fallakte #${caseId}`;
  const resultStatus = input.resultStatus || defaultStatus;

  const lines: string[] = [];

  // Satzart 6310 = Ergebnisse einer Untersuchung
  lines.push(formatGdtLine('8000', '6310'));

  // Placeholder for 8100 Satzlänge
  lines.push(formatGdtLine('8100', '00000'));

  lines.push(formatGdtLine('8315', input.receiverId || 'ALBIS'));
  lines.push(formatGdtLine('8316', input.senderId || 'UDO'));
  lines.push(formatGdtLine('9218', '02.10'));
  lines.push(formatGdtLine('3000', patientId));

  if (input.lastName) {
    lines.push(formatGdtLine('3101', input.lastName));
  }
  if (input.firstName) {
    lines.push(formatGdtLine('3102', input.firstName));
  }

  lines.push(formatGdtLine('6220', resultDate));
  lines.push(formatGdtLine('8402', examName));
  lines.push(formatGdtLine('6221', resultStatus));

  // Compute exact total byte length for 8100
  const rawTextTemp = lines.join('');
  const totalByteLength = Buffer.byteLength(rawTextTemp, 'utf-8');

  // Replace line 8100 with computed length
  const formatted8100 = formatGdtLine('8100', String(totalByteLength).padStart(5, '0'));
  lines[1] = formatted8100;

  const rawText = lines.join('');
  const buffer = input.encoding === 'UTF-8' ? Buffer.from(rawText, 'utf-8') : encodeCp850(rawText);

  return { rawText, buffer };
}

/**
 * Creates a sample ALBIS GDT-IN (Satzart 6302) string for testing
 */
export function generateSampleAlbisGdtIn(patientId = 'SYN-90412', lastName = 'Mustermann', firstName = 'Hans'): string {
  const lines: string[] = [];
  lines.push(formatGdtLine('8000', '6302'));
  lines.push(formatGdtLine('8100', '00210'));
  lines.push(formatGdtLine('8315', 'UDO'));
  lines.push(formatGdtLine('8316', 'ALBIS'));
  lines.push(formatGdtLine('9218', '02.10'));
  lines.push(formatGdtLine('3000', patientId));
  lines.push(formatGdtLine('3101', lastName));
  lines.push(formatGdtLine('3102', firstName));
  lines.push(formatGdtLine('3103', '14051968'));
  lines.push(formatGdtLine('3110', '1'));
  lines.push(formatGdtLine('3105', 'AOK-H-123456789'));
  lines.push(formatGdtLine('6200', formatIsoToGdtDate(new Date())));
  lines.push(formatGdtLine('8402', 'Anforderung UDO Neurologisches Gutachten'));
  lines.push(formatGdtLine('8410', 'Verdacht auf Bandscheibenvorfall L4/L5, Minderung Erwerbsfähigkeit prüfen'));

  const temp = lines.join('');
  const totalBytes = Buffer.byteLength(temp, 'utf-8');
  lines[1] = formatGdtLine('8100', String(totalBytes).padStart(5, '0'));

  return lines.join('');
}
