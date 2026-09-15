"use client";

import React, { useState, useCallback } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { StarStructureEditor } from './StarStructureEditor';
import { useDrafts } from '../context/DraftContext';
import { StarBlocks } from '../types';

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

export function StructurePageClient({
  brandSlot,
  linksSlot,
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
  starGuideSlot,
}: StructurePageClientProps) {
  const { activeDraft, updateDraft } = useDrafts();

  const blocks: StarBlocks = activeDraft?.starBlocks || DEFAULT_STAR_BLOCKS;
  const [hasUnapplied, setHasUnapplied] = useState(false);

  // 各ブロックの変更
  const handleBlockChange = useCallback((field: keyof StarBlocks, value: string) => {
    if (!activeDraft) return;
    const nextBlocks = {
      ...(activeDraft.starBlocks || DEFAULT_STAR_BLOCKS),
      [field]: value,
    };
    setHasUnapplied(true);
    updateDraft({
      ...activeDraft,
      starBlocks: nextBlocks,
      updatedAt: Date.now(),
    });
  }, [activeDraft, updateDraft]);

  // ブロックから本文を合成して反映
  const handleApplyBlocksToContent = useCallback(() => {
    if (!activeDraft) return;
    const current = activeDraft.starBlocks || DEFAULT_STAR_BLOCKS;
    const parts = [
      current.conclusion && `【結論】\n${current.conclusion}`,
      current.situation && `【状況・課題】\n${current.situation}`,
      current.action && `【独自の行動・工夫】\n${current.action}`,
      current.result && `【成果・学び】\n${current.result}`,
      current.contribution && `【企業への貢献】\n${current.contribution}`,
    ].filter(Boolean);

    const generated = parts.join('\n\n');
    updateDraft(
      {
        ...activeDraft,
        content: generated,
        isBlockMode: false,
        updatedAt: Date.now(),
      },
      true
    );
    setHasUnapplied(false);
  }, [activeDraft, updateDraft]);

  // 執筆モードへ遷移（SPAソフトナビゲーション）
  const handleSwitchToWriteMode = useCallback(() => {
    handleApplyBlocksToContent();
    const targetUrl = `/?id=${activeDraft?.id || ''}`;
    if (typeof window !== 'undefined') {
      if ('navigation' in window && typeof (window as any).navigation?.navigate === 'function') {
        (window as any).navigation.navigate(targetUrl);
      } else {
        window.location.href = targetUrl;
      }
    }
  }, [activeDraft, handleApplyBlocksToContent]);

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
      <div className="max-w-4xl mx-auto space-y-4">
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
