"use client";

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
export const EditorHeaderBar: React.FC<EditorHeaderBarProps> = memo(({
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
    <div className="bg-white rounded-lg border border-neutral-200 p-2.5 sm:p-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-center">
        {/* Draft Title */}
        <div className="md:col-span-8">
          <label htmlFor="draft-title-input" className="text-xs font-semibold text-neutral-500 block mb-0.5">
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
            className="w-full text-lg font-bold text-neutral-900 placeholder-neutral-300 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-hidden py-0.5 transition-colors"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-4">
          <label htmlFor="draft-category-select" className="text-xs font-semibold text-neutral-500 block mb-0.5">
            設問カテゴリ
          </label>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200">
            <Tag className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              id="draft-category-select"
              value={draft.category}
              onChange={(e) => {
                onUpdateDraft({ category: e.target.value as ESQuestionCategory });
              }}
              aria-label="設問カテゴリ"
              className="w-full text-sm text-neutral-800 bg-transparent focus:outline-hidden cursor-pointer"
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
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-100">
        {/* Target Count Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
            <Target className="w-4 h-4 text-neutral-500" />
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
                className={`px-2.5 py-1 rounded text-sm font-mono font-medium transition-colors cursor-pointer border ${
                  currentTarget === t
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {t}字
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher */}
        <div className={`flex items-center p-0.5 bg-neutral-100 rounded-md border border-neutral-200 transition-opacity duration-150 ${isModePending ? 'opacity-70' : 'opacity-100'}`}>
          <button
            id="mode-tab-write"
            type="button"
            onClick={() => onChangeMode('write')}
            className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded transition-colors cursor-pointer ${
              activeMode === 'write'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>執筆</span>
          </button>
          <button
            id="mode-tab-structure"
            type="button"
            onClick={onTransferToBlocks}
            className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded transition-colors cursor-pointer ${
              activeMode === 'structure'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="STAR法（結論・課題・行動・成果・貢献）で思考を整理"
          >
            <Layers className="w-4 h-4" />
            <span>STAR構成</span>
            {hasUnappliedStarChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="未反映の変更あり" />
            )}
          </button>
          <button
            id="mode-tab-preview"
            type="button"
            onClick={() => onChangeMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded transition-colors cursor-pointer ${
              activeMode === 'preview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="客観的な閲覧と過去バージョンの復元"
          >
            <Eye className="w-4 h-4" />
            <span>プレビュー & 履歴</span>
            {(draft.snapshots?.length || 0) > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-full text-xs font-mono">
                {draft.snapshots?.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

EditorHeaderBar.displayName = 'EditorHeaderBar';
