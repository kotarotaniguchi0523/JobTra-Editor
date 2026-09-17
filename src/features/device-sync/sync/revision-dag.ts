import { revisionIdOf } from './canonical-json.js';
import type { JsonValue, Revision, RevisionStore, VectorClock } from './types.js';

export async function createRevision<T extends JsonValue>(input: {
  documentId: string;
  value: T;
  parents?: readonly Revision<T>[];
  replicaId: string;
  createdAt?: number;
}): Promise<Revision<T>> {
  const parents = [...(input.parents ?? [])];
  const clock = mergeClocks(parents.map((revision) => revision.clock));
  clock[input.replicaId] = (clock[input.replicaId] ?? 0) + 1;
  const unsigned = {
    documentId: input.documentId,
    parents: parents.map((revision) => revision.id),
    value: input.value,
    clock,
    authorReplicaId: input.replicaId,
    createdAt: input.createdAt ?? Date.now(),
  };
  return { ...unsigned, id: await revisionIdOf(unsigned) };
}

export function mergeClocks(clocks: readonly VectorClock[]): VectorClock {
  const merged: VectorClock = {};
  for (const clock of clocks) {
    for (const [replicaId, value] of Object.entries(clock)) {
      merged[replicaId] = Math.max(merged[replicaId] ?? 0, value);
    }
  }
  return merged;
}

export async function findMergeBase<T extends JsonValue>(
  store: RevisionStore<T>,
  leftId: string,
  rightId: string,
): Promise<Revision<T> | undefined> {
  if (leftId === rightId) return store.getRevision(leftId);

  const leftDistances = await ancestorDistances(store, leftId);
  const rightDistances = await ancestorDistances(store, rightId);
  const common = [...leftDistances.keys()].filter((id) => rightDistances.has(id));
  common.sort((left, right) => {
    const leftDistance =
      (leftDistances.get(left) ?? Infinity) + (rightDistances.get(left) ?? Infinity);
    const rightDistance =
      (leftDistances.get(right) ?? Infinity) + (rightDistances.get(right) ?? Infinity);
    return leftDistance - rightDistance || left.localeCompare(right);
  });
  const id = common[0];
  return id === undefined ? undefined : store.getRevision(id);
}

export async function reachableRevisionIds<T extends JsonValue>(
  store: RevisionStore<T>,
  heads: readonly string[],
): Promise<Set<string>> {
  const ids = new Set<string>();
  const queue = [...heads];
  while (queue.length > 0) {
    const id = queue.shift();
    if (id === undefined || ids.has(id)) continue;
    const revision = await store.getRevision(id);
    if (revision === undefined) continue;
    ids.add(id);
    queue.push(...revision.parents);
  }
  return ids;
}

async function ancestorDistances<T extends JsonValue>(
  store: RevisionStore<T>,
  startId: string,
): Promise<Map<string, number>> {
  const distances = new Map<string, number>();
  const queue: Array<readonly [string, number]> = [[startId, 0]];
  while (queue.length > 0) {
    const item = queue.shift();
    if (item === undefined) continue;
    const [id, distance] = item;
    const previous = distances.get(id);
    if (previous !== undefined && previous <= distance) continue;
    distances.set(id, distance);
    const revision = await store.getRevision(id);
    if (revision !== undefined) {
      queue.push(...revision.parents.map((parent) => [parent, distance + 1] as const));
    }
  }
  return distances;
}
