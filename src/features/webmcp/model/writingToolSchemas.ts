import {
  array,
  boolean,
  finite,
  literal,
  nullable,
  number,
  optional,
  picklist,
  pipe,
  safeParse,
  string,
  strictObject,
  union,
  type InferOutput,
} from 'valibot';
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

const finiteNumber = pipe(number(), finite());
const categorySchema = picklist([
  'gakuchika',
  'shibou',
  'pr',
  'zasetsu',
  'jiku',
  'future',
  'custom',
] as const);
const starFieldSchema = picklist([
  'conclusion',
  'situation',
  'action',
  'result',
  'contribution',
] as const);

const ToolFailureSchema = strictObject({
  ok: literal(false),
  error: strictObject({
    code: string(),
    message: string(),
  }),
});

const DraftSummarySchema = strictObject({
  id: string(),
  title: string(),
  companyName: string(),
  category: categorySchema,
  targetCount: finiteNumber,
  updatedAt: finiteNumber,
  charsNoWhitespace: finiteNumber,
});

const StarBlocksSchema = strictObject({
  conclusion: string(),
  situation: string(),
  action: string(),
  result: string(),
  contribution: string(),
});

const SelectionSchema = strictObject({
  start: finiteNumber,
  end: finiteNumber,
  text: string(),
  textTruncated: boolean(),
  before: string(),
  after: string(),
});

const CurrentWritingContextOutputSchema = strictObject({
  ok: literal(true),
  scope: literal('current'),
  draft: DraftSummarySchema,
  contentDigest: string(),
  content: string(),
  contentTruncated: boolean(),
  starBlocks: nullable(StarBlocksSchema),
  starBlocksTruncated: array(starFieldSchema),
  selection: nullable(SelectionSchema),
});

const SelectionWritingContextOutputSchema = strictObject({
  ok: literal(true),
  scope: literal('selection'),
  draft: DraftSummarySchema,
  contentDigest: string(),
  selection: SelectionSchema,
});

const StarWritingContextOutputSchema = strictObject({
  ok: literal(true),
  scope: literal('star'),
  draft: DraftSummarySchema,
  contentDigest: string(),
  isBlockMode: boolean(),
  starBlocks: nullable(StarBlocksSchema),
  starBlocksTruncated: array(starFieldSchema),
});

const SnapshotSummarySchema = strictObject({
  id: string(),
  label: string(),
  timestamp: finiteNumber,
  charsNoWhitespace: finiteNumber,
});

const SnapshotWritingContextOutputSchema = strictObject({
  ok: literal(true),
  scope: literal('snapshot'),
  draft: DraftSummarySchema,
  snapshot: SnapshotSummarySchema,
  contentDigest: string(),
  content: string(),
  contentTruncated: boolean(),
});

const GetWritingContextOutputSchema = union([
  ToolFailureSchema,
  CurrentWritingContextOutputSchema,
  SelectionWritingContextOutputSchema,
  StarWritingContextOutputSchema,
  SnapshotWritingContextOutputSchema,
]);

const JapaneseMetricsSchema = strictObject({
  totalChars: finiteNumber,
  charsNoWhitespace: finiteNumber,
  linesCount: finiteNumber,
  sentenceCount: finiteNumber,
  avgSentenceLength: finiteNumber,
  kanjiCount: finiteNumber,
  hiraganaCount: finiteNumber,
  katakanaCount: finiteNumber,
  kanjiRatio: finiteNumber,
  longestSentenceLength: finiteNumber,
});

const AuditCheckSchema = strictObject({
  id: string(),
  title: string(),
  status: picklist(['pass', 'warning', 'info'] as const),
  message: string(),
  detail: optional(string()),
  replacement: optional(
    strictObject({
      original: string(),
      suggested: string(),
    }),
  ),
});

const RatioBlockSchema = strictObject({
  name: string(),
  idealRatio: finiteNumber,
  idealChars: finiteNumber,
  actualChars: finiteNumber,
  actualRatio: finiteNumber,
  status: picklist(['perfect', 'short', 'long', 'empty'] as const),
  feedback: string(),
});

const RatioBalanceSchema = strictObject({
  totalActualChars: finiteNumber,
  targetChars: finiteNumber,
  blocks: strictObject({
    conclusion: RatioBlockSchema,
    situation: RatioBlockSchema,
    action: RatioBlockSchema,
    resultAndContribution: RatioBlockSchema,
  }),
  overallAdvice: string(),
});

const RedundancyMatchSchema = strictObject({
  id: string(),
  startIndex: finiteNumber,
  endIndex: finiteNumber,
  original: string(),
  suggested: string(),
  charsSaved: finiteNumber,
  label: string(),
});

const StarStructureSchema = strictObject({
  available: boolean(),
  completedBlocks: array(starFieldSchema),
  missingBlocks: array(starFieldSchema),
});

const AnalyzeWritingOutputSchema = union([
  ToolFailureSchema,
  strictObject({
    ok: literal(true),
    draft: DraftSummarySchema,
    contentDigest: string(),
    metrics: JapaneseMetricsSchema,
    auditChecks: array(AuditCheckSchema),
    ratioBalance: RatioBalanceSchema,
    redundancyMatches: array(RedundancyMatchSchema),
    starStructure: StarStructureSchema,
  }),
]);

const ChangeWindowSchema = strictObject({
  start: finiteNumber,
  before: string(),
  after: string(),
  beforeTruncated: boolean(),
  afterTruncated: boolean(),
});

const VersionContentSchema = strictObject({
  contentDigest: string(),
  charsNoWhitespace: finiteNumber,
  content: string(),
  contentTruncated: boolean(),
});

const CompareWritingVersionsOutputSchema = union([
  ToolFailureSchema,
  strictObject({
    ok: literal(true),
    draft: DraftSummarySchema,
    current: VersionContentSchema,
    snapshot: strictObject({
      id: string(),
      label: string(),
      timestamp: finiteNumber,
      charsNoWhitespace: finiteNumber,
      contentDigest: string(),
      content: string(),
      contentTruncated: boolean(),
    }),
    comparison: strictObject({
      changed: boolean(),
      charsRemoved: finiteNumber,
      charsAdded: finiteNumber,
      changeWindow: nullable(ChangeWindowSchema),
    }),
  }),
]);

export type GetWritingContextOutput = InferOutput<typeof GetWritingContextOutputSchema>;
export type AnalyzeWritingOutput = InferOutput<typeof AnalyzeWritingOutputSchema>;
export type CompareWritingVersionsOutput = InferOutput<typeof CompareWritingVersionsOutputSchema>;

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

/**
 * WebMCP 0.1.8 exposes inputSchema but no outputSchema on ModelContextTool.
 * These parsers therefore enforce the structured JSON output contract at the
 * execute boundary while remaining compatible with the current browser type.
 */
export function parseGetWritingContextOutput(value: unknown): GetWritingContextOutput | null {
  const result = safeParse(GetWritingContextOutputSchema, value);
  return result.success ? result.output : null;
}

export function parseAnalyzeWritingOutput(value: unknown): AnalyzeWritingOutput | null {
  const result = safeParse(AnalyzeWritingOutputSchema, value);
  return result.success ? result.output : null;
}

export function parseCompareWritingVersionsOutput(
  value: unknown,
): CompareWritingVersionsOutput | null {
  const result = safeParse(CompareWritingVersionsOutputSchema, value);
  return result.success ? result.output : null;
}
