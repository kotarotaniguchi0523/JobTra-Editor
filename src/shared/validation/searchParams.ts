import {
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  record,
  regex,
  string,
  transform,
  trim,
  type InferOutput,
} from 'valibot';
import { DraftIdSchema, parseDraftId } from '@shared/validation/draftSchemas';
import { parseSchemaOr } from '@shared/validation/parse';

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
const SearchParamsSchema = record(SearchParamKeySchema, SearchParamValueSchema);
const WorkspaceSearchParamsSchema = object({ id: optional(DraftIdSchema) });

export function parseSearchQuery(value: unknown): string {
  return parseSchemaOr(SearchQuerySchema, value, '');
}

function toSearchParamRecord(input: URLSearchParams | string): Record<string, string> {
  const params = typeof input === 'string' ? new URLSearchParams(input) : input;
  return Object.fromEntries(params.entries());
}

function parseSearchParams(
  input: URLSearchParams | string,
): InferOutput<typeof SearchParamsSchema> {
  return parseSchemaOr(SearchParamsSchema, toSearchParamRecord(input), {});
}

export function parseWorkspaceSearchParams(
  input: URLSearchParams | string,
): InferOutput<typeof WorkspaceSearchParamsSchema> {
  return parseSchemaOr(WorkspaceSearchParamsSchema, parseSearchParams(input), {});
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
