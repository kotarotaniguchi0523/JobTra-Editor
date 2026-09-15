'use client';

import React, { useState, useTransition, memo } from 'react';
import { History, BookmarkPlus, Check, RotateCcw, FileEdit, Layers } from 'lucide-react';
import { ESDraft, DraftSnapshot } from '../types';

interface DocumentPreviewProps {
  draft: ESDraft;
  charsNoWs: number;
  currentTarget: number;
  onSaveSnapshot: (label: string) => void;
  onRestoreSnapshot: (snap: DraftSnapshot) => void;
  checklistSlot?: React.ReactNode;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = memo(
  ({ draft, charsNoWs, currentTarget, onSaveSnapshot, onRestoreSnapshot, checklistSlot }) => {
    const [isNaming, setIsNaming] = useState(false);
    const [snapshotLabel, setSnapshotLabel] = useState('');
    const [restoredToast, setRestoredToast] = useState(false);
    const [, startTransition] = useTransition();

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!snapshotLabel.trim()) return;
      const labelToSave = snapshotLabel.trim();
      startTransition(() => {
        onSaveSnapshot(labelToSave);
        setSnapshotLabel('');
        setIsNaming(false);
      });
    };

    const handleRestore = (snap: DraftSnapshot) => {
      startTransition(() => {
        onRestoreSnapshot(snap);
        setRestoredToast(true);
      });
      setTimeout(() => {
        startTransition(() => {
          setRestoredToast(false);
        });
      }, 2500);
    };

    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Formatted Clean Document */}
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-8">
          <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-3.5">
            <div>
              <span className="text-xs font-medium text-neutral-400 uppercase">
                {draft.companyName ? `${draft.companyName} 提出用` : '提出用プレビュー'}
              </span>
              <h3 className="mt-0.5 text-xl font-bold text-neutral-900">
                {draft.title || '無題のエントリーシート'}
              </h3>
            </div>
            <span className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-sm font-medium text-neutral-600">
              {charsNoWs} 文字 / 目標 {currentTarget} 文字
            </span>
          </div>

          <div className="flex-1 font-sans text-lg leading-[1.75] tracking-wide whitespace-pre-wrap text-neutral-900 select-text sm:text-xl">
            {draft.content || (
              <span className="text-neutral-400 italic">本文が入力されていません。</span>
            )}
          </div>

          {/* SPA Quick Navigation Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-xs">
            <span className="text-neutral-400">
              内容を修正・再推敲する場合はエディタへ移動してください
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`/structure?id=${draft.id}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-700 no-underline transition-colors hover:bg-neutral-50"
              >
                <Layers className="h-3.5 w-3.5 text-neutral-500" />
                <span>STAR構成で整理</span>
              </a>
              <a
                href={`/?id=${draft.id}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-1.5 font-medium text-white no-underline shadow-2xs transition-colors hover:bg-neutral-800"
              >
                <FileEdit className="h-3.5 w-3.5" />
                <span>執筆エディタで推敲</span>
              </a>
            </div>
          </div>
        </div>

        {/* Snapshots & History Manager */}
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-5 lg:col-span-4">
          <div className="mb-3.5 flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-neutral-600" />
              <h4 className="text-sm font-semibold text-neutral-900">バージョン履歴</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  setIsNaming(true);
                });
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200"
              title="現在の内容を別バージョンとして保管"
              aria-label="現在の内容を別バージョンとして保管"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-neutral-500" />
              <span>版を保存</span>
            </button>
          </div>

          {restoredToast && (
            <div className="animate-fadeIn mb-2.5 flex items-center gap-2 rounded bg-emerald-50 p-2.5 text-xs text-emerald-800">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>バージョンを本文に復元しました</span>
            </div>
          )}

          {isNaming && (
            <form onSubmit={handleSave} className="mb-3 space-y-2 rounded-md bg-neutral-50 p-3">
              <label
                htmlFor="snapshot-label-input"
                className="block text-xs font-medium text-neutral-600"
              >
                バージョンのラベル名
              </label>
              <input
                id="snapshot-label-input"
                type="text"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                placeholder="例: 面談前フィードバック反映版"
                aria-label="バージョンのラベル名"
                autoFocus
                className="w-full rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-800 focus:border-neutral-900 focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setIsNaming(false);
                      setSnapshotLabel('');
                    });
                  }}
                  className="cursor-pointer px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                >
                  保存
                </button>
              </div>
            </form>
          )}

          {/* Snapshots List */}
          <div className="max-h-[420px] flex-1 space-y-2 overflow-y-auto">
            {!draft.snapshots || draft.snapshots.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                まだ保存されたバージョンはありません。
                <br />
                推敲の過程をいつでも保存・復元できます。
              </div>
            ) : (
              draft.snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="flex items-start justify-between gap-2 rounded bg-neutral-50 p-3 transition-colors hover:bg-neutral-100/80"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-neutral-900">
                      {snap.label}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                      <span>{snap.charCount}字</span>
                      <span>•</span>
                      <span>
                        {new Date(snap.timestamp).toLocaleString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(snap)}
                    className="shrink-0 cursor-pointer rounded p-1.5 text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900"
                    title="このバージョンを本文に復元"
                    aria-label="このバージョンを本文に復元"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RSC Static Checklist Slot */}
        {checklistSlot && <div className="lg:col-span-12">{checklistSlot}</div>}
      </div>
    );
  },
);

DocumentPreview.displayName = 'DocumentPreview';
