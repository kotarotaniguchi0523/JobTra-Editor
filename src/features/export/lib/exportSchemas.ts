import { maxLength, pipe, safeParse, string, transform, trim } from 'valibot';

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
  const result = safeParse(ExportFilenamePartSchema, value);
  return result.success && result.output ? result.output : fallback;
}

export function parseMarkdownYamlString(value: unknown, fallback = ''): string {
  const result = safeParse(MarkdownYamlStringSchema, value);
  return result.success ? result.output : fallback;
}
