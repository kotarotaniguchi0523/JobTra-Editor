"use client";

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

export const DocumentPreview: React.FC<DocumentPreviewProps> = memo(({
  draft,
  charsNoWs,
  currentTarget,
  onSaveSnapshot,
  onRestoreSnapshot,
  checklistSlot,
}) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* Formatted Clean Document */}
      <div className="lg:col-span-8 bg-white rounded-lg border border-neutral-200 p-6 sm:p-8 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 mb-5">
          <div>
            <span className="text-xs font-medium text-neutral-400 uppercase">
              {draft.companyName ? `${draft.companyName} 提出用` : '提出用プレビュー'}
            </span>
            <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
              {draft.title || '無題のエントリーシート'}
            </h3>
          </div>
          <span className="text-sm font-mono font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
            {charsNoWs} 文字 / 目標 {currentTarget} 文字
          </span>
        </div>

        <div className="flex-1 whitespace-pre-wrap text-lg sm:text-xl text-neutral-900 leading-[1.75] font-sans select-text tracking-wide">
          {draft.content || (
            <span className="text-neutral-400 italic">本文が入力されていません。</span>
          )}
        </div>

        {/* SPA Quick Navigation Bar */}
        <div className="pt-4 mt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-400">
            内容を修正・再推敲する場合はエディタへ移動してください
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`/structure?id=${draft.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors font-medium no-underline"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span>STAR構成で整理</span>
            </a>
            <a
              href={`/?id=${draft.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium no-underline shadow-2xs"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>執筆エディタで推敲</span>
            </a>
          </div>
        </div>
      </div>

      {/* Snapshots & History Manager */}
      <div className="lg:col-span-4 bg-white rounded-lg border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col">
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 mb-3.5">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neutral-600" />
            <h4 className="text-sm font-semibold text-neutral-900">
              バージョン履歴
            </h4>
          </div>
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setIsNaming(true);
              });
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="現在の内容を別バージョンとして保管"
            aria-label="現在の内容を別バージョンとして保管"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-neutral-500" />
            <span>版を保存</span>
          </button>
        </div>

        {restoredToast && (
          <div className="mb-2.5 p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>バージョンを本文に復元しました</span>
          </div>
        )}

        {isNaming && (
          <form onSubmit={handleSave} className="p-3 bg-neutral-50 rounded-md mb-3 space-y-2">
            <label htmlFor="snapshot-label-input" className="text-xs font-medium text-neutral-600 block">
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
              className="w-full text-xs text-neutral-800 bg-white border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-hidden focus:border-neutral-900"
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
                className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800 cursor-pointer"
              >
                保存
              </button>
            </div>
          </form>
        )}

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[420px]">
          {(!draft.snapshots || draft.snapshots.length === 0) ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              まだ保存されたバージョンはありません。
              <br />
              推敲の過程をいつでも保存・復元できます。
            </div>
          ) : (
            draft.snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3 bg-neutral-50 hover:bg-neutral-100/80 rounded transition-colors flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    {snap.label}
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
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
                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors shrink-0 cursor-pointer"
                  title="このバージョンを本文に復元"
                  aria-label="このバージョンを本文に復元"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RSC Static Checklist Slot */}
      {checklistSlot && (
        <div className="lg:col-span-12">
          {checklistSlot}
        </div>
      )}
    </div>
  );
});

DocumentPreview.displayName = 'DocumentPreview';
