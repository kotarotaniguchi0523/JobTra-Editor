import type { JsonValue, Revision } from './types.js';

/**
 * Return revisions in deterministic parent-before-child order.
 * This is deliberately pure so both storage implementations can share it.
 */
export function topologicalOrder<T extends JsonValue>(
  incoming: ReadonlyMap<string, Revision<T>>,
): Revision<T>[] {
  const pending = new Map(incoming);
  const ordered: Revision<T>[] = [];

  while (pending.size > 0) {
    const ready = [...pending.values()].filter((revision) =>
      revision.parents.every((parent) => !pending.has(parent)),
    );
    if (ready.length === 0) throw new Error('revision graph contains a cycle');
    ready.sort((left, right) => left.id.localeCompare(right.id));
    for (const revision of ready) {
      pending.delete(revision.id);
      ordered.push(revision);
    }
  }

  return ordered;
}
