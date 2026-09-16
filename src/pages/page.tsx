import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '@widgets/handbook/rsc/ESHandbook';
import { AuditGuidelines } from '@widgets/audit/rsc/AuditGuidelines';
import { SidebarFooter } from '@widgets/workspace/rsc/SidebarFooter';
import { EmptyDraftGuide } from '@widgets/workspace/rsc/EmptyDraftGuide';
import { HeaderBrand, HeaderStaticLinks } from '@widgets/workspace/rsc/HeaderBrand';
import { WorkspaceLayout } from '@widgets/workspace/WorkspaceLayout';
import { WriteEditorIsland } from '@widgets/editor/ui/WriteEditorIsland';

function LoadingSpinner() {
  return (
    <div className="space-y-2 p-8 text-center text-xs text-neutral-400">
      <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      <p>ガイドを読み込み中...</p>
    </div>
  );
}

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
        <Suspense fallback={<LoadingSpinner />}>
          {defer(<ESHandbook />, { name: 'ESHandbook' })}
        </Suspense>
      }
    >
      <WriteEditorIsland />
    </WorkspaceLayout>
  );
}
