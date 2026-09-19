import { maxLength, nonEmpty, pipe, safeParse, string, trim } from 'valibot';
import type { DraftProgressStatus, ESDraft, ESQuestionCategory } from '@entities/draft/model/types';
import {
  DraftCollectionSchema,
  DraftIdSchema,
  DraftProgressStatusSchema,
  ESDraftSchema,
  ESQuestionCategorySchema,
} from '@entities/draft/model/schemas';

export { DraftIdSchema } from '@entities/draft/model/schemas';

const SnapshotLabelSchema = pipe(string(), trim(), nonEmpty(), maxLength(200));

export function parseDraft(value: unknown): ESDraft | null {
  const result = safeParse(ESDraftSchema, value);
  return result.success ? result.output : null;
}

export function parseDraftId(value: unknown): string | null {
  const result = safeParse(DraftIdSchema, value);
  return result.success ? result.output : null;
}

export function parseDraftCollection(value: unknown): ESDraft[] | null {
  const result = safeParse(DraftCollectionSchema, value);
  return result.success ? result.output : null;
}

export function parseOptionalCategory(value: unknown): ESQuestionCategory | null {
  if (value === '' || value === null || value === undefined) return null;
  const result = safeParse(ESQuestionCategorySchema, value);
  return result.success ? result.output : null;
}

export function parseProgressStatus(value: unknown): DraftProgressStatus | null {
  if (value === '' || value === null || value === undefined) return null;
  const result = safeParse(DraftProgressStatusSchema, value);
  return result.success ? result.output : null;
}

export function parseSnapshotLabel(value: unknown, fallback = '無題のスナップショット'): string {
  const result = safeParse(SnapshotLabelSchema, value);
  return result.success && result.output ? result.output : fallback;
}
