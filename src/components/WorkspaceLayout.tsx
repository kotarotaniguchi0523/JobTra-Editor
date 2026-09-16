import React, { useState, useTransition, useCallback, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { useDraftActions, useDraftData, useDraftSaveStatus } from '../context/DraftContext';
import { Sidebar } from './Sidebar';
import { WorkspaceHeader } from './workspace/WorkspaceHeader';
import { WorkspaceDraftBar } from './workspace/WorkspaceDraftBar';
import { ESDraft } from '../types';

// クライアントの重いUIは遅延読み込みし、静的ガイドはActivityで先読み可能にする
const LazyWorkspaceAuditPanel = lazy(() =>
  import('./WorkspaceAuditPanel').then((m) => ({ default: m.WorkspaceAuditPanel })),
);

const LazyHandbookModal = lazy(() =>
  import('./HandbookModal').then((m) => ({ default: m.HandbookModal })),
);

const LazyExportModal = lazy(() =>
  import('./export/ExportModal').then((m) => ({ default: m.ExportModal })),
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

type WorkspacePanel = 'sidebar' | 'audit' | 'handbook' | 'export' | null;

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
  const { drafts, activeDraftId, activeDraft, isLoading } = useDraftData();
  const { isSaving, saveStatus } = useDraftSaveStatus();
  const { selectDraft, createDraft, updateDraft, deleteDraft, duplicateDraft, toggleStar } =
    useDraftActions();

  const [openPanel, setOpenPanel] = useState<WorkspacePanel>(null);
  const [, startTransition] = useTransition();

  const setPanel = useCallback(
    (panel: WorkspacePanel) => {
      // Opening a lazy/heavy panel may suspend. Closing and mobile drawer
      // interactions are small urgent updates and should never lag.
      if (panel === null || panel === 'sidebar') {
        setOpenPanel(panel);
      } else {
        startTransition(() => setOpenPanel(panel));
      }
    },
    [startTransition],
  );

  const currentId = activeDraftId || activeDraft?.id || '';

  const handleUpdateDraft = useCallback(
    (partial: Partial<ESDraft>, immediate: boolean = false) => {
      if (!activeDraft) return;
      updateDraft({ ...activeDraft, ...partial, updatedAt: Date.now() }, immediate);
    },
    [activeDraft, updateDraft],
  );

  const handleSelectDraft = useCallback(
    (id: string) => {
      selectDraft(id);
      setPanel(null);
    },
    [selectDraft, setPanel],
  );

  const handleCreateNewDraft = useCallback(() => {
    void createDraft();
  }, [createDraft]);

  const handleDeleteDraft = useCallback(
    (id: string) => {
      const nextActiveId =
        activeDraftId === id ? (drafts.find((draft) => draft.id !== id)?.id ?? '') : activeDraftId;
      void deleteDraft(id, nextActiveId);
    },
    [activeDraftId, deleteDraft, drafts],
  );

  const handleDuplicateDraft = useCallback(
    (id: string) => {
      const target = drafts.find((draft) => draft.id === id);
      if (target) void duplicateDraft(target);
    },
    [drafts, duplicateDraft],
  );

  const handleToggleStar = useCallback(
    (id: string) => {
      const target = drafts.find((draft) => draft.id === id);
      if (target) void toggleStar(target);
    },
    [drafts, toggleStar],
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-100 font-sans text-neutral-900">
      {/* 1. 共通サイドバー */}
      <Sidebar
        drafts={drafts}
        currentDraftId={currentId}
        onSelectDraft={handleSelectDraft}
        onCreateNewDraft={handleCreateNewDraft}
        onDuplicateDraft={handleDuplicateDraft}
        onDeleteDraft={handleDeleteDraft}
        onToggleStar={handleToggleStar}
        isSaving={isSaving}
        saveStatus={saveStatus}
        isMobileOpen={openPanel === 'sidebar'}
        onCloseMobile={() => setPanel(null)}
        footerSlot={sidebarFooterSlot}
      />

      {/* 2. メイン領域 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <WorkspaceHeader
          brandSlot={brandSlot}
          linksSlot={linksSlot}
          onOpenSidebar={() => setPanel('sidebar')}
          isSaving={isSaving}
          saveStatus={saveStatus}
          isAuditOpen={openPanel === 'audit'}
          onToggleAudit={() => setPanel(openPanel === 'audit' ? null : 'audit')}
          onOpenHandbook={() => setPanel('handbook')}
          copyContent={activeDraft?.content || null}
          onOpenExport={activeDraft ? () => setPanel('export') : undefined}
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

          {/* 4. リアルタイム監査パネル（開いた時のみ遅延ロード） */}
          {openPanel === 'audit' && activeDraft && (
            <Suspense
              fallback={
                <>
                  <button
                    type="button"
                    aria-label="文章監査パネルを閉じる"
                    className="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-neutral-900/30 backdrop-blur-xs lg:hidden"
                    onClick={() => setPanel(null)}
                  />
                  <aside className="animate-fadeIn fixed inset-y-0 right-0 z-50 flex w-full max-w-sm items-center justify-center overflow-y-auto border-l border-neutral-200 bg-white shadow-2xl lg:static lg:z-auto lg:w-96 lg:shadow-none">
                    <div className="flex items-center justify-center p-4 text-xs text-neutral-400">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      監査モジュールを読み込み中...
                    </div>
                  </aside>
                </>
              }
            >
              <LazyWorkspaceAuditPanel
                draft={activeDraft}
                guidelinesSlot={guidelinesSlot}
                onClose={() => setPanel(null)}
                onApplyReplacement={(original, suggested) => {
                  const nextContent = activeDraft.content.replace(original, suggested);
                  handleUpdateDraft({ content: nextContent }, true);
                }}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* 5. 推敲ハンドブックモーダル（hidden Activityで静的ペイロードを先読み） */}
      <Suspense
        fallback={
          openPanel === 'handbook' ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                推敲ガイドを読み込み中...
              </div>
            </div>
          ) : null
        }
      >
        <LazyHandbookModal isOpen={openPanel === 'handbook'} onClose={() => setPanel(null)}>
          {handbookSlot}
        </LazyHandbookModal>
      </Suspense>

      {/* 6. エクスポートモーダル（ブラウザ内minitype PDF / Markdown） */}
      {activeDraft && (
        <Suspense
          fallback={
            openPanel === 'export' ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  エクスポート設定を読み込み中...
                </div>
              </div>
            ) : null
          }
        >
          <LazyExportModal
            isOpen={openPanel === 'export'}
            onClose={() => setPanel(null)}
            draft={activeDraft}
          />
        </Suspense>
      )}
    </div>
  );
}
