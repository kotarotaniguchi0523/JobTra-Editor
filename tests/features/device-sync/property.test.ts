import './setup.js';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mergeJson } from '../../../src/features/device-sync/sync/merge.js';
import type { JsonValue } from '../../../src/features/device-sync/sync/types.js';

describe('merge invariants', () => {
  it('is idempotent when both sides are equal', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const result = mergeJson(value as JsonValue, value as JsonValue, value as JsonValue);
        expect(result.value).toEqual(value);
        expect(result.conflicts).toEqual([]);
      }),
      { numRuns: 200 },
    );
  });

  it('never emits conflict markers into structured JSON', () => {
    fc.assert(
      fc.property(fc.jsonValue(), fc.jsonValue(), fc.jsonValue(), (base, local, remote) => {
        const result = mergeJson(base as JsonValue, local as JsonValue, remote as JsonValue);
        expect(JSON.stringify(result.value)).not.toContain('<<<<<<<');
        expect(JSON.stringify(result.value)).not.toContain('>>>>>>>');
      }),
      { numRuns: 200 },
    );
  });
});
