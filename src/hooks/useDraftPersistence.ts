import { useCallback, useEffect, useRef, useState } from 'react';
import type { TransitionStartFunction } from 'react';
import type { ESDraft } from '../types';
import { storage } from '../services/storage';

export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveController {
  timer: ReturnType<typeof setTimeout> | null;
  requestId: number;
  queue: Promise<void>;
}

const DEBOUNCE_MS = 600;

/**
 * Owns only the imperative persistence lifecycle. Draft rendering stays
 * urgent; normal typing merely replaces a timer and does not update provider
 * state until an actual IndexedDB write begins or finishes.
 */
export function useDraftPersistence(startTransition: TransitionStartFunction) {
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>('idle');
  const controllerRef = useRef<SaveController>({
    timer: null,
    requestId: 0,
    queue: Promise.resolve(),
  });

  const enqueueSave = useCallback(
    (draft: ESDraft, requestId: number): Promise<void> => {
      const controller = controllerRef.current;
      const write = controller.queue.then(() => storage.saveDraft(draft));
      controller.queue = write.catch(() => undefined);

      void write.then(
        () => {
          if (controllerRef.current.requestId !== requestId) return;
          startTransition(() => setSaveStatus('saved'));
        },
        (error: unknown) => {
          console.error('Failed to save draft:', error);
          if (controllerRef.current.requestId !== requestId) return;
          startTransition(() => setSaveStatus('error'));
        },
      );

      return write;
    },
    [startTransition],
  );

  const saveDraftNow = useCallback(
    (draft: ESDraft): Promise<void> => {
      const controller = controllerRef.current;
      controller.requestId += 1;
      const requestId = controller.requestId;

      if (controller.timer) {
        clearTimeout(controller.timer);
        controller.timer = null;
      }

      setSaveStatus('saving');
      return enqueueSave(draft, requestId);
    },
    [enqueueSave],
  );

  const scheduleDraftSave = useCallback(
    (draft: ESDraft) => {
      const controller = controllerRef.current;
      controller.requestId += 1;
      const requestId = controller.requestId;

      if (controller.timer) clearTimeout(controller.timer);

      controller.timer = setTimeout(() => {
        controller.timer = null;
        setSaveStatus('saving');
        void enqueueSave(draft, requestId);
      }, DEBOUNCE_MS);
    },
    [enqueueSave],
  );

  useEffect(() => {
    return () => {
      const controller = controllerRef.current;
      controller.requestId += 1;
      if (controller.timer) clearTimeout(controller.timer);
    };
  }, []);

  return { saveStatus, saveDraftNow, scheduleDraftSave };
}
