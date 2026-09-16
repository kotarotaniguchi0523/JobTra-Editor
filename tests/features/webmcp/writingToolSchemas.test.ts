import { describe, expect, it } from 'vitest';
import {
  parseAnalyzeWritingInput,
  parseCompareWritingVersionsInput,
  parseGetWritingContextInput,
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
});
