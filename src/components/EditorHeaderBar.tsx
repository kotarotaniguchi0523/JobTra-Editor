'use client';

import React, { memo } from 'react';
import { Tag, Target, FileEdit, Layers, Eye } from 'lucide-react';
import { ESDraft, ESQuestionCategory, EditorMode } from '../types';

interface EditorHeaderBarProps {
  draft: ESDraft;
  onUpdateDraft: (partial: Partial<ESDraft>, immediate?: boolean) => void;
  activeMode: EditorMode;
  onChangeMode: (mode: EditorMode) => void;
  targetCount: number;
  onChangeTargetCount: (target: number) => void;
  onTransferToBlocks: () => void;
  hasUnappliedStarChanges: boolean;
  isModePending: boolean;
}

const CATEGORY_LABELS: Record<ESQuestionCategory, string> = {
  gakuchika: 'ガクチカ（学生時代注力）',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折克服',
  jiku: '就活の軸・価値観',
  future: '入社後キャリア・ビジョン',
  custom: '自由記述',
};

const TARGET_PRESETS = [200, 300, 400, 500, 600, 800];

/**
 * EditorHeaderBar:
 * 下書きのメタデータ（タイトル、カテゴリ、目標字数）とモード切替タブの責務を担うコンポーネント
 */
export const EditorHeaderBar: React.FC<EditorHeaderBarProps> = memo(
  ({
    draft,
    onUpdateDraft,
    activeMode,
    onChangeMode,
    targetCount,
    onChangeTargetCount,
    onTransferToBlocks,
    hasUnappliedStarChanges,
    isModePending,
  }) => {
    const currentTarget = targetCount || draft.targetCount || 400;

    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-2.5 sm:p-3">
        <div className="grid grid-cols-1 items-center gap-2 sm:gap-2.5 md:grid-cols-12">
          {/* Draft Title */}
          <div className="md:col-span-8">
            <label
              htmlFor="draft-title-input"
              className="mb-0.5 block text-xs font-semibold text-neutral-500"
            >
              タイトル / 企業・設問テーマ
            </label>
            <input
              id="draft-title-input"
              type="text"
              value={draft.title}
              onChange={(e) => {
                onUpdateDraft({ title: e.target.value });
              }}
              placeholder="例: ○○商事 ガクチカ / カフェでの定着率改善"
              aria-label="タイトル / 企業・設問テーマ"
              className="w-full border-b border-transparent bg-transparent py-0.5 text-lg font-bold text-neutral-900 placeholder-neutral-300 transition-colors hover:border-neutral-200 focus:border-neutral-900 focus:outline-hidden"
            />
          </div>

          {/* Category Selector */}
          <div className="md:col-span-4">
            <label
              htmlFor="draft-category-select"
              className="mb-0.5 block text-xs font-semibold text-neutral-500"
            >
              設問カテゴリ
            </label>
            <div className="flex items-center gap-1.5 rounded-md bg-neutral-100/80 px-2.5 py-1.5">
              <Tag className="h-4 w-4 shrink-0 text-neutral-400" />
              <select
                id="draft-category-select"
                value={draft.category}
                onChange={(e) => {
                  onUpdateDraft({ category: e.target.value as ESQuestionCategory });
                }}
                aria-label="設問カテゴリ"
                className="w-full cursor-pointer bg-transparent text-sm text-neutral-800 focus:outline-hidden"
              >
                {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                  <option key={cat} value={cat}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sub-toolbar: Target presets & Mode tabs */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-2">
          {/* Target Count Pills */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
              <Target className="h-4 w-4 text-neutral-500" />
              目標字数:
            </span>
            <div className="flex items-center gap-1.5">
              {TARGET_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onChangeTargetCount(t);
                    onUpdateDraft({ targetCount: t });
                  }}
                  className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-sm font-medium transition-colors ${
                    currentTarget === t
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {t}字
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher */}
          <div
            className={`flex items-center rounded-md border border-neutral-200 bg-neutral-100 p-0.5 transition-opacity duration-150 ${isModePending ? 'opacity-70' : 'opacity-100'}`}
          >
            <button
              id="mode-tab-write"
              type="button"
              onClick={() => onChangeMode('write')}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors ${
                activeMode === 'write'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FileEdit className="h-4 w-4" />
              <span>執筆</span>
            </button>
            <button
              id="mode-tab-structure"
              type="button"
              onClick={onTransferToBlocks}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors ${
                activeMode === 'structure'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="STAR法（結論・課題・行動・成果・貢献）で思考を整理"
            >
              <Layers className="h-4 w-4" />
              <span>STAR構成</span>
              {hasUnappliedStarChanges && (
                <span className="h-2 w-2 rounded-full bg-amber-500" title="未反映の変更あり" />
              )}
            </button>
            <button
              id="mode-tab-preview"
              type="button"
              onClick={() => onChangeMode('preview')}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors ${
                activeMode === 'preview'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="客観的な閲覧と過去バージョンの復元"
            >
              <Eye className="h-4 w-4" />
              <span>プレビュー & 履歴</span>
              {(draft.snapshots?.length || 0) > 0 && (
                <span className="ml-0.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-xs text-neutral-700">
                  {draft.snapshots?.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

EditorHeaderBar.displayName = 'EditorHeaderBar';
