import { openDB, type IDBPDatabase } from 'idb';
import { revisionIdOf } from './canonical-json.js';
import { topologicalOrder } from './topological-order.js';
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
    const entries: RevisionHeads[] = [];
    for (const entry of heads) {
      if (documentId !== undefined && entry.documentId !== documentId) continue;
      entries.push({ documentId: entry.documentId, heads: [...entry.heads].sort() });
    }
    return entries.sort((left, right) => left.documentId.localeCompare(right.documentId));
  }

  async putRevisions(revisions: readonly Revision<T>[]): Promise<void> {
    const db = await this.dbPromise;
    const incoming = new Map(revisions.map((revision) => [revision.id, revision]));
    await validateRevisions(db, incoming);
    const ordered = topologicalOrder(incoming);
    const transaction = db.transaction(['revisions', 'heads'], 'readwrite');
    const revisionStore = transaction.objectStore('revisions');
    const headsStore = transaction.objectStore('heads');
    const [existingRevisions, existingHeads] = await Promise.all([
      revisionStore.getAll(),
      headsStore.getAll(),
    ]);
    const existingIds = new Set(existingRevisions.map((revision) => revision.id));
    const headsByDocument = new Map(
      existingHeads.map((entry) => [entry.documentId, { ...entry, heads: [...entry.heads] }]),
    );

    for (const revision of ordered) {
      if (existingIds.has(revision.id)) continue;

      revisionStore.put(revision, revision.id);
      existingIds.add(revision.id);

      const current = headsByDocument.get(revision.documentId) ?? {
        documentId: revision.documentId,
        heads: [],
      };
      current.heads = current.heads.filter((head) => !revision.parents.includes(head));
      if (!current.heads.includes(revision.id)) current.heads.push(revision.id);
      current.heads.sort();
      headsByDocument.set(revision.documentId, current);
      headsStore.put(current, current.documentId);
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
  const revisions = [...incoming.values()];
  for (const revision of revisions) {
    if (revision.documentId.length === 0) throw new Error('revision documentId is required');
    if (new Set(revision.parents).size !== revision.parents.length) {
      throw new Error(`revision ${revision.id} has duplicate parents`);
    }
  }

  const expectedIds = await Promise.all(
    revisions.map(async (revision) => {
      const { id: _id, ...unsigned } = revision;
      return revisionIdOf(unsigned);
    }),
  );
  for (const [index, revision] of revisions.entries()) {
    if (expectedIds[index] !== revision.id) {
      throw new Error(`revision ${revision.id} failed integrity check`);
    }
  }

  const externalParentIds = new Set<string>();
  for (const revision of revisions) {
    for (const parent of revision.parents) {
      if (!incoming.has(parent)) externalParentIds.add(parent);
    }
  }

  const externalParents = await Promise.all(
    [...externalParentIds].map(async (id) => [id, await db.get('revisions', id)] as const),
  );
  const externalParentsById = new Map(externalParents);
  for (const revision of revisions) {
    for (const parent of revision.parents) {
      const parentRevision = incoming.get(parent) ?? externalParentsById.get(parent);
      if (parentRevision === undefined) throw new Error(`missing parent ${parent}`);
      if (parentRevision.documentId !== revision.documentId) {
        throw new Error(`revision ${revision.id} has a cross-document parent`);
      }
    }
  }
}
