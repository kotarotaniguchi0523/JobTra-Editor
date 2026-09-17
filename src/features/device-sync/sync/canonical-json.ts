import type { JsonValue } from './types.js';

export function canonicalJson(value: JsonValue): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortJson(child)]),
    );
  }
  return value;
}

export async function revisionIdOf<T extends JsonValue>(
  revision: Omit<import('./types.js').Revision<T>, 'id'>,
): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(revision));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
