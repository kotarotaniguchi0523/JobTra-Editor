'use client';

import { useDeferredValue, type ReactNode } from 'react';
import { DocumentPreview } from '@widgets/preview/ui/DocumentPreview';
import { draftActions, useActiveDraft } from '@entities/draft/model/draftStore';
import { buildSnapshotId } from '@entities/draft/model/draftFactories';
import { calculateMetrics } from '@features/writing-assistance/lib/analyzer';
import type { DraftSnapshot } from '@entities/draft/model/types';

interface PreviewIslandProps {
  checklistSlot?: ReactNode;
}

/** Owns preview metrics, snapshot actions, and the browser export entry point. */
export function PreviewIsland({ checklistSlot }: PreviewIslandProps) {
  const activeDraft = useActiveDraft();
  const { createSnapshot, restoreSnapshot } = draftActions;
  const content = activeDraft?.content || '';
  const deferredContent = useDeferredValue(content);
  const metrics = calculateMetrics(deferredContent);

  function handleSaveSnapshot(label: string) {
    if (!activeDraft) return;
    const timestamp = Date.now();
    const id = buildSnapshotId(timestamp, Math.random().toString(36).slice(2, 7));
    void createSnapshot(activeDraft, label, { id, timestamp });
  }

  function handleRestoreSnapshot(snapshot: DraftSnapshot) {
    if (!activeDraft) return;
    void restoreSnapshot(activeDraft, snapshot, Date.now());
  }

  if (!activeDraft) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <DocumentPreview
        draft={activeDraft}
        charsNoWs={metrics.charsNoWhitespace}
        currentTarget={activeDraft.targetCount}
        onSaveSnapshot={handleSaveSnapshot}
        onRestoreSnapshot={handleRestoreSnapshot}
        checklistSlot={checklistSlot}
      />
    </div>
  );
}
