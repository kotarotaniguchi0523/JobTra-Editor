import type { ESDraft } from '@entities/draft/model/types';
import { cloneDraft } from '@entities/draft/model/draftFactories';
import { parseDraft } from '@shared/validation/draftSchemas';
import { canonicalJson } from './canonical-json.js';
import { mergeJson, resolveMergeConflicts, type MergeChoice } from './merge.js';
import { syncStores } from './protocol.js';
import { createRevision, findMergeBase } from './revision-dag.js';
import type {
  JsonValue,
  MergeConflict,
  Revision,
  RevisionStore,
  SyncChannel,
  SyncSummary,
} from './types.js';

const DELETED_KIND = 'jobtra-draft-deleted-v1';

type DeletedDraft = {
  kind: typeof DELETED_KIND;
  documentId: string;
  deletedAt: number;
};

export type DraftSyncValue = JsonValue;

export type DraftSyncConflict = {
  documentId: string;
  baseRevisionId?: string;
  localRevisionId: string;
  remoteRevisionId: string;
  headRevisionIds: string[];
  baseValue?: DraftSyncValue;
  localValue: DraftSyncValue;
  remoteValue: DraftSyncValue;
  provisionalValue: DraftSyncValue;
  conflicts: MergeConflict[];
};

export type DraftSyncResult = {
  summary: SyncSummary;
  syncedDrafts: ESDraft[];
  conflicts: DraftSyncConflict[];
};

export type DraftConflictResolution = Readonly<Record<string, MergeChoice>>;

export async function syncDrafts(options: {
  drafts: readonly ESDraft[];
  store: RevisionStore<DraftSyncValue>;
  channel: SyncChannel<DraftSyncValue>;
  replicaId: string;
  now: number;
  timeoutMs?: number;
}): Promise<DraftSyncResult> {
  const currentDrafts = options.drafts.map(cloneDraft);
  await ensureLocalRevisions({
    drafts: currentDrafts,
    store: options.store,
    replicaId: options.replicaId,
    now: options.now,
  });

  let beforeSyncHeads: Awaited<ReturnType<typeof options.store.getHeads>> = [];
  const summary = await syncStores({
    store: options.store,
    channel: options.channel,
    timeoutMs: options.timeoutMs,
    onSnapshot: (snapshot) => {
      beforeSyncHeads = snapshot.heads;
    },
  });
  const [afterSyncHeads, knownRevisions] = await readPostSyncSnapshot(options.store, summary);
  const headsByDocument = new Map(
    afterSyncHeads.map((entry) => [entry.documentId, entry] as const),
  );
  const beforeHeadsByDocument = new Map(
    beforeSyncHeads.map((entry) => [entry.documentId, new Set(entry.heads)] as const),
  );
  const documentIds = new Set<string>([
    ...currentDrafts.map((draft) => draft.id),
    ...knownRevisions.map((revision) => revision.documentId),
  ]);
  const draftsById = new Map(currentDrafts.map((draft) => [draft.id, cloneDraft(draft)]));
  const reconciliations = await Promise.all(
    [...documentIds].sort().map(async (documentId) =>
      reconcileDocument({
        documentId,
        entry: headsByDocument.get(documentId),
        beforeHeads: beforeHeadsByDocument.get(documentId) ?? new Set<string>(),
        replicaId: options.replicaId,
        now: options.now,
        store: options.store,
      }),
    ),
  );
  const conflicts: DraftSyncConflict[] = [];
  for (const reconciliation of reconciliations) {
    if (reconciliation === undefined) continue;
    applySyncValue(draftsById, reconciliation.documentId, reconciliation.value);
    if (reconciliation.conflict !== undefined) conflicts.push(reconciliation.conflict);
  }

  return {
    summary,
    syncedDrafts: [...draftsById.values()].map(cloneDraft),
    conflicts,
  };
}

async function readPostSyncSnapshot(
  store: RevisionStore<DraftSyncValue>,
  _completedSync: SyncSummary,
): Promise<
  [Awaited<ReturnType<typeof store.getHeads>>, Awaited<ReturnType<typeof store.getRevisions>>]
> {
  return Promise.all([store.getHeads(), store.getRevisions()]);
}

export async function resolveDraftConflict(options: {
  conflict: DraftSyncConflict;
  choices: DraftConflictResolution;
  store: RevisionStore<DraftSyncValue>;
  replicaId: string;
  now: number;
}): Promise<ESDraft | null> {
  const value = resolveMergeConflicts(
    options.conflict.provisionalValue,
    options.conflict.conflicts,
    options.choices,
  );
  const parents = await options.store.getRevisions(options.conflict.headRevisionIds);
  if (parents.length !== options.conflict.headRevisionIds.length) {
    throw new Error(`sync conflict parents are missing for ${options.conflict.documentId}`);
  }
  const resolvedRevision = await createRevision({
    documentId: options.conflict.documentId,
    value,
    parents,
    replicaId: options.replicaId,
    createdAt: options.now,
  });
  await options.store.putRevisions([resolvedRevision]);
  return draftFromSyncValue(value, options.conflict.documentId);
}

async function ensureLocalRevisions(options: {
  drafts: readonly ESDraft[];
  store: RevisionStore<DraftSyncValue>;
  replicaId: string;
  now: number;
}): Promise<void> {
  const currentIds = new Set(options.drafts.map((draft) => draft.id));
  const existingRevisions = await options.store.getRevisions();
  const knownDocumentIds = new Set(existingRevisions.map((revision) => revision.documentId));

  for (const draft of options.drafts) knownDocumentIds.add(draft.id);

  const currentRevisions = await Promise.all(
    options.drafts.map(async (draft) => {
      const heads = await options.store.getHeads(draft.id);
      const parents = await options.store.getRevisions(heads[0]?.heads ?? []);
      const value = toDraftValue(draft);
      if (parents.length === 1 && sameJson(parents[0].value, value)) return undefined;
      return createRevision({
        documentId: draft.id,
        value,
        parents,
        replicaId: options.replicaId,
        createdAt: options.now,
      });
    }),
  );
  await Promise.all(
    currentRevisions
      .filter((revision): revision is Revision<DraftSyncValue> => revision !== undefined)
      .map((revision) => options.store.putRevisions([revision])),
  );

  const deletionRevisions = await Promise.all(
    [...knownDocumentIds]
      .filter((documentId) => !currentIds.has(documentId))
      .sort()
      .map(async (documentId) => {
        const heads = await options.store.getHeads(documentId);
        const parentRevisions = await options.store.getRevisions(heads[0]?.heads ?? []);
        if (
          parentRevisions.length === 0 ||
          parentRevisions.every((revision) => isDeleted(revision.value))
        ) {
          return undefined;
        }
        return createRevision({
          documentId,
          value: toDeletedValue(documentId, options.now),
          parents: parentRevisions,
          replicaId: options.replicaId,
          createdAt: options.now,
        });
      }),
  );
  await Promise.all(
    deletionRevisions
      .filter((revision): revision is Revision<DraftSyncValue> => revision !== undefined)
      .map((revision) => options.store.putRevisions([revision])),
  );
}

async function reconcileDocument(options: {
  documentId: string;
  entry: { documentId: string; heads: string[] } | undefined;
  beforeHeads: ReadonlySet<string>;
  replicaId: string;
  now: number;
  store: RevisionStore<DraftSyncValue>;
}): Promise<
  undefined | { documentId: string; value: DraftSyncValue; conflict?: DraftSyncConflict }
> {
  const entry = options.entry;
  if (entry === undefined || entry.heads.length === 0) return undefined;
  const revisions = await options.store.getRevisions(entry.heads);
  if (revisions.length !== entry.heads.length) {
    throw new Error(`sync is missing a head revision for ${options.documentId}`);
  }
  if (revisions.length === 1) {
    return { documentId: options.documentId, value: revisions[0].value };
  }

  const merge = await mergeHeadRevisions({
    documentId: options.documentId,
    revisions,
    beforeHeads: options.beforeHeads,
    replicaId: options.replicaId,
    store: options.store,
  });
  if ('conflict' in merge) {
    return {
      documentId: options.documentId,
      value: merge.conflict.localValue,
      conflict: merge.conflict,
    };
  }

  const mergedRevision = await createRevision({
    documentId: options.documentId,
    value: merge.value,
    parents: revisions,
    replicaId: options.replicaId,
    createdAt: options.now,
  });
  await options.store.putRevisions([mergedRevision]);
  return { documentId: options.documentId, value: merge.value };
}

async function mergeHeadRevisions(options: {
  documentId: string;
  revisions: readonly Revision<DraftSyncValue>[];
  beforeHeads: ReadonlySet<string>;
  replicaId: string;
  store: RevisionStore<DraftSyncValue>;
}): Promise<{ value: DraftSyncValue } | { conflict: DraftSyncConflict }> {
  const [local, remote] = chooseLocalAndRemote(
    options.revisions,
    options.beforeHeads,
    options.replicaId,
  );
  const base = await findMergeBase(options.store, local.id, remote.id);

  if (base === undefined) {
    if (sameLogicalDraft(local.value, remote.value)) {
      return { value: newerValue(local.value, remote.value) };
    }
    const conflicts: MergeConflict[] = [
      {
        path: '',
        base: undefined,
        local: local.value,
        remote: remote.value,
        kind: 'value',
      },
    ];
    return {
      conflict: {
        documentId: options.documentId,
        localRevisionId: local.id,
        remoteRevisionId: remote.id,
        headRevisionIds: options.revisions.map((revision) => revision.id).sort(),
        localValue: local.value,
        remoteValue: remote.value,
        provisionalValue: local.value,
        conflicts,
      },
    };
  }

  const result = normalizeDraftMetadataConflicts(
    mergeJson(base.value, local.value, remote.value),
    local.value,
    remote.value,
  );
  if (result.conflicts.length === 0) return { value: result.value };
  return {
    conflict: {
      documentId: options.documentId,
      baseRevisionId: base.id,
      localRevisionId: local.id,
      remoteRevisionId: remote.id,
      headRevisionIds: options.revisions.map((revision) => revision.id).sort(),
      baseValue: base.value,
      localValue: local.value,
      remoteValue: remote.value,
      provisionalValue: result.value,
      conflicts: result.conflicts,
    },
  };
}

function normalizeDraftMetadataConflicts(
  result: { value: DraftSyncValue; conflicts: MergeConflict[] },
  local: DraftSyncValue,
  remote: DraftSyncValue,
): { value: DraftSyncValue; conflicts: MergeConflict[] } {
  const localDraft = parseDraft(local);
  const remoteDraft = parseDraft(remote);
  if (localDraft === null || remoteDraft === null) return result;

  const conflicts = result.conflicts.filter(
    (conflict) => conflict.path !== 'createdAt' && conflict.path !== 'updatedAt',
  );
  const mergedDraft = parseDraft(result.value);
  if (mergedDraft === null) return { value: result.value, conflicts };
  mergedDraft.createdAt = Math.min(localDraft.createdAt, remoteDraft.createdAt);
  mergedDraft.updatedAt = Math.max(localDraft.updatedAt, remoteDraft.updatedAt);
  return { value: toDraftValue(mergedDraft), conflicts };
}

function chooseLocalAndRemote(
  revisions: readonly Revision<DraftSyncValue>[],
  beforeHeads: ReadonlySet<string>,
  replicaId: string,
): [Revision<DraftSyncValue>, Revision<DraftSyncValue>] {
  const local =
    revisions.find((revision) => beforeHeads.has(revision.id)) ??
    revisions.find((revision) => revision.authorReplicaId === replicaId) ??
    [...revisions].sort((left, right) => left.id.localeCompare(right.id))[0];
  const remote =
    revisions.find((revision) => revision.id !== local.id) ??
    [...revisions].sort((left, right) => left.id.localeCompare(right.id))[1];
  if (local === undefined || remote === undefined) {
    throw new Error('at least two revisions are required to merge');
  }
  return [local, remote];
}

function applySyncValue(
  draftsById: Map<string, ESDraft>,
  documentId: string,
  value: DraftSyncValue,
): void {
  const draft = draftFromSyncValue(value, documentId);
  if (draft === null) draftsById.delete(documentId);
  else draftsById.set(documentId, draft);
}

function draftFromSyncValue(value: DraftSyncValue, documentId: string): ESDraft | null {
  if (isDeleted(value)) return null;
  const draft = parseDraft(value);
  if (draft === null || draft.id !== documentId) {
    throw new Error(`sync revision contains an invalid draft for ${documentId}`);
  }
  return cloneDraft(draft);
}

function toDraftValue(draft: ESDraft): DraftSyncValue {
  return cloneDraft(draft) as unknown as DraftSyncValue;
}

function toDeletedValue(documentId: string, deletedAt: number): DeletedDraft {
  return { kind: DELETED_KIND, documentId, deletedAt };
}

function isDeleted(value: DraftSyncValue): value is DeletedDraft {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const candidate = value as { kind?: unknown; documentId?: unknown; deletedAt?: unknown };
  return (
    candidate.kind === DELETED_KIND &&
    typeof candidate.documentId === 'string' &&
    typeof candidate.deletedAt === 'number'
  );
}

function sameJson(left: DraftSyncValue, right: DraftSyncValue): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function sameLogicalDraft(left: DraftSyncValue, right: DraftSyncValue): boolean {
  if (isDeleted(left) || isDeleted(right)) return isDeleted(left) && isDeleted(right);
  const leftDraft = parseDraft(left);
  const rightDraft = parseDraft(right);
  if (leftDraft === null || rightDraft === null) return sameJson(left, right);
  return (
    canonicalJson(stripDraftTimestamps(leftDraft)) ===
    canonicalJson(stripDraftTimestamps(rightDraft))
  );
}

function newerValue(left: DraftSyncValue, right: DraftSyncValue): DraftSyncValue {
  const leftDraft = parseDraft(left);
  const rightDraft = parseDraft(right);
  if (leftDraft !== null && rightDraft !== null) {
    return leftDraft.updatedAt >= rightDraft.updatedAt ? left : right;
  }
  return left;
}

function stripDraftTimestamps(draft: ESDraft): DraftSyncValue {
  const copy = cloneDraft(draft);
  copy.createdAt = 0;
  copy.updatedAt = 0;
  copy.snapshots = copy.snapshots?.map((snapshot) => ({ ...snapshot, timestamp: 0 }));
  return copy as unknown as DraftSyncValue;
}
