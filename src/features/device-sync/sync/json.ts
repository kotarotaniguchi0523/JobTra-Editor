import type { JsonValue } from './types.js';

/** Clone a JSON value without sharing nested arrays or records. */
export function cloneJsonValue<T extends JsonValue>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneJsonValue) as T;
  if (isJsonRecord(value)) {
    const clone: Record<string, JsonValue> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      clone[key] = cloneJsonValue(nestedValue);
    }
    return clone as T;
  }
  return value;
}

/** Narrow an unknown value to a JSON record, excluding arrays and null. */
export function isJsonRecord(value: unknown): value is Record<string, JsonValue> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
