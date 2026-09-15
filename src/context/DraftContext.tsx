"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
  useRef,
  ReactNode,
} from 'react';
import { useSearchParams } from '@funstack/router';
import { ESDraft, ESQuestionCategory, DraftSnapshot } from '../types';
import { storage } from '../services/storage';

interface DraftContextType {
  drafts: ESDraft[];
  activeDraftId: string;
  activeDraft: ESDraft | null;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  selectDraft: (id: string) => void;
  createDraft: (category?: ESQuestionCategory) => Promise<string>;
  updateDraft: (updated: ESDraft, immediate?: boolean) => void;
  deleteDraft: (id: string) => Promise<void>;
  duplicateDraft: (id: string) => Promise<string>;
  toggleStar: (id: string) => void;
  createSnapshot: (id: string, label: string) => Promise<void>;
  restoreSnapshot: (id: string, snapshot: DraftSnapshot) => Promise<void>;
}

const DraftContext = createContext<DraftContextType | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<ESDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [, startTransition] = useTransition();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlId = searchParams.get('id');

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadedRef = useRef<boolean>(false);

  // 1. 初回ロード & 他タブ同期
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const loaded = await storage.getAllDrafts();
        if (!isMounted) return;

        startTransition(() => {
          setDrafts(loaded);
          setIsLoading(false);
          isLoadedRef.current = true;

          // URLクエリまたは最初の1件を選択
          if (currentUrlId && loaded.some((d) => d.id === currentUrlId)) {
            setActiveDraftId(currentUrlId);
          } else if (loaded.length > 0) {
            setActiveDraftId(loaded[0].id);
          }
        });
      } catch (err) {
        console.error('Failed to load drafts from IndexedDB:', err);
        if (isMounted) {
          startTransition(() => {
            setIsLoading(false);
          });
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [currentUrlId]);

  // URLの id が変わったら activeDraftId も追従
  useEffect(() => {
    if (currentUrlId && currentUrlId !== activeDraftId && drafts.some((d) => d.id === currentUrlId)) {
      startTransition(() => {
        setActiveDraftId(currentUrlId);
      });
    }
  }, [currentUrlId, activeDraftId, drafts]);

  // 下書き選択（URLクエリも更新）
  const selectDraft = useCallback((id: string) => {
    startTransition(() => {
      setActiveDraftId(id);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('id', id);
        return next;
      });
    });
  }, [setSearchParams]);

  // 下書き新規作成
  const createDraft = useCallback(async (category: ESQuestionCategory = 'gakuchika') => {
    const newDraft = await storage.createDefaultDraft(category);
    startTransition(() => {
      setDrafts((prev) => [newDraft, ...prev]);
      setActiveDraftId(newDraft.id);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('id', newDraft.id);
        return next;
      });
    });
    return newDraft.id;
  }, [setSearchParams]);

  // 下書き更新（デバウンス保存または即時保存）
  const updateDraft = useCallback((updated: ESDraft, immediate: boolean = false) => {
    // UIは即時楽観更新
    startTransition(() => {
      setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    });

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (immediate) {
      startTransition(() => {
        setSaveStatus('saving');
      });
      storage.saveDraft(updated).then(() => {
        startTransition(() => {
          setSaveStatus('saved');
        });
        setTimeout(() => {
          startTransition(() => {
            setSaveStatus('idle');
          });
        }, 1500);
      });
    } else {
      setSaveStatus('saving');
      saveTimerRef.current = setTimeout(() => {
        storage.saveDraft(updated).then(() => {
          startTransition(() => {
            setSaveStatus('saved');
          });
          setTimeout(() => {
            startTransition(() => {
              setSaveStatus('idle');
            });
          }, 1500);
        });
      }, 600);
    }
  }, []);

  // 下書き削除
  const deleteDraft = useCallback(async (id: string) => {
    await storage.deleteDraft(id);
    const filtered = drafts.filter((d) => d.id !== id);
    let nextId = activeDraftId;
    if (activeDraftId === id && filtered.length > 0) {
      nextId = filtered[0].id;
    }

    startTransition(() => {
      setDrafts(filtered);
      if (nextId !== activeDraftId) {
        setActiveDraftId(nextId);
        setSearchParams((searchPrev) => {
          const next = new URLSearchParams(searchPrev);
          next.set('id', nextId);
          return next;
        });
      }
    });
  }, [activeDraftId, drafts, setSearchParams]);

  // 下書き複製
  const duplicateDraft = useCallback(async (id: string) => {
    const target = drafts.find((d) => d.id === id);
    if (!target) return id;
    const duplicated = await storage.duplicateDraft(target);
    if (!duplicated) return id;

    startTransition(() => {
      setDrafts((prev) => [duplicated, ...prev]);
      setActiveDraftId(duplicated.id);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('id', duplicated.id);
        return next;
      });
    });
    return duplicated.id;
  }, [drafts, setSearchParams]);

  // スター切り替え
  const toggleStar = useCallback((id: string) => {
    const target = drafts.find((d) => d.id === id);
    if (!target) return;
    const updated = { ...target, starred: !target.starred, updatedAt: Date.now() };

    startTransition(() => {
      setDrafts((prev) => prev.map((d) => (d.id === id ? updated : d)));
    });
    storage.saveDraft(updated);
  }, [drafts]);

  // スナップショット保存
  const createSnapshot = useCallback(async (id: string, label: string) => {
    const updated = await storage.addSnapshot(id, label);
    if (updated) {
      startTransition(() => {
        setDrafts((prev) => prev.map((d) => (d.id === id ? updated : d)));
      });
    }
  }, []);

  // スナップショット復元
  const restoreSnapshot = useCallback(async (id: string, snapshot: DraftSnapshot) => {
    const target = drafts.find((d) => d.id === id);
    if (!target) return;
    const updated: ESDraft = {
      ...target,
      content: snapshot.content,
      updatedAt: Date.now(),
    };
    await storage.saveDraft(updated);
    startTransition(() => {
      setDrafts((prev) => prev.map((d) => (d.id === id ? updated : d)));
    });
  }, [drafts]);

  const activeDraft = useMemo(() => {
    return drafts.find((d) => d.id === activeDraftId) || (drafts.length > 0 ? drafts[0] : null);
  }, [drafts, activeDraftId]);

  const value = useMemo<DraftContextType>(() => ({
    drafts,
    activeDraftId,
    activeDraft,
    isLoading,
    isSaving: saveStatus === 'saving',
    saveStatus,
    selectDraft,
    createDraft,
    updateDraft,
    deleteDraft,
    duplicateDraft,
    toggleStar,
    createSnapshot,
    restoreSnapshot,
  }), [
    drafts,
    activeDraftId,
    activeDraft,
    isLoading,
    saveStatus,
    selectDraft,
    createDraft,
    updateDraft,
    deleteDraft,
    duplicateDraft,
    toggleStar,
    createSnapshot,
    restoreSnapshot,
  ]);

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDrafts(): DraftContextType {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDrafts must be used within a DraftProvider');
  }
  return context;
}
