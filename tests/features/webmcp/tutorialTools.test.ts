import { afterEach, describe, expect, it, vi } from 'vitest';
import { tutorialTools } from '@features/webmcp/lib/tutorialTools';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('tutorial WebMCP tools', () => {
  it('loads the raw tutorial Markdown lazily with the execution signal', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toEqual({ Accept: 'text/markdown' });
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response('# JobTra', { status: 200 });
    });
    globalThis.fetch = fetchMock;

    const tool = tutorialTools.find(({ name }) => name === 'get_jobtra_tutorial');
    if (!tool) throw new Error('tutorial tool not found');

    const controller = new AbortController();
    await expect(
      tool.execute({ stage: 'first-use' }, { signal: controller.signal }),
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        topic: 'jobtra-tutorial',
        stage: 'first-use',
        markdown: '# JobTra',
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith('/ai/jobtra-tutorial.ja.md', expect.any(Object));
  });

  it('returns a structured failure when the guide is unavailable', async () => {
    globalThis.fetch = vi.fn(async () => new Response('', { status: 404 }));
    const tool = tutorialTools.find(({ name }) => name === 'get_jobtra_cloud_setup_guide');
    if (!tool) throw new Error('cloud guide tool not found');

    await expect(tool.execute({}, { signal: new AbortController().signal })).resolves.toEqual({
      ok: false,
      error: { code: 'guide_unavailable', message: 'ガイドを取得できませんでした (404)。' },
    });
  });
});
