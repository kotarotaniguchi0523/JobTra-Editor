import type {
  JsonValue,
  Revision,
  RevisionStore,
  SyncChannel,
  SyncMessage,
  SyncSummary,
} from './types.js';

const MAX_SYNC_MESSAGE_BYTES = 16 * 1024;

export async function syncStores<T extends JsonValue>(options: {
  store: RevisionStore<T>;
  channel: SyncChannel<T>;
  timeoutMs?: number;
}): Promise<SyncSummary> {
  const timeoutMs = options.timeoutMs ?? 10_000;
  const localRevisions = await options.store.getRevisions();
  const localIds = new Set(localRevisions.map((revision) => revision.id));
  const localHeads = await options.store.getHeads();

  return new Promise<SyncSummary>((resolve, reject) => {
    let sent = false;
    let finishedSending = false;
    let remoteDone = false;
    let settled = false;
    let received = 0;
    const receivedIds = new Set<string>();
    let sentRevisionIds: string[] = [];
    let acknowledged = new Set<string>();
    let unsubscribe: (() => void) | undefined;
    let processing = Promise.resolve();

    const timer = setTimeout(() => finish(new Error('sync timed out')), timeoutMs);

    const finish = (error?: Error): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe?.();
      if (error !== undefined) reject(error);
      else resolve({ sent: sentRevisionIds.length, received });
    };

    const maybeFinish = (): void => {
      if (!finishedSending || !sentRevisionIds.every((id) => acknowledged.has(id)) || !remoteDone)
        return;
      finish();
    };

    const sendOurMissingRevisions = async (remoteIds: Set<string>): Promise<void> => {
      if (sent) return;
      sent = true;
      const missing = localRevisions.filter((revision) => !remoteIds.has(revision.id));
      sentRevisionIds = missing.map((revision) => revision.id);
      const batches = chunkRevisions(missing);
      await batches.reduce<Promise<void>>(
        (previous, batch) =>
          previous.then(() => options.channel.send({ kind: 'revisions', revisions: batch })),
        Promise.resolve(),
      );
      finishedSending = true;
      await options.channel.send({ kind: 'done' });
      maybeFinish();
    };

    const onMessage = (message: SyncMessage<T>): void => {
      processing = processing.then(async () => {
        try {
          if (message.kind === 'hello') {
            await sendOurMissingRevisions(new Set(message.revisionIds));
            return;
          }
          if (message.kind === 'revisions') {
            await options.store.putRevisions(message.revisions);
            for (const revision of message.revisions) {
              if (!localIds.has(revision.id) && !receivedIds.has(revision.id)) {
                receivedIds.add(revision.id);
                received += 1;
              }
            }
            await options.channel.send({
              kind: 'ack',
              revisionIds: message.revisions.map((revision) => revision.id),
            });
            return;
          }
          if (message.kind === 'ack') {
            for (const id of message.revisionIds) acknowledged.add(id);
            maybeFinish();
            return;
          }
          remoteDone = true;
          maybeFinish();
        } catch (error) {
          finish(error instanceof Error ? error : new Error(String(error)));
        }
      });
    };

    unsubscribe = options.channel.onMessage(onMessage);
    void options.channel
      .send({
        kind: 'hello',
        revisionIds: [...localIds].sort(),
        heads: localHeads,
      })
      .catch((error: unknown) => finish(error instanceof Error ? error : new Error(String(error))));
  });
}

function chunkRevisions<T extends JsonValue>(revisions: readonly Revision<T>[]): Revision<T>[][] {
  if (revisions.length === 0) return [[]];
  const batches: Revision<T>[][] = [];
  let current: Revision<T>[] = [];
  for (const revision of revisions) {
    const candidate = [...current, revision];
    const bytes = new TextEncoder().encode(
      JSON.stringify({ kind: 'revisions', revisions: candidate }),
    ).byteLength;
    if (current.length > 0 && bytes > MAX_SYNC_MESSAGE_BYTES) {
      batches.push(current);
      current = [revision];
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) batches.push(current);
  return batches;
}
