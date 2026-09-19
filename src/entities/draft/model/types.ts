import type { InferOutput } from 'valibot';
import type {
  DraftProgressStatusSchema,
  DraftSnapshotSchema,
  ESDraftSchema,
  ESQuestionCategorySchema,
  StarBlocksSchema,
} from '@entities/draft/model/schemas';

export type ESQuestionCategory = InferOutput<typeof ESQuestionCategorySchema>;
export type DraftProgressStatus = InferOutput<typeof DraftProgressStatusSchema>;

export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type StarBlocks = InferOutput<typeof StarBlocksSchema>;
export type DraftSnapshot = InferOutput<typeof DraftSnapshotSchema>;
export type ESDraft = InferOutput<typeof ESDraftSchema>;
