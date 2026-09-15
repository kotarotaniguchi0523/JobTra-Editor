"use client";

import React, { useState, useTransition, useMemo, Suspense, lazy } from 'react';
import { 
  FileEdit, 
  Layers, 
  Eye, 
  ShieldCheck, 
  BookOpen, 
  Menu, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  Tag,
  Target
} from 'lucide-react';
import { useDrafts } from '../context/DraftContext';
import { Sidebar } from './Sidebar';
import { ESQuestionCategory, ESDraft } from '../types';
import { cleanForSubmission, auditText, calculateMetrics } from '../services/analyzer';

// 開いていない重いUIコンポーネントは React.lazy で遅延読み込み
const LazyReviewPanel = lazy(() =>
  import('./ReviewPanel').then((m) => ({ default: m.ReviewPanel }))
);

const LazyHandbookModal = lazy(() =>
  import('./HandbookModal').then((m) => ({ default: m.HandbookModal }))
);

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  activeMode: 'write' | 'structure' | 'preview';
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
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

export function WorkspaceLayout({
  children,
  activeMode,
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
}: WorkspaceLayoutProps) {
  const {
    drafts,
    activeDraftId,
    activeDraft,
    isLoading,
    isSaving,
    selectDraft,
    createDraft,
    updateDraft,
    deleteDraft,
    duplicateDraft,
    toggleStar,
  } = useDrafts();

  // 単純なローカルフラグで状態管理（Reducerに走らない設計）
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentId = activeDraftId || activeDraft?.id || '';

  // 監査用メトリクスとチェック
  const activeContent = activeDraft?.content || '';
  const auditResult = useMemo(
    () => auditText(activeContent, activeDraft?.targetCount || 400),
    [activeContent, activeDraft?.targetCount]
  );
  const metricsResult = useMemo(() => calculateMetrics(activeContent), [activeContent]);

  // クリップボードへ提出用コピー
  const handleCopyClean = () => {
    if (!activeDraft) return;
    const cleanText = cleanForSubmission(activeDraft.content);
    navigator.clipboard.writeText(cleanText).then(() => {
      startTransition(() => {
        setIsCopied(true);
      });
      setTimeout(() => {
        startTransition(() => {
          setIsCopied(false);
        });
      }, 2000);
    });
  };

  // 下書き更新ハンドラ
  const handleUpdateDraft = (partial: Partial<ESDraft>, immediate: boolean = false) => {
    if (!activeDraft) return;
    updateDraft({ ...activeDraft, ...partial, updatedAt: Date.now() }, immediate);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 text-neutral-900 font-sans">
      {/* 1. 共通サイドバー */}
      <Sidebar
        drafts={drafts}
        currentDraftId={currentId}
        onSelectDraft={(id) => {
          selectDraft(id);
          setIsSidebarOpen(false);
        }}
        onCreateNewDraft={() => createDraft()}
        onDuplicateDraft={(id) => duplicateDraft(id)}
        onDeleteDraft={(id) => deleteDraft(id)}
        onToggleStar={(id) => toggleStar(id)}
        isSaving={isSaving}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        footerSlot={sidebarFooterSlot}
      />

      {/* 2. メイン領域 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* トップヘッダー */}
        <header
          id="app-top-header"
          className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between shrink-0 z-20"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="下書き一覧を開く"
              aria-label="下書き一覧を開く"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <a href="/" className="flex items-center gap-2.5 text-inherit no-underline">
                <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider">
                  ES
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-neutral-900 tracking-tight">
                      就活ESクラフト
                    </h1>
                    {isPending && (
                      <span className="flex items-center gap-1 text-xs text-neutral-400 font-medium animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        同期中
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 自動保存ステータス */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 pr-2 border-r border-neutral-200">
              {isSaving ? (
                <span className="flex items-center gap-1.5 text-neutral-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                  保存中...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-neutral-500" title="IndexedDBに自動保存されています">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  保存済み
                </span>
              )}
            </div>

            {/* 機能紹介リンク */}
            <a
              id="header-lp-link"
              href="/about"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              title="機能紹介・LPを見る"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>機能紹介</span>
            </a>

            {/* 推敲ハンドブック */}
            <button
              id="header-handbook-btn"
              type="button"
              onClick={() => setIsHandbookOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
              title="STAR法・配分比率・推敲ガイドを開く"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
              <span>推敲ガイド</span>
            </button>

            {/* 監査パネル展開トグル */}
            <button
              id="header-audit-toggle-btn"
              type="button"
              onClick={() => setIsAuditOpen(!isAuditOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                isAuditOpen
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="リアルタイム日本語監査・推敲アドバイス"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">文章監査</span>
            </button>

            {/* 提出用コピー */}
            <button
              id="clean-copy-btn"
              type="button"
              onClick={handleCopyClean}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
              title="余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>コピー完了</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>提出用にコピー</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* 下書きヘッダーバー & SPAルートタブ切り替え */}
        {activeDraft && (
          <div className="bg-white border-b border-neutral-200 px-4 py-2.5 shrink-0 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <div className="md:col-span-8">
                <input
                  id="draft-title-input"
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => handleUpdateDraft({ title: e.target.value })}
                  placeholder="タイトル / 企業・設問テーマ"
                  className="w-full text-base font-bold text-neutral-900 placeholder-neutral-300 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-hidden py-0.5 transition-colors"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200">
                <Tag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <select
                  id="draft-category-select"
                  value={activeDraft.category}
                  onChange={(e) =>
                    handleUpdateDraft({ category: e.target.value as ESQuestionCategory })
                  }
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
                      onClick={() => handleUpdateDraft({ targetCount: t })}
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
                    <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded-full text-[10px] font-mono">
                      {activeDraft.snapshots?.length}
                    </span>
                  )}
                </a>
              </nav>
            </div>
          </div>
        )}

        {/* 3. 各ページのワークスペース本体 */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>下書きを読み込んでいます...</span>
              </div>
            ) : !activeDraft ? (
              emptyDraftGuideSlot || (
                <div className="text-center py-16 text-neutral-400">
                  <p className="text-sm">下書きがありません。「新規作成」をクリックしてください。</p>
                </div>
              )
            ) : (
              children
            )}
          </main>

          {/* 4. リアルタイム監査パネル（開いた時のみ React.lazy で遅延ロード） */}
          {isAuditOpen && activeDraft && (
            <aside className="w-80 lg:w-96 border-l border-neutral-200 bg-white overflow-y-auto shrink-0 shadow-lg lg:shadow-none animate-fadeIn">
              <Suspense
                fallback={
                  <div className="p-4 flex items-center justify-center text-neutral-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    監査モジュールを読み込み中...
                  </div>
                }
              >
                <LazyReviewPanel
                  checks={auditResult}
                  metrics={metricsResult}
                  guidelinesSlot={guidelinesSlot}
                  onClose={() => setIsAuditOpen(false)}
                  onApplyReplacement={(original, suggested) => {
                    const nextContent = activeDraft.content.replace(original, suggested);
                    handleUpdateDraft({ content: nextContent }, true);
                  }}
                />
              </Suspense>
            </aside>
          )}
        </div>
      </div>

      {/* 5. 推敲ハンドブックモーダル（開いた時のみ React.lazy で遅延ロード） */}
      {isHandbookOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white p-4 rounded-lg text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                推敲ガイドを読み込み中...
              </div>
            </div>
          }
        >
          <LazyHandbookModal
            isOpen={isHandbookOpen}
            onClose={() => setIsHandbookOpen(false)}
          >
            {handbookSlot}
          </LazyHandbookModal>
        </Suspense>
      )}
    </div>
  );
}
