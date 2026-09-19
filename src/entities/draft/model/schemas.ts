import {
  array,
  boolean,
  finite,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  regex,
  string,
} from 'valibot';

const MAX_ID_LENGTH = 128;
const MAX_TEXT_LENGTH = 20_000;

export const DraftIdSchema = pipe(
  string(),
  minLength(1),
  maxLength(MAX_ID_LENGTH),
  regex(/^[A-Za-z0-9_-]+$/),
);

export const ESQuestionCategorySchema = picklist([
  'gakuchika',
  'shibou',
  'pr',
  'zasetsu',
  'jiku',
  'future',
  'custom',
] as const);

export const DraftProgressStatusSchema = picklist([
  'not_started',
  'in_progress',
  'paused',
  'completed',
] as const);

const TextSchema = pipe(string(), maxLength(MAX_TEXT_LENGTH));
const TimestampSchema = pipe(number(), finite(), integer(), minValue(0));

export const StarBlocksSchema = object({
  conclusion: TextSchema,
  situation: TextSchema,
  action: TextSchema,
  result: TextSchema,
  contribution: TextSchema,
});

export const DraftSnapshotSchema = object({
  id: DraftIdSchema,
  label: pipe(string(), maxLength(200)),
  content: TextSchema,
  charCount: pipe(number(), finite(), integer(), minValue(0)),
  timestamp: TimestampSchema,
});

export const ESDraftSchema = object({
  id: DraftIdSchema,
  title: TextSchema,
  companyName: TextSchema,
  category: nullable(ESQuestionCategorySchema),
  content: TextSchema,
  starBlocks: optional(StarBlocksSchema),
  isBlockMode: boolean(),
  targetCount: nullable(pipe(number(), finite(), integer(), minValue(1), maxValue(10_000))),
  progressStatus: optional(nullable(DraftProgressStatusSchema), null),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  tags: array(pipe(string(), maxLength(100))),
  starred: optional(boolean()),
  snapshots: optional(array(DraftSnapshotSchema)),
});

export const DraftCollectionSchema = array(ESDraftSchema);
