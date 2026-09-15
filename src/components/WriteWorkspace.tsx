"use client";

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
export const WriteWorkspace: React.FC<WriteWorkspaceProps> = memo(({
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFocusSentence}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              isFocusSentenceEnabled
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
            title="いまカーソルがある一文のみをハイライト"
          >
            <Focus className="w-3.5 h-3.5" />
            <span>フォーカス・センテンス</span>
          </button>

          <button
            type="button"
            onClick={onToggleTypewriter}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              isTypewriterScrollEnabled
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
            title="入力行を常に視線の中央にキープ"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>タイプライター視線固定</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCleanFormatting}
            className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 px-2.5 py-1 rounded hover:bg-neutral-200/60 transition-colors cursor-pointer"
            title="余分な連続改行や行末スペースを自動整理"
          >
            <Eraser className="w-3.5 h-3.5 text-neutral-400" />
            <span>書式整理</span>
          </button>
        </div>
      </div>

      {/* Core Textarea Box */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
        <div className="px-3.5 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono text-xs">
            {metrics.charsNoWhitespace} 文字（空白・改行除く） / 全 {metrics.totalChars} 字
          </span>
          <span className="text-xs text-neutral-400">
            Tabキーで思考の伴走フレーズを即時挿入
          </span>
        </div>

        {isFocusSentenceEnabled && (
          <FocusSentenceDisplay
            content={deferredContent}
            cursorPos={deferredCursorPos}
          />
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
});

WriteWorkspace.displayName = 'WriteWorkspace';
