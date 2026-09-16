import React, { useState } from 'react';
import { BookmarkPlus, History, RotateCcw } from 'lucide-react';
import type { DraftSnapshot, ESDraft } from '@entities/draft/model/types';
import { parseSnapshotLabel } from '@shared/validation/draftSchemas';

interface SnapshotHistoryProps {
  draft: ESDraft;
  onSaveSnapshot: (label: string) => void;
  onRestoreSnapshot: (snapshot: DraftSnapshot) => void;
}

export function SnapshotHistory({
  draft,
  onSaveSnapshot,
  onRestoreSnapshot,
}: SnapshotHistoryProps) {
  const [snapshotLabel, setSnapshotLabel] = useState<string | null>(null);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const labelToSave = parseSnapshotLabel(snapshotLabel ?? '', '');
    if (!labelToSave) return;
    onSaveSnapshot(labelToSave);
    setSnapshotLabel(null);
  };

  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-5 lg:col-span-4">
      <div className="mb-3.5 flex items-center justify-between border-b border-neutral-100 pb-2.5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-neutral-600" />
          <h4 className="text-sm font-semibold text-neutral-900">バージョン履歴</h4>
        </div>
        <button
          type="button"
          onClick={() => setSnapshotLabel('')}
          className="flex cursor-pointer items-center gap-1.5 rounded bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200"
          title="現在の内容を別バージョンとして保管"
          aria-label="現在の内容を別バージョンとして保管"
        >
          <BookmarkPlus className="h-3.5 w-3.5 text-neutral-500" />
          <span>版を保存</span>
        </button>
      </div>

      {snapshotLabel !== null && (
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
            onChange={(event) => setSnapshotLabel(event.target.value)}
            placeholder="例: 面談前フィードバック反映版"
            aria-label="バージョンのラベル名"
            autoFocus
            className="w-full rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-hidden"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSnapshotLabel(null)}
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

      <div className="max-h-[420px] flex-1 space-y-2 overflow-y-auto">
        {!draft.snapshots || draft.snapshots.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            まだ保存されたバージョンはありません。
            <br />
            推敲の過程をいつでも保存・復元できます。
          </div>
        ) : (
          draft.snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex items-start justify-between gap-2 rounded bg-neutral-50 p-3 transition-colors hover:bg-neutral-100/80"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-neutral-900">
                  {snapshot.label}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                  <span>{snapshot.charCount}字</span>
                  <span>•</span>
                  <span>
                    {new Date(snapshot.timestamp).toLocaleString('ja-JP', {
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
                onClick={() => onRestoreSnapshot(snapshot)}
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
  );
}
