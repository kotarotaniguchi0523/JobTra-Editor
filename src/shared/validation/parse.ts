import { safeParse, type BaseIssue, type BaseSchema, type InferOutput } from 'valibot';

type AnySchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

export function parseSchema<const TSchema extends AnySchema>(
  schema: TSchema,
  value: unknown,
): InferOutput<TSchema> | null {
  const result = safeParse(schema, value);
  return result.success ? result.output : null;
}

export function parseSchemaOr<const TSchema extends AnySchema>(
  schema: TSchema,
  value: unknown,
  fallback: InferOutput<TSchema>,
): InferOutput<TSchema> {
  return parseSchema(schema, value) ?? fallback;
}
