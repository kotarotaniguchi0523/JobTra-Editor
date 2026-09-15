import type { ESDraft } from '../types';

function sanitizeExportPart(value: string | undefined, fallback: string): string {
  return value?.replace(/[\s/\\:*?"<>|]+/g, '_') || fallback;
}

export function getExportFilename(draft: ESDraft, extension: 'md' | 'pdf'): string {
  const company = sanitizeExportPart(draft.companyName, '');
  const title = sanitizeExportPart(draft.title, 'ES');
  return company ? `ES_${company}_${title}.${extension}` : `ES_${title}.${extension}`;
}
