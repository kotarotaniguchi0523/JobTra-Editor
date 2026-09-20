import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '@widgets/handbook/rsc/ESHandbook';
import { AuditGuidelines } from '@widgets/audit/rsc/AuditGuidelines';
import { SidebarFooter } from '@widgets/workspace/rsc/SidebarFooter';
import { EmptyDraftGuide } from '@widgets/workspace/rsc/EmptyDraftGuide';
import { StarMethodGuide } from '@widgets/structure/rsc/StarMethodGuide';
import { HeaderBrand, HeaderStaticLinks } from '@widgets/workspace/rsc/HeaderBrand';
import { StructureIsland } from '@widgets/structure/ui/StructureIsland';
import { WorkspaceLayout } from '@widgets/workspace/rsc/WorkspaceLayout';
import { HandbookLoadingFallback } from '@widgets/handbook/rsc/HandbookLoadingFallback';

/**
 * Structure Page (/structure) for Funstack Static File-System Routing
 * STAR Method Framework Editor. Defer splits the StarMethodGuide RSC payload.
 */
export default function StructurePage() {
  return (
    <WorkspaceLayout
      activeMode="structure"
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
      <StructureIsland
        starGuideSlot={
          <Suspense
            fallback={<div className="p-4 text-xs text-neutral-400">STAR解説読込中...</div>}
          >
            {defer(<StarMethodGuide />, { name: 'StarMethodGuide' })}
          </Suspense>
        }
      />
    </WorkspaceLayout>
  );
}
