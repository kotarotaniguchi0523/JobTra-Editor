import './setup.js';
import { describe, expect, it } from 'vitest';
import { createLoopbackChannels } from '../../../src/features/device-sync/sync/channel.js';
import { IndexedDbRevisionStore } from '../../../src/features/device-sync/sync/indexeddb-store.js';
import { MemoryRevisionStore } from '../../../src/features/device-sync/sync/memory-store.js';
import { syncStores } from '../../../src/features/device-sync/sync/protocol.js';
import { createRevision } from '../../../src/features/device-sync/sync/revision-dag.js';
import type { RevisionStore } from '../../../src/features/device-sync/sync/types.js';

async function seed(store: RevisionStore, replicaId: string, body: string) {
  const root = await createRevision({
    documentId: 'draft-1',
    value: { body },
    replicaId,
    createdAt: 1,
  });
  await store.putRevisions([root]);
  return root;
}

describe('revision sync protocol', () => {
  it('completes when both stores are empty', async () => {
    const left = new MemoryRevisionStore();
    const right = new MemoryRevisionStore();
    const [leftChannel, rightChannel] = createLoopbackChannels();

    const [leftSummary, rightSummary] = await Promise.all([
      syncStores({ store: left, channel: leftChannel }),
      syncStores({ store: right, channel: rightChannel }),
    ]);

    expect(leftSummary).toEqual({ sent: 0, received: 0 });
    expect(rightSummary).toEqual({ sent: 0, received: 0 });
  });

  it('synchronizes divergent stores through two independent channels', async () => {
    const left = new MemoryRevisionStore();
    const right = new MemoryRevisionStore();
    const leftRoot = await seed(left, 'pc', 'base');
    const rightRoot = await seed(right, 'pc', 'base');
    expect(leftRoot.id).toBe(rightRoot.id);

    const leftRevision = await createRevision({
      documentId: 'draft-1',
      value: { body: 'local' },
      parents: [leftRoot],
      replicaId: 'pc',
      createdAt: 2,
    });
    const rightRevision = await createRevision({
      documentId: 'draft-1',
      value: { body: 'remote' },
      parents: [rightRoot],
      replicaId: 'phone',
      createdAt: 3,
    });
    await left.putRevisions([leftRevision]);
    await right.putRevisions([rightRevision]);

    const [leftChannel, rightChannel] = createLoopbackChannels({ latencyMs: 1, duplicateEvery: 2 });
    const [leftSummary, rightSummary] = await Promise.all([
      syncStores({ store: left, channel: leftChannel }),
      syncStores({ store: right, channel: rightChannel }),
    ]);

    expect(leftSummary.received).toBe(1);
    expect(rightSummary.received).toBe(1);
    expect((await left.getRevisions()).map((revision) => revision.id).sort()).toEqual(
      (await right.getRevisions()).map((revision) => revision.id).sort(),
    );
    leftChannel.close();
    rightChannel.close();
  });

  it('synchronizes two independent IndexedDB stores end to end', async () => {
    const left = new IndexedDbRevisionStore(`jobtra-sync-left-${crypto.randomUUID()}`);
    const right = new IndexedDbRevisionStore(`jobtra-sync-right-${crypto.randomUUID()}`);
    try {
      const leftRoot = await seed(left, 'pc', 'base');
      const rightRoot = await seed(right, 'pc', 'base');
      const leftRevision = await createRevision({
        documentId: 'draft-1',
        value: { body: 'local' },
        parents: [leftRoot],
        replicaId: 'pc',
        createdAt: 2,
      });
      const rightRevision = await createRevision({
        documentId: 'draft-1',
        value: { body: 'remote' },
        parents: [rightRoot],
        replicaId: 'phone',
        createdAt: 3,
      });
      await left.putRevisions([leftRevision]);
      await right.putRevisions([rightRevision]);

      const [leftChannel, rightChannel] = createLoopbackChannels({
        latencyMs: 1,
        duplicateEvery: 2,
      });
      await Promise.all([
        syncStores({ store: left, channel: leftChannel }),
        syncStores({ store: right, channel: rightChannel }),
      ]);

      expect((await left.getRevisions()).map((revision) => revision.id).sort()).toEqual(
        (await right.getRevisions()).map((revision) => revision.id).sort(),
      );
      expect(await left.getHeads()).toEqual(await right.getHeads());
      leftChannel.close();
      rightChannel.close();
    } finally {
      await left.close();
      await right.close();
    }
  });

  it('splits a large revision history into bounded protocol batches', async () => {
    const left = new MemoryRevisionStore();
    const right = new MemoryRevisionStore();
    let parent = await seed(left, 'pc', 'base');
    const revisions = [parent];
    for (let index = 0; index < 5; index += 1) {
      parent = await createRevision({
        documentId: 'draft-1',
        value: { body: `${index}-${'x'.repeat(8_000)}` },
        parents: [parent],
        replicaId: 'pc',
        createdAt: index + 2,
      });
      revisions.push(parent);
      await left.putRevisions([parent]);
    }

    const [leftChannel, rightChannel] = createLoopbackChannels({ latencyMs: 1 });
    const [leftSummary, rightSummary] = await Promise.all([
      syncStores({ store: left, channel: leftChannel }),
      syncStores({ store: right, channel: rightChannel }),
    ]);

    expect(leftSummary.sent).toBe(revisions.length);
    expect(rightSummary.received).toBe(revisions.length);
    expect((await right.getRevisions()).length).toBe(revisions.length);
  });

  it('detects a dropped completion message instead of claiming success', async () => {
    const left = new MemoryRevisionStore();
    const right = new MemoryRevisionStore();
    await seed(left, 'pc', 'base');
    await seed(right, 'pc', 'base');
    const [leftChannel, rightChannel] = createLoopbackChannels({
      drop: (message, direction) => message.kind === 'done' && direction === 'a-to-b',
    });

    await expect(
      Promise.all([
        syncStores({ store: left, channel: leftChannel, timeoutMs: 50 }),
        syncStores({ store: right, channel: rightChannel, timeoutMs: 50 }),
      ]),
    ).rejects.toThrow('sync timed out');
    leftChannel.close();
    rightChannel.close();
  });
});
