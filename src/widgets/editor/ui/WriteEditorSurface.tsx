import React, { useState } from 'react';
import type { JapaneseMetrics } from '@features/writing-assistance/model/types';
import type { ESQuestionCategory } from '@entities/draft/model/types';
import { analyzeGhostContext } from '@features/writing-assistance/lib/ghostGuidance';
import { DeferredGhostGuidance } from '@widgets/editor/ui/DeferredGhostGuidance';
import { DeferredTextarea } from '@widgets/editor/ui/DeferredTextarea';
import { FocusSentenceDisplay } from '@widgets/editor/ui/FocusSentenceDisplay';

interface WriteEditorSurfaceProps {
  content: string;
  metrics: JapaneseMetrics;
  deferredContent: string;
  category: ESQuestionCategory | null;
  isFocusSentenceEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  onContentCommit: (value: string, cursorPos: number) => void;
}

export function WriteEditorSurface({
  content,
  metrics,
  deferredContent,
  category,
  isFocusSentenceEnabled,
  isTypewriterScrollEnabled,
  onContentCommit,
}: WriteEditorSurfaceProps) {
  const [cursorPos, setCursorPos] = useState(0);
  const ghostGuidance = analyzeGhostContext(deferredContent, cursorPos, category);

  function handleContentCommit(nextContent: string, nextCursorPos: number) {
    setCursorPos(nextCursorPos);
    onContentCommit(nextContent, nextCursorPos);
  }

  function handleInsertPhrase(phrase: string) {
    const before = content.slice(0, cursorPos);
    const after = content.slice(cursorPos);
    const nextContent = before + phrase + after;
    const nextCursorPos = cursorPos + phrase.length;
    setCursorPos(nextCursorPos);
    // This is a controlled editor mutation, so it must remain urgent. The
    // expensive metrics/guidance projections already consume deferred text.
    onContentCommit(nextContent, nextCursorPos);
  }

  function handleInsertTabSuggestion() {
    if (ghostGuidance) handleInsertPhrase(ghostGuidance.tabSuggestion);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-500 sm:px-3.5 sm:py-2">
        <span className="font-mono text-xs">
          {metrics.charsNoWhitespace} 字（空白除外） / 全 {metrics.totalChars} 字
        </span>
        <span className="hidden text-xs text-neutral-400 sm:inline">
          Tabキーで伴走フレーズを即時挿入
        </span>
      </div>

      {isFocusSentenceEnabled && (
        <FocusSentenceDisplay content={deferredContent} cursorPos={cursorPos} />
      )}

      <DeferredTextarea
        id="es-body-textarea"
        value={content}
        onChange={handleContentCommit}
        onCursorChange={setCursorPos}
        onInsertTabSuggestion={ghostGuidance ? handleInsertTabSuggestion : undefined}
        isTypewriterScrollEnabled={isTypewriterScrollEnabled}
      />

      {ghostGuidance && (
        <DeferredGhostGuidance guidance={ghostGuidance} onInsertSuggestion={handleInsertPhrase} />
      )}
    </div>
  );
}
