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
export const SidebarDraftItem: React.FC<SidebarDraftItemProps> = memo(
  ({ draft, isSelected, onSelect, onDuplicate, onDelete, onToggleStar, categoryLabel }) => {
    return (
      <div
        className={`group relative w-full rounded-md border p-2.5 transition-all ${
          isSelected
            ? 'border-neutral-300 bg-white shadow-xs ring-1 ring-neutral-900/5'
            : 'border-neutral-200/80 bg-white/60 hover:border-neutral-300 hover:bg-white'
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onSelect(draft.id)}
            className="min-w-0 flex-1 cursor-pointer text-left focus:outline-hidden"
            aria-label={`${draft.companyName || categoryLabel}: ${draft.title || '無題のエントリーシート'} を選択`}
          >
            <span className="block truncate text-xs font-medium text-neutral-500">
              {draft.companyName ? draft.companyName : categoryLabel}
            </span>
            <h4
              className={`truncate text-sm font-semibold ${
                isSelected ? 'text-neutral-900' : 'text-neutral-700'
              }`}
            >
              {draft.title || '無題のエントリーシート'}
            </h4>
            <span className="mt-1 line-clamp-2 block font-sans text-xs leading-relaxed font-normal text-neutral-500">
              {draft.content ? draft.content : '本文なし'}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(draft.id);
            }}
            className={`shrink-0 cursor-pointer rounded-sm p-1 transition-colors ${
              draft.starred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
            title={draft.starred ? 'スターを解除' : '重要マークをつける'}
            aria-label={draft.starred ? 'スターを解除' : '重要マークをつける'}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 font-mono">
            <span>{draft.content.replace(/\s/g, '').length}字</span>
            <span>/</span>
            <span>{draft.targetCount || 400}字</span>
          </div>

          <div className="flex items-center gap-1 opacity-70 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(draft.id);
              }}
              className="cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              title="下書きを複製"
              aria-label="下書きを複製"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('この下書きを削除しますか？')) {
                  onDelete(draft.id);
                }
              }}
              className="cursor-pointer rounded p-1 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="下書きを削除"
              aria-label="下書きを削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

SidebarDraftItem.displayName = 'SidebarDraftItem';
