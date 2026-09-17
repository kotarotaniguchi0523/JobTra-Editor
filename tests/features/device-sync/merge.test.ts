import './setup.js';
import { describe, expect, it } from 'vitest';
import { mergeJson } from '../../../src/features/device-sync/sync/merge.js';

describe('mergeJson', () => {
  it('takes the side that changed when the other side stayed at base', () => {
    const result = mergeJson(
      { title: 'base', count: 1 },
      { title: 'local', count: 1 },
      { title: 'base', count: 2 },
    );

    expect(result.value).toEqual({ title: 'local', count: 2 });
    expect(result.conflicts).toEqual([]);
  });

  it('merges independent object fields and null values', () => {
    const result = mergeJson(
      { title: 'base', note: 'base', optional: 'value' },
      { title: 'local', note: 'base', optional: null },
      { title: 'base', note: 'remote', optional: 'value' },
    );

    expect(result.value).toEqual({ title: 'local', note: 'remote', optional: null });
    expect(result.conflicts).toEqual([]);
  });

  it('merges independent text lines without inserting conflict markers', () => {
    const result = mergeJson(
      { body: 'one\ntwo\nthree' },
      { body: 'local-one\ntwo\nthree' },
      { body: 'one\ntwo\nremote-three' },
    );

    expect(result.value).toEqual({ body: 'local-one\ntwo\nremote-three' });
    expect(result.conflicts).toEqual([]);
  });

  it('returns a structured conflict for overlapping text edits', () => {
    const result = mergeJson(
      { body: 'one\ntwo\nthree' },
      { body: 'one\nlocal\nthree' },
      { body: 'one\nremote\nthree' },
    );

    expect(result.value.body).toBe('one\nlocal\nthree');
    expect(result.conflicts).toEqual([expect.objectContaining({ path: 'body', kind: 'text' })]);
    expect(result.value.body).not.toContain('<<<<<<<');
  });

  it('reports scalar and array conflicts at the precise path', () => {
    const result = mergeJson(
      { tags: ['base'], nested: { enabled: false } },
      { tags: ['local'], nested: { enabled: true } },
      { tags: ['remote'], nested: { enabled: true } },
    );

    expect(result.value).toEqual({ tags: ['local'], nested: { enabled: true } });
    expect(result.conflicts).toEqual([expect.objectContaining({ path: 'tags', kind: 'value' })]);
  });

  it('preserves a remote field deletion when local stayed at base', () => {
    const result = mergeJson(
      { title: 'base', removed: 'value' },
      { title: 'local' },
      { title: 'base', removed: 'value' },
    );

    expect(result.value).toEqual({ title: 'local' });
    expect(result.conflicts).toEqual([]);
  });
});
