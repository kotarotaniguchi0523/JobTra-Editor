import './setup.js';
import { describe, expect, it } from 'vitest';
import { createTrysteroChannel } from '../../../src/features/device-sync/transport/trystero.js';
import type { JsonValue, SyncMessage } from '../../../src/features/device-sync/sync/types.js';

describe('Trystero transport adapter', () => {
  it('rejects an incomplete pairing token before opening a room', () => {
    expect(() => createTrysteroChannel({ appId: '', roomId: 'room', password: 'secret' })).toThrow(
      'appId, roomId, and password are required',
    );
  });

  it('binds the sync action to the room and forwards messages', async () => {
    let actionHandler: ((message: SyncMessage<JsonValue>) => void) | undefined;
    let sent: SyncMessage<JsonValue> | undefined;
    let left = false;
    const channel = createTrysteroChannel({
      appId: 'jobtra-test',
      roomId: 'room',
      password: 'secret',
      join: ((config: { appId: string; password?: string }, roomId: string) => {
        expect(config).toEqual({ appId: 'jobtra-test', password: 'secret' });
        expect(roomId).toBe('room');
        return {
          makeAction(name: string) {
            expect(name).toBe('jobtra-sync-v1');
            return {
              async send(message: SyncMessage<JsonValue>) {
                sent = message;
                actionHandler?.(message);
              },
              set onMessage(handler: (message: SyncMessage<JsonValue>) => void) {
                actionHandler = handler;
              },
            };
          },
          leave() {
            left = true;
          },
        };
      }) as never,
    });

    const received: SyncMessage<JsonValue>[] = [];
    channel.onMessage((message) => received.push(message));
    const hello: SyncMessage = { kind: 'done' };
    await channel.send(hello);

    expect(sent).toEqual(hello);
    expect(received).toEqual([hello]);
    channel.close();
    expect(left).toBe(true);
  });

  it('waits for a peer before the protocol sends its first message', async () => {
    let peerHandler: ((peerId: string) => void) | null = null;
    const channel = createTrysteroChannel({
      appId: 'jobtra-test',
      roomId: 'room',
      password: 'secret',
      join: (() => ({
        makeAction() {
          return {
            send() {
              return undefined;
            },
          };
        },
        set onPeerJoin(handler: ((peerId: string) => void) | null) {
          peerHandler = handler;
        },
        leave() {},
      })) as never,
    });

    const pending = channel.waitForPeer?.(1_000);
    peerHandler?.('peer-1');

    await expect(pending).resolves.toBeUndefined();
    channel.close();
  });

  it('rejects a pending peer wait when the channel closes', async () => {
    const channel = createTrysteroChannel({
      appId: 'jobtra-test',
      roomId: 'room',
      password: 'secret',
      join: (() => ({
        makeAction() {
          return { send() {} };
        },
        leave() {},
      })) as never,
    });

    const pending = channel.waitForPeer?.(1_000);
    channel.close();

    await expect(pending).rejects.toThrow('sync channel is closed');
  });
});
