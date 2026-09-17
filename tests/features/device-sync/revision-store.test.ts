import './setup.js';
import { describe, expect, it } from 'vitest';
import { IndexedDbRevisionStore } from '../../../src/features/device-sync/sync/indexeddb-store.js';
import { MemoryRevisionStore } from '../../../src/features/device-sync/sync/memory-store.js';
import {
  createRevision,
  findMergeBase,
  mergeClocks,
  reachableRevisionIds,
} from '../../../src/features/device-sync/sync/revision-dag.js';
import type { Revision } from '../../../src/features/device-sync/sync/types.js';

async function createGraph(store: MemoryRevisionStore): Promise<{
  root: Revision;
  local: Revision;
  remote: Revision;
}> {
  const root = await createRevision({
    documentId: 'draft-1',
    value: { body: 'base' },
    replicaId: 'pc',
    createdAt: 1,
  });
  await store.putRevisions([root]);
  const local = await createRevision({
    documentId: root.documentId,
    value: { body: 'local' },
    parents: [root],
    replicaId: 'pc',
    createdAt: 2,
  });
  const remote = await createRevision({
    documentId: root.documentId,
    value: { body: 'remote' },
    parents: [root],
    replicaId: 'phone',
    createdAt: 3,
  });
  await store.putRevisions([local, remote]);
  return { root, local, remote };
}

describe('revision stores', () => {
  it('keeps both divergent heads and finds their common ancestor', async () => {
    const store = new MemoryRevisionStore();
    const { root, local, remote } = await createGraph(store);

    expect(await store.getHeads()).toEqual([
      { documentId: 'draft-1', heads: [local.id, remote.id].sort() },
    ]);
    expect((await findMergeBase(store, local.id, remote.id))?.id).toBe(root.id);
    expect((await findMergeBase(store, local.id, local.id))?.id).toBe(local.id);
    expect(await reachableRevisionIds(store, [local.id, 'unknown'])).toEqual(
      new Set([root.id, local.id]),
    );
  });

  it('returns no merge base for unrelated roots and merges vector clocks', async () => {
    const store = new MemoryRevisionStore();
    const first = await createRevision({
      documentId: 'first',
      value: { body: 'first' },
      replicaId: 'pc',
      createdAt: 1,
    });
    const second = await createRevision({
      documentId: 'second',
      value: { body: 'second' },
      replicaId: 'phone',
      createdAt: 1,
    });
    await store.putRevisions([first, second]);

    expect(await findMergeBase(store, first.id, second.id)).toBeUndefined();
    expect(
      mergeClocks([
        { pc: 1, phone: 2 },
        { pc: 3, tablet: 1 },
      ]),
    ).toEqual({
      pc: 3,
      phone: 2,
      tablet: 1,
    });
  });

  it('rejects tampered content before mutating the memory store', async () => {
    const store = new MemoryRevisionStore();
    const root = await createRevision({
      documentId: 'draft-1',
      value: { body: 'base' },
      replicaId: 'pc',
      createdAt: 1,
    });
    await store.putRevisions([root]);
    const tampered = { ...root, id: 'tampered', value: { body: 'changed' } };

    await expect(store.putRevisions([tampered])).rejects.toThrow('integrity check');
    expect(await store.getRevisions()).toEqual([root]);
  });

  it('rejects a parent belonging to another document', async () => {
    const store = new MemoryRevisionStore();
    const root = await createRevision({
      documentId: 'draft-1',
      value: { body: 'base' },
      replicaId: 'pc',
      createdAt: 1,
    });
    const child = await createRevision({
      documentId: 'draft-2',
      value: { body: 'child' },
      parents: [root as Revision<{ body: string }>],
      replicaId: 'pc',
      createdAt: 2,
    });

    await expect(store.putRevisions([root, child])).rejects.toThrow('cross-document parent');
    expect(await store.getRevisions()).toEqual([]);
  });

  it('applies an out-of-order batch atomically in IndexedDB', async () => {
    const store = new IndexedDbRevisionStore(`jobtra-test-${crypto.randomUUID()}`);
    const root = await createRevision({
      documentId: 'draft-1',
      value: { body: 'base' },
      replicaId: 'pc',
      createdAt: 1,
    });
    const child = await createRevision({
      documentId: root.documentId,
      value: { body: 'child' },
      parents: [root],
      replicaId: 'pc',
      createdAt: 2,
    });

    await store.putRevisions([child, root]);
    expect((await store.getHeads())[0]?.heads).toEqual([child.id]);
    expect((await store.getRevisions()).map((revision) => revision.id).sort()).toEqual(
      [root.id, child.id].sort(),
    );
    await store.close();
  });

  it('keeps heads correct when memory receives an out-of-order batch', async () => {
    const store = new MemoryRevisionStore();
    const root = await createRevision({
      documentId: 'draft-1',
      value: { body: 'base' },
      replicaId: 'pc',
      createdAt: 1,
    });
    const child = await createRevision({
      documentId: root.documentId,
      value: { body: 'child' },
      parents: [root],
      replicaId: 'pc',
      createdAt: 2,
    });

    await store.putRevisions([child, root]);
    expect((await store.getHeads())[0]?.heads).toEqual([child.id]);
  });

  it('does not partially apply a batch with a missing parent', async () => {
    const store = new IndexedDbRevisionStore(`jobtra-test-${crypto.randomUUID()}`);
    const root = await createRevision({
      documentId: 'draft-1',
      value: { body: 'base' },
      replicaId: 'pc',
      createdAt: 1,
    });
    const child = await createRevision({
      documentId: root.documentId,
      value: { body: 'child' },
      parents: [root],
      replicaId: 'pc',
      createdAt: 2,
    });

    await expect(store.putRevisions([child])).rejects.toThrow(`missing parent ${root.id}`);
    expect(await store.getRevisions()).toEqual([]);
    await store.close();
  });
});
