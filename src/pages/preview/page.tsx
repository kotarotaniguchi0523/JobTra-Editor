import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from '../../components/server/ESHandbook';
import { AuditGuidelines } from '../../components/server/AuditGuidelines';
import { SidebarFooter } from '../../components/server/SidebarFooter';
import { EmptyDraftGuide } from '../../components/server/EmptyDraftGuide';
import { SubmissionChecklist } from '../../components/server/SubmissionChecklist';
import { PreviewPageClient } from '../../components/PreviewPageClient';

function LoadingSpinner() {
  return (
    <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
      <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
      <p>ガイドを読み込み中...</p>
    </div>
  );
}

/**
 * Preview Page (/preview) for Funstack Static File-System Routing
 * Clean submission text & snapshot history. Defer splits the SubmissionChecklist RSC payload.
 */
export default function PreviewPage() {
  return (
    <PreviewPageClient
      sidebarFooterSlot={<SidebarFooter />}
      emptyDraftGuideSlot={<EmptyDraftGuide />}
      checklistSlot={
        <Suspense fallback={<div className="p-4 text-xs text-neutral-400">チェックリスト読込中...</div>}>
          {defer(<SubmissionChecklist />, { name: 'SubmissionChecklist' })}
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
