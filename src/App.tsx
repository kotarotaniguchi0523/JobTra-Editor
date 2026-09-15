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
    <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
      <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
      <p>ES推敲ハンドブックを読み込み中...</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 font-sans antialiased">
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
