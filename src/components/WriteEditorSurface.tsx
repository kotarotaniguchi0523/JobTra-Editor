import React, { memo, useCallback, useMemo, useState } from 'react';
import { JapaneseMetrics } from '../types';
import { analyzeGhostContext } from '../services/ghostGuidance';
import { DeferredGhostGuidance } from './DeferredGhostGuidance';
import { DeferredTextarea } from './DeferredTextarea';
import { FocusSentenceDisplay } from './FocusSentenceDisplay';

interface WriteEditorSurfaceProps {
  content: string;
  metrics: JapaneseMetrics;
  deferredContent: string;
  isFocusSentenceEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  onContentCommit: (value: string, cursorPos: number) => void;
}

export const WriteEditorSurface: React.FC<WriteEditorSurfaceProps> = memo(
  ({
    content,
    metrics,
    deferredContent,
    isFocusSentenceEnabled,
    isTypewriterScrollEnabled,
    onContentCommit,
  }) => {
    const [cursorPos, setCursorPos] = useState(0);
    const ghostGuidance = useMemo(
      () => analyzeGhostContext(deferredContent, cursorPos),
      [cursorPos, deferredContent],
    );

    const handleContentCommit = useCallback(
      (nextContent: string, nextCursorPos: number) => {
        setCursorPos(nextCursorPos);
        onContentCommit(nextContent, nextCursorPos);
      },
      [onContentCommit],
    );

    const handleInsertPhrase = useCallback(
      (phrase: string) => {
        const before = content.slice(0, cursorPos);
        const after = content.slice(cursorPos);
        const nextContent = before + phrase + after;
        const nextCursorPos = cursorPos + phrase.length;
        setCursorPos(nextCursorPos);
        // This is a controlled editor mutation, so it must remain urgent. The
        // expensive metrics/guidance projections already consume deferred text.
        onContentCommit(nextContent, nextCursorPos);
      },
      [content, cursorPos, onContentCommit],
    );

    const handleInsertTabSuggestion = useCallback(() => {
      handleInsertPhrase(ghostGuidance.tabSuggestion);
    }, [ghostGuidance.tabSuggestion, handleInsertPhrase]);

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
          onInsertTabSuggestion={handleInsertTabSuggestion}
          isTypewriterScrollEnabled={isTypewriterScrollEnabled}
        />

        <DeferredGhostGuidance guidance={ghostGuidance} onInsertSuggestion={handleInsertPhrase} />
      </div>
    );
  },
);

WriteEditorSurface.displayName = 'WriteEditorSurface';
