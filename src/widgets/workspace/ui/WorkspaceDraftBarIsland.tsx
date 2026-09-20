'use client';

import { WorkspaceDraftBar } from '@widgets/workspace/ui/WorkspaceDraftBar';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

export function WorkspaceDraftBarIsland() {
  const { activeDraft, currentDraftId, activeMode, updateDraft } = useWorkspaceInteraction();

  if (!activeDraft) return null;

  return (
    <WorkspaceDraftBar
      activeDraft={activeDraft}
      currentId={currentDraftId}
      activeMode={activeMode}
      onUpdateDraft={updateDraft}
    />
  );
}
