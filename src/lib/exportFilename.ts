import type { ESDraft } from '../types';
import { parseExportFilenamePart } from '../validation/schemas';

export function getExportFilename(draft: ESDraft, extension: 'md' | 'pdf'): string {
  const company = parseExportFilenamePart(draft.companyName, '');
  const title = parseExportFilenamePart(draft.title, 'ES');
  return company ? `ES_${company}_${title}.${extension}` : `ES_${title}.${extension}`;
}
