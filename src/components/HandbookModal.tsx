'use client';

import React, { Activity, useTransition, memo } from 'react';
import { X, Sparkles } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * HandbookModal:
 * Wraps the heavy static handbook rendered via RSC in React 19 `<Activity>`.
 * Keeps DOM and client component state alive while retaining prerendered RSC
 * payloads in the background while hidden, revealing them instantly when opened.
 * Pattern from @funstack/static/dist/docs/learn/DeferAndActivity.md
 */
export const HandbookModal: React.FC<HandbookModalProps> = memo(({ isOpen, onClose, children }) => {
  const [, startTransition] = useTransition();
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <div
        id="handbook-modal-container"
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 transition-opacity duration-150 sm:p-5 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop button */}
        <button
          type="button"
          aria-label="モーダルを閉じる"
          className="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/50 backdrop-blur-xs"
          onClick={() => {
            startTransition(() => {
              onClose();
            });
          }}
        />

        <dialog
          open
          id="handbook-modal-dialog"
          aria-labelledby="handbook-modal-title"
          className="relative z-10 m-0 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white p-0 text-neutral-900 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-900 text-white">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div>
                <h2 id="handbook-modal-title" className="text-sm font-bold text-neutral-900">
                  就活ES推敲ハンドブック
                </h2>
                <p className="text-xs text-neutral-500">
                  Funstack Static RSC (Server Component + defer) で事前生成
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  onClose();
                });
              }}
              aria-label="閉じる"
              className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content Slot */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs leading-relaxed text-neutral-700">
            {children ? (
              children
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400">
                ハンドブックを読み込み中...
              </div>
            )}
          </div>
        </dialog>
      </div>
    </Activity>
  );
});

HandbookModal.displayName = 'HandbookModal';
