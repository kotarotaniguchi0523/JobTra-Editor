"use client";

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
export const FocusSentenceDisplay: React.FC<FocusSentenceDisplayProps> = memo(({
  content,
  cursorPos,
}) => {
  if (!content.trim()) return null;

  const focusSentenceCtx = extractFocusSentence(content, cursorPos);

  return (
    <div className="px-5 py-3 bg-neutral-50/80 border-b border-neutral-200 flex flex-col gap-1 transition-opacity duration-150">
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span className="font-semibold text-neutral-700 flex items-center gap-1">
          <Focus className="w-3 h-3 text-neutral-900" />
          執筆中の一文（{focusSentenceCtx.sentenceIndex + 1} / {focusSentenceCtx.totalSentences} 文目）
        </span>
        <span className="font-mono">{focusSentenceCtx.focusSentence.trim().length} 文字</span>
      </div>
      <div className="text-base sm:text-lg text-neutral-950 font-medium font-sans leading-relaxed tracking-wide">
        <span className="text-neutral-400 select-none opacity-40">...</span>
        <span className="bg-amber-100/70 text-neutral-950 px-1 py-0.5 rounded border-b-2 border-neutral-900">
          {focusSentenceCtx.focusSentence || '（執筆中）'}
        </span>
        <span className="text-neutral-400 select-none opacity-40">...</span>
      </div>
    </div>
  );
});

FocusSentenceDisplay.displayName = 'FocusSentenceDisplay';
