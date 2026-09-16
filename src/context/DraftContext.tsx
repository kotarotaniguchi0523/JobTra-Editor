'use client';

import React, { createContext, useContext, useMemo, useReducer, useTransition } from 'react';
import { useSearchParams } from '@funstack/router';
import type { ESDraft } from '../types';
import { draftReducer, INITIAL_DRAFT_STATE } from './draftReducer';
import { useDraftBootstrap, useDraftUrlSelection } from '../hooks/useDraftLifecycle';
import { useDraftCommands, type DraftCommands } from '../hooks/useDraftCommands';
import { useDraftPersistence, type DraftSaveStatus } from '../hooks/useDraftPersistence';
import { parseWorkspaceSearchParams } from '../validation/schemas';

interface DraftDataContextType {
  drafts: ESDraft[];
  activeDraftId: string;
  activeDraft: ESDraft | null;
  isLoading: boolean;
}

interface DraftSaveStatusContextType {
  isSaving: boolean;
  saveStatus: DraftSaveStatus;
}

const DraftDataContext = createContext<DraftDataContextType | null>(null);
const DraftActionsContext = createContext<DraftCommands | null>(null);
const DraftSaveStatusContext = createContext<DraftSaveStatusContextType | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(draftReducer, INITIAL_DRAFT_STATE);
  const [, startTransition] = useTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlId = parseWorkspaceSearchParams(searchParams).id;
  const { drafts, activeDraftId, isLoading } = state;

  useDraftBootstrap({ currentUrlId, isLoading, dispatch, startTransition });
  useDraftUrlSelection({
    currentUrlId,
    activeDraftId,
    isLoading,
    hasCurrentUrlDraft: Boolean(currentUrlId && drafts.some((draft) => draft.id === currentUrlId)),
    dispatch,
    startTransition,
  });

  const { saveStatus, saveDraftNow, scheduleDraftSave } = useDraftPersistence(startTransition);
  const actions = useDraftCommands({
    dispatch,
    startTransition,
    setSearchParams,
    saveDraftNow,
    scheduleDraftSave,
  });

  // The active draft is derived from the reducer snapshot; it is not copied
  // into another state variable, so there is no synchronization effect.
  const activeDraft = drafts.find((draft) => draft.id === activeDraftId) ?? drafts[0] ?? null;

  const dataValue = useMemo<DraftDataContextType>(
    () => ({ drafts, activeDraftId, activeDraft, isLoading }),
    [activeDraft, activeDraftId, drafts, isLoading],
  );

  const saveStatusValue = useMemo<DraftSaveStatusContextType>(
    () => ({ isSaving: saveStatus === 'saving', saveStatus }),
    [saveStatus],
  );

  return (
    <DraftDataContext.Provider value={dataValue}>
      <DraftActionsContext.Provider value={actions}>
        <DraftSaveStatusContext.Provider value={saveStatusValue}>
          {children}
        </DraftSaveStatusContext.Provider>
      </DraftActionsContext.Provider>
    </DraftDataContext.Provider>
  );
}

function useRequiredContext<T>(context: React.Context<T | null>, name: string): T {
  const value = useContext(context);
  if (!value) throw new Error(`${name} must be used within DraftProvider`);
  return value;
}

export function useDraftData(): DraftDataContextType {
  return useRequiredContext(DraftDataContext, 'useDraftData');
}

export function useDraftActions(): DraftCommands {
  return useRequiredContext(DraftActionsContext, 'useDraftActions');
}

export function useDraftSaveStatus(): DraftSaveStatusContextType {
  return useRequiredContext(DraftSaveStatusContext, 'useDraftSaveStatus');
}
