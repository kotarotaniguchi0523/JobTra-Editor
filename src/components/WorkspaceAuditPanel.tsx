import React, { memo, useDeferredValue, useMemo } from 'react';
import type { ESDraft } from '../types';
import { auditText, calculateMetrics } from '../services/analyzer';
import { ReviewPanel } from './ReviewPanel';

interface WorkspaceAuditPanelProps {
  draft: ESDraft;
  guidelinesSlot?: React.ReactNode;
  onClose: () => void;
  onApplyReplacement: (original: string, suggested: string) => void;
}

/**
 * Keeps audit work out of the workspace shell. The draft itself remains
 * urgent; only the derived checks and metrics follow the deferred content.
 */
export const WorkspaceAuditPanel: React.FC<WorkspaceAuditPanelProps> = memo(
  ({ draft, guidelinesSlot, onClose, onApplyReplacement }) => {
    const deferredContent = useDeferredValue(draft.content);
    const checks = useMemo(
      () => auditText(deferredContent, draft.targetCount || 400),
      [deferredContent, draft.targetCount],
    );
    const metrics = useMemo(() => calculateMetrics(deferredContent), [deferredContent]);

    return (
      <>
        <button
          type="button"
          aria-label="文章監査パネルを閉じる"
          className="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-neutral-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />

        <aside className="animate-fadeIn fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-neutral-200 bg-white shadow-2xl lg:static lg:z-auto lg:w-96 lg:shadow-none">
          <ReviewPanel
            checks={checks}
            metrics={metrics}
            guidelinesSlot={guidelinesSlot}
            onClose={onClose}
            onApplyReplacement={onApplyReplacement}
          />
        </aside>
      </>
    );
  },
);

WorkspaceAuditPanel.displayName = 'WorkspaceAuditPanel';
