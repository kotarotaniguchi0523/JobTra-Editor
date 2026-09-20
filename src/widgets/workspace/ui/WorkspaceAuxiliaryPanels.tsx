'use client';

import { startTransition, Suspense, lazy, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

const LazyWorkspaceAuditPanel = lazy(() =>
  import('@widgets/audit/ui/WorkspaceAuditPanel').then((m) => ({
    default: m.WorkspaceAuditPanel,
  })),
);

const LazyHandbookModal = lazy(() =>
  import('@widgets/handbook/ui/HandbookModal').then((m) => ({ default: m.HandbookModal })),
);

const LazyExportModal = lazy(() =>
  import('@features/export/ui/ExportModal').then((m) => ({ default: m.ExportModal })),
);

const LazyDeviceSyncPanel = lazy(() =>
  import('@features/device-sync/ui/DeviceSyncPanel').then((m) => ({
    default: m.DeviceSyncPanel,
  })),
);

interface WorkspaceAuxiliaryPanelsProps {
  handbookSlot?: ReactNode;
  guidelinesSlot?: ReactNode;
}

function PanelLoading({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </div>
  );
}

/**
 * Keeps optional client panels out of the static frame. Deferred server slots
 * are rendered only when the corresponding panel is opened.
 */
export function WorkspaceAuxiliaryPanels({
  handbookSlot,
  guidelinesSlot,
}: WorkspaceAuxiliaryPanelsProps) {
  const { activeDraft, openPanel, setPanel, updateDraft } = useWorkspaceInteraction();

  return (
    <>
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
              startTransition(() => updateDraft({ content: nextContent }, true));
            }}
          />
        </Suspense>
      )}

      {openPanel === 'handbook' && (
        <Suspense fallback={<PanelLoading label="推敲ガイドを読み込み中..." />}>
          <LazyHandbookModal isOpen onClose={() => setPanel(null)}>
            {handbookSlot}
          </LazyHandbookModal>
        </Suspense>
      )}

      {openPanel === 'export' && activeDraft && (
        <Suspense fallback={<PanelLoading label="エクスポート設定を読み込み中..." />}>
          <LazyExportModal isOpen onClose={() => setPanel(null)} draft={activeDraft} />
        </Suspense>
      )}

      {openPanel === 'sync' && (
        <Suspense fallback={<PanelLoading label="同期パネルを読み込み中..." />}>
          <LazyDeviceSyncPanel onClose={() => setPanel(null)} />
        </Suspense>
      )}
    </>
  );
}
