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
  record,
  regex,
  safeParse,
  string,
  transform,
  trim,
  type InferOutput,
} from 'valibot';
import type { ESDraft, ESQuestionCategory } from '../types';

const MAX_ID_LENGTH = 128;
const MAX_TEXT_LENGTH = 20_000;

const DraftIdSchema = pipe(
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

const ExportFilenamePartSchema = pipe(
  string(),
  trim(),
  transform((value) => value.replace(/[\s/\\:*?"<>|]+/g, '_')),
  maxLength(80),
);

const SnapshotLabelSchema = pipe(string(), trim(), nonEmpty(), maxLength(200));

const MarkdownYamlStringSchema = pipe(
  string(),
  maxLength(2_000),
  transform((value) =>
    value
      .replaceAll('\\', '\\\\')
      .replaceAll('"', '\\"')
      .replace(/[\r\n]/g, '\\n'),
  ),
);

const SearchQuerySchema = pipe(
  string(),
  trim(),
  maxLength(200),
  transform((value) => value.toLowerCase()),
);

const SearchParamKeySchema = pipe(
  string(),
  minLength(1),
  maxLength(64),
  regex(/^[A-Za-z][A-Za-z0-9_-]*$/),
);
const SearchParamValueSchema = pipe(string(), maxLength(2_000));
const QueryStringSchema = pipe(string(), minLength(1), maxLength(2_000));
const QueryIntegerSchema = pipe(string(), regex(/^-?\d+$/), transform(Number), finite(), integer());

const SearchParamsSchema = record(SearchParamKeySchema, SearchParamValueSchema);
const WorkspaceSearchParamsSchema = object({ id: optional(DraftIdSchema) });

export type ValidatedSearchParams = InferOutput<typeof SearchParamsSchema>;

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

export function parseCategory(value: unknown, fallback: ESQuestionCategory = 'gakuchika') {
  const result = safeParse(CategorySchema, value);
  return result.success ? result.output : fallback;
}

export function parseExportFilenamePart(value: unknown, fallback: string): string {
  const result = safeParse(ExportFilenamePartSchema, value);
  return result.success && result.output ? result.output : fallback;
}

export function parseSnapshotLabel(value: unknown, fallback = '無題のスナップショット'): string {
  const result = safeParse(SnapshotLabelSchema, value);
  return result.success && result.output ? result.output : fallback;
}

export function parseSearchQuery(value: unknown): string {
  const result = safeParse(SearchQuerySchema, value);
  return result.success ? result.output : '';
}

export function parseMarkdownYamlString(value: unknown, fallback = ''): string {
  const result = safeParse(MarkdownYamlStringSchema, value);
  return result.success ? result.output : fallback;
}

export function parseQueryValue(value: unknown, type: 'string'): string | null;
export function parseQueryValue(value: unknown, type: 'number'): number | null;
export function parseQueryValue(value: unknown, type: 'string' | 'number'): string | number | null;
export function parseQueryValue(value: unknown, type: 'string' | 'number'): string | number | null {
  const result = safeParse(type === 'number' ? QueryIntegerSchema : QueryStringSchema, value);
  return result.success ? result.output : null;
}

export function parseSearchParamKey(value: unknown): string | null {
  const result = safeParse(SearchParamKeySchema, value);
  return result.success ? result.output : null;
}

export function parseSearchParamValue(value: unknown): string | null {
  const result = safeParse(SearchParamValueSchema, value);
  return result.success ? result.output : null;
}

function toSearchParamRecord(input: URLSearchParams | string): Record<string, string> {
  const params = typeof input === 'string' ? new URLSearchParams(input) : input;
  return Object.fromEntries(params.entries());
}

export function parseSearchParams(input: URLSearchParams | string): ValidatedSearchParams {
  const result = safeParse(SearchParamsSchema, toSearchParamRecord(input));
  return result.success ? result.output : {};
}

export function parseWorkspaceSearchParams(
  input: URLSearchParams | string,
): InferOutput<typeof WorkspaceSearchParamsSchema> {
  const result = safeParse(WorkspaceSearchParamsSchema, parseSearchParams(input));
  return result.success ? result.output : {};
}

export function withDraftId(input: URLSearchParams | string, id: unknown): URLSearchParams {
  const params = new URLSearchParams(parseSearchParams(input));
  const parsedId = parseDraftId(id);

  if (parsedId) {
    params.set('id', parsedId);
  } else {
    params.delete('id');
  }

  return params;
}

export function pathWithDraftId(path: string, id: unknown): string {
  const query = withDraftId('', id).toString();
  return query ? `${path}?${query}` : path;
}
