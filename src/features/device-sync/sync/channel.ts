import type { JsonValue, SyncChannel, SyncMessage } from './types.js';

export function createLoopbackChannels<T extends JsonValue = JsonValue>(options?: {
  latencyMs?: number;
  duplicateEvery?: number;
  drop?: (message: SyncMessage<T>, direction: 'a-to-b' | 'b-to-a') => boolean;
}): [SyncChannel<T>, SyncChannel<T>] {
  const a = new LoopbackChannel<T>();
  const b = new LoopbackChannel<T>();
  let sentA = 0;
  let sentB = 0;
  a.setPeer(b, 'a-to-b', () => ++sentA, options);
  b.setPeer(a, 'b-to-a', () => ++sentB, options);
  return [a, b];
}

class LoopbackChannel<T extends JsonValue> implements SyncChannel<T> {
  private peer: LoopbackChannel<T> | undefined;
  private direction: 'a-to-b' | 'b-to-a' = 'a-to-b';
  private readonly handlers = new Set<(message: SyncMessage<T>) => void>();
  private closed = false;
  private nextSequence: () => number = () => 0;
  private options: Parameters<typeof createLoopbackChannels<T>>[0] | undefined;

  setPeer(
    peer: LoopbackChannel<T>,
    direction: 'a-to-b' | 'b-to-a',
    nextSequence: () => number,
    options?: Parameters<typeof createLoopbackChannels<T>>[0],
  ): void {
    this.peer = peer;
    this.direction = direction;
    this.nextSequence = nextSequence;
    this.options = options;
  }

  async send(message: SyncMessage<T>): Promise<void> {
    if (this.closed) throw new Error('channel is closed');
    const peer = this.peer;
    if (peer === undefined || peer.closed) throw new Error('peer channel is closed');
    const sequence = this.nextSequence();
    if (this.options?.drop?.(message, this.direction) === true) return;
    const copies =
      this.options?.duplicateEvery !== undefined &&
      this.options.duplicateEvery > 0 &&
      sequence % this.options.duplicateEvery === 0
        ? 2
        : 1;
    for (let index = 0; index < copies; index += 1) {
      const deliver = () => peer.deliver(message);
      const latency = this.options?.latencyMs ?? 0;
      if (latency > 0) setTimeout(deliver, latency);
      else queueMicrotask(deliver);
    }
  }

  onMessage(handler: (message: SyncMessage<T>) => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  close(): void {
    this.closed = true;
    this.handlers.clear();
  }

  private deliver(message: SyncMessage<T>): void {
    if (!this.closed) for (const handler of this.handlers) handler(message);
  }
}
