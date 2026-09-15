'use client';

import React, { memo, useRef, useEffect, useState, useTransition } from 'react';

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
 * ローカル状態とIMEバッファを直接保持することで0msの完全な打鍵感を実現し、
 * 親コンポーネントの重い再レンダリングやトランジションが
 * キーストロークを遮断（あるいはIME変換を破壊）しないように防御します。
 */
export const DeferredTextarea: React.FC<DeferredTextareaProps> = memo(
  ({
    id,
    value,
    onChange,
    onCursorChange,
    onInsertTabSuggestion,
    placeholder = 'ここに文章を入力してください...',
    minHeight = '340px',
    isTypewriterScrollEnabled = true,
  }) => {
    const [localText, setLocalText] = useState<string>(value);
    const [prevValue, setPrevValue] = useState<string>(value);
    const [, startTransition] = useTransition();
    const isComposingRef = useRef<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // React公式パターン: Props変化時の状態同期をuseEffectではなくレンダー中に実行
    if (value !== prevValue) {
      setPrevValue(value);
      if (!isComposingRef.current) {
        setLocalText(value);
      }
    }

    const handleCursorChange = (pos: number) => {
      startTransition(() => {
        onCursorChange(pos);
      });
    };

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

    const notifyChange = (val: string, pos: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        startTransition(() => {
          onChange(val, pos);
        });
      }, 120);
    };

    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, []);

    return (
      <div className="relative p-4 sm:p-6">
        <textarea
          id={id}
          ref={textareaRef}
          value={localText}
          onChange={(e) => {
            const val = e.target.value;
            const pos = e.target.selectionStart;
            setLocalText(val);
            handleCursorChange(pos);
            handleScrollToCursor(pos, val);
            if (!isComposingRef.current) {
              notifyChange(val, pos);
            }
          }}
          onSelect={(e) => {
            handleCursorChange(e.currentTarget.selectionStart);
          }}
          onClick={(e) => {
            handleCursorChange(e.currentTarget.selectionStart);
          }}
          onKeyUp={(e) => {
            handleCursorChange(e.currentTarget.selectionStart);
          }}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={(e) => {
            isComposingRef.current = false;
            const val = e.currentTarget.value;
            const pos = e.currentTarget.selectionStart;
            setLocalText(val);
            handleCursorChange(pos);
            notifyChange(val, pos);
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'Tab' &&
              !isComposingRef.current &&
              !e.shiftKey &&
              !e.ctrlKey &&
              !e.altKey &&
              !e.metaKey &&
              onInsertTabSuggestion
            ) {
              e.preventDefault();
              startTransition(() => {
                onInsertTabSuggestion();
              });
            }
          }}
          placeholder={placeholder}
          aria-label="エントリーシート本文"
          rows={12}
          className="w-full resize-y bg-transparent font-sans text-lg leading-[1.75] tracking-wide text-neutral-900 placeholder-neutral-300 selection:bg-neutral-200 focus:outline-hidden sm:text-xl"
          style={{ minHeight }}
        />
      </div>
    );
  },
);

DeferredTextarea.displayName = 'DeferredTextarea';
