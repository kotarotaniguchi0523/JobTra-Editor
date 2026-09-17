import { startTransition, useSyncExternalStore } from 'react';
import type { DraftSnapshot, ESDraft, ESQuestionCategory } from '@entities/draft/model/types';
import { storage } from '@entities/draft/storage/indexedDbStorage';
import { draftReducer, INITIAL_DRAFT_STATE } from '@entities/draft/model/draftReducer';
import type { DraftAction, DraftState } from '@entities/draft/model/draftReducer';
import { parseSnapshotLabel } from '@shared/validation/draftSchemas';

export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface DraftStoreState extends DraftState {
  saveStatus: DraftSaveStatus;
}

export interface DraftActions {
  selectDraft: (id: string) => void;
  createDraft: (category?: ESQuestionCategory) => Promise<string>;
  updateDraft: (updated: ESDraft, immediate?: boolean) => void;
  updateActiveDraft: (partial: Partial<ESDraft>, immediate?: boolean) => void;
  deleteDraft: (id: string, nextActiveId: string) => Promise<void>;
  duplicateDraft: (draft: ESDraft) => Promise<string>;
  toggleStar: (draft: ESDraft) => Promise<void>;
  createSnapshot: (draft: ESDraft, label: string) => Promise<void>;
  restoreSnapshot: (draft: ESDraft, snapshot: DraftSnapshot) => Promise<void>;
}

type StoreAction = DraftAction | { type: 'save-status'; status: DraftSaveStatus };

interface SaveController {
  timer: ReturnType<typeof setTimeout> | null;
  requestId: number;
  queue: Promise<void>;
}

const DEBOUNCE_MS = 600;
const EMPTY_DRAFTS: ESDraft[] = [];

let state: DraftStoreState = {
  ...INITIAL_DRAFT_STATE,
  saveStatus: 'idle',
};

const listeners = new Set<() => void>();
const saveController: SaveController = {
  timer: null,
  requestId: 0,
  queue: Promise.resolve(),
};

let hasBootstrapped = false;
let bootstrapPromise: Promise<void> | null = null;

function reduce(state: DraftStoreState, action: StoreAction): DraftStoreState {
  if (action.type === 'save-status') {
    return state.saveStatus === action.status ? state : { ...state, saveStatus: action.status };
  }

  const draftState = draftReducer(state, action);
  return draftState === state ? state : { ...state, ...draftState };
}

function dispatch(action: StoreAction): void {
  const nextState = reduce(state, action);
  if (nextState === state) return;

  state = nextState;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function enqueueSave(draft: ESDraft, requestId: number): Promise<void> {
  const write = saveController.queue.then(() => storage.saveDraft(draft));
  saveController.queue = write.catch(() => undefined);

  void write.then(
    () => {
      if (saveController.requestId !== requestId) return;
      startTransition(() => dispatch({ type: 'save-status', status: 'saved' }));
    },
    (error: unknown) => {
      console.error('Failed to save draft:', error);
      if (saveController.requestId !== requestId) return;
      startTransition(() => dispatch({ type: 'save-status', status: 'error' }));
    },
  );

  return write;
}

function saveDraftNow(draft: ESDraft): Promise<void> {
  saveController.requestId += 1;
  const requestId = saveController.requestId;

  if (saveController.timer) {
    clearTimeout(saveController.timer);
    saveController.timer = null;
  }

  startTransition(() => dispatch({ type: 'save-status', status: 'saving' }));
  return enqueueSave(draft, requestId);
}

function scheduleDraftSave(draft: ESDraft): void {
  saveController.requestId += 1;
  const requestId = saveController.requestId;

  if (saveController.timer) clearTimeout(saveController.timer);

  saveController.timer = setTimeout(() => {
    saveController.timer = null;
    startTransition(() => dispatch({ type: 'save-status', status: 'saving' }));
    void enqueueSave(draft, requestId);
  }, DEBOUNCE_MS);
}

function bootstrap(currentUrlId?: string): void {
  if (hasBootstrapped || bootstrapPromise) return;
  hasBootstrapped = true;

  bootstrapPromise = storage
    .getAllDrafts()
    .then((drafts) => {
      const activeDraftId =
        currentUrlId && drafts.some((draft) => draft.id === currentUrlId)
          ? currentUrlId
          : drafts[0]?.id || '';

      startTransition(() => {
        dispatch({ type: 'loaded', drafts, activeDraftId });
      });
    })
    .catch((error: unknown) => {
      console.error('Failed to load drafts from IndexedDB:', error);
      startTransition(() => dispatch({ type: 'load-failed' }));
    })
    .finally(() => {
      bootstrapPromise = null;
    });
}

function selectDraft(id: string): void {
  dispatch({ type: 'select', id });
}

async function createDraft(category: ESQuestionCategory = 'gakuchika'): Promise<string> {
  try {
    const newDraft = await storage.createDefaultDraft(category);
    startTransition(() => dispatch({ type: 'add', draft: newDraft }));
    return newDraft.id;
  } catch (error) {
    console.error('Failed to create draft:', error);
    return '';
  }
}

function updateDraft(updated: ESDraft, immediate = false): void {
  // The reducer update is urgent; only persistence is deferred.
  dispatch({ type: 'replace', draft: updated });
  if (immediate) {
    void saveDraftNow(updated).catch(() => undefined);
  } else {
    scheduleDraftSave(updated);
  }
}

function updateActiveDraft(partial: Partial<ESDraft>, immediate = false): void {
  const activeDraft =
    state.drafts.find((draft) => draft.id === state.activeDraftId) ?? state.drafts[0] ?? null;
  if (!activeDraft) return;

  updateDraft(
    {
      ...activeDraft,
      ...partial,
      updatedAt: Date.now(),
    },
    immediate,
  );
}

async function deleteDraft(id: string, nextActiveId: string): Promise<void> {
  try {
    await storage.deleteDraft(id);
    startTransition(() => dispatch({ type: 'remove', id, nextActiveId }));
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

async function duplicateDraft(draft: ESDraft): Promise<string> {
  try {
    const duplicated = await storage.duplicateDraft(draft);
    startTransition(() => dispatch({ type: 'add', draft: duplicated }));
    return duplicated.id;
  } catch (error) {
    console.error('Failed to duplicate draft:', error);
    return draft.id;
  }
}

async function toggleStar(draft: ESDraft): Promise<void> {
  const updated: ESDraft = {
    ...draft,
    starred: !draft.starred,
    updatedAt: Date.now(),
  };

  dispatch({ type: 'replace', draft: updated });
  try {
    await saveDraftNow(updated);
  } catch (error) {
    console.error('Failed to save starred state:', error);
    startTransition(() => {
      dispatch({ type: 'replace-if-current', expected: updated, draft });
    });
  }
}

async function createSnapshot(draft: ESDraft, label: string): Promise<void> {
  const timestamp = Date.now();
  const updated: ESDraft = {
    ...draft,
    snapshots: [
      {
        id: `snap_${timestamp}_${Math.random().toString(36).slice(2, 7)}`,
        label: parseSnapshotLabel(label),
        content: draft.content,
        charCount: draft.content.replace(/\s+/g, '').length,
        timestamp,
      },
      ...(draft.snapshots ?? []),
    ],
    updatedAt: timestamp,
  };

  // The snapshot is derived entirely from the current in-memory draft, so
  // show it immediately and let IndexedDB persistence settle in a transition.
  startTransition(() => dispatch({ type: 'replace', draft: updated }));
  try {
    await saveDraftNow(updated);
  } catch (error) {
    console.error('Failed to create snapshot:', error);
    startTransition(() => {
      dispatch({ type: 'replace-if-current', expected: updated, draft });
    });
  }
}

async function restoreSnapshot(draft: ESDraft, snapshot: DraftSnapshot): Promise<void> {
  const updated: ESDraft = {
    ...draft,
    content: snapshot.content,
    updatedAt: Date.now(),
  };

  // Restore is a local optimistic mutation: the editor should reflect the
  // selected version before IndexedDB finishes. Conditional rollback keeps a
  // newer edit safe if persistence fails after the user continues typing.
  dispatch({ type: 'replace', draft: updated });
  try {
    await saveDraftNow(updated);
  } catch (error) {
    console.error('Failed to restore snapshot:', error);
    startTransition(() => {
      dispatch({ type: 'replace-if-current', expected: updated, draft });
    });
  }
}

export const draftStore = {
  getState: () => state,
  subscribe,
  dispatch,
  bootstrap,
};

export const draftActions: DraftActions = {
  selectDraft,
  createDraft,
  updateDraft,
  updateActiveDraft,
  deleteDraft,
  duplicateDraft,
  toggleStar,
  createSnapshot,
  restoreSnapshot,
};

function getDraftsSnapshot(): ESDraft[] {
  return draftStore.getState().drafts;
}

function getFirstDraftIdSnapshot(): string {
  return draftStore.getState().drafts[0]?.id ?? '';
}

function getDraftExistsSnapshot(id: string): boolean {
  return Boolean(id && draftStore.getState().drafts.some((draft) => draft.id === id));
}

function getActiveDraftIdSnapshot(): string {
  return draftStore.getState().activeDraftId;
}

function getActiveDraftSnapshot(): ESDraft | null {
  const current = draftStore.getState();
  return (
    current.drafts.find((draft) => draft.id === current.activeDraftId) ?? current.drafts[0] ?? null
  );
}

function getDraftLoadingSnapshot(): boolean {
  return draftStore.getState().isLoading;
}

function getSaveStatusSnapshot(): DraftSaveStatus {
  return draftStore.getState().saveStatus;
}

function getServerDraftsSnapshot(): ESDraft[] {
  return EMPTY_DRAFTS;
}

function getServerActiveDraftIdSnapshot(): string {
  return '';
}

function getServerFirstDraftIdSnapshot(): string {
  return '';
}

function getServerDraftExistsSnapshot(): boolean {
  return false;
}

function getServerActiveDraftSnapshot(): ESDraft | null {
  return null;
}

function getServerDraftLoadingSnapshot(): boolean {
  return true;
}

function getServerSaveStatusSnapshot(): DraftSaveStatus {
  return 'idle';
}

export function useDrafts(): ESDraft[] {
  return useSyncExternalStore(subscribe, getDraftsSnapshot, getServerDraftsSnapshot);
}

export function useFirstDraftId(): string {
  return useSyncExternalStore(subscribe, getFirstDraftIdSnapshot, getServerFirstDraftIdSnapshot);
}

export function useDraftExists(id: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getDraftExistsSnapshot(id),
    getServerDraftExistsSnapshot,
  );
}

export function useActiveDraftId(): string {
  return useSyncExternalStore(subscribe, getActiveDraftIdSnapshot, getServerActiveDraftIdSnapshot);
}

export function useActiveDraft(): ESDraft | null {
  return useSyncExternalStore(subscribe, getActiveDraftSnapshot, getServerActiveDraftSnapshot);
}

export function useDraftLoading(): boolean {
  return useSyncExternalStore(subscribe, getDraftLoadingSnapshot, getServerDraftLoadingSnapshot);
}

export function useDraftSaveStatus(): DraftSaveStatus {
  return useSyncExternalStore(subscribe, getSaveStatusSnapshot, getServerSaveStatusSnapshot);
}
