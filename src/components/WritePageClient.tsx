"use client";

import React, { useState, useDeferredValue, useMemo, lazy, Suspense } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { WriteWorkspace } from './WriteWorkspace';
import { RatioBalanceMeter } from './RatioBalanceMeter';
import { useDrafts } from '../context/DraftContext';
import { calculateMetrics } from '../services/analyzer';
import { calculateRatioBalance } from '../services/ratioBalance';
import { detectRedundancies, applySculpt, applyAllSculpts, RedundancyMatch } from '../services/sculptor';

// 削りツールバーは必要な時だけ遅延読み込み
const LazyChiselToolbar = lazy(() =>
  import('./ChiselToolbar').then((m) => ({ default: m.ChiselToolbar }))
);

interface WritePageClientProps {
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
}

export function WritePageClient({
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
}: WritePageClientProps) {
  const { activeDraft, updateDraft } = useDrafts();

  // 単純なローカル状態（リデューサー不使用）
  const [cursorPos, setCursorPos] = useState(0);
  const [isFocusSentenceEnabled, setIsFocusSentenceEnabled] = useState(false);
  const [isTypewriterScrollEnabled, setIsTypewriterScrollEnabled] = useState(false);

  const content = activeDraft?.content || '';
  const deferredContent = useDeferredValue(content);
  const deferredCursorPos = useDeferredValue(cursorPos);

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

  const totalSavedChars = useMemo(() => {
    return redundancyMatches.reduce((acc, m) => acc + m.charsSaved, 0);
  }, [redundancyMatches]);

  // 本文コミットハンドラ
  const handleContentCommit = (newContent: string, newPos: number) => {
    if (!activeDraft) return;
    setCursorPos(newPos);
    updateDraft({ ...activeDraft, content: newContent, updatedAt: Date.now() });
  };

  // 書式整理（連続改行のトリムなど）
  const handleCleanFormatting = () => {
    if (!activeDraft) return;
    const cleaned = activeDraft.content
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    updateDraft({ ...activeDraft, content: cleaned, updatedAt: Date.now() }, true);
  };

  // フレーズ挿入
  const handleInsertPhrase = (phrase: string) => {
    if (!activeDraft) return;
    const before = content.slice(0, cursorPos);
    const after = content.slice(cursorPos);
    const nextContent = before + phrase + after;
    const nextPos = cursorPos + phrase.length;
    setCursorPos(nextPos);
    updateDraft({ ...activeDraft, content: nextContent, updatedAt: Date.now() }, true);
  };

  // 1箇所の削りを適用
  const handleApplyOneChisel = (match: RedundancyMatch) => {
    if (!activeDraft) return;
    const nextContent = applySculpt(activeDraft.content, match);
    updateDraft({ ...activeDraft, content: nextContent, updatedAt: Date.now() }, true);
  };

  // 全ての削りを一括適用
  const handleApplyAllChisel = () => {
    if (!activeDraft) return;
    const { newText } = applyAllSculpts(activeDraft.content);
    updateDraft({ ...activeDraft, content: newText, updatedAt: Date.now() }, true);
  };

  return (
    <WorkspaceLayout
      activeMode="write"
      handbookSlot={handbookSlot}
      guidelinesSlot={guidelinesSlot}
      sidebarFooterSlot={sidebarFooterSlot}
      emptyDraftGuideSlot={emptyDraftGuideSlot}
    >
      <div className="max-w-4xl mx-auto space-y-3">
        {/* 1. 漢字・ひらがな黄金比率メーター */}
        <RatioBalanceMeter balance={ratioBalance} />

        {/* 2. 削りツールバー（候補があるときだけ遅延読み込みで表示） */}
        {redundancyMatches.length > 0 && (
          <Suspense fallback={<div className="h-10 bg-amber-50/50 rounded animate-pulse" />}>
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
          cursorPos={cursorPos}
          isFocusSentenceEnabled={isFocusSentenceEnabled}
          isTypewriterScrollEnabled={isTypewriterScrollEnabled}
          metrics={metrics}
          deferredContent={deferredContent}
          deferredCursorPos={deferredCursorPos}
          onToggleFocusSentence={() => setIsFocusSentenceEnabled(!isFocusSentenceEnabled)}
          onToggleTypewriter={() => setIsTypewriterScrollEnabled(!isTypewriterScrollEnabled)}
          onCleanFormatting={handleCleanFormatting}
          onContentCommit={handleContentCommit}
          onCursorChange={setCursorPos}
          onInsertPhrase={handleInsertPhrase}
        />
      </div>
    </WorkspaceLayout>
  );
}
