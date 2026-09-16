import {
  array,
  boolean,
  finite,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  nonEmpty,
  object,
  optional,
  picklist,
  pipe,
  regex,
  safeParse,
  string,
  trim,
} from 'valibot';
import type { ESDraft, ESQuestionCategory } from '@entities/draft/model/types';

const MAX_ID_LENGTH = 128;
const MAX_TEXT_LENGTH = 20_000;

export const DraftIdSchema = pipe(
  string(),
  minLength(1),
  maxLength(MAX_ID_LENGTH),
  regex(/^[A-Za-z0-9_-]+$/),
);

const CategorySchema = picklist([
  'gakuchika',
  'shibou',
  'pr',
  'zasetsu',
  'jiku',
  'future',
  'custom',
] as const);

const TextSchema = pipe(string(), maxLength(MAX_TEXT_LENGTH));
const TimestampSchema = pipe(number(), finite(), integer(), minValue(0));
const TargetCountSchema = pipe(number(), finite(), integer(), minValue(1), maxValue(10_000));

const StarBlocksSchema = object({
  conclusion: TextSchema,
  situation: TextSchema,
  action: TextSchema,
  result: TextSchema,
  contribution: TextSchema,
});

const DraftSnapshotSchema = object({
  id: DraftIdSchema,
  label: pipe(string(), maxLength(200)),
  content: TextSchema,
  charCount: pipe(number(), finite(), integer(), minValue(0)),
  timestamp: TimestampSchema,
});

const ESDraftSchema = object({
  id: DraftIdSchema,
  title: TextSchema,
  companyName: TextSchema,
  category: CategorySchema,
  content: TextSchema,
  starBlocks: optional(StarBlocksSchema),
  isBlockMode: boolean(),
  targetCount: TargetCountSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  tags: array(pipe(string(), maxLength(100))),
  starred: optional(boolean()),
  snapshots: optional(array(DraftSnapshotSchema)),
});

const DraftCollectionSchema = array(ESDraftSchema);
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

export function parseCategory(
  value: unknown,
  fallback: ESQuestionCategory = 'gakuchika',
): ESQuestionCategory {
  const result = safeParse(CategorySchema, value);
  return result.success ? result.output : fallback;
}

export function parseSnapshotLabel(value: unknown, fallback = '無題のスナップショット'): string {
  const result = safeParse(SnapshotLabelSchema, value);
  return result.success && result.output ? result.output : fallback;
}
