'use client';

import { createContext, startTransition, useContext, useState, type ReactNode } from 'react';
import type { ESDraft } from '@entities/draft/model/types';
import {
  draftActions,
  useActiveDraft,
  useActiveDraftId,
  useDraftLoading,
  useDraftSaveStatus,
  useDrafts,
} from '@entities/draft/model/draftStore';
import type { WorkspaceMode } from '@widgets/workspace/ui/types';

export type WorkspacePanel = 'sidebar' | 'audit' | 'handbook' | 'export' | 'sync' | null;

interface WorkspaceInteractionContextValue {
  activeMode: WorkspaceMode;
  drafts: ESDraft[];
  activeDraftId: string | null;
  activeDraft: ESDraft | null;
  currentDraftId: string;
  isLoading: boolean;
  saveStatus: ReturnType<typeof useDraftSaveStatus>;
  openPanel: WorkspacePanel;
  setPanel: (panel: WorkspacePanel) => void;
  updateDraft: (partial: Partial<ESDraft>, immediate?: boolean) => void;
  selectDraft: (id: string) => void;
  createDraft: () => void;
  deleteDraft: (id: string) => void;
  duplicateDraft: (id: string) => void;
  toggleStar: (id: string) => void;
}

const WorkspaceInteractionContext = createContext<WorkspaceInteractionContextValue | null>(null);

export interface WorkspaceInteractionProviderProps {
  activeMode: WorkspaceMode;
  children: ReactNode;
}

/**
 * Keeps browser-owned draft and panel state at the smallest shared client
 * boundary. The frame and all static slots remain outside this module.
 */
export function WorkspaceInteractionProvider({
  activeMode,
  children,
}: WorkspaceInteractionProviderProps) {
  const drafts = useDrafts();
  const activeDraftId = useActiveDraftId();
  const activeDraft = useActiveDraft();
  const isLoading = useDraftLoading();
  const saveStatus = useDraftSaveStatus();
  const { selectDraft, createDraft, updateActiveDraft, deleteDraft, duplicateDraft, toggleStar } =
    draftActions;
  const [openPanel, setOpenPanel] = useState<WorkspacePanel>(null);

  function setPanel(panel: WorkspacePanel) {
    // Opening a lazy/heavy panel may suspend. Closing and mobile drawer
    // interactions are small urgent updates and should never lag.
    if (panel === null || panel === 'sidebar') {
      setOpenPanel(panel);
    } else {
      startTransition(() => setOpenPanel(panel));
    }
  }

  const currentDraftId = activeDraftId || activeDraft?.id || '';

  function updateDraft(partial: Partial<ESDraft>, immediate = false) {
    updateActiveDraft(partial, { updatedAt: Date.now(), immediate });
  }

  function handleSelectDraft(id: string) {
    selectDraft(id);
    setPanel(null);
  }

  function handleCreateDraft() {
    void createDraft();
  }

  function handleDeleteDraft(id: string) {
    const nextActiveId =
      activeDraftId === id ? (drafts.find((draft) => draft.id !== id)?.id ?? '') : activeDraftId;
    void deleteDraft(id, nextActiveId);
  }

  function handleDuplicateDraft(id: string) {
    const target = drafts.find((draft) => draft.id === id);
    if (target) void duplicateDraft(target);
  }

  function handleToggleStar(id: string) {
    const target = drafts.find((draft) => draft.id === id);
    if (target) void toggleStar(target, Date.now());
  }

  return (
    <WorkspaceInteractionContext.Provider
      value={{
        activeMode,
        drafts,
        activeDraftId,
        activeDraft,
        currentDraftId,
        isLoading,
        saveStatus,
        openPanel,
        setPanel,
        updateDraft,
        selectDraft: handleSelectDraft,
        createDraft: handleCreateDraft,
        deleteDraft: handleDeleteDraft,
        duplicateDraft: handleDuplicateDraft,
        toggleStar: handleToggleStar,
      }}
    >
      {children}
    </WorkspaceInteractionContext.Provider>
  );
}

export function useWorkspaceInteraction() {
  const context = useContext(WorkspaceInteractionContext);
  if (!context) {
    throw new Error('useWorkspaceInteraction must be used inside WorkspaceInteractionProvider');
  }
  return context;
}
