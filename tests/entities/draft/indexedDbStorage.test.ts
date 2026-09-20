import 'fake-indexeddb/auto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildDefaultDraft } from '@entities/draft/model/draftFactories';
import { draftDatabase } from '@entities/draft/storage/dexieDraftDatabase';
import { storage } from '@entities/draft/storage/indexedDbStorage';
import { normalizeDexieCloudDatabaseUrl } from '@entities/draft/storage/dexieCloudConfig';

const DRAFT_DATABASE_NAME = 'es_craft_indexed_db';
const migratedDraft = buildDefaultDraft('legacy-draft', 1_000);

function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DRAFT_DATABASE_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('database deletion was blocked'));
  });
}

function createLegacyDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DRAFT_DATABASE_NAME, 2);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('drafts', { keyPath: 'id' });
      store.createIndex('updatedAt', 'updatedAt');
      store.createIndex('category', 'category');
      store.createIndex('progressStatus', 'progressStatus');
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction('drafts', 'readwrite');
      transaction.objectStore('drafts').put(migratedDraft);
      transaction.oncomplete = () => {
        request.result.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    };
    request.onerror = () => reject(request.error);
  });
}

describe('IndexedDB draft storage', () => {
  beforeAll(async () => {
    await deleteDatabase();
    await createLegacyDatabase();
  });

  afterAll(async () => {
    draftDatabase.close();
    await deleteDatabase();
  });

  it('reads drafts from the existing database schema', async () => {
    const draft = await storage.getDraft(migratedDraft.id);

    expect(draft).toEqual(migratedDraft);
  });

  it('persists writes and publishes live database changes', async () => {
    const draft = buildDefaultDraft('observed-draft', 2_000);
    const observed = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('draft observation timed out')), 1_000);
      const unsubscribe = storage.subscribe((drafts) => {
        if (!drafts.some((entry) => entry.id === draft.id)) return;
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      });
    });

    await storage.saveDraft(draft);
    await observed;
    expect(await storage.getDraft(draft.id)).toEqual(draft);
    await storage.deleteDraft(draft.id);
    expect(await storage.getDraft(draft.id)).toBeNull();
  });
});

describe('Dexie Cloud configuration', () => {
  it('accepts HTTPS endpoints and local development endpoints only', () => {
    expect(normalizeDexieCloudDatabaseUrl(' https://example.dexie.cloud/ ')).toBe(
      'https://example.dexie.cloud',
    );
    expect(normalizeDexieCloudDatabaseUrl('http://localhost:3000/')).toBe('http://localhost:3000');
    expect(normalizeDexieCloudDatabaseUrl('http://example.dexie.cloud')).toBeNull();
    expect(normalizeDexieCloudDatabaseUrl('not a URL')).toBeNull();
  });
});
