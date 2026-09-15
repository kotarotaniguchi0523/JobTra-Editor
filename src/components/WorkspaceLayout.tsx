'use client';

import React, { useState, useTransition, useMemo, useCallback, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { useDrafts } from '../context/DraftContext';
import { Sidebar } from './Sidebar';
import { WorkspaceHeader } from './workspace/WorkspaceHeader';
import { WorkspaceDraftBar } from './workspace/WorkspaceDraftBar';
import { ESDraft } from '../types';
import { cleanForSubmission, auditText, calculateMetrics } from '../services/analyzer';

// 開いていない重いUIコンポーネントは React.lazy で遅延読み込み
const LazyReviewPanel = lazy(() =>
  import('./ReviewPanel').then((m) => ({ default: m.ReviewPanel })),
);

const LazyHandbookModal = lazy(() =>
  import('./HandbookModal').then((m) => ({ default: m.HandbookModal })),
);

const LazyExportModal = lazy(() =>
  import('./ExportModal').then((m) => ({ default: m.ExportModal })),
);

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  activeMode: 'write' | 'structure' | 'preview';
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
}

export function WorkspaceLayout({
  children,
  activeMode,
  brandSlot,
  linksSlot,
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

  // 単純なローカルフラグで状態管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentId = activeDraftId || activeDraft?.id || '';

  // 監査用メトリクスとチェック
  const activeContent = activeDraft?.content || '';
  const auditResult = useMemo(
    () => auditText(activeContent, activeDraft?.targetCount || 400),
    [activeContent, activeDraft?.targetCount],
  );
  const metricsResult = useMemo(() => calculateMetrics(activeContent), [activeContent]);

  // クリップボードへ提出用コピー
  const handleCopyClean = useCallback(() => {
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
  }, [activeDraft]);

  // 下書き更新ハンドラ
  const handleUpdateDraft = useCallback(
    (partial: Partial<ESDraft>, immediate: boolean = false) => {
      if (!activeDraft) return;
      updateDraft({ ...activeDraft, ...partial, updatedAt: Date.now() }, immediate);
    },
    [activeDraft, updateDraft],
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-100 font-sans text-neutral-900">
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
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <WorkspaceHeader
          brandSlot={brandSlot}
          linksSlot={linksSlot}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isPending={isPending}
          isSaving={isSaving}
          isAuditOpen={isAuditOpen}
          onToggleAudit={() => setIsAuditOpen(!isAuditOpen)}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          isCopied={isCopied}
          onCopyClean={handleCopyClean}
          onOpenExport={activeDraft ? () => setIsExportOpen(true) : undefined}
        />

        {activeDraft && (
          <WorkspaceDraftBar
            activeDraft={activeDraft}
            currentId={currentId}
            activeMode={activeMode}
            onUpdateDraft={handleUpdateDraft}
          />
        )}

        {/* 3. 各ページのワークスペース本体 */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-5">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-neutral-400">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>下書きを読み込んでいます...</span>
              </div>
            ) : !activeDraft ? (
              emptyDraftGuideSlot || (
                <div className="py-16 text-center text-neutral-400">
                  <p className="text-sm">
                    下書きがありません。「新規作成」をクリックしてください。
                  </p>
                </div>
              )
            ) : (
              children
            )}
          </main>

          {/* 4. リアルタイム監査パネル（開いた時のみ React.lazy で遅延ロード） */}
          {isAuditOpen && activeDraft && (
            <>
              {/* モバイル用背景オーバーレイ */}
              <button
                type="button"
                aria-label="文章監査パネルを閉じる"
                className="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-neutral-900/30 backdrop-blur-xs lg:hidden"
                onClick={() => setIsAuditOpen(false)}
              />

              <aside className="animate-fadeIn fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-neutral-200 bg-white shadow-2xl lg:static lg:z-auto lg:w-96 lg:shadow-none">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-4 text-xs text-neutral-400">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            </>
          )}
        </div>
      </div>

      {/* 5. 推敲ハンドブックモーダル（開いた時のみ React.lazy で遅延ロード） */}
      {isHandbookOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                推敲ガイドを読み込み中...
              </div>
            </div>
          }
        >
          <LazyHandbookModal isOpen={isHandbookOpen} onClose={() => setIsHandbookOpen(false)}>
            {handbookSlot}
          </LazyHandbookModal>
        </Suspense>
      )}

      {/* 6. エクスポートモーダル（ブラウザ内minitype PDF / Markdown） */}
      {isExportOpen && activeDraft && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                エクスポート設定を読み込み中...
              </div>
            </div>
          }
        >
          <LazyExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            draft={activeDraft}
          />
        </Suspense>
      )}
    </div>
  );
}
