import Dexie, { liveQuery, type Table, type Subscription } from 'dexie';
import dexieCloudAddon from 'dexie-cloud-addon';
import type { ESDraft } from '@entities/draft/model/types';
import { getDexieCloudDatabaseUrl } from './dexieCloudConfig';

const DRAFT_DATABASE_NAME = 'es_craft_indexed_db';
const DRAFT_DATABASE_VERSION = 2;
const DRAFT_STORE_NAME = 'drafts';

const DRAFT_STORE_SCHEMA = 'id, updatedAt, category, progressStatus';

export type DraftDatabase = Dexie & {
  drafts: Table<ESDraft, string>;
};

type DraftDatabaseObserver = (drafts: ESDraft[]) => void;

function createDraftDatabase(): DraftDatabase {
  const db = new Dexie(DRAFT_DATABASE_NAME, { addons: [dexieCloudAddon] }) as DraftDatabase;
  db.version(DRAFT_DATABASE_VERSION).stores({
    // The table is synced without '@' so existing application-generated IDs
    // remain valid. Dexie Cloud marks every declared application table for
    // sync; '@' is reserved for its generated ID prefix policy.
    [DRAFT_STORE_NAME]: DRAFT_STORE_SCHEMA,
  });

  const databaseUrl = getDexieCloudDatabaseUrl();
  if (databaseUrl && typeof window !== 'undefined') {
    db.cloud.configure({
      databaseUrl,
      nameSuffix: false,
      requireAuth: true,
      tryUseServiceWorker: false,
    });
  }

  return db;
}

export const draftDatabase = createDraftDatabase();

export async function openDraftDatabase(): Promise<DraftDatabase> {
  await draftDatabase.open();
  return draftDatabase;
}

export function observeDraftDatabase(observer: DraftDatabaseObserver): () => void {
  if (typeof indexedDB === 'undefined') return () => undefined;

  let subscription: Subscription | null = null;
  try {
    subscription = liveQuery(async () => {
      const db = await openDraftDatabase();
      return db.drafts.toArray();
    }).subscribe({
      next: (drafts) => observer(drafts),
      error: (error: unknown) => {
        // Local persistence must remain usable if a remote sync endpoint is
        // temporarily unavailable. Dexie Cloud retries independently.
        console.warn('Draft database observation stopped:', error);
      },
    });
  } catch (error) {
    console.warn('Draft database observation unavailable:', error);
  }

  return () => subscription?.unsubscribe();
}
