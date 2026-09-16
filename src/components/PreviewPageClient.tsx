'use client';

import React, { useDeferredValue, useMemo } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { DocumentPreview } from './DocumentPreview';
import { useDraftActions, useDraftData } from '../context/DraftContext';
import { calculateMetrics } from '../services/analyzer';
import { DraftSnapshot } from '../types';

interface PreviewPageClientProps {
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
}

export function PreviewPageClient({
  brandSlot,
  linksSlot,
  handbookSlot,
  guidelinesSlot,
  sidebarFooterSlot,
  emptyDraftGuideSlot,
  checklistSlot,
}: PreviewPageClientProps) {
  const { activeDraft } = useDraftData();
  const { createSnapshot, restoreSnapshot } = useDraftActions();
  const content = activeDraft?.content || '';
  const deferredContent = useDeferredValue(content);

  const metrics = useMemo(() => {
    return calculateMetrics(deferredContent);
  }, [deferredContent]);

  const handleSaveSnapshot = (label: string) => {
    if (!activeDraft) return;
    createSnapshot(activeDraft.id, label);
  };

  const handleRestoreSnapshot = (snap: DraftSnapshot) => {
    if (!activeDraft) return;
    restoreSnapshot(activeDraft, snap);
  };

  if (!activeDraft) {
    return (
      <WorkspaceLayout
        activeMode="preview"
        brandSlot={brandSlot}
        linksSlot={linksSlot}
        handbookSlot={handbookSlot}
        guidelinesSlot={guidelinesSlot}
        sidebarFooterSlot={sidebarFooterSlot}
        emptyDraftGuideSlot={emptyDraftGuideSlot}
      >
        <div className="py-16 text-center text-neutral-400">下書きが選択されていません。</div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      activeMode="preview"
      brandSlot={brandSlot}
      linksSlot={linksSlot}
      handbookSlot={handbookSlot}
      guidelinesSlot={guidelinesSlot}
      sidebarFooterSlot={sidebarFooterSlot}
      emptyDraftGuideSlot={emptyDraftGuideSlot}
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <DocumentPreview
          draft={activeDraft}
          charsNoWs={metrics.charsNoWhitespace}
          currentTarget={activeDraft.targetCount || 400}
          onSaveSnapshot={handleSaveSnapshot}
          onRestoreSnapshot={handleRestoreSnapshot}
          checklistSlot={checklistSlot}
        />
      </div>
    </WorkspaceLayout>
  );
}
