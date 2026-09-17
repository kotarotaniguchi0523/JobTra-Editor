import { revisionIdOf } from './canonical-json.js';
import type { JsonValue, Revision, RevisionHeads, RevisionStore } from './types.js';

export class MemoryRevisionStore<T extends JsonValue = JsonValue> implements RevisionStore<T> {
  private readonly revisions = new Map<string, Revision<T>>();
  private readonly heads = new Map<string, Set<string>>();

  async getRevision(id: string): Promise<Revision<T> | undefined> {
    return this.revisions.get(id);
  }

  async getRevisions(ids?: readonly string[]): Promise<Revision<T>[]> {
    if (ids === undefined) return [...this.revisions.values()];
    return ids.flatMap((id) => {
      const revision = this.revisions.get(id);
      return revision === undefined ? [] : [revision];
    });
  }

  async getHeads(documentId?: string): Promise<RevisionHeads[]> {
    const entries = [...this.heads.entries()]
      .filter(([id]) => documentId === undefined || id === documentId)
      .map(([id, heads]) => ({ documentId: id, heads: [...heads].sort() }));
    return entries.sort((left, right) => left.documentId.localeCompare(right.documentId));
  }

  async putRevisions(revisions: readonly Revision<T>[]): Promise<void> {
    const incoming = new Map(revisions.map((revision) => [revision.id, revision]));
    for (const revision of incoming.values()) {
      if (revision.documentId.length === 0) throw new Error('revision documentId is required');
      if (new Set(revision.parents).size !== revision.parents.length) {
        throw new Error(`revision ${revision.id} has duplicate parents`);
      }
      const { id: _id, ...unsigned } = revision;
      const expected = await revisionIdOf(unsigned);
      if (expected !== revision.id)
        throw new Error(`revision ${revision.id} failed integrity check`);
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
      this.revisions.set(revision.id, revision);
      const heads = this.heads.get(revision.documentId) ?? new Set<string>();
      for (const parent of revision.parents) heads.delete(parent);
      heads.add(revision.id);
      this.heads.set(revision.documentId, heads);
    }
  }
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
