import { useCallback, useMemo } from 'react';
import type { Dispatch, TransitionStartFunction } from 'react';
import type { DraftSnapshot, ESDraft, ESQuestionCategory } from '../types';
import { storage } from '../services/storage';
import type { DraftAction } from '../context/draftReducer';
import { withDraftId } from '../validation/schemas';

type SearchParamsSetter = (
  params:
    | URLSearchParams
    | Record<string, string>
    | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>),
  options?: { replace?: boolean },
) => void;

export interface DraftCommands {
  selectDraft: (id: string) => void;
  createDraft: (category?: ESQuestionCategory) => Promise<string>;
  updateDraft: (updated: ESDraft, immediate?: boolean) => void;
  deleteDraft: (id: string, nextActiveId: string) => Promise<void>;
  duplicateDraft: (draft: ESDraft) => Promise<string>;
  toggleStar: (draft: ESDraft) => Promise<void>;
  createSnapshot: (id: string, label: string) => Promise<void>;
  restoreSnapshot: (draft: ESDraft, snapshot: DraftSnapshot) => Promise<void>;
}

interface UseDraftCommandsOptions {
  dispatch: Dispatch<DraftAction>;
  startTransition: TransitionStartFunction;
  setSearchParams: SearchParamsSetter;
  saveDraftNow: (draft: ESDraft) => Promise<void>;
  scheduleDraftSave: (draft: ESDraft) => void;
}

/**
 * Event commands are kept outside the provider component so render only
 * assembles state and contexts. Every command owns its own async boundary and
 * only commits reducer updates after the external operation succeeds.
 */
export function useDraftCommands({
  dispatch,
  startTransition,
  setSearchParams,
  saveDraftNow,
  scheduleDraftSave,
}: UseDraftCommandsOptions): DraftCommands {
  const selectDraft = useCallback(
    (id: string) => {
      dispatch({ type: 'select', id });
      startTransition(() => {
        setSearchParams((prev) => withDraftId(prev, id));
      });
    },
    [dispatch, setSearchParams, startTransition],
  );

  const createDraft = useCallback(
    async (category: ESQuestionCategory = 'gakuchika') => {
      try {
        const newDraft = await storage.createDefaultDraft(category);
        startTransition(() => {
          dispatch({ type: 'add', draft: newDraft });
          setSearchParams((prev) => withDraftId(prev, newDraft.id));
        });
        return newDraft.id;
      } catch (error) {
        console.error('Failed to create draft:', error);
        return '';
      }
    },
    [dispatch, setSearchParams, startTransition],
  );

  const updateDraft = useCallback(
    (updated: ESDraft, immediate = false) => {
      // The reducer update is urgent; only the persistence side effect is
      // deferred. This is the controlled-input invariant for the editor.
      dispatch({ type: 'replace', draft: updated });
      if (immediate) {
        void saveDraftNow(updated).catch(() => undefined);
      } else {
        scheduleDraftSave(updated);
      }
    },
    [dispatch, saveDraftNow, scheduleDraftSave],
  );

  const deleteDraft = useCallback(
    async (id: string, nextActiveId: string) => {
      try {
        await storage.deleteDraft(id);
        startTransition(() => {
          dispatch({ type: 'remove', id, nextActiveId });
          setSearchParams((prev) => withDraftId(prev, nextActiveId));
        });
      } catch (error) {
        console.error('Failed to delete draft:', error);
      }
    },
    [dispatch, setSearchParams, startTransition],
  );

  const duplicateDraft = useCallback(
    async (draft: ESDraft) => {
      try {
        const duplicated = await storage.duplicateDraft(draft);
        startTransition(() => {
          dispatch({ type: 'add', draft: duplicated });
          setSearchParams((prev) => withDraftId(prev, duplicated.id));
        });
        return duplicated.id;
      } catch (error) {
        console.error('Failed to duplicate draft:', error);
        return draft.id;
      }
    },
    [dispatch, setSearchParams, startTransition],
  );

  const toggleStar = useCallback(
    async (draft: ESDraft) => {
      const updated: ESDraft = {
        ...draft,
        starred: !draft.starred,
        updatedAt: Date.now(),
      };

      // Optimistic UI is urgent. The conditional rollback cannot overwrite a
      // newer text edit that landed while the IndexedDB write was pending.
      dispatch({ type: 'replace', draft: updated });
      try {
        await saveDraftNow(updated);
      } catch (error) {
        console.error('Failed to save starred state:', error);
        startTransition(() => {
          dispatch({ type: 'replace-if-current', expected: updated, draft });
        });
      }
    },
    [dispatch, saveDraftNow, startTransition],
  );

  const createSnapshot = useCallback(
    async (id: string, label: string) => {
      try {
        const updated = await storage.addSnapshot(id, label);
        if (updated) {
          startTransition(() => {
            dispatch({ type: 'replace', draft: updated });
          });
        }
      } catch (error) {
        console.error('Failed to create snapshot:', error);
      }
    },
    [dispatch, startTransition],
  );

  const restoreSnapshot = useCallback(
    async (draft: ESDraft, snapshot: DraftSnapshot) => {
      const updated: ESDraft = {
        ...draft,
        content: snapshot.content,
        updatedAt: Date.now(),
      };

      try {
        await saveDraftNow(updated);
        startTransition(() => {
          dispatch({ type: 'replace', draft: updated });
        });
      } catch (error) {
        console.error('Failed to restore snapshot:', error);
      }
    },
    [dispatch, saveDraftNow, startTransition],
  );

  return useMemo(
    () => ({
      selectDraft,
      createDraft,
      updateDraft,
      deleteDraft,
      duplicateDraft,
      toggleStar,
      createSnapshot,
      restoreSnapshot,
    }),
    [
      createDraft,
      createSnapshot,
      deleteDraft,
      duplicateDraft,
      restoreSnapshot,
      selectDraft,
      toggleStar,
      updateDraft,
    ],
  );
}
