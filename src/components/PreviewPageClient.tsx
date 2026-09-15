"use client";

import React, { useMemo } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { DocumentPreview } from './DocumentPreview';
import { useDrafts } from '../context/DraftContext';
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
  const { activeDraft, createSnapshot, restoreSnapshot } = useDrafts();

  const metrics = useMemo(() => {
    return calculateMetrics(activeDraft?.content || '');
  }, [activeDraft?.content]);

  const handleSaveSnapshot = (label: string) => {
    if (!activeDraft) return;
    createSnapshot(activeDraft.id, label);
  };

  const handleRestoreSnapshot = (snap: DraftSnapshot) => {
    if (!activeDraft) return;
    restoreSnapshot(activeDraft.id, snap);
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
        <div className="text-center py-16 text-neutral-400">
          下書きが選択されていません。
        </div>
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
      <div className="max-w-4xl mx-auto space-y-4">
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
