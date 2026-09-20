import React, { useDeferredValue, useState } from 'react';
import { Plus, Search, Star, HardDrive, Sparkles, ArrowRight } from 'lucide-react';
import type { DraftSaveStatus, ESDraft } from '@entities/draft/model/types';
import { SidebarDraftList } from '@widgets/workspace/ui/SidebarDraftList';
import { parseSearchQuery } from '@shared/validation/searchParams';

interface SidebarProps {
  drafts: ESDraft[];
  currentDraftId: string;
  onSelectDraft: (id: string) => void;
  onCreateNewDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (id: string) => void;
  onToggleStar: (id: string) => void;
  isLoading: boolean;
  saveStatus: DraftSaveStatus;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  footerSlot?: React.ReactNode;
}

const CATEGORY_TAG_LABELS = {
  all: 'すべて',
  uncategorized: '未分類',
  gakuchika: 'ガクチカ',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折',
  jiku: '就活軸',
  future: '入社後',
  custom: '自由記述',
} as const;

type CategoryFilter = keyof typeof CATEGORY_TAG_LABELS;
type FilterSelection = { kind: 'category'; value: CategoryFilter } | { kind: 'starred' };

interface FilterState {
  searchInput: string;
  selection: FilterSelection;
}

const INITIAL_FILTER_STATE: FilterState = {
  searchInput: '',
  selection: { kind: 'category', value: 'all' },
};

function filterDrafts(
  drafts: ESDraft[],
  selection: FilterSelection,
  searchQuery: string,
): ESDraft[] {
  return drafts.filter((draft) => {
    if (selection.kind === 'starred' && !draft.starred) return false;
    if (
      selection.kind === 'category' &&
      selection.value !== 'all' &&
      (selection.value === 'uncategorized'
        ? draft.category !== null
        : draft.category !== selection.value)
    ) {
      return false;
    }

    if (!searchQuery) return true;

    const matchTitle = draft.title.toLowerCase().includes(searchQuery);
    const matchCompany = (draft.companyName || '').toLowerCase().includes(searchQuery);
    const matchContent = draft.content.toLowerCase().includes(searchQuery);
    return matchTitle || matchCompany || matchContent;
  });
}

export function Sidebar({
  drafts,
  currentDraftId,
  onSelectDraft,
  onCreateNewDraft,
  onDeleteDraft,
  onDuplicateDraft,
  onToggleStar,
  isLoading,
  saveStatus,
  isMobileOpen,
  onCloseMobile,
  footerSlot,
}: SidebarProps) {
  const [filter, setFilter] = useState(INITIAL_FILTER_STATE);

  // Keep the source input and filter controls responsive. Only the list
  // projection consumes deferred values, so a large catalog never blocks a
  // keystroke or delays the selected button's visual state.
  const deferredDrafts = useDeferredValue(drafts);
  const deferredFilter = useDeferredValue(filter);
  const deferredSearchQuery = parseSearchQuery(deferredFilter.searchInput);
  const filteredDrafts = filterDrafts(
    deferredDrafts,
    deferredFilter.selection,
    deferredSearchQuery,
  );
  const isFilterPending = deferredDrafts !== drafts || deferredFilter !== filter;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="サイドバーを閉じる"
          className="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-neutral-900/30 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        aria-busy={isLoading}
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-neutral-50/95 transition-transform duration-200 ease-in-out lg:static lg:w-80 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900">下書き一覧</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600">
              {drafts.length}件
            </span>
          </div>

          <button
            id="sidebar-new-draft-btn"
            type="button"
            onClick={() => {
              onCreateNewDraft();
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
            title="新しいエントリーシートを作成"
          >
            <Plus className="h-4 w-4" />
            <span>新規作成</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col gap-2 border-b border-neutral-200 bg-white p-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1.5">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              id="sidebar-search-input"
              type="text"
              value={filter.searchInput}
              maxLength={200}
              onChange={(event) =>
                setFilter((current) => ({ ...current, searchInput: event.target.value }))
              }
              placeholder="企業名や内容で検索..."
              aria-label="企業名や内容で検索"
              className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-hidden"
            />
            {filter.searchInput && (
              <button
                type="button"
                onClick={() => setFilter((current) => ({ ...current, searchInput: '' }))}
                aria-label="検索キーワードをクリア"
                className="px-1 text-xs text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex scrollbar-none items-center gap-1 overflow-x-auto pb-0.5">
            <button
              type="button"
              aria-pressed={filter.selection.kind === 'starred'}
              onClick={() =>
                setFilter((current) => ({
                  ...current,
                  selection:
                    current.selection.kind === 'starred'
                      ? { kind: 'category', value: 'all' }
                      : { kind: 'starred' },
                }))
              }
              className={`flex shrink-0 cursor-pointer items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                filter.selection.kind === 'starred'
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Star
                className={`h-3 w-3 ${filter.selection.kind === 'starred' ? 'fill-amber-500 text-amber-500' : ''}`}
              />
              <span>重要</span>
            </button>

            {Object.entries(CATEGORY_TAG_LABELS).map(([key, label]) => {
              const category = key as CategoryFilter;
              const isSelected =
                filter.selection.kind === 'category' && filter.selection.value === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setFilter((current) => ({
                      ...current,
                      selection: { kind: 'category', value: category },
                    }))
                  }
                  className={`shrink-0 cursor-pointer rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-150 ${isFilterPending ? 'opacity-70' : 'opacity-100'}`}
        >
          <SidebarDraftList
            drafts={filteredDrafts}
            currentDraftId={currentDraftId}
            onSelectDraft={onSelectDraft}
            onCloseMobile={onCloseMobile}
            onDeleteDraft={onDeleteDraft}
            onDuplicateDraft={onDuplicateDraft}
            onToggleStar={onToggleStar}
          />
        </div>

        {/* Footer: RSC footerSlot preferred */}
        {footerSlot ? (
          footerSlot
        ) : (
          <div className="space-y-2 border-t border-neutral-200 bg-white p-3 text-xs">
            <a
              id="sidebar-lp-link"
              href="/about"
              className="flex items-center justify-between rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              title="就活ESクラフトの機能一覧・LPを見る"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>機能一覧・LP</span>
              </div>
              <ArrowRight className="h-3 w-3 text-neutral-400" />
            </a>

            <div className="flex items-center justify-between pt-0.5 text-neutral-500">
              <div className="flex items-center gap-1.5">
                <HardDrive className="h-4 w-4 text-neutral-500" />
                <span>IndexedDB オフライン自動保存</span>
              </div>
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  saveStatus === 'error'
                    ? 'bg-rose-500'
                    : saveStatus === 'saving'
                      ? 'animate-ping bg-amber-400'
                      : 'bg-emerald-500'
                }`}
                title={saveStatus === 'error' ? '自動保存に失敗しました' : undefined}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
