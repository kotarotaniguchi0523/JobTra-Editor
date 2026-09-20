import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '@widgets/handbook/rsc/ESHandbook';
import { AuditGuidelines } from '@widgets/audit/rsc/AuditGuidelines';
import { SidebarFooter } from '@widgets/workspace/rsc/SidebarFooter';
import { EmptyDraftGuide } from '@widgets/workspace/rsc/EmptyDraftGuide';
import { SubmissionChecklist } from '@widgets/preview/rsc/SubmissionChecklist';
import { HeaderBrand, HeaderStaticLinks } from '@widgets/workspace/rsc/HeaderBrand';
import { PreviewIsland } from '@widgets/preview/ui/PreviewIsland';
import { WorkspaceLayout } from '@widgets/workspace/rsc/WorkspaceLayout';
import { HandbookLoadingFallback } from '@widgets/handbook/rsc/HandbookLoadingFallback';

/**
 * Preview Page (/preview) for Funstack Static File-System Routing
 * Clean submission text & snapshot history. Defer splits the SubmissionChecklist RSC payload.
 */
export default function PreviewPage() {
  return (
    <WorkspaceLayout
      activeMode="preview"
      brandSlot={<HeaderBrand />}
      linksSlot={<HeaderStaticLinks />}
      sidebarFooterSlot={<SidebarFooter />}
      emptyDraftGuideSlot={<EmptyDraftGuide />}
      guidelinesSlot={
        <Suspense fallback={<div className="p-4 text-xs text-neutral-400">監査基準読込中...</div>}>
          {defer(<AuditGuidelines />, { name: 'AuditGuidelines' })}
        </Suspense>
      }
      handbookSlot={
        <Suspense fallback={<HandbookLoadingFallback />}>
          {defer(<ESHandbook />, { name: 'ESHandbook' })}
        </Suspense>
      }
    >
      <PreviewIsland
        checklistSlot={
          <Suspense
            fallback={<div className="p-4 text-xs text-neutral-400">チェックリスト読込中...</div>}
          >
            {defer(<SubmissionChecklist />, { name: 'SubmissionChecklist' })}
          </Suspense>
        }
      />
    </WorkspaceLayout>
  );
}
