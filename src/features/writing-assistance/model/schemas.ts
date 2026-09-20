import { finite, nullable, number, optional, pipe, picklist, strictObject, string } from 'valibot';

const finiteNumber = pipe(number(), finite());

export const JapaneseMetricsSchema = strictObject({
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

export const AuditCheckSchema = strictObject({
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

export const RatioBlockSchema = strictObject({
  name: string(),
  idealRatio: finiteNumber,
  idealChars: finiteNumber,
  actualChars: finiteNumber,
  actualRatio: finiteNumber,
  status: picklist(['perfect', 'short', 'long', 'empty'] as const),
  feedback: string(),
});

export const RatioBalanceSchema = strictObject({
  totalActualChars: finiteNumber,
  targetChars: nullable(finiteNumber),
  profileLabel: string(),
  blocks: strictObject({
    conclusion: RatioBlockSchema,
    situation: RatioBlockSchema,
    action: RatioBlockSchema,
    resultAndContribution: RatioBlockSchema,
  }),
  overallAdvice: string(),
});

export const RedundancyMatchSchema = strictObject({
  id: string(),
  startIndex: finiteNumber,
  endIndex: finiteNumber,
  original: string(),
  suggested: string(),
  charsSaved: finiteNumber,
  label: string(),
});
