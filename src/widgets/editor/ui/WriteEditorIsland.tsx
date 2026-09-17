'use client';

import { useDeferredValue, lazy, Suspense } from 'react';
import { RatioBalanceMeter } from '@widgets/editor/ui/RatioBalanceMeter';
import { WriteWorkspace } from '@widgets/editor/ui/WriteWorkspace';
import { draftActions, useActiveDraft } from '@entities/draft/model/draftStore';
import { calculateMetrics } from '@features/writing-assistance/lib/analyzer';
import { calculateRatioBalance } from '@features/writing-assistance/lib/ratioBalance';
import {
  detectRedundancies,
  applySculpt,
  applyAllSculpts,
  type RedundancyMatch,
} from '@features/writing-assistance/lib/sculptor';

// 削りツールバーは必要な時だけ遅延読み込み
const LazyChiselToolbar = lazy(() =>
  import('@widgets/editor/ui/ChiselToolbar').then((m) => ({ default: m.ChiselToolbar })),
);

/**
 * Owns only write-mode interaction. The workspace shell and all static RSC
 * slots stay outside this client island.
 */
export function WriteEditorIsland() {
  const activeDraft = useActiveDraft();
  const { updateActiveDraft } = draftActions;

  const content = activeDraft?.content || '';
  const deferredContent = useDeferredValue(content);

  // 日本語メトリクス計算
  const metrics = calculateMetrics(deferredContent);

  // 黄金比バランス計算
  const ratioBalance = calculateRatioBalance(deferredContent, activeDraft?.targetCount || 400);

  // 冗長表現削り候補
  const redundancyMatches = detectRedundancies(deferredContent);

  const totalSavedChars = redundancyMatches.reduce((acc, match) => acc + match.charsSaved, 0);

  // 本文コミットハンドラ
  function handleContentCommit(newContent: string, _newPos: number) {
    if (!activeDraft) return;
    updateActiveDraft({ content: newContent }, { updatedAt: Date.now() });
  }

  // 書式整理（連続改行のトリムなど）
  function handleCleanFormatting() {
    if (!activeDraft) return;
    const cleaned = activeDraft.content
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    updateActiveDraft({ content: cleaned }, { updatedAt: Date.now(), immediate: true });
  }

  // 1箇所の削りを適用
  function handleApplyOneChisel(match: RedundancyMatch) {
    if (!activeDraft) return;
    const nextContent = applySculpt(activeDraft.content, match);
    updateActiveDraft({ content: nextContent }, { updatedAt: Date.now(), immediate: true });
  }

  // 全ての削りを一括適用
  function handleApplyAllChisel() {
    if (!activeDraft) return;
    const { newText } = applyAllSculpts(activeDraft.content);
    updateActiveDraft({ content: newText }, { updatedAt: Date.now(), immediate: true });
  }

  if (!activeDraft) return null;

  return (
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
  );
}
