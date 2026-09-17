import { describe, expect, it } from 'vitest';
import {
  createSnapshotDraft,
  mergeDraftUpdate,
  restoreSnapshotDraft,
  toggleDraftStar,
} from '@entities/draft/model/draftMutations';
import type { ESDraft } from '@entities/draft/model/types';

const draft: ESDraft = {
  id: 'draft-1',
  title: '下書き',
  companyName: '会社',
  category: 'gakuchika',
  content: '本文です。',
  isBlockMode: false,
  targetCount: 400,
  createdAt: 1,
  updatedAt: 2,
  tags: ['タグ'],
  starred: false,
  snapshots: [],
};

describe('draft mutations', () => {
  it('derives an updated draft without changing the source', () => {
    const result = mergeDraftUpdate(draft, { content: '更新後' }, 100);

    expect(result).toEqual({ ...draft, content: '更新後', updatedAt: 100 });
    expect(draft).toEqual({ ...draft, content: '本文です。', updatedAt: 2 });
  });

  it('uses the supplied timestamp for a pure star toggle', () => {
    const result = toggleDraftStar(draft, 200);

    expect(result.starred).toBe(true);
    expect(result.updatedAt).toBe(200);
    expect(draft.starred).toBe(false);
  });

  it('creates a snapshot from explicit identity data and preserves the source', () => {
    const result = createSnapshotDraft(draft, '  初稿  ', {
      id: 'snap-1',
      timestamp: 300,
    });

    expect(result.snapshots).toEqual([
      {
        id: 'snap-1',
        label: '初稿',
        content: '本文です。',
        charCount: 5,
        timestamp: 300,
      },
    ]);
    expect(result.updatedAt).toBe(300);
    expect(draft.snapshots).toEqual([]);
    expect(draft.updatedAt).toBe(2);
  });

  it('restores only content and the supplied update timestamp', () => {
    const snapshot = {
      id: 'snap-1',
      label: '初稿',
      content: '復元する本文。',
      charCount: 8,
      timestamp: 3,
    };

    expect(restoreSnapshotDraft(draft, snapshot, 400)).toEqual({
      ...draft,
      content: '復元する本文。',
      updatedAt: 400,
    });
    expect(draft.content).toBe('本文です。');
  });
});
