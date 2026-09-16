import React from 'react';
import { Tag, Target, FileEdit, Layers, Eye } from 'lucide-react';
import { ESDraft, ESQuestionCategory } from '@entities/draft/model/types';
import { parseCategory } from '@shared/validation/draftSchemas';
import { pathWithDraftId } from '@shared/validation/searchParams';

interface WorkspaceDraftBarProps {
  activeDraft: ESDraft;
  currentId: string;
  activeMode: 'write' | 'structure' | 'preview';
  onUpdateDraft: (updates: Partial<ESDraft>) => void;
}

const CATEGORY_SELECT_LABELS: Record<ESQuestionCategory, string> = {
  gakuchika: 'ガクチカ（学生時代注力）',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折克服',
  jiku: '就活の軸・価値観',
  future: '入社後キャリア・ビジョン',
  custom: '自由記述',
};

const TARGET_PRESETS = [200, 300, 400, 500, 600, 800];

export function WorkspaceDraftBar({
  activeDraft,
  currentId,
  activeMode,
  onUpdateDraft,
}: WorkspaceDraftBarProps) {
  return (
    <div className="shrink-0 space-y-2 border-b border-neutral-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
        <div className="md:col-span-8">
          <label htmlFor="draft-title-input" className="sr-only">
            下書きタイトル
          </label>
          <input
            id="draft-title-input"
            type="text"
            value={activeDraft.title}
            onChange={(e) => onUpdateDraft({ title: e.target.value })}
            placeholder="タイトル / 企業・設問テーマ"
            aria-label="タイトルまたは企業・設問テーマ"
            className="w-full border-b border-transparent bg-transparent py-0.5 text-base font-bold text-neutral-900 placeholder-neutral-300 transition-colors hover:border-neutral-200 focus:border-neutral-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 md:col-span-4">
          <Tag className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <label htmlFor="draft-category-select" className="sr-only">
            設問カテゴリ
          </label>
          <select
            id="draft-category-select"
            value={activeDraft.category}
            onChange={(e) => onUpdateDraft({ category: parseCategory(e.target.value) })}
            aria-label="設問カテゴリ"
            className="w-full cursor-pointer bg-transparent text-sm text-neutral-800 focus:outline-hidden"
          >
            {Object.entries(CATEGORY_SELECT_LABELS).map(([cat, label]) => (
              <option key={cat} value={cat}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 目標字数 ＆ SPAページ切り替えナビゲーション */}
      <div className="flex flex-col gap-2 border-t border-neutral-100 pt-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-neutral-600">
            <Target className="h-3.5 w-3.5 text-neutral-500" />
            目標字数:
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {TARGET_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onUpdateDraft({ targetCount: t })}
                className={`cursor-pointer rounded border px-2 py-0.5 font-mono text-xs font-medium transition-colors ${
                  (activeDraft.targetCount || 400) === t
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {t}字
              </button>
            ))}
          </div>
        </div>

        {/* SPA ルートタブ（Funstack Router によりSPA遷移） */}
        <nav className="flex w-full items-center rounded-md border border-neutral-200 bg-neutral-100 p-0.5 text-xs sm:w-auto">
          <a
            id="mode-tab-write"
            href={pathWithDraftId('/', currentId)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2.5 py-1 font-medium whitespace-nowrap no-underline transition-colors sm:flex-initial sm:px-3 ${
              activeMode === 'write'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileEdit className="h-3.5 w-3.5 shrink-0" />
            <span>執筆</span>
          </a>

          <a
            id="mode-tab-structure"
            href={pathWithDraftId('/structure', currentId)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2.5 py-1 font-medium whitespace-nowrap no-underline transition-colors sm:flex-initial sm:px-3 ${
              activeMode === 'structure'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="STAR法（結論・課題・行動・成果・貢献）で思考を整理"
          >
            <Layers className="h-3.5 w-3.5 shrink-0" />
            <span>STAR構成</span>
          </a>

          <a
            id="mode-tab-preview"
            href={pathWithDraftId('/preview', currentId)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2.5 py-1 font-medium whitespace-nowrap no-underline transition-colors sm:flex-initial sm:px-3 ${
              activeMode === 'preview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="客観的な閲覧と過去バージョンの復元"
          >
            <Eye className="h-3.5 w-3.5 shrink-0" />
            <span>プレビュー</span>
            {(activeDraft.snapshots?.length || 0) > 0 && (
              <span className="py-0.2 rounded-full bg-neutral-200 px-1.5 font-mono text-xs text-neutral-700">
                {activeDraft.snapshots?.length}
              </span>
            )}
          </a>
        </nav>
      </div>
    </div>
  );
}
