import { beforeEach, describe, expect, it } from 'vitest';
import type { ESDraft } from '@entities/draft/model/types';
import { draftStore } from '@entities/draft/model/draftStore';
import { writingTools } from '@features/webmcp/lib/writingTools';

const draft: ESDraft = {
  id: 'draft-1',
  title: 'アルバイト経験',
  companyName: 'テスト株式会社',
  category: 'gakuchika',
  content: '私はチームで課題を解決しました。',
  starBlocks: {
    conclusion: '課題解決力です。',
    situation: 'チームに課題がありました。',
    action: '役割を整理しました。',
    result: '作業を完了しました。',
    contribution: '',
  },
  isBlockMode: false,
  targetCount: 400,
  createdAt: 1,
  updatedAt: 2,
  tags: [],
  snapshots: [
    {
      id: 'snap-1',
      label: '初稿',
      content: '私はチームで課題に取り組みました。',
      charCount: 20,
      timestamp: 1,
    },
  ],
};

function executeTool(name: string, input: unknown) {
  const tool = writingTools.find((candidate) => candidate.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);

  return tool.execute(input as Record<string, unknown>, {
    signal: new AbortController().signal,
  });
}

describe('WebMCP writing tools', () => {
  beforeEach(() => {
    draftStore.dispatch({ type: 'loaded', drafts: [draft], activeDraftId: draft.id });
  });

  it('returns the active draft as writing context without changing store state', async () => {
    const result = await executeTool('get_writing_context', {});

    expect(result).toMatchObject({
      ok: true,
      scope: 'current',
      draft: {
        id: draft.id,
        title: draft.title,
        companyName: draft.companyName,
      },
      content: draft.content,
      starBlocks: draft.starBlocks,
    });
    expect(draftStore.getState().drafts[0]).toBe(draft);
  });

  it('bounds user-authored context and reports truncation', async () => {
    const longDraft: ESDraft = {
      ...draft,
      content: 'あ'.repeat(8_001),
      starBlocks: {
        ...draft.starBlocks!,
        action: 'い'.repeat(8_001),
      },
    };
    draftStore.dispatch({ type: 'loaded', drafts: [longDraft], activeDraftId: longDraft.id });

    const result = await executeTool('get_writing_context', {});

    expect(result).toMatchObject({
      ok: true,
      content: 'あ'.repeat(8_000),
      contentTruncated: true,
      starBlocks: {
        action: 'い'.repeat(8_000),
      },
      starBlocksTruncated: ['action'],
    });
  });

  it('exposes existing local writing analysis as structured output', async () => {
    const result = await executeTool('analyze_writing', {});

    expect(result).toMatchObject({
      ok: true,
      contentDigest: expect.stringMatching(/^fnv1a-[0-9a-f]{8}$/),
      metrics: {
        charsNoWhitespace: draft.content.length,
      },
      starStructure: {
        available: true,
        missingBlocks: ['contribution'],
      },
    });
  });

  it('compares the current content with an existing snapshot', async () => {
    const result = await executeTool('compare_writing_versions', { snapshotId: 'snap-1' });

    expect(result).toMatchObject({
      ok: true,
      snapshot: {
        id: 'snap-1',
        label: '初稿',
        content: '私はチームで課題に取り組みました。',
      },
      current: {
        content: draft.content,
      },
      comparison: {
        changed: true,
      },
    });

    expect(result).toMatchObject({
      snapshot: {
        charsNoWhitespace: draft.snapshots?.[0].content.length,
      },
    });
  });

  it('returns an actionable error when a requested snapshot is missing', async () => {
    const result = await executeTool('compare_writing_versions', {
      snapshotId: 'missing-snapshot',
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'snapshot_not_found',
        message: '指定されたスナップショット「missing-snapshot」が見つかりません。',
      },
    });
  });

  it('rejects execution after the agent cancels the tool', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(writingTools[0].execute({}, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
