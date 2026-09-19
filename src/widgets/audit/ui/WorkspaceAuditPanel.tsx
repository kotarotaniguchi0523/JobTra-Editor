import React, { useDeferredValue } from 'react';
import type { ESDraft } from '@entities/draft/model/types';
import { auditText, calculateMetrics } from '@features/writing-assistance/lib/analyzer';
import { ReviewPanel } from '@widgets/audit/ui/ReviewPanel';

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
export function WorkspaceAuditPanel({
  draft,
  guidelinesSlot,
  onClose,
  onApplyReplacement,
}: WorkspaceAuditPanelProps) {
  const deferredContent = useDeferredValue(draft.content);
  const checks = auditText(deferredContent, draft.targetCount);
  const metrics = calculateMetrics(deferredContent);

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
}
