'use client';

import React from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { StarStructureEditor } from './StarStructureEditor';
import { useDraftActions, useDraftData } from '../context/DraftContext';
import { StarBlocks } from '../types';
import { pathWithDraftId } from '../validation/schemas';

interface StructurePageClientProps {
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
  starGuideSlot?: React.ReactNode;
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

export function StructurePageClient({
  brandSlot,
  linksSlot,
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
  starGuideSlot,
}: StructurePageClientProps) {
  const { activeDraft } = useDraftData();
  const { updateDraft } = useDraftActions();

  const blocks: StarBlocks = activeDraft?.starBlocks || DEFAULT_STAR_BLOCKS;
  const hasUnapplied = Boolean(activeDraft && buildStarContent(blocks) !== activeDraft.content);

  // 各ブロックの変更
  const handleBlockChange = (field: keyof StarBlocks, value: string) => {
    if (!activeDraft) return;
    const nextBlocks = { ...(activeDraft.starBlocks || DEFAULT_STAR_BLOCKS), [field]: value };
    updateDraft({ ...activeDraft, starBlocks: nextBlocks, updatedAt: Date.now() });
  };

  // ブロックから本文を合成して反映
  const handleApplyBlocksToContent = () => {
    if (!activeDraft) return;
    const current = activeDraft.starBlocks || DEFAULT_STAR_BLOCKS;
    const generated = buildStarContent(current);
    updateDraft(
      {
        ...activeDraft,
        content: generated,
        isBlockMode: false,
        updatedAt: Date.now(),
      },
      true,
    );
  };

  // 執筆モードへ遷移（SPAソフトナビゲーション）
  const handleSwitchToWriteMode = () => {
    const targetUrl = pathWithDraftId('/', activeDraft?.id);
    if (typeof window !== 'undefined') {
      if ('navigation' in window && typeof (window as any).navigation?.navigate === 'function') {
        (window as any).navigation.navigate(targetUrl);
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  return (
    <WorkspaceLayout
      activeMode="structure"
      brandSlot={brandSlot}
      linksSlot={linksSlot}
      handbookSlot={handbookSlot}
      guidelinesSlot={guidelinesSlot}
      sidebarFooterSlot={sidebarFooterSlot}
      emptyDraftGuideSlot={emptyDraftGuideSlot}
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <StarStructureEditor
          currentStarBlocks={blocks}
          onBlockChange={handleBlockChange}
          onSwitchToWriteMode={handleSwitchToWriteMode}
          onApplyBlocksToContent={handleApplyBlocksToContent}
          hasUnappliedChanges={hasUnapplied}
          starGuideSlot={starGuideSlot}
        />
      </div>
    </WorkspaceLayout>
  );
}
