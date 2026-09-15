import './index.css';
import { Suspense } from 'react';
import { defer } from '@funstack/static/server';
import { ESHandbook } from './components/server/ESHandbook';
import { AuditGuidelines } from './components/server/AuditGuidelines';
import { HeaderBrand, HeaderStaticLinks } from './components/server/HeaderBrand';
import { SidebarFooter } from './components/server/SidebarFooter';
import { StarMethodGuide } from './components/server/StarMethodGuide';
import { SubmissionChecklist } from './components/server/SubmissionChecklist';
import { EmptyDraftGuide } from './components/server/EmptyDraftGuide';
import { ClientApp } from './components/ClientApp';

function LoadingSpinner() {
  return (
    <div className="space-y-2 p-8 text-center text-xs text-neutral-400">
      <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      <p>ES推敲ハンドブックを読み込み中...</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50 font-sans text-neutral-900 antialiased">
      <ClientApp
        brandSlot={<HeaderBrand />}
        linksSlot={<HeaderStaticLinks />}
        sidebarFooterSlot={<SidebarFooter />}
        starGuideSlot={<StarMethodGuide />}
        checklistSlot={<SubmissionChecklist />}
        emptyDraftGuideSlot={<EmptyDraftGuide />}
        guidelinesSlot={<AuditGuidelines />}
        handbookSlot={
          <Suspense fallback={<LoadingSpinner />}>
            {defer(<ESHandbook />, { name: 'ESHandbook' })}
          </Suspense>
        }
      />
    </div>
  );
}
