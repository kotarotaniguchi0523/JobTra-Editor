import type { ESDraft } from '@entities/draft/model/types';
import {
  buildDefaultDraft,
  buildDraftId,
  buildDuplicatedDraft,
  cloneDraft,
} from '@entities/draft/model/draftFactories';
import { parseDraft, parseDraftCollection, parseDraftId } from '@shared/validation/draftSchemas';
import { observeDraftDatabase, openDraftDatabase } from './dexieDraftDatabase';

type DraftStorageObserver = (drafts: ESDraft[]) => void;
const DRAFT_DATABASE_NAME = 'es_craft_indexed_db';

class IndexedDbStorage {
  private dbPromise: ReturnType<typeof openDraftDatabase> | null = null;
  private readonly isIndexedDbAvailable: boolean;
  private readonly initialDrafts: readonly ESDraft[];

  constructor(initialDrafts: readonly ESDraft[]) {
    this.initialDrafts = initialDrafts;
    this.isIndexedDbAvailable = typeof indexedDB !== 'undefined';
  }

  private async openDb() {
    if (!this.isIndexedDbAvailable) {
      throw new Error('IndexedDB is not available');
    }

    this.dbPromise ??= openDraftDatabase();
    return this.dbPromise;
  }

  // Fallback to localStorage if IndexedDB is blocked or throws.
  private getLocalStorageDrafts(): ESDraft[] {
    try {
      if (typeof localStorage === 'undefined') return this.initialDrafts.map(cloneDraft);
      const data = localStorage.getItem(DRAFT_DATABASE_NAME);
      if (data) {
        return parseDraftCollection(JSON.parse(data)) || this.initialDrafts.map(cloneDraft);
      }
    } catch (error) {
      console.warn('LocalStorage read error', error);
    }
    return this.initialDrafts.map(cloneDraft);
  }

  private saveLocalStorageDrafts(drafts: ESDraft[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const validated = parseDraftCollection(drafts);
      if (!validated) {
        console.warn('LocalStorage draft validation failed');
        return;
      }
      localStorage.setItem(DRAFT_DATABASE_NAME, JSON.stringify(validated));
    } catch (error) {
      console.warn('LocalStorage save error', error);
    }
  }

  public subscribe(observer: DraftStorageObserver): () => void {
    if (!this.isIndexedDbAvailable) return () => undefined;

    return observeDraftDatabase((drafts) => {
      const validated = parseDraftCollection(drafts);
      if (!validated) return;
      validated.sort((a, b) => b.updatedAt - a.updatedAt);
      observer(validated);
    });
  }

  public async getAllDrafts(): Promise<ESDraft[]> {
    try {
      const db = await this.openDb();
      const list = parseDraftCollection(await db.drafts.toArray()) || [];
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      return list;
    } catch (error) {
      console.warn('IndexedDB unavailable or failed, falling back to LocalStorage', error);
      const list = this.getLocalStorageDrafts();
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      return list;
    }
  }

  public async getDraft(id: string): Promise<ESDraft | null> {
    const validId = parseDraftId(id);
    if (!validId) return null;

    try {
      const db = await this.openDb();
      return parseDraft(await db.drafts.get(validId));
    } catch {
      const drafts = this.getLocalStorageDrafts();
      return drafts.find((draft) => draft.id === validId) || null;
    }
  }

  public async saveDraft(draft: ESDraft): Promise<void> {
    const validatedDraft = parseDraft(draft);
    if (!validatedDraft) throw new Error('Draft validation failed');

    try {
      const db = await this.openDb();
      await db.drafts.put(validatedDraft);
    } catch {
      const drafts = this.getLocalStorageDrafts();
      const index = drafts.findIndex((entry) => entry.id === validatedDraft.id);
      if (index >= 0) drafts[index] = validatedDraft;
      else drafts.unshift(validatedDraft);
      this.saveLocalStorageDrafts(drafts);
    }
  }

  public async replaceAllDrafts(drafts: readonly ESDraft[]): Promise<void> {
    const validatedDrafts = parseDraftCollection(drafts);
    if (!validatedDrafts) throw new Error('Draft collection validation failed');

    try {
      const db = await this.openDb();
      await db.transaction('rw', db.drafts, async () => {
        const existingDrafts = await db.drafts.toArray();
        const nextIds = new Set(validatedDrafts.map((draft) => draft.id));
        const idsToDelete: string[] = [];
        for (const draft of existingDrafts) {
          if (!nextIds.has(draft.id)) idsToDelete.push(draft.id);
        }
        await db.drafts.bulkDelete(idsToDelete);
        await db.drafts.bulkPut(validatedDrafts);
      });
    } catch {
      this.saveLocalStorageDrafts(validatedDrafts);
    }
  }

  public async deleteDraft(id: string): Promise<void> {
    const validId = parseDraftId(id);
    if (!validId) return;

    try {
      const db = await this.openDb();
      await db.drafts.delete(validId);
    } catch {
      const drafts = this.getLocalStorageDrafts().filter((draft) => draft.id !== validId);
      this.saveLocalStorageDrafts(drafts);
    }
  }

  public async duplicateDraft(source: ESDraft): Promise<ESDraft> {
    const timestamp = Date.now();
    const newDraft = buildDuplicatedDraft(
      source,
      buildDraftId(timestamp, Math.random().toString(36).substring(2, 7)),
      timestamp,
    );
    await this.saveDraft(newDraft);
    return newDraft;
  }

  public async createDefaultDraft(): Promise<ESDraft> {
    const timestamp = Date.now();
    const newDraft = buildDefaultDraft(
      buildDraftId(timestamp, Math.random().toString(36).substring(2, 7)),
      timestamp,
    );
    await this.saveDraft(newDraft);
    return newDraft;
  }
}

// 初回はサンプルを保存しない。ユーザーが明示的に新規作成してから始める。
export const storage = new IndexedDbStorage([]);
