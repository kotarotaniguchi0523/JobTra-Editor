export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type VectorClock = Record<string, number>;

export type Revision<T extends JsonValue = JsonValue> = {
  id: string;
  documentId: string;
  parents: string[];
  value: T;
  clock: VectorClock;
  authorReplicaId: string;
  createdAt: number;
};

export type RevisionHeads = {
  documentId: string;
  heads: string[];
};

export type MergeConflict = {
  path: string;
  base: JsonValue | undefined;
  local: JsonValue | undefined;
  remote: JsonValue | undefined;
  kind: 'value' | 'text';
};

export type MergeResult<T extends JsonValue> = {
  value: T;
  conflicts: MergeConflict[];
};

export type SyncMessage<T extends JsonValue = JsonValue> =
  | {
      kind: 'hello';
      revisionIds: string[];
      heads: RevisionHeads[];
    }
  | {
      kind: 'revisions';
      revisions: Revision<T>[];
    }
  | {
      kind: 'ack';
      revisionIds: string[];
    }
  | {
      kind: 'done';
    };

export interface RevisionStore<T extends JsonValue = JsonValue> {
  getRevision(id: string): Promise<Revision<T> | undefined>;
  getRevisions(ids?: readonly string[]): Promise<Revision<T>[]>;
  getHeads(documentId?: string): Promise<RevisionHeads[]>;
  putRevisions(revisions: readonly Revision<T>[]): Promise<void>;
}

export interface SyncChannel<T extends JsonValue = JsonValue> {
  send(message: SyncMessage<T>): Promise<void>;
  onMessage(handler: (message: SyncMessage<T>) => void): () => void;
  close(): void;
}

export type SyncSummary = {
  sent: number;
  received: number;
};
