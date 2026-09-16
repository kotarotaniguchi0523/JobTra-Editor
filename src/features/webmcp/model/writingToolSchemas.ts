import { optional, picklist, safeParse, strictObject, type InferOutput } from 'valibot';
import { DraftIdSchema } from '@shared/validation/draftSchemas';

const WritingScopeSchema = picklist(['current', 'selection', 'star', 'snapshot'] as const);

const GetWritingContextInputSchema = strictObject({
  draftId: optional(DraftIdSchema),
  scope: optional(WritingScopeSchema),
  snapshotId: optional(DraftIdSchema),
});

const AnalyzeWritingInputSchema = strictObject({
  draftId: optional(DraftIdSchema),
});

const CompareWritingVersionsInputSchema = strictObject({
  draftId: optional(DraftIdSchema),
  snapshotId: DraftIdSchema,
});

export type GetWritingContextInput = InferOutput<typeof GetWritingContextInputSchema>;
export type AnalyzeWritingInput = InferOutput<typeof AnalyzeWritingInputSchema>;
export type CompareWritingVersionsInput = InferOutput<typeof CompareWritingVersionsInputSchema>;

export function parseGetWritingContextInput(value: unknown): GetWritingContextInput | null {
  const result = safeParse(GetWritingContextInputSchema, value);
  return result.success ? result.output : null;
}

export function parseAnalyzeWritingInput(value: unknown): AnalyzeWritingInput | null {
  const result = safeParse(AnalyzeWritingInputSchema, value);
  return result.success ? result.output : null;
}

export function parseCompareWritingVersionsInput(
  value: unknown,
): CompareWritingVersionsInput | null {
  const result = safeParse(CompareWritingVersionsInputSchema, value);
  return result.success ? result.output : null;
}
