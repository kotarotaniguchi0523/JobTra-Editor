'use client';

import { useState } from 'react';
import type { ESDraft } from '../../types';
import { ExportDialog } from './ExportDialog';
import { ExportTabs, type ExportTab } from './ExportTabs';
import { MarkdownExportPanel } from './MarkdownExportPanel';
import { PdfExportPanel } from './PdfExportPanel';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: ESDraft;
}

export function ExportModal({ isOpen, onClose, draft }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('pdf');

  if (!isOpen) return null;

  return (
    <ExportDialog onClose={onClose}>
      <ExportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'pdf' ? (
          <PdfExportPanel draft={draft} />
        ) : (
          <MarkdownExportPanel draft={draft} />
        )}
      </div>
    </ExportDialog>
  );
}
