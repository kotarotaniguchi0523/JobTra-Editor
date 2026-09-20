import { maxLength, nonEmpty, pipe, string, trim } from 'valibot';
import type { DraftProgressStatus, ESDraft, ESQuestionCategory } from '@entities/draft/model/types';
import {
  DraftCollectionSchema,
  DraftIdSchema,
  DraftProgressStatusSchema,
  ESDraftSchema,
  ESQuestionCategorySchema,
} from '@entities/draft/model/schemas';
import { parseSchema, parseSchemaOr } from './parse';

export { DraftIdSchema } from '@entities/draft/model/schemas';

const SnapshotLabelSchema = pipe(string(), trim(), nonEmpty(), maxLength(200));

export function parseDraft(value: unknown): ESDraft | null {
  return parseSchema(ESDraftSchema, value);
}

export function parseDraftId(value: unknown): string | null {
  return parseSchema(DraftIdSchema, value);
}

export function parseDraftCollection(value: unknown): ESDraft[] | null {
  return parseSchema(DraftCollectionSchema, value);
}

export function parseOptionalCategory(value: unknown): ESQuestionCategory | null {
  if (value === '' || value === null || value === undefined) return null;
  return parseSchema(ESQuestionCategorySchema, value);
}

export function parseProgressStatus(value: unknown): DraftProgressStatus | null {
  if (value === '' || value === null || value === undefined) return null;
  return parseSchema(DraftProgressStatusSchema, value);
}

export function parseSnapshotLabel(value: unknown, fallback = '無題のスナップショット'): string {
  return parseSchemaOr(SnapshotLabelSchema, value, fallback);
}
