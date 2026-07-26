// REQUIRES: MDR/CE certification before clinical use (sick note digital signature)

import { SickNoteData, generateSickNoteDocument, exportSickNotePdf } from '../../src/lib/docs/sick-note';

export type { SickNoteData };
export { generateSickNoteDocument, exportSickNotePdf };
