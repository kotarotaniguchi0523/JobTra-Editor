"use client";

import React, { memo } from 'react';
import { Tag, Target, FileEdit, Layers, Eye } from 'lucide-react';
import { ESDraft, ESQuestionCategory } from '../../types';

interface WorkspaceDraftBarProps {
  activeDraft: ESDraft;
  currentId: string;
  activeMode: 'write' | 'structure' | 'preview';
  onUpdateDraft: (updates: Partial<ESDraft>) => void;
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

export const WorkspaceDraftBar: React.FC<WorkspaceDraftBarProps> = memo(({
  activeDraft,
  currentId,
  activeMode,
  onUpdateDraft,
}) => {
  return (
    <div className="bg-white border-b border-neutral-200 px-4 py-2.5 shrink-0 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
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
            className="w-full text-base font-bold text-neutral-900 placeholder-neutral-300 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-hidden py-0.5 transition-colors"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200">
          <Tag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <label htmlFor="draft-category-select" className="sr-only">
            設問カテゴリ
          </label>
          <select
            id="draft-category-select"
            value={activeDraft.category}
            onChange={(e) =>
              onUpdateDraft({ category: e.target.value as ESQuestionCategory })
            }
            aria-label="設問カテゴリ"
            className="w-full text-xs text-neutral-800 bg-transparent focus:outline-hidden cursor-pointer"
          >
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
              <option key={cat} value={cat}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 目標字数 ＆ SPAページ切り替えナビゲーション */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-neutral-500" />
            目標字数:
          </span>
          <div className="flex items-center gap-1">
            {TARGET_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onUpdateDraft({ targetCount: t })}
                className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer border ${
                  (activeDraft.targetCount || 400) === t
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {t}字
              </button>
            ))}
          </div>
        </div>

        {/* SPA ルートタブ（Funstack Router によりSPA遷移） */}
        <nav className="flex items-center p-0.5 bg-neutral-100 rounded-md border border-neutral-200 text-xs">
          <a
            id="mode-tab-write"
            href={`/?id=${currentId}`}
            className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded transition-colors no-underline ${
              activeMode === 'write'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>執筆</span>
          </a>

          <a
            id="mode-tab-structure"
            href={`/structure?id=${currentId}`}
            className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded transition-colors no-underline ${
              activeMode === 'structure'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="STAR法（結論・課題・行動・成果・貢献）で思考を整理"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>STAR構成</span>
          </a>

          <a
            id="mode-tab-preview"
            href={`/preview?id=${currentId}`}
            className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded transition-colors no-underline ${
              activeMode === 'preview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="客観的な閲覧と過去バージョンの復元"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>プレビュー & 履歴</span>
            {(activeDraft.snapshots?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded-full text-xs font-mono">
                {activeDraft.snapshots?.length}
              </span>
            )}
          </a>
        </nav>
      </div>
    </div>
  );
});
