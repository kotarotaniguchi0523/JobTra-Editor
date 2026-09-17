import { openDB, type IDBPDatabase } from 'idb';
import { revisionIdOf } from './canonical-json.js';
import type { JsonValue, Revision, RevisionHeads, RevisionStore } from './types.js';

type SyncDb<T extends JsonValue> = {
  revisions: {
    key: string;
    value: Revision<T>;
  };
  heads: {
    key: string;
    value: RevisionHeads;
  };
};

export class IndexedDbRevisionStore<T extends JsonValue = JsonValue> implements RevisionStore<T> {
  private readonly dbPromise: Promise<IDBPDatabase<SyncDb<T>>>;

  constructor(
    private readonly name = 'jobtra-sync',
    private readonly version = 1,
  ) {
    this.dbPromise = openDB<SyncDb<T>>(name, version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('revisions')) db.createObjectStore('revisions');
        if (!db.objectStoreNames.contains('heads')) db.createObjectStore('heads');
      },
    });
  }

  async getRevision(id: string): Promise<Revision<T> | undefined> {
    return (await this.dbPromise).get('revisions', id);
  }

  async getRevisions(ids?: readonly string[]): Promise<Revision<T>[]> {
    const db = await this.dbPromise;
    if (ids === undefined) return db.getAll('revisions');
    const revisions = await Promise.all(ids.map((id) => db.get('revisions', id)));
    return revisions.filter((revision): revision is Revision<T> => revision !== undefined);
  }

  async getHeads(documentId?: string): Promise<RevisionHeads[]> {
    const db = await this.dbPromise;
    const heads = await db.getAll('heads');
    return heads
      .filter((entry) => documentId === undefined || entry.documentId === documentId)
      .map((entry) => ({ documentId: entry.documentId, heads: [...entry.heads].sort() }))
      .sort((left, right) => left.documentId.localeCompare(right.documentId));
  }

  async putRevisions(revisions: readonly Revision<T>[]): Promise<void> {
    const db = await this.dbPromise;
    const incoming = new Map(revisions.map((revision) => [revision.id, revision]));
    await validateRevisions(db, incoming);
    const ordered = topologicalOrder(incoming);
    const transaction = db.transaction(['revisions', 'heads'], 'readwrite');
    for (const revision of ordered) {
      if ((await transaction.objectStore('revisions').get(revision.id)) !== undefined) continue;
      await transaction.objectStore('revisions').put(revision, revision.id);
      const current = (await transaction.objectStore('heads').get(revision.documentId)) ?? {
        documentId: revision.documentId,
        heads: [],
      };
      current.heads = current.heads.filter((head) => !revision.parents.includes(head));
      if (!current.heads.includes(revision.id)) current.heads.push(revision.id);
      current.heads.sort();
      await transaction.objectStore('heads').put(current, current.documentId);
    }
    await transaction.done;
  }

  async close(): Promise<void> {
    (await this.dbPromise).close();
  }
}

async function validateRevisions<T extends JsonValue>(
  db: IDBPDatabase<SyncDb<T>>,
  incoming: ReadonlyMap<string, Revision<T>>,
): Promise<void> {
  for (const revision of incoming.values()) {
    if (revision.documentId.length === 0) throw new Error('revision documentId is required');
    if (new Set(revision.parents).size !== revision.parents.length) {
      throw new Error(`revision ${revision.id} has duplicate parents`);
    }
    const { id: _id, ...unsigned } = revision;
    if ((await revisionIdOf(unsigned)) !== revision.id) {
      throw new Error(`revision ${revision.id} failed integrity check`);
    }
    for (const parent of revision.parents) {
      const parentRevision = incoming.get(parent) ?? (await db.get('revisions', parent));
      if (parentRevision === undefined) {
        throw new Error(`missing parent ${parent}`);
      }
      if (parentRevision.documentId !== revision.documentId) {
        throw new Error(`revision ${revision.id} has a cross-document parent`);
      }
    }
  }
}

function topologicalOrder<T extends JsonValue>(
  incoming: ReadonlyMap<string, Revision<T>>,
): Revision<T>[] {
  const pending = new Map(incoming);
  const ordered: Revision<T>[] = [];
  while (pending.size > 0) {
    const ready = [...pending.values()].filter((revision) =>
      revision.parents.every((parent) => !pending.has(parent)),
    );
    if (ready.length === 0) throw new Error('revision graph contains a cycle');
    ready.sort((left, right) => left.id.localeCompare(right.id));
    for (const revision of ready) {
      pending.delete(revision.id);
      ordered.push(revision);
    }
  }
  return ordered;
}
