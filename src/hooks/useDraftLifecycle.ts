import { useEffect } from 'react';
import type { Dispatch, TransitionStartFunction } from 'react';
import { storage } from '../services/storage';
import type { DraftAction } from '../context/draftReducer';

interface DraftBootstrapOptions {
  currentUrlId?: string;
  isLoading: boolean;
  dispatch: Dispatch<DraftAction>;
  startTransition: TransitionStartFunction;
}

/**
 * Loads the browser-local draft store only while the reducer is still empty.
 * The cancellation flag prevents a late IndexedDB result from committing after
 * a route or provider has been replaced.
 */
export function useDraftBootstrap({
  currentUrlId,
  isLoading,
  dispatch,
  startTransition,
}: DraftBootstrapOptions) {
  useEffect(() => {
    if (!isLoading) return;

    let cancelled = false;

    void storage
      .getAllDrafts()
      .then((loaded) => {
        if (cancelled) return;

        startTransition(() => {
          dispatch({
            type: 'loaded',
            drafts: loaded,
            activeDraftId:
              currentUrlId && loaded.some((draft) => draft.id === currentUrlId)
                ? currentUrlId
                : loaded[0]?.id || '',
          });
        });
      })
      .catch((error: unknown) => {
        console.error('Failed to load drafts from IndexedDB:', error);
        if (!cancelled) {
          startTransition(() => {
            dispatch({ type: 'load-failed' });
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUrlId, dispatch, isLoading, startTransition]);
}

interface DraftUrlSelectionOptions {
  currentUrlId?: string;
  activeDraftId: string;
  isLoading: boolean;
  hasCurrentUrlDraft: boolean;
  dispatch: Dispatch<DraftAction>;
  startTransition: TransitionStartFunction;
}

/** Keeps browser history navigation and in-memory selection in sync. */
export function useDraftUrlSelection({
  currentUrlId,
  activeDraftId,
  isLoading,
  hasCurrentUrlDraft,
  dispatch,
  startTransition,
}: DraftUrlSelectionOptions) {
  useEffect(() => {
    if (isLoading || !currentUrlId || !hasCurrentUrlDraft || currentUrlId === activeDraftId) {
      return;
    }

    startTransition(() => {
      dispatch({ type: 'select', id: currentUrlId });
    });
  }, [activeDraftId, currentUrlId, dispatch, hasCurrentUrlDraft, isLoading, startTransition]);
}
