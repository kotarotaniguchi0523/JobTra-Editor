import React, { useState } from 'react';
import { Eraser, Focus, ScrollText } from 'lucide-react';

interface WriteToolbarOptions {
  isFocusSentenceEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
}

interface WriteToolbarProps {
  onCleanFormatting: () => void;
  children: (options: WriteToolbarOptions) => React.ReactNode;
}

export function WriteToolbar({ onCleanFormatting, children }: WriteToolbarProps) {
  const [isFocusSentenceEnabled, setFocusSentenceEnabled] = useState(false);
  const [isTypewriterScrollEnabled, setTypewriterScrollEnabled] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setFocusSentenceEnabled((enabled) => !enabled)}
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
            onClick={() => setTypewriterScrollEnabled((enabled) => !enabled)}
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

      {children({ isFocusSentenceEnabled, isTypewriterScrollEnabled })}
    </>
  );
}
