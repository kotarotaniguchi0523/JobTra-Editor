import { describe, expect, it } from 'vitest';
import type { ESDraft } from '../src/types';
import { draftReducer } from '../src/context/draftReducer';

const draft: ESDraft = {
  id: 'draft-1',
  title: '下書き',
  companyName: '',
  category: 'gakuchika',
  content: '本文',
  isBlockMode: false,
  targetCount: 400,
  createdAt: 1,
  updatedAt: 1,
  tags: [],
  starred: false,
};

describe('draftReducer optimistic rollback', () => {
  it('rolls back only when the optimistic object is still current', () => {
    const optimistic = { ...draft, starred: true };
    const state = {
      drafts: [optimistic],
      activeDraftId: optimistic.id,
      isLoading: false,
    };

    const next = draftReducer(state, {
      type: 'replace-if-current',
      expected: optimistic,
      draft,
    });

    expect(next.drafts[0]).toBe(draft);
  });

  it('does not overwrite a newer edit when an older save fails', () => {
    const optimistic = { ...draft, starred: true };
    const newerEdit = { ...optimistic, content: '新しい本文' };
    const state = {
      drafts: [newerEdit],
      activeDraftId: newerEdit.id,
      isLoading: false,
    };

    const next = draftReducer(state, {
      type: 'replace-if-current',
      expected: optimistic,
      draft,
    });

    expect(next).toBe(state);
    expect(next.drafts[0]).toBe(newerEdit);
  });
});
