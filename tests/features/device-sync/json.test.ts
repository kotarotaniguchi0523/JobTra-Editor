import { describe, expect, it } from 'vitest';
import { areCanonicalJsonEqual } from '../../../src/features/device-sync/sync/canonical-json.js';
import { cloneJsonValue, isJsonRecord } from '../../../src/features/device-sync/sync/json.js';
import type { JsonValue } from '../../../src/features/device-sync/sync/types.js';

describe('sync JSON helpers', () => {
  it('clones nested JSON values without sharing mutable containers', () => {
    const value: JsonValue = { nested: { labels: ['one'] }, enabled: true };
    const clone = cloneJsonValue(value);

    expect(clone).toEqual(value);
    expect(clone).not.toBe(value);
    if (!isJsonRecord(value) || !isJsonRecord(clone)) throw new Error('expected records');
    expect(clone.nested).not.toBe(value.nested);
    if (!isJsonRecord(value.nested) || !isJsonRecord(clone.nested)) {
      throw new Error('expected nested records');
    }
    expect(clone.nested.labels).not.toBe(value.nested.labels);
  });

  it('compares object key order canonically', () => {
    expect(areCanonicalJsonEqual({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 })).toBe(true);
    expect(areCanonicalJsonEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('recognizes records but not arrays or null', () => {
    expect(isJsonRecord({ value: 1 })).toBe(true);
    expect(isJsonRecord([])).toBe(false);
    expect(isJsonRecord(null)).toBe(false);
  });
});
