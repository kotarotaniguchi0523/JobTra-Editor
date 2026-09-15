"use client";

import React, { memo } from 'react';
import { Trash2, Copy, Star } from 'lucide-react';
import { ESDraft } from '../types';

interface SidebarDraftItemProps {
  draft: ESDraft;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  categoryLabel: string;
}

/**
 * SidebarDraftItem:
 * サイドバーにおける個別の下書きカードアイテムの表示とアクションをカプセル化
 */
export const SidebarDraftItem: React.FC<SidebarDraftItemProps> = memo(({
  draft,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleStar,
  categoryLabel,
}) => {
  return (
    <div
      className={`w-full p-2.5 rounded-md border transition-all group relative ${
        isSelected
          ? 'bg-white border-neutral-300 shadow-xs ring-1 ring-neutral-900/5'
          : 'bg-white/60 border-neutral-200/80 hover:bg-white hover:border-neutral-300'
      }`}
    >
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <button
          type="button"
          onClick={() => onSelect(draft.id)}
          className="flex-1 min-w-0 text-left cursor-pointer focus:outline-hidden"
          aria-label={`${draft.companyName || categoryLabel}: ${draft.title || '無題のエントリーシート'} を選択`}
        >
          <span className="text-xs font-medium text-neutral-500 block truncate">
            {draft.companyName ? draft.companyName : categoryLabel}
          </span>
          <h4
            className={`text-sm font-semibold truncate ${
              isSelected ? 'text-neutral-900' : 'text-neutral-700'
            }`}
          >
            {draft.title || '無題のエントリーシート'}
          </h4>
          <span className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mt-1 block font-sans font-normal">
            {draft.content ? draft.content : '本文なし'}
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(draft.id);
          }}
          className={`p-1 rounded-sm transition-colors cursor-pointer shrink-0 ${
            draft.starred
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
          title={draft.starred ? 'スターを解除' : '重要マークをつける'}
          aria-label={draft.starred ? 'スターを解除' : '重要マークをつける'}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 pt-1.5 border-t border-neutral-100">
        <div className="flex items-center gap-1.5 font-mono">
          <span>{draft.content.replace(/\s/g, '').length}字</span>
          <span>/</span>
          <span>{draft.targetCount || 400}字</span>
        </div>

        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(draft.id);
            }}
            className="p-1 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            title="下書きを複製"
            aria-label="下書きを複製"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('この下書きを削除しますか？')) {
                onDelete(draft.id);
              }
            }}
            className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
            title="下書きを削除"
            aria-label="下書きを削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

SidebarDraftItem.displayName = 'SidebarDraftItem';
