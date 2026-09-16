import { Activity, useState, useTransition } from 'react';
import type { ESDraft } from '@entities/draft/model/types';
import { ExportDialog } from '@features/export/ui/ExportDialog';
import { ExportTabs, type ExportTab } from '@features/export/ui/ExportTabs';
import { MarkdownExportPanel } from '@features/export/ui/MarkdownExportPanel';
import { PdfExportPanel } from '@features/export/ui/PdfExportPanel';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: ESDraft;
}

export function ExportModal({ isOpen, onClose, draft }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('pdf');
  const [, startTransition] = useTransition();

  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'} name="export-modal">
      <ExportDialog isOpen={isOpen} onClose={onClose}>
        <ExportTabs
          activeTab={activeTab}
          onTabChange={(tab) => startTransition(() => setActiveTab(tab))}
        />
        <div className="flex-1 overflow-y-auto p-5">
          <Activity mode={activeTab === 'pdf' ? 'visible' : 'hidden'} name="pdf-export-panel">
            <PdfExportPanel draft={draft} />
          </Activity>
          <Activity mode={activeTab === 'md' ? 'visible' : 'hidden'} name="markdown-export-panel">
            <MarkdownExportPanel draft={draft} />
          </Activity>
        </div>
      </ExportDialog>
    </Activity>
  );
}
