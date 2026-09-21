import { describe, expect, it } from 'vitest';
import {
  buildDefaultDraft,
  buildDraftId,
  buildDuplicatedDraft,
  buildSnapshotId,
  createInitialSampleDrafts,
  isUntouchedLegacySampleDraft,
  migrateLegacyDrafts,
  normalizeLegacyDefaultDraft,
  removeUntouchedLegacySampleDrafts,
} from '@entities/draft/model/draftFactories';
import type { ESDraft } from '@entities/draft/model/types';

const source: ESDraft = {
  id: 'draft-1',
  title: '下書き',
  companyName: '会社',
  category: 'gakuchika',
  content: '本文',
  starBlocks: {
    conclusion: '結論',
    situation: '',
    action: '',
    result: '',
    contribution: '',
  },
  isBlockMode: true,
  targetCount: 400,
  createdAt: 1,
  updatedAt: 2,
  tags: ['タグ'],
  snapshots: [{ id: 'snap-1', label: '初稿', content: '本文', charCount: 2, timestamp: 2 }],
};

describe('draft factories', () => {
  it('builds deterministic identifiers from supplied values', () => {
    expect(buildDraftId(10, 'abc')).toBe('draft_10_abc');
    expect(buildSnapshotId(20, 'xyz')).toBe('snap_20_xyz');
  });

  it('builds a default draft without reading a clock', () => {
    expect(buildDefaultDraft('draft-2', 100)).toMatchObject({
      id: 'draft-2',
      category: null,
      targetCount: null,
      progressStatus: null,
      createdAt: 100,
      updatedAt: 100,
      content: '',
    });
  });

  it('clears category and target count only on untouched legacy defaults', () => {
    const legacyDraft: ESDraft = {
      ...buildDefaultDraft('legacy-default', 100),
      category: 'gakuchika',
      targetCount: 400,
    };

    expect(normalizeLegacyDefaultDraft(legacyDraft)).toMatchObject({
      category: null,
      targetCount: null,
      progressStatus: null,
    });

    expect(
      normalizeLegacyDefaultDraft({ ...legacyDraft, content: 'ユーザーが入力した本文' }),
    ).toMatchObject({ category: 'gakuchika', targetCount: 400 });
  });

  it('removes only untouched seeded samples during migration', () => {
    const sample = createInitialSampleDrafts(1_000_000)[0];

    expect(isUntouchedLegacySampleDraft(sample)).toBe(true);
    expect(migrateLegacyDrafts([sample])).toEqual([]);
    expect(removeUntouchedLegacySampleDrafts([sample])).toEqual([]);
    expect(migrateLegacyDrafts([{ ...sample, title: '編集したサンプル' }])).toHaveLength(1);
  });

  it('deeply clones nested draft data when duplicating', () => {
    const result = buildDuplicatedDraft(source, 'draft-2', 100);

    expect(result).toMatchObject({
      id: 'draft-2',
      title: '下書き (コピー)',
      createdAt: 100,
      updatedAt: 100,
    });
    expect(result.tags).not.toBe(source.tags);
    expect(result.starBlocks).not.toBe(source.starBlocks);
    expect(result.snapshots).not.toBe(source.snapshots);
    expect(result.snapshots?.[0]).not.toBe(source.snapshots?.[0]);
  });

  it('creates independent sample drafts from an explicit reference time', () => {
    const first = createInitialSampleDrafts(1_000_000);
    const second = createInitialSampleDrafts(2_000_000);

    expect(first[0].createdAt).toBe(1_000_000 - 2 * 24 * 60 * 60 * 1_000);
    expect(first[0].updatedAt).toBe(1_000_000 - 24 * 60 * 60 * 1_000);
    expect(second[0].updatedAt).toBe(2_000_000 - 24 * 60 * 60 * 1_000);
    first[0].tags.push('変更');
    expect(second[0].tags).not.toContain('変更');
  });
});
