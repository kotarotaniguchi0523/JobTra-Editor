'use client';

import { Download, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ExportDialog({ isOpen, onClose, children }: ExportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="export-modal-title"
      className="export-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-4"
      onCancel={handleCancel}
    >
      <div className="flex min-h-full w-full items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
          aria-label="閉じる"
        />
        <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white text-neutral-900 shadow-2xl">
          <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-white">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <h2 id="export-modal-title" className="text-base font-bold text-neutral-900">
                  ドキュメントエクスポート
                </h2>
                <p className="text-xs text-neutral-500">
                  ブラウザ内minitypeによる日本語組版PDFやMarkdownファイルとして保存
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {children}

          <footer className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/80 px-5 py-3 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span>組版エンジン:</span>
              <a
                href="https://zenn.dev/inaniwaudon/articles/62f1def4bad627"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold text-neutral-700 underline hover:text-neutral-950"
              >
                <span>minitype by inaniwaudon</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded px-2.5 py-1 font-medium text-neutral-600 hover:text-neutral-900"
            >
              閉じる
            </button>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
