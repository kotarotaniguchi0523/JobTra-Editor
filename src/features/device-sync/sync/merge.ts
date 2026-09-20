import { diff3Merge } from 'node-diff3';
import { areCanonicalJsonEqual } from './canonical-json.js';
import { cloneJsonValue, isJsonRecord } from './json.js';
import type { JsonValue, MergeChoice, MergeConflict, MergeResult } from './types.js';

export type { MergeChoice } from './types.js';

const MISSING = Symbol('missing');
type MergeInput = JsonValue | typeof MISSING;

export function mergeJson<T extends JsonValue>(base: T, local: T, remote: T): MergeResult<T> {
  const conflicts: MergeConflict[] = [];
  const value = mergeValue(base, local, remote, '', conflicts);
  return { value: value as T, conflicts };
}

/**
 * Applies explicit user choices to the provisional value returned by
 * mergeJson. The function clones the input, so conflict resolution never
 * mutates a revision value kept in IndexedDB.
 */
export function resolveMergeConflicts<T extends JsonValue>(
  provisional: T,
  conflicts: readonly MergeConflict[],
  choices: Readonly<Record<string, MergeChoice>>,
): T {
  let resolved: JsonValue = cloneJsonValue(provisional);
  for (const conflict of conflicts) {
    const choice = choices[conflict.path] ?? 'local';
    const selected = conflict[choice];
    if (conflict.path === '') {
      if (selected === undefined) {
        throw new Error('root conflict cannot resolve to a missing value');
      }
      resolved = cloneJsonValue(selected);
      continue;
    }
    resolved = setJsonPath(resolved, conflict.path, selected);
  }
  return resolved as T;
}

function mergeValue(
  base: MergeInput,
  local: MergeInput,
  remote: MergeInput,
  path: string,
  conflicts: MergeConflict[],
): MergeInput {
  if (sameJson(local, remote)) return local;
  if (sameJson(local, base)) return remote;
  if (sameJson(remote, base)) return local;

  if (typeof base === 'string' && typeof local === 'string' && typeof remote === 'string') {
    const result = diff3Merge(local, base, remote, { stringSeparator: '\n' });
    const lines: string[] = [];
    for (const region of result) {
      if (region.ok !== undefined) {
        lines.push(...region.ok);
      } else if (region.conflict !== undefined) {
        conflicts.push({
          path,
          base: base,
          local: local,
          remote: remote,
          kind: 'text',
        });
        lines.push(...region.conflict.a);
      }
    }
    return lines.join('\n');
  }

  if (isMergeObject(base) && isMergeObject(local) && isMergeObject(remote)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
    const output: Record<string, JsonValue> = {};
    for (const key of [...keys].sort()) {
      const child = mergeValue(
        readObjectValue(base, key),
        readObjectValue(local, key),
        readObjectValue(remote, key),
        path ? `${path}.${key}` : key,
        conflicts,
      );
      if (child !== MISSING) output[key] = child as JsonValue;
    }
    return output;
  }

  conflicts.push({
    path,
    base: toJsonValue(base),
    local: toJsonValue(local),
    remote: toJsonValue(remote),
    kind: 'value',
  });
  return local;
}

function isMergeObject(value: MergeInput): value is Record<string, JsonValue> {
  return value !== MISSING && isJsonRecord(value);
}

function readObjectValue(value: MergeInput, key: string): MergeInput {
  return isMergeObject(value) && key in value ? (value[key] as JsonValue) : MISSING;
}

function sameJson(left: MergeInput, right: MergeInput): boolean {
  if (left === MISSING || right === MISSING) return left === right;
  return areCanonicalJsonEqual(left, right);
}

function toJsonValue(value: MergeInput): JsonValue | undefined {
  return value === MISSING ? undefined : value;
}

function setJsonPath(
  value: JsonValue,
  path: string,
  replacement: JsonValue | undefined,
): JsonValue {
  const segments = path.split('.').filter(Boolean);
  if (segments.length === 0) return replacement ?? null;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`cannot resolve nested conflict at ${path}`);
  }

  const root = cloneJsonValue(value) as { [key: string]: JsonValue };
  let cursor: { [key: string]: JsonValue } = root;
  for (const segment of segments.slice(0, -1)) {
    const nested = cursor[segment];
    if (nested === null || typeof nested !== 'object' || Array.isArray(nested)) {
      throw new Error(`cannot resolve nested conflict at ${path}`);
    }
    cursor = nested as { [key: string]: JsonValue };
  }
  const leaf = segments[segments.length - 1];
  if (replacement === undefined) delete cursor[leaf];
  else cursor[leaf] = cloneJsonValue(replacement);
  return root;
}
