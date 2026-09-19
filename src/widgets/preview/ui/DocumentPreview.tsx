import React, { lazy, Suspense, useState } from 'react';
import { FileEdit, Layers, Download } from 'lucide-react';
import type { ESDraft, DraftSnapshot } from '@entities/draft/model/types';
import { pathWithDraftId } from '@shared/validation/searchParams';
import { SnapshotHistory } from '@features/draft-snapshots/ui/SnapshotHistory';

const LazyExportModal = lazy(() =>
  import('@features/export/ui/ExportModal').then((module) => ({
    default: module.ExportModal,
  })),
);

interface DocumentPreviewProps {
  draft: ESDraft;
  charsNoWs: number;
  currentTarget: number | null;
  onSaveSnapshot: (label: string) => void;
  onRestoreSnapshot: (snap: DraftSnapshot) => void;
  checklistSlot?: React.ReactNode;
}

export function DocumentPreview({
  draft,
  charsNoWs,
  currentTarget,
  onSaveSnapshot,
  onRestoreSnapshot,
  checklistSlot,
}: DocumentPreviewProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      {/* Formatted Clean Document */}
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-8 lg:col-span-8">
        <div className="mb-5 flex flex-col gap-2 border-b border-neutral-100 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-400 uppercase">
              {draft.companyName ? `${draft.companyName} 提出用` : '提出用プレビュー'}
            </span>
            <h3 className="mt-0.5 text-lg font-bold text-neutral-900 sm:text-xl">
              {draft.title || '無題のエントリーシート'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:self-center">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              title="ブラウザ内minitypeによる日本語組版PDFやMarkdownでエクスポート"
            >
              <Download className="h-3.5 w-3.5 text-amber-600" />
              <span>エクスポート (PDF/MD)</span>
            </button>
            <span className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs font-medium text-neutral-600 sm:text-sm">
              {charsNoWs} 文字{currentTarget ? ` / 上限 ${currentTarget} 文字` : ''}
            </span>
          </div>
        </div>

        <div className="flex-1 font-sans text-base leading-[1.75] tracking-wide whitespace-pre-wrap text-neutral-900 select-text sm:text-xl">
          {draft.content || (
            <span className="text-neutral-400 italic">本文が入力されていません。</span>
          )}
        </div>

        {/* SPA Quick Navigation Bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span className="text-neutral-400">
            内容を修正・再推敲する場合はエディタへ移動してください
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:bg-neutral-50"
            >
              <Download className="h-3.5 w-3.5 text-amber-600" />
              <span>PDF / MD 出力</span>
            </button>
            <a
              href={pathWithDraftId('/structure', draft.id)}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-700 no-underline transition-colors hover:bg-neutral-50"
            >
              <Layers className="h-3.5 w-3.5 text-neutral-500" />
              <span>STAR構成で整理</span>
            </a>
            <a
              href={pathWithDraftId('/', draft.id)}
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-1.5 font-medium text-white no-underline shadow-2xs transition-colors hover:bg-neutral-800"
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>執筆エディタで推敲</span>
            </a>
          </div>
        </div>
      </div>

      <SnapshotHistory
        draft={draft}
        onSaveSnapshot={onSaveSnapshot}
        onRestoreSnapshot={onRestoreSnapshot}
      />

      {/* RSC Static Checklist Slot */}
      {checklistSlot && <div className="lg:col-span-12">{checklistSlot}</div>}

      {/* Export Modal (browser-side minitype PDF / Markdown) */}
      <Suspense
        fallback={
          isExportOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="rounded-lg bg-white p-4 text-xs">エクスポート設定を読み込み中...</div>
            </div>
          ) : null
        }
      >
        <LazyExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          draft={draft}
        />
      </Suspense>
    </div>
  );
}
