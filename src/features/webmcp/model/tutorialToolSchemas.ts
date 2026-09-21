import {
  boolean,
  finite,
  literal,
  nullable,
  number,
  optional,
  picklist,
  pipe,
  string,
  strictObject,
  union,
  type InferOutput,
} from 'valibot';
import { parseSchema } from '@shared/validation/parse';

const TutorialStageSchema = picklist(['first-use', 'writing', 'review', 'sync'] as const);
const TutorialExampleSchema = picklist(['gakuchika'] as const);
const TutorialInsertModeSchema = picklist(['replace_empty', 'append'] as const);
const DraftIdSchema = string();

const GuideOutputSchema = strictObject({
  ok: literal(true),
  topic: string(),
  stage: nullable(TutorialStageSchema),
  contentType: literal('text/markdown'),
  source: string(),
  markdown: string(),
});

const FailureSchema = strictObject({
  ok: literal(false),
  error: strictObject({ code: string(), message: string() }),
});

const TutorialOutputSchema = strictObject({
  ok: literal(true),
  draftId: string(),
  exampleId: TutorialExampleSchema,
  mode: TutorialInsertModeSchema,
  insertedText: string(),
  contentDigest: string(),
  charsNoWhitespace: pipe(number(), finite()),
});

const TutorialGuideResultSchema = union([FailureSchema, GuideOutputSchema]);
const TutorialExampleResultSchema = union([FailureSchema, TutorialOutputSchema]);

export const tutorialStageInputSchema = {
  type: 'object',
  properties: {
    stage: {
      type: 'string',
      enum: ['first-use', 'writing', 'review', 'sync'],
      description: '取得したいチュートリアルの段階。省略時は初回利用です。',
    },
  },
  additionalProperties: false,
} as const;

export const cloudGuideInputSchema = {
  type: 'object',
  additionalProperties: false,
} as const;

export const tutorialExampleInputSchema = {
  type: 'object',
  properties: {
    exampleId: {
      type: 'string',
      enum: ['gakuchika'],
      description: '入力する例文の種類です。',
    },
    mode: {
      type: 'string',
      enum: ['replace_empty', 'append'],
      description: '空欄への入力か、既存本文への追加かを指定します。',
    },
    confirm: {
      type: 'boolean',
      description: 'ユーザーが入力操作を明示的に確認した場合だけtrueにします。',
    },
    draftId: {
      type: 'string',
      minLength: 1,
      maxLength: 128,
      description: '対象の下書きID。省略時は現在の下書きです。',
    },
  },
  required: ['exampleId', 'mode', 'confirm'],
  additionalProperties: false,
} as const;

export type TutorialStage = InferOutput<typeof TutorialStageSchema>;
export type TutorialGuideOutput = InferOutput<typeof TutorialGuideResultSchema>;
export type TutorialFailure = InferOutput<typeof FailureSchema>;
export type TutorialExampleOutput = InferOutput<typeof TutorialExampleResultSchema>;

const TutorialStageInputSchema = strictObject({ stage: optional(TutorialStageSchema) });
const CloudGuideInputSchema = strictObject({});
const TutorialExampleInputSchema = strictObject({
  exampleId: TutorialExampleSchema,
  mode: TutorialInsertModeSchema,
  confirm: boolean(),
  draftId: optional(DraftIdSchema),
});

export type TutorialStageInput = InferOutput<typeof TutorialStageInputSchema>;
export type TutorialExampleInput = InferOutput<typeof TutorialExampleInputSchema>;

export function parseTutorialStageInput(value: unknown): TutorialStageInput | null {
  return parseSchema(TutorialStageInputSchema, value);
}

export function parseCloudGuideInput(value: unknown): Record<string, never> | null {
  return parseSchema(CloudGuideInputSchema, value);
}

export function parseTutorialExampleInput(value: unknown): TutorialExampleInput | null {
  return parseSchema(TutorialExampleInputSchema, value);
}

export function parseTutorialGuideOutput(value: unknown): TutorialGuideOutput | null {
  return parseSchema(TutorialGuideResultSchema, value);
}

export function parseTutorialExampleOutput(value: unknown): TutorialExampleOutput | null {
  return parseSchema(TutorialExampleResultSchema, value);
}
