import React, { useLayoutEffect, useRef } from 'react';
import { getTextareaHeight } from '@widgets/editor/lib/textareaHeight';

interface DeferredTextareaProps {
  id: string;
  value: string;
  onChange: (value: string, cursorPos: number) => void;
  onCursorChange: (cursorPos: number) => void;
  onInsertTabSuggestion?: () => void;
  placeholder?: string;
  minHeight?: string;
  isTypewriterScrollEnabled?: boolean;
}

/**
 * DeferredTextarea:
 * 入力コンポーネントとしての責務を最小単位に分離。
 * 入力値は親のdraft reducerを唯一のsource of truthとしてurgentに同期します。
 * 重い解析側はuseDeferredValueで遅延させ、DOM refはタイプライター表示のスクロールという
 * 命令的な処理に限定します。IMEも通常のcontrolled inputとしてReactに同期させます。
 */
export function DeferredTextarea({
  id,
  value,
  onChange,
  onCursorChange,
  onInsertTabSuggestion,
  placeholder = 'ここに文章を入力してください...',
  minHeight = '340px',
  isTypewriterScrollEnabled = true,
}: DeferredTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numericMinHeight = Number.parseFloat(minHeight) || 0;

  // DOM計測・style書き込みはこの末端Clientに閉じ込める。本文の派生状態にはしない。
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${getTextareaHeight(textarea.scrollHeight, numericMinHeight)}px`;
  }, [numericMinHeight, value]);

  const handleScrollToCursor = (pos: number, text: string) => {
    if (!isTypewriterScrollEnabled || !textareaRef.current) return;
    const textBefore = text.slice(0, pos);
    const linesBefore = textBefore.split('\n').length;
    const lineHeight = 35;
    const cursorTop = linesBefore * lineHeight;
    const visibleHeight = textareaRef.current.clientHeight;
    const desiredScrollTop = Math.max(0, cursorTop - visibleHeight / 2);
    textareaRef.current.scrollTo({
      top: desiredScrollTop,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative p-4 sm:p-6">
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          const pos = e.target.selectionStart;
          onCursorChange(pos);
          handleScrollToCursor(pos, val);
          onChange(val, pos);
        }}
        onSelect={(e) => {
          onCursorChange(e.currentTarget.selectionStart);
        }}
        onClick={(e) => {
          onCursorChange(e.currentTarget.selectionStart);
        }}
        onKeyUp={(e) => {
          onCursorChange(e.currentTarget.selectionStart);
        }}
        onKeyDown={(e) => {
          if (
            e.key === 'Tab' &&
            !(e.nativeEvent as KeyboardEvent).isComposing &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            onInsertTabSuggestion
          ) {
            e.preventDefault();
            onInsertTabSuggestion();
          }
        }}
        placeholder={placeholder}
        aria-label="エントリーシート本文"
        rows={12}
        className="w-full resize-none overflow-hidden bg-transparent font-sans text-lg leading-[1.75] tracking-wide text-neutral-900 placeholder-neutral-300 selection:bg-neutral-200 focus:outline-hidden sm:text-xl"
        style={{ minHeight }}
      />
    </div>
  );
}
