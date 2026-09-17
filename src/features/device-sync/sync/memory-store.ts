import { revisionIdOf } from './canonical-json.js';
import type { JsonValue, Revision, RevisionHeads, RevisionStore } from './types.js';

export class MemoryRevisionStore<T extends JsonValue = JsonValue> implements RevisionStore<T> {
  private readonly revisions = new Map<string, Revision<T>>();
  private readonly heads = new Map<string, Set<string>>();

  async getRevision(id: string): Promise<Revision<T> | undefined> {
    const revision = this.revisions.get(id);
    return revision === undefined ? undefined : cloneRevision(revision);
  }

  async getRevisions(ids?: readonly string[]): Promise<Revision<T>[]> {
    if (ids === undefined) return [...this.revisions.values()].map(cloneRevision);
    const revisions: Revision<T>[] = [];
    for (const id of ids) {
      const revision = this.revisions.get(id);
      if (revision !== undefined) revisions.push(cloneRevision(revision));
    }
    return revisions;
  }

  async getHeads(documentId?: string): Promise<RevisionHeads[]> {
    const entries: RevisionHeads[] = [];
    for (const [id, heads] of this.heads.entries()) {
      if (documentId !== undefined && id !== documentId) continue;
      entries.push({ documentId: id, heads: [...heads].sort() });
    }
    return entries.sort((left, right) => left.documentId.localeCompare(right.documentId));
  }

  async putRevisions(revisions: readonly Revision<T>[]): Promise<void> {
    const incoming = new Map(revisions.map((revision) => [revision.id, revision]));
    const incomingRevisions = [...incoming.values()];
    for (const revision of incomingRevisions) {
      if (revision.documentId.length === 0) throw new Error('revision documentId is required');
      if (new Set(revision.parents).size !== revision.parents.length) {
        throw new Error(`revision ${revision.id} has duplicate parents`);
      }
    }

    const expectedIds = await Promise.all(
      incomingRevisions.map(async (revision) => {
        const { id: _id, ...unsigned } = revision;
        return revisionIdOf(unsigned);
      }),
    );
    for (const [index, revision] of incomingRevisions.entries()) {
      const expected = expectedIds[index];
      if (expected !== revision.id)
        throw new Error(`revision ${revision.id} failed integrity check`);
    }

    for (const revision of incomingRevisions) {
      for (const parent of revision.parents) {
        const exists = this.revisions.has(parent) || incoming.has(parent);
        if (!exists) throw new Error(`missing parent ${parent}`);
        const parentRevision = this.revisions.get(parent) ?? incoming.get(parent);
        if (parentRevision?.documentId !== revision.documentId) {
          throw new Error(`revision ${revision.id} has a cross-document parent`);
        }
      }
    }

    for (const revision of topologicalOrder(incoming)) {
      if (this.revisions.has(revision.id)) continue;
      const storedRevision = cloneRevision(revision);
      this.revisions.set(storedRevision.id, storedRevision);
      const heads = this.heads.get(storedRevision.documentId) ?? new Set<string>();
      for (const parent of storedRevision.parents) heads.delete(parent);
      heads.add(storedRevision.id);
      this.heads.set(storedRevision.documentId, heads);
    }
  }
}

function cloneJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(cloneJsonValue);
  if (value !== null && typeof value === 'object') {
    const clone: { [key: string]: JsonValue } = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      clone[key] = cloneJsonValue(nestedValue);
    }
    return clone;
  }
  return value;
}

function cloneRevision<T extends JsonValue>(revision: Revision<T>): Revision<T> {
  return {
    ...revision,
    parents: [...revision.parents],
    value: cloneJsonValue(revision.value) as T,
    clock: { ...revision.clock },
  };
}

function topologicalOrder<T extends JsonValue>(
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
