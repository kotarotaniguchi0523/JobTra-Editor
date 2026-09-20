import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '@widgets/handbook/rsc/ESHandbook';
import { AuditGuidelines } from '@widgets/audit/rsc/AuditGuidelines';
import { SidebarFooter } from '@widgets/workspace/rsc/SidebarFooter';
import { EmptyDraftGuide } from '@widgets/workspace/rsc/EmptyDraftGuide';
import { HeaderBrand, HeaderStaticLinks } from '@widgets/workspace/rsc/HeaderBrand';
import { WorkspaceLayout } from '@widgets/workspace/rsc/WorkspaceLayout';
import { WebMcpIsland } from '@features/webmcp/ui/WebMcpIsland';
import { WriteEditorIsland } from '@widgets/editor/ui/WriteEditorIsland';
import { HandbookLoadingFallback } from '@widgets/handbook/rsc/HandbookLoadingFallback';

/**
 * Top Page (/) for Funstack Static File-System Routing
 * Write Mode Workspace. Server Component splits heavy knowledge payloads via defer().
 */
export default function HomePage() {
  return (
    <WorkspaceLayout
      activeMode="write"
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
      <>
        <WriteEditorIsland />
        <WebMcpIsland />
      </>
    </WorkspaceLayout>
  );
}
