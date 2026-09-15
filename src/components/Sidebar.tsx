"use client";

import React, { useReducer, useTransition, memo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  HardDrive,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ESDraft } from '../types';
import { SidebarDraftItem } from './SidebarDraftItem';

interface SidebarProps {
  drafts: ESDraft[];
  currentDraftId: string;
  onSelectDraft: (id: string) => void;
  onCreateNewDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (id: string) => void;
  onToggleStar: (id: string) => void;
  isSaving: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  footerSlot?: React.ReactNode;
}

const CATEGORY_TAG_LABELS: Record<string, string> = {
  all: 'すべて',
  gakuchika: 'ガクチカ',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折',
  jiku: '就活軸',
  future: '入社後',
};

// 3つの useState を 1 つの Reducer に統合
interface FilterState {
  searchQuery: string;
  selectedFilter: string;
  showStarredOnly: boolean;
}

type FilterAction =
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'TOGGLE_STARRED' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'CLEAR_SEARCH':
      return { ...state, searchQuery: '' };
    case 'SET_FILTER':
      return { ...state, selectedFilter: action.filter, showStarredOnly: false };
    case 'TOGGLE_STARRED':
      return { ...state, showStarredOnly: !state.showStarredOnly };
    default:
      return state;
  }
}

export const Sidebar: React.FC<SidebarProps> = memo(({
  drafts,
  currentDraftId,
  onSelectDraft,
  onCreateNewDraft,
  onDeleteDraft,
  onDuplicateDraft,
  onToggleStar,
  isSaving,
  isMobileOpen,
  onCloseMobile,
  footerSlot,
}) => {
  const [filter, dispatchFilter] = useReducer(filterReducer, {
    searchQuery: '',
    selectedFilter: 'all',
    showStarredOnly: false,
  });

  // React 19 useTransition: フィルタリング・検索および下書き操作のトランジション追跡
  const [isFilterPending, startTransition] = useTransition();

  const handleSearchChange = (q: string) => {
    startTransition(() => {
      dispatchFilter({ type: 'SET_SEARCH', query: q });
    });
  };

  const handleClearSearch = () => {
    startTransition(() => {
      dispatchFilter({ type: 'CLEAR_SEARCH' });
    });
  };

  const handleSelectFilter = (cat: string) => {
    startTransition(() => {
      dispatchFilter({ type: 'SET_FILTER', filter: cat });
    });
  };

  const handleToggleStarredOnly = () => {
    startTransition(() => {
      dispatchFilter({ type: 'TOGGLE_STARRED' });
    });
  };

  const filteredDrafts = drafts.filter((d) => {
    if (filter.showStarredOnly && !d.starred) return false;
    if (filter.selectedFilter !== 'all' && d.category !== filter.selectedFilter) return false;
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCompany = (d.companyName || '').toLowerCase().includes(q);
      const matchContent = d.content.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchContent;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="サイドバーを閉じる"
          className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-40 lg:hidden cursor-default border-none w-full h-full"
          onClick={() => {
            startTransition(() => {
              onCloseMobile();
            });
          }}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:w-80 bg-neutral-50/95 border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-3 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900">
              下書き一覧
            </span>
            <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
              {drafts.length}件
            </span>
          </div>

          <button
            id="sidebar-new-draft-btn"
            type="button"
            onClick={() => {
              startTransition(() => {
                onCreateNewDraft();
                if (window.innerWidth < 1024) onCloseMobile();
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
            title="新しいエントリーシートを作成"
          >
            <Plus className="w-4 h-4" />
            <span>新規作成</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-neutral-200 bg-white flex flex-col gap-2">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-100/80 rounded-md border border-neutral-200">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              id="sidebar-search-input"
              type="text"
              value={filter.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="企業名や内容で検索..."
              aria-label="企業名や内容で検索"
              className="w-full text-xs text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-hidden"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="検索キーワードをクリア"
                className="text-neutral-400 hover:text-neutral-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={handleToggleStarredOnly}
              className={`px-2.5 py-1 rounded text-xs font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer border ${
                filter.showStarredOnly
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Star className={`w-3 h-3 ${filter.showStarredOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>重要</span>
            </button>

            {Object.entries(CATEGORY_TAG_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectFilter(key)}
                className={`px-2.5 py-1 rounded text-xs font-medium shrink-0 transition-colors cursor-pointer border ${
                  filter.selectedFilter === key && !filter.showStarredOnly
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drafts List */}
        <div className={`flex-1 overflow-y-auto p-3 space-y-2 transition-opacity duration-150 ${isFilterPending ? 'opacity-70' : 'opacity-100'}`}>
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              条件に一致する下書きはありません
            </div>
          ) : (
            filteredDrafts.map((d) => (
              <SidebarDraftItem
                key={d.id}
                draft={d}
                isSelected={d.id === currentDraftId}
                onSelect={(id) => {
                  startTransition(() => {
                    onSelectDraft(id);
                    if (window.innerWidth < 1024) onCloseMobile();
                  });
                }}
                onDuplicate={(id) => {
                  startTransition(() => {
                    onDuplicateDraft(id);
                  });
                }}
                onDelete={(id) => {
                  startTransition(() => {
                    onDeleteDraft(id);
                  });
                }}
                onToggleStar={(id) => {
                  startTransition(() => {
                    onToggleStar(id);
                  });
                }}
                categoryLabel={CATEGORY_TAG_LABELS[d.category] || '下書き'}
              />
            ))
          )}
        </div>

        {/* Footer: RSC footerSlot preferred */}
        {footerSlot ? (
          footerSlot
        ) : (
          <div className="p-3 border-t border-neutral-200 bg-white text-xs space-y-2">
            <a
              id="sidebar-lp-link"
              href="/about"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs font-medium text-xs"
              title="就活ESクラフトの機能一覧・LPを見る"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>機能一覧・LP</span>
              </div>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </a>

            <div className="flex items-center justify-between text-neutral-500 pt-0.5">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-neutral-500" />
                <span>IndexedDB オフライン自動保存</span>
              </div>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
