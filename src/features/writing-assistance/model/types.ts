import type { InferOutput } from 'valibot';
import {
  AuditCheckSchema,
  JapaneseMetricsSchema,
  RatioBalanceSchema,
  RatioBlockSchema,
  RedundancyMatchSchema,
} from './schemas';

export type JapaneseMetrics = InferOutput<typeof JapaneseMetricsSchema>;
export type AuditCheck = InferOutput<typeof AuditCheckSchema>;
export type BlockTarget = InferOutput<typeof RatioBlockSchema>;
export type RatioBalanceResult = InferOutput<typeof RatioBalanceSchema>;
export type RedundancyMatch = InferOutput<typeof RedundancyMatchSchema>;

export type WritingPhase = 'conclusion' | 'situation' | 'action' | 'result' | 'contribution';

export type WritingProfile = {
  label: string;
  ratioLabels: readonly [string, string, string, string];
  ratios: readonly [number, number, number, number];
  phases: Record<
    WritingPhase,
    { label: string; question: string; tabSuggestion: string; explanation: string }
  >;
};

export interface GhostGuidance {
  phase: WritingPhase;
  phaseLabel: string;
  question: string;
  tabSuggestion: string;
  explanation: string;
}
