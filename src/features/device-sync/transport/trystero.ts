import { joinRoom } from 'trystero';
import type { JsonValue, SyncChannel, SyncMessage } from '../sync/types.js';

type TrysteroAction<T extends JsonValue> = {
  send(data: SyncMessage<T>): Promise<void> | void;
  onMessage?: (data: SyncMessage<T>, metadata: { peerId: string }) => void;
};

type TrysteroRoom<T extends JsonValue> = {
  makeAction(name: string): TrysteroAction<T>;
  leave(): void;
};

export type TrysteroJoin = <T extends JsonValue>(
  config: { appId: string; password?: string },
  roomId: string,
) => TrysteroRoom<T>;

export function createTrysteroChannel<T extends JsonValue = JsonValue>(options: {
  appId: string;
  roomId: string;
  password: string;
  join?: TrysteroJoin;
}): SyncChannel<T> {
  if (!options.appId || !options.roomId || !options.password) {
    throw new Error('Trystero appId, roomId, and password are required');
  }
  const join = options.join ?? (joinRoom as unknown as TrysteroJoin);
  const room = join<T>({ appId: options.appId, password: options.password }, options.roomId);
  const action = room.makeAction('jobtra-sync-v1');
  const handlers = new Set<(message: SyncMessage<T>) => void>();
  action.onMessage = (message) => {
    for (const handler of handlers) handler(message);
  };

  return {
    async send(message) {
      await action.send(message);
    },
    onMessage(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    close() {
      handlers.clear();
      room.leave();
    },
  };
}
