'use client';

import type { ReactNode } from 'react';
import { Sidebar } from '@widgets/workspace/ui/Sidebar';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

interface WorkspaceSidebarIslandProps {
  footerSlot?: ReactNode;
}

export function WorkspaceSidebarIsland({ footerSlot }: WorkspaceSidebarIslandProps) {
  const {
    drafts,
    currentDraftId,
    saveStatus,
    openPanel,
    selectDraft,
    createDraft,
    deleteDraft,
    duplicateDraft,
    toggleStar,
    setPanel,
  } = useWorkspaceInteraction();

  return (
    <Sidebar
      drafts={drafts}
      currentDraftId={currentDraftId}
      onSelectDraft={selectDraft}
      onCreateNewDraft={createDraft}
      onDuplicateDraft={duplicateDraft}
      onDeleteDraft={deleteDraft}
      onToggleStar={toggleStar}
      saveStatus={saveStatus}
      isMobileOpen={openPanel === 'sidebar'}
      onCloseMobile={() => setPanel(null)}
      footerSlot={footerSlot}
    />
  );
}
