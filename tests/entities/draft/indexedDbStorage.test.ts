import 'fake-indexeddb/auto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildDefaultDraft, createInitialSampleDrafts } from '@entities/draft/model/draftFactories';
import { draftDatabase } from '@entities/draft/storage/dexieDraftDatabase';
import { storage } from '@entities/draft/storage/indexedDbStorage';
import { normalizeDexieCloudDatabaseUrl } from '@entities/draft/storage/dexieCloudConfig';

const DRAFT_DATABASE_NAME = 'es_craft_indexed_db';
const migratedDraft = buildDefaultDraft('legacy-draft', 1_000);
const legacyConfiguredDraft = {
  ...buildDefaultDraft('legacy-configured-draft', 1_100),
  category: 'gakuchika' as const,
  targetCount: 400,
};
const legacySampleDraft = createInitialSampleDrafts(1_000_000_000)[0];
const editedLegacySampleDraft = {
  ...createInitialSampleDrafts(1_000_000_000)[1],
  title: '編集済みサンプル',
};

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
      store.put(legacyConfiguredDraft);
      store.put(legacySampleDraft);
      store.put(editedLegacySampleDraft);
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

  it('normalizes legacy blank drafts without changing authored drafts', async () => {
    const draft = await storage.getDraft(legacyConfiguredDraft.id);

    expect(draft).toMatchObject({ category: null, targetCount: null, progressStatus: null });
    expect(await draftDatabase.drafts.get(legacyConfiguredDraft.id)).toMatchObject({
      category: null,
      targetCount: null,
      progressStatus: null,
    });
  });

  it('removes untouched seeded samples while preserving edited records', async () => {
    expect(await storage.getDraft(legacySampleDraft.id)).toBeNull();
    expect(await draftDatabase.drafts.get(legacySampleDraft.id)).toBeUndefined();
    expect(await storage.getDraft(editedLegacySampleDraft.id)).toMatchObject({
      title: '編集済みサンプル',
    });
    expect(await draftDatabase.drafts.get(editedLegacySampleDraft.id)).toMatchObject({
      title: '編集済みサンプル',
    });
  });

  it('creates drafts with no category or character limit selected', async () => {
    const draft = await storage.createDefaultDraft();

    expect(draft).toMatchObject({ category: null, targetCount: null, progressStatus: null });
    await storage.deleteDraft(draft.id);
  });

  it('keeps metadata selected by a user immediately after creation', async () => {
    const draft = await storage.createDefaultDraft();
    const configuredDraft = {
      ...draft,
      category: 'gakuchika' as const,
      targetCount: 400,
    };
    const observed = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('configured draft observation timed out')),
        1_000,
      );
      const unsubscribe = storage.subscribe((drafts) => {
        const current = drafts.find((entry) => entry.id === draft.id);
        if (current?.category !== 'gakuchika' || current.targetCount !== 400) return;
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      });
    });

    await storage.saveDraft(configuredDraft);
    await observed;

    expect(await storage.getDraft(draft.id)).toMatchObject({
      category: 'gakuchika',
      targetCount: 400,
    });
    await storage.deleteDraft(draft.id);
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
