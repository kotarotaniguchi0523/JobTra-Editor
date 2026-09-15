import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '../../components/server/ESHandbook';
import { AuditGuidelines } from '../../components/server/AuditGuidelines';
import { SidebarFooter } from '../../components/server/SidebarFooter';
import { EmptyDraftGuide } from '../../components/server/EmptyDraftGuide';
import { StarMethodGuide } from '../../components/server/StarMethodGuide';
import { HeaderBrand, HeaderStaticLinks } from '../../components/server/HeaderBrand';
import { StructurePageClient } from '../../components/StructurePageClient';

function LoadingSpinner() {
  return (
    <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
      <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
      <p>ガイドを読み込み中...</p>
    </div>
  );
}

/**
 * Structure Page (/structure) for Funstack Static File-System Routing
 * STAR Method Framework Editor. Defer splits the StarMethodGuide RSC payload.
 */
export default function StructurePage() {
  return (
    <StructurePageClient
      brandSlot={<HeaderBrand />}
      linksSlot={<HeaderStaticLinks />}
      sidebarFooterSlot={<SidebarFooter />}
      emptyDraftGuideSlot={<EmptyDraftGuide />}
      starGuideSlot={
        <Suspense fallback={<div className="p-4 text-xs text-neutral-400">STAR解説読込中...</div>}>
          {defer(<StarMethodGuide />, { name: 'StarMethodGuide' })}
        </Suspense>
      }
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
    />
  );
}
