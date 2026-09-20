import { maxLength, pipe, string, transform, trim } from 'valibot';
import { parseSchema, parseSchemaOr } from '@shared/validation/parse';

const ExportFilenamePartSchema = pipe(
  string(),
  trim(),
  transform((value) => value.replace(/[\s/\\:*?"<>|]+/g, '_')),
  maxLength(80),
);

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

export function parseExportFilenamePart(value: unknown, fallback: string): string {
  const parsed = parseSchema(ExportFilenamePartSchema, value);
  return parsed || fallback;
}

export function parseMarkdownYamlString(value: unknown, fallback = ''): string {
  return parseSchemaOr(MarkdownYamlStringSchema, value, fallback);
}
