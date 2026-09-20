import type { DraftSyncConflict } from '../sync/types.js';

export function conflictChoiceKey(conflict: DraftSyncConflict, path: string): string {
  return `${conflict.documentId}:${path}`;
}
