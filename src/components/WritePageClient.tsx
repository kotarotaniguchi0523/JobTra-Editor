'use client';

import React, { useCallback, useDeferredValue, useMemo, lazy, Suspense } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { WriteWorkspace } from './WriteWorkspace';
import { RatioBalanceMeter } from './RatioBalanceMeter';
import { useDraftActions, useDraftData } from '../context/DraftContext';
import { calculateMetrics } from '../services/analyzer';
import { calculateRatioBalance } from '../services/ratioBalance';
import {
  detectRedundancies,
  applySculpt,
  applyAllSculpts,
  RedundancyMatch,
} from '../services/sculptor';

// 削りツールバーは必要な時だけ遅延読み込み
const LazyChiselToolbar = lazy(() =>
  import('./ChiselToolbar').then((m) => ({ default: m.ChiselToolbar })),
);

interface WritePageClientProps {
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
}

export function WritePageClient({
  brandSlot,
  linksSlot,
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
}: WritePageClientProps) {
  const { activeDraft } = useDraftData();
  const { updateDraft } = useDraftActions();

  const content = activeDraft?.content || '';
  const deferredContent = useDeferredValue(content);

  // 日本語メトリクス計算
  const metrics = useMemo(() => {
    return calculateMetrics(deferredContent);
  }, [deferredContent]);

  // 黄金比バランス計算
  const ratioBalance = useMemo(() => {
    return calculateRatioBalance(deferredContent, activeDraft?.targetCount || 400);
  }, [deferredContent, activeDraft?.targetCount]);

  // 冗長表現削り候補
  const redundancyMatches = useMemo(() => {
    return detectRedundancies(deferredContent);
  }, [deferredContent]);

  const totalSavedChars = redundancyMatches.reduce((acc, m) => acc + m.charsSaved, 0);

  // 本文コミットハンドラ
  const handleContentCommit = useCallback(
    (newContent: string, _newPos: number) => {
      if (!activeDraft) return;
      updateDraft({ ...activeDraft, content: newContent, updatedAt: Date.now() });
    },
    [activeDraft, updateDraft],
  );

  // 書式整理（連続改行のトリムなど）
  const handleCleanFormatting = useCallback(() => {
    if (!activeDraft) return;
    const cleaned = activeDraft.content
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    updateDraft({ ...activeDraft, content: cleaned, updatedAt: Date.now() }, true);
  }, [activeDraft, updateDraft]);

  // 1箇所の削りを適用
  const handleApplyOneChisel = useCallback(
    (match: RedundancyMatch) => {
      if (!activeDraft) return;
      const nextContent = applySculpt(activeDraft.content, match);
      updateDraft({ ...activeDraft, content: nextContent, updatedAt: Date.now() }, true);
    },
    [activeDraft, updateDraft],
  );

  // 全ての削りを一括適用
  const handleApplyAllChisel = useCallback(() => {
    if (!activeDraft) return;
    const { newText } = applyAllSculpts(activeDraft.content);
    updateDraft({ ...activeDraft, content: newText, updatedAt: Date.now() }, true);
  }, [activeDraft, updateDraft]);

  return (
    <WorkspaceLayout
      activeMode="write"
      brandSlot={brandSlot}
      linksSlot={linksSlot}
      handbookSlot={handbookSlot}
      guidelinesSlot={guidelinesSlot}
      sidebarFooterSlot={sidebarFooterSlot}
      emptyDraftGuideSlot={emptyDraftGuideSlot}
    >
      <div className="mx-auto max-w-4xl space-y-3">
        {/* 1. 漢字・ひらがな黄金比率メーター */}
        <RatioBalanceMeter balance={ratioBalance} />

        {/* 2. 削りツールバー（候補があるときだけ遅延読み込みで表示） */}
        {redundancyMatches.length > 0 && (
          <Suspense fallback={<div className="h-10 animate-pulse rounded bg-amber-50/50" />}>
            <LazyChiselToolbar
              matches={redundancyMatches}
              onApplyOne={handleApplyOneChisel}
              onApplyAll={handleApplyAllChisel}
              totalSaved={totalSavedChars}
            />
          </Suspense>
        )}

        {/* 3. メインエディタエリア */}
        <WriteWorkspace
          content={content}
          metrics={metrics}
          deferredContent={deferredContent}
          onCleanFormatting={handleCleanFormatting}
          onContentCommit={handleContentCommit}
        />
      </div>
    </WorkspaceLayout>
  );
}
