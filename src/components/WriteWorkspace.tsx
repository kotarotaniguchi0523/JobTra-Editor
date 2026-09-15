'use client';

import React, { memo } from 'react';
import { Focus, ScrollText, Eraser } from 'lucide-react';
import { JapaneseMetrics } from '../types';
import { DeferredTextarea } from './DeferredTextarea';
import { FocusSentenceDisplay } from './FocusSentenceDisplay';
import { DeferredGhostGuidance } from './DeferredGhostGuidance';

interface WriteWorkspaceProps {
  content: string;
  cursorPos: number;
  isFocusSentenceEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  metrics: JapaneseMetrics;
  deferredContent: string;
  deferredCursorPos: number;
  onToggleFocusSentence: () => void;
  onToggleTypewriter: () => void;
  onCleanFormatting: () => void;
  onContentCommit: (val: string, pos: number) => void;
  onCursorChange: (pos: number) => void;
  onInsertPhrase: (phrase: string) => void;
}

/**
 * WriteWorkspace:
 * 執筆モードにおける入力エリア、フォーカスセンテンス、視線固定、ゴースト補完の責務を担うコンポーネント
 */
export const WriteWorkspace: React.FC<WriteWorkspaceProps> = memo(
  ({
    content,
    isFocusSentenceEnabled,
    isTypewriterScrollEnabled,
    metrics,
    deferredContent,
    deferredCursorPos,
    onToggleFocusSentence,
    onToggleTypewriter,
    onCleanFormatting,
    onContentCommit,
    onCursorChange,
    onInsertPhrase,
  }) => {
    return (
      <div className="space-y-2">
        {/* Tool Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onToggleFocusSentence}
              className={`flex cursor-pointer items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-colors sm:gap-1.5 sm:px-2.5 ${
                isFocusSentenceEnabled
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
              title="いまカーソルがある一文のみをハイライト"
            >
              <Focus className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">フォーカス・センテンス</span>
              <span className="sm:hidden">一文集中</span>
            </button>

            <button
              type="button"
              onClick={onToggleTypewriter}
              className={`flex cursor-pointer items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-colors sm:gap-1.5 sm:px-2.5 ${
                isTypewriterScrollEnabled
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
              title="入力行を常に視線の中央にキープ"
            >
              <ScrollText className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">タイプライター視線固定</span>
              <span className="sm:hidden">視線固定</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCleanFormatting}
              className="flex cursor-pointer items-center gap-1 rounded px-2.5 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
              title="余分な連続改行や行末スペースを自動整理"
            >
              <Eraser className="h-3.5 w-3.5 text-neutral-400" />
              <span>書式整理</span>
            </button>
          </div>
        </div>

        {/* Core Textarea Box */}
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
            <FocusSentenceDisplay content={deferredContent} cursorPos={deferredCursorPos} />
          )}

          <DeferredTextarea
            id="es-body-textarea"
            value={content}
            onChange={onContentCommit}
            onCursorChange={onCursorChange}
            onInsertTabSuggestion={() => {
              const ghost = document.getElementById('ghost-tab-suggestion');
              if (ghost && ghost.textContent) {
                onInsertPhrase(ghost.textContent.trim());
              }
            }}
            isTypewriterScrollEnabled={isTypewriterScrollEnabled}
          />

          <DeferredGhostGuidance
            content={deferredContent}
            cursorPos={deferredCursorPos}
            onInsertSuggestion={onInsertPhrase}
          />
        </div>
      </div>
    );
  },
);

WriteWorkspace.displayName = 'WriteWorkspace';
