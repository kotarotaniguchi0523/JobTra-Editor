import React, { memo } from 'react';
import { Focus } from 'lucide-react';
import { extractFocusSentence } from '../services/focusSentence';

interface FocusSentenceDisplayProps {
  content: string;
  cursorPos: number;
}

/**
 * FocusSentenceDisplay:
 * 執筆中の文章の句点分割・抽出を行うコンポーネント。
 * 親から渡された deferredContent を使用して単独でレンダリングすることで、
 * タイピング処理（Transition）の中断・優先処理を可能にします。
 */
export const FocusSentenceDisplay: React.FC<FocusSentenceDisplayProps> = memo(
  ({ content, cursorPos }) => {
    if (!content.trim()) return null;

    const focusSentenceCtx = extractFocusSentence(content, cursorPos);

    return (
      <div className="flex flex-col gap-1 border-b border-neutral-200 bg-neutral-50/80 px-5 py-3 transition-opacity duration-150">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1 font-semibold text-neutral-700">
            <Focus className="h-3 w-3 text-neutral-900" />
            執筆中の一文（{focusSentenceCtx.sentenceIndex + 1} / {focusSentenceCtx.totalSentences}{' '}
            文目）
          </span>
          <span className="font-mono">{focusSentenceCtx.focusSentence.trim().length} 文字</span>
        </div>
        <div className="font-sans text-base leading-relaxed font-medium tracking-wide text-neutral-950 sm:text-lg">
          <span className="text-neutral-400 opacity-40 select-none">...</span>
          <span className="rounded border-b-2 border-neutral-900 bg-amber-100/70 px-1 py-0.5 text-neutral-950">
            {focusSentenceCtx.focusSentence || '（執筆中）'}
          </span>
          <span className="text-neutral-400 opacity-40 select-none">...</span>
        </div>
      </div>
    );
  },
);

FocusSentenceDisplay.displayName = 'FocusSentenceDisplay';
