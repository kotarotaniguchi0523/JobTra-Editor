'use client';

import { startTransition, useEffect, useRef } from 'react';
import { useSearchParams } from '@funstack/router';
import {
  draftStore,
  useActiveDraftId,
  useDraftExists,
  useDraftLoading,
  useFirstDraftId,
} from '@entities/draft/model/draftStore';
import { parseWorkspaceSearchParams, withDraftId } from '@shared/validation/searchParams';

/**
 * Boots the browser-local external store and synchronizes only the URL side
 * effect. It deliberately renders no wrapper and provides no context.
 */
export function DraftRuntime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlId = parseWorkspaceSearchParams(searchParams).id;
  const hasCurrentUrlDraft = useDraftExists(currentUrlId ?? '');
  const firstDraftId = useFirstDraftId();
  const activeDraftId = useActiveDraftId();
  const isLoading = useDraftLoading();
  const lastObservedUrlId = useRef(currentUrlId);

  useEffect(() => {
    draftStore.bootstrap(currentUrlId);
  }, [currentUrlId]);

  useEffect(() => {
    if (isLoading || lastObservedUrlId.current === currentUrlId) {
      return;
    }

    lastObservedUrlId.current = currentUrlId;
    if (!currentUrlId || !hasCurrentUrlDraft || currentUrlId === activeDraftId) return;

    startTransition(() => {
      draftStore.dispatch({ type: 'select', id: currentUrlId });
    });
  }, [activeDraftId, currentUrlId, hasCurrentUrlDraft, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const nextUrlId = activeDraftId || firstDraftId;
    if (nextUrlId === currentUrlId) return;

    startTransition(() => {
      setSearchParams((previous) => withDraftId(previous, nextUrlId), { replace: true });
    });
  }, [activeDraftId, currentUrlId, firstDraftId, isLoading, setSearchParams]);

  return null;
}
