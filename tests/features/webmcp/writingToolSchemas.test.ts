import { describe, expect, it } from 'vitest';
import {
  parseAnalyzeWritingInput,
  parseAnalyzeWritingOutput,
  parseCompareWritingVersionsInput,
  parseCompareWritingVersionsOutput,
  parseGetWritingContextInput,
  parseGetWritingContextOutput,
} from '@features/webmcp/model/writingToolSchemas';

describe('WebMCP writing tool input schemas', () => {
  it('accepts the current writing context with an optional scope', () => {
    expect(parseGetWritingContextInput({ scope: 'selection' })).toEqual({
      scope: 'selection',
    });
  });

  it('rejects unsupported scopes and unsafe draft ids', () => {
    expect(parseGetWritingContextInput({ scope: 'delete' })).toBeNull();
    expect(parseAnalyzeWritingInput({ draftId: '../unsafe' })).toBeNull();
    expect(parseAnalyzeWritingInput({ unexpected: true })).toBeNull();
  });

  it('requires a snapshot id for version comparison', () => {
    expect(parseCompareWritingVersionsInput({})).toBeNull();
    expect(parseCompareWritingVersionsInput({ snapshotId: 'snap_123' })).toEqual({
      snapshotId: 'snap_123',
    });
  });

  it('accepts structured failures and rejects extra output fields', () => {
    const failure = {
      ok: false,
      error: { code: 'draft_not_found', message: '見つかりません。' },
    };

    expect(parseGetWritingContextOutput(failure)).toEqual(failure);
    expect(parseAnalyzeWritingOutput({ ...failure, extra: true })).toBeNull();
    expect(parseCompareWritingVersionsOutput({ ...failure, extra: true })).toBeNull();
  });

  it('rejects output numbers that cannot be represented in JSON', () => {
    expect(
      parseGetWritingContextOutput({
        ok: false,
        error: { code: 'invalid', message: 'invalid' },
        targetCount: Number.POSITIVE_INFINITY,
      }),
    ).toBeNull();
  });
});
