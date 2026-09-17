import './setup.js';
import { describe, expect, it } from 'vitest';
import type { ESDraft } from '../../../src/entities/draft/model/types.js';
import {
  resolveDraftConflict,
  syncDrafts,
  type DraftSyncValue,
} from '../../../src/features/device-sync/sync/draft-sync.js';
import { createLoopbackChannels } from '../../../src/features/device-sync/sync/channel.js';
import { MemoryRevisionStore } from '../../../src/features/device-sync/sync/memory-store.js';
import { createRevision } from '../../../src/features/device-sync/sync/revision-dag.js';

const baseDraft: ESDraft = {
  id: 'draft-sync-test',
  title: '同期テスト',
  companyName: '株式会社テスト',
  category: 'pr',
  content: '共通の本文です。',
  isBlockMode: false,
  targetCount: 400,
  createdAt: 100,
  updatedAt: 100,
  tags: ['test'],
  starred: false,
  snapshots: [],
};

function draft(overrides: Partial<ESDraft>): ESDraft {
  return { ...baseDraft, ...overrides };
}

async function seedSharedBase(store: MemoryRevisionStore<DraftSyncValue>): Promise<void> {
  const revision = await createRevision({
    documentId: baseDraft.id,
    value: baseDraft as unknown as DraftSyncValue,
    replicaId: 'seed',
    createdAt: 100,
  });
  await store.putRevisions([revision]);
}

describe('syncDrafts', () => {
  it('syncs independent edits and creates a merge revision', async () => {
    const left = new MemoryRevisionStore<DraftSyncValue>();
    const right = new MemoryRevisionStore<DraftSyncValue>();
    await Promise.all([seedSharedBase(left), seedSharedBase(right)]);
    const [leftChannel, rightChannel] = createLoopbackChannels<DraftSyncValue>();

    const [leftResult, rightResult] = await Promise.all([
      syncDrafts({
        drafts: [draft({ title: '左の編集', updatedAt: 200 })],
        store: left,
        channel: leftChannel,
        replicaId: 'left',
        now: 200,
      }),
      syncDrafts({
        drafts: [draft({ content: '右の編集です。', updatedAt: 300 })],
        store: right,
        channel: rightChannel,
        replicaId: 'right',
        now: 300,
      }),
    ]);

    expect(leftResult.conflicts).toEqual([]);
    expect(rightResult.conflicts).toEqual([]);
    expect(leftResult.syncedDrafts[0]).toMatchObject({
      title: '左の編集',
      content: '右の編集です。',
    });
    expect(rightResult.syncedDrafts[0]).toEqual(leftResult.syncedDrafts[0]);
    expect((await left.getHeads(baseDraft.id))[0]?.heads).toHaveLength(1);
  });

  it('returns a structured conflict and resolves it into a merge revision', async () => {
    const left = new MemoryRevisionStore<DraftSyncValue>();
    const right = new MemoryRevisionStore<DraftSyncValue>();
    await Promise.all([seedSharedBase(left), seedSharedBase(right)]);
    const [leftChannel, rightChannel] = createLoopbackChannels<DraftSyncValue>();

    const [leftResult] = await Promise.all([
      syncDrafts({
        drafts: [draft({ content: '左が書いた本文', updatedAt: 200 })],
        store: left,
        channel: leftChannel,
        replicaId: 'left',
        now: 200,
      }),
      syncDrafts({
        drafts: [draft({ content: '右が書いた本文', updatedAt: 300 })],
        store: right,
        channel: rightChannel,
        replicaId: 'right',
        now: 300,
      }),
    ]);

    expect(leftResult.conflicts).toHaveLength(1);
    const conflict = leftResult.conflicts[0];
    expect(conflict.conflicts).toEqual([
      expect.objectContaining({ path: 'content', kind: 'text' }),
    ]);

    const resolved = await resolveDraftConflict({
      conflict,
      choices: { content: 'remote' },
      store: left,
      replicaId: 'left',
      now: 400,
    });
    expect(resolved?.content).toBe('右が書いた本文');
    expect((await left.getHeads(baseDraft.id))[0]?.heads).toHaveLength(1);
  });

  it('does not create a false conflict for separately seeded equivalent drafts', async () => {
    const left = new MemoryRevisionStore<DraftSyncValue>();
    const right = new MemoryRevisionStore<DraftSyncValue>();
    const leftRoot = await createRevision({
      documentId: baseDraft.id,
      value: draft({ createdAt: 100, updatedAt: 200 }) as unknown as DraftSyncValue,
      replicaId: 'left',
      createdAt: 200,
    });
    const rightRoot = await createRevision({
      documentId: baseDraft.id,
      value: draft({ createdAt: 900, updatedAt: 1_000 }) as unknown as DraftSyncValue,
      replicaId: 'right',
      createdAt: 1_000,
    });
    await left.putRevisions([leftRoot]);
    await right.putRevisions([rightRoot]);
    const [leftChannel, rightChannel] = createLoopbackChannels<DraftSyncValue>();

    const [leftResult] = await Promise.all([
      syncDrafts({
        drafts: [draft({ createdAt: 100, updatedAt: 200 })],
        store: left,
        channel: leftChannel,
        replicaId: 'left',
        now: 2_000,
      }),
      syncDrafts({
        drafts: [draft({ createdAt: 900, updatedAt: 1_000 })],
        store: right,
        channel: rightChannel,
        replicaId: 'right',
        now: 2_000,
      }),
    ]);

    expect(leftResult.conflicts).toEqual([]);
    expect(leftResult.syncedDrafts[0].updatedAt).toBe(1_000);
  });

  it('propagates a deletion as a tombstone and removes the draft on both devices', async () => {
    const left = new MemoryRevisionStore<DraftSyncValue>();
    const right = new MemoryRevisionStore<DraftSyncValue>();
    await Promise.all([seedSharedBase(left), seedSharedBase(right)]);
    const [leftChannel, rightChannel] = createLoopbackChannels<DraftSyncValue>();

    const [leftResult, rightResult] = await Promise.all([
      syncDrafts({
        drafts: [],
        store: left,
        channel: leftChannel,
        replicaId: 'left',
        now: 400,
      }),
      syncDrafts({
        drafts: [baseDraft],
        store: right,
        channel: rightChannel,
        replicaId: 'right',
        now: 400,
      }),
    ]);

    expect(leftResult.syncedDrafts).toEqual([]);
    expect(rightResult.syncedDrafts).toEqual([]);
    const [head] = await right.getHeads(baseDraft.id);
    expect(head?.heads).toHaveLength(1);
    const [tombstone] = await right.getRevisions(head?.heads);
    expect(tombstone?.value).toMatchObject({
      kind: 'jobtra-draft-deleted-v1',
      documentId: baseDraft.id,
    });
  });
});
