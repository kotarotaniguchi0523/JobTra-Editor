'use client';

import type { ReactNode } from 'react';
import { StarStructureEditor } from '@widgets/structure/ui/StarStructureEditor';
import { draftActions, draftStore, useActiveDraft } from '@entities/draft/model/draftStore';
import type { StarBlocks } from '@entities/draft/model/types';
import { pathWithDraftId } from '@shared/validation/searchParams';

interface StructureIslandProps {
  starGuideSlot?: ReactNode;
}

const DEFAULT_STAR_BLOCKS: StarBlocks = {
  conclusion: '',
  situation: '',
  action: '',
  result: '',
  contribution: '',
};

function buildStarContent(blocks: StarBlocks): string {
  return [
    blocks.conclusion && `【結論】\n${blocks.conclusion}`,
    blocks.situation && `【状況・課題】\n${blocks.situation}`,
    blocks.action && `【独自の行動・工夫】\n${blocks.action}`,
    blocks.result && `【成果・学び】\n${blocks.result}`,
    blocks.contribution && `【企業への貢献】\n${blocks.contribution}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/** Owns STAR block editing and its browser navigation affordance. */
export function StructureIsland({ starGuideSlot }: StructureIslandProps) {
  const activeDraft = useActiveDraft();
  const { updateActiveDraft } = draftActions;

  const blocks: StarBlocks = activeDraft?.starBlocks || DEFAULT_STAR_BLOCKS;
  const hasUnapplied = Boolean(activeDraft && buildStarContent(blocks) !== activeDraft.content);

  // 各ブロックの変更
  function handleBlockChange(field: keyof StarBlocks, value: string) {
    if (!activeDraft) return;
    const currentDraft =
      draftStore.getState().drafts.find((draft) => draft.id === activeDraft.id) ?? activeDraft;
    const nextBlocks = { ...(currentDraft.starBlocks || DEFAULT_STAR_BLOCKS), [field]: value };
    updateActiveDraft({ starBlocks: nextBlocks });
  }

  // ブロックから本文を合成して反映
  function handleApplyBlocksToContent() {
    if (!activeDraft) return;
    const currentDraft =
      draftStore.getState().drafts.find((draft) => draft.id === activeDraft.id) ?? activeDraft;
    const current = currentDraft.starBlocks || DEFAULT_STAR_BLOCKS;
    const generated = buildStarContent(current);
    updateActiveDraft({ content: generated, isBlockMode: false }, true);
  }

  if (!activeDraft) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <StarStructureEditor
        currentStarBlocks={blocks}
        onBlockChange={handleBlockChange}
        writeModeHref={pathWithDraftId('/', activeDraft.id)}
        onApplyBlocksToContent={handleApplyBlocksToContent}
        hasUnappliedChanges={hasUnapplied}
        starGuideSlot={starGuideSlot}
      />
    </div>
  );
}
