import { diff3Merge } from 'node-diff3';
import { canonicalJson } from './canonical-json.js';
import type { JsonValue, MergeConflict, MergeResult } from './types.js';

const MISSING = Symbol('missing');
type MergeInput = JsonValue | typeof MISSING;

export function mergeJson<T extends JsonValue>(base: T, local: T, remote: T): MergeResult<T> {
  const conflicts: MergeConflict[] = [];
  const value = mergeValue(base, local, remote, '', conflicts);
  return { value: value as T, conflicts };
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

  if (isObject(base) && isObject(local) && isObject(remote)) {
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

function isObject(value: MergeInput): value is Record<string, JsonValue> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readObjectValue(value: MergeInput, key: string): MergeInput {
  return isObject(value) && key in value ? (value[key] as JsonValue) : MISSING;
}

function sameJson(left: MergeInput, right: MergeInput): boolean {
  if (left === MISSING || right === MISSING) return left === right;
  return canonicalJson(left) === canonicalJson(right);
}

function toJsonValue(value: MergeInput): JsonValue | undefined {
  return value === MISSING ? undefined : value;
}
