import type { ESDraft } from '@entities/draft/model/types';
import {
  buildDefaultDraft,
  buildDraftId,
  buildDuplicatedDraft,
  cloneDraft,
  createInitialSampleDrafts,
} from '@entities/draft/model/draftFactories';
import {
  parseCategory,
  parseDraft,
  parseDraftCollection,
  parseDraftId,
} from '@shared/validation/draftSchemas';

const DB_NAME = 'es_craft_indexed_db';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

class IndexedDbStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isIndexedDbAvailable: boolean;
  private readonly initialDrafts: readonly ESDraft[];

  constructor(initialDrafts: readonly ESDraft[]) {
    this.initialDrafts = initialDrafts;
    this.isIndexedDbAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
  }

  private async openDb(): Promise<IDBDatabase> {
    if (!this.isIndexedDbAvailable) {
      throw new Error('IndexedDB is not available');
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
            store.createIndex('category', 'category', { unique: false });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          resolve(db);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }

    return this.dbPromise;
  }

  // Fallback to localStorage if IndexedDB is blocked or throws
  private getLocalStorageDrafts(): ESDraft[] {
    try {
      const data = localStorage.getItem(DB_NAME);
      if (data) {
        return parseDraftCollection(JSON.parse(data)) || this.initialDrafts.map(cloneDraft);
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return this.initialDrafts.map(cloneDraft);
  }

  private saveLocalStorageDrafts(drafts: ESDraft[]): void {
    try {
      const validated = parseDraftCollection(drafts);
      if (!validated) {
        console.warn('LocalStorage draft validation failed');
        return;
      }
      localStorage.setItem(DB_NAME, JSON.stringify(validated));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  public async getAllDrafts(): Promise<ESDraft[]> {
    try {
      const db = await this.openDb();
      return new Promise<ESDraft[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const list = parseDraftCollection(request.result) || [];
          if (list.length === 0) {
            // First time: seed sample drafts
            this.seedInitialDrafts().then(resolve).catch(reject);
            return;
          }
          // Sort by updatedAt descending
          list.sort((a, b) => b.updatedAt - a.updatedAt);
          resolve(list);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('IndexedDB unavailable or failed, falling back to LocalStorage', err);
      const list = this.getLocalStorageDrafts();
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      return list;
    }
  }

  private async seedInitialDrafts(): Promise<ESDraft[]> {
    await Promise.all(this.initialDrafts.map((draft) => this.saveDraft(draft)));
    return this.initialDrafts.map(cloneDraft);
  }

  public async getDraft(id: string): Promise<ESDraft | null> {
    const validId = parseDraftId(id);
    if (!validId) return null;

    try {
      const db = await this.openDb();
      return new Promise<ESDraft | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(validId);

        request.onsuccess = () => {
          resolve(parseDraft(request.result));
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts();
      return drafts.find((d) => d.id === validId) || null;
    }
  }

  public async saveDraft(draft: ESDraft): Promise<void> {
    const validatedDraft = parseDraft(draft);
    if (!validatedDraft) {
      throw new Error('Draft validation failed');
    }

    const draftToSave = validatedDraft;

    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(draftToSave);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts();
      const index = drafts.findIndex((d) => d.id === draftToSave.id);
      if (index >= 0) {
        drafts[index] = draftToSave;
      } else {
        drafts.unshift(draftToSave);
      }
      this.saveLocalStorageDrafts(drafts);
    }
  }

  public async deleteDraft(id: string): Promise<void> {
    const validId = parseDraftId(id);
    if (!validId) return;

    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(validId);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts().filter((d) => d.id !== validId);
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
  public async createDefaultDraft(category: string = 'gakuchika'): Promise<ESDraft> {
    const timestamp = Date.now();
    const newDraft = buildDefaultDraft(
      parseCategory(category),
      buildDraftId(timestamp, Math.random().toString(36).substring(2, 7)),
      timestamp,
    );
    await this.saveDraft(newDraft);
    return newDraft;
  }
}

export const storage = new IndexedDbStorage(createInitialSampleDrafts(Date.now()));
