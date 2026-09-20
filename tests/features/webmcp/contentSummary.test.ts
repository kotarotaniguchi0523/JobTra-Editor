import { describe, expect, it } from 'vitest';
import { summarizeBoundedContent } from '../../../src/features/webmcp/lib/contentSummary';

describe('summarizeBoundedContent', () => {
  it('keeps the digest and character count for truncated content', () => {
    const summary = summarizeBoundedContent(' A B C ', 3);

    expect(summary.content).toBe(' A ');
    expect(summary.contentTruncated).toBe(true);
    expect(summary.charsNoWhitespace).toBe(3);
    expect(summary.contentDigest).toMatch(/^fnv1a-[a-f0-9]{8}$/);
  });
});
