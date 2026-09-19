import type { DraftSnapshot, ESDraft } from '@entities/draft/model/types';
import { parseSnapshotLabel } from '@shared/validation/draftSchemas';
import { countNonWhitespaceCharacters } from '@shared/lib/text';

export type DraftUpdateOptions = {
  updatedAt: number;
  immediate?: boolean;
};

export type SnapshotIdentity = {
  id: string;
  timestamp: number;
};

/** Purely derives a new draft; it never changes the input draft. */
export function mergeDraftUpdate(
  draft: ESDraft,
  partial: Partial<ESDraft>,
  updatedAt: number,
): ESDraft {
  return { ...draft, ...partial, updatedAt };
}

/** Purely derives the opposite starred state. */
export function toggleDraftStar(draft: ESDraft, updatedAt: number): ESDraft {
  return { ...draft, starred: !draft.starred, updatedAt };
}

/** Purely creates a snapshot and the corresponding draft version. */
export function createSnapshotDraft(
  draft: ESDraft,
  label: string,
  identity: SnapshotIdentity,
): ESDraft {
  const snapshot: DraftSnapshot = {
    id: identity.id,
    label: parseSnapshotLabel(label),
    content: draft.content,
    charCount: countNonWhitespaceCharacters(draft.content),
    timestamp: identity.timestamp,
  };

  return {
    ...draft,
    snapshots: [snapshot, ...(draft.snapshots ?? [])],
    updatedAt: identity.timestamp,
  };
}

/** Purely restores content from a snapshot. */
export function restoreSnapshotDraft(
  draft: ESDraft,
  snapshot: DraftSnapshot,
  updatedAt: number,
): ESDraft {
  return { ...draft, content: snapshot.content, updatedAt };
}
