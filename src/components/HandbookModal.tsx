"use client";

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
export const HandbookModal: React.FC<HandbookModalProps> = memo(({
  isOpen,
  onClose,
  children,
}) => {
  const [, startTransition] = useTransition();
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <div
        id="handbook-modal-container"
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 transition-opacity duration-150 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop button */}
        <button
          type="button"
          aria-label="モーダルを閉じる"
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs w-full h-full cursor-default border-none"
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
          className="relative z-10 bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden m-0 p-0 text-neutral-900"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h2 id="handbook-modal-title" className="font-bold text-sm text-neutral-900">就活ES推敲ハンドブック</h2>
                <p className="text-[11px] text-neutral-500">Funstack Static RSC (Server Component + defer) で事前生成</p>
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
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Slot */}
          <div className="p-5 overflow-y-auto flex-1 text-xs text-neutral-700 space-y-4 leading-relaxed">
            {children ? (
              children
            ) : (
              <div className="text-neutral-400 py-12 text-center text-xs">
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
