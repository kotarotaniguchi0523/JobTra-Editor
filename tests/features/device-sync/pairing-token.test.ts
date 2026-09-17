import './setup.js';
import { describe, expect, it } from 'vitest';
import {
  createPairingToken,
  decodePairingToken,
  encodePairingToken,
} from '../../../src/features/device-sync/transport/pairing-token.js';

describe('pairing token', () => {
  it('round-trips a short-lived token without including document data', () => {
    const token = createPairingToken({
      appId: 'jobtra',
      strategy: 'nostr',
      now: 1000,
      ttlMs: 60_000,
    });
    const decoded = decodePairingToken(encodePairingToken(token), 2000);

    expect(decoded).toEqual(token);
    expect(JSON.stringify(decoded)).not.toContain('draft');
    expect(decoded.password).toHaveLength(43);
  });

  it('rejects expired, malformed, and tampered tokens', () => {
    const token = createPairingToken({ appId: 'jobtra', now: 1000, ttlMs: 100 });
    const encoded = encodePairingToken(token);

    expect(() => decodePairingToken(encoded, 1100)).toThrow('expired');
    expect(() => decodePairingToken('not-a-token', 1000)).toThrow('invalid');
    expect(() => decodePairingToken(`${encoded.slice(0, -1)}x`, 1000)).toThrow('invalid');
  });

  it('rejects unsafe TTLs before creating a token', () => {
    expect(() => createPairingToken({ appId: 'jobtra', ttlMs: 0 })).toThrow('ttlMs');
    expect(() => createPairingToken({ appId: 'jobtra', ttlMs: 16 * 60_000 })).toThrow('ttlMs');
  });
});
