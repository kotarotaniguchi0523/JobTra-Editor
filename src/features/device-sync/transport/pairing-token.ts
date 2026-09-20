import type { JsonValue } from '../sync/types.js';
import { isJsonRecord } from '../sync/json.js';

export type PairingToken = {
  version: 1;
  appId: string;
  strategy: string;
  roomId: string;
  password: string;
  expiresAt: number;
};

export function buildPairingToken(options: {
  appId: string;
  strategy?: string;
  ttlMs?: number;
  now: number;
  roomId: string;
  password: string;
}): PairingToken {
  if (!options.appId) throw new Error('pairing appId is required');
  const ttlMs = options.ttlMs ?? 60_000;
  if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0 || ttlMs > 15 * 60_000) {
    throw new Error('pairing ttlMs must be between 1ms and 15 minutes');
  }
  return {
    version: 1,
    appId: options.appId,
    strategy: options.strategy ?? 'nostr',
    roomId: options.roomId,
    password: options.password,
    expiresAt: options.now + ttlMs,
  };
}

export function createPairingToken(options: {
  appId: string;
  strategy?: string;
  ttlMs?: number;
  now: number;
}): PairingToken {
  return buildPairingToken({
    appId: options.appId,
    strategy: options.strategy,
    ttlMs: options.ttlMs,
    now: options.now,
    roomId: crypto.randomUUID(),
    password: encodeBytes(crypto.getRandomValues(new Uint8Array(32))),
  });
}

export function encodePairingToken(token: PairingToken): string {
  validateShape(token);
  return encodeBytes(new TextEncoder().encode(JSON.stringify(token)));
}

export function decodePairingToken(encoded: string, now: number): PairingToken {
  if (!encoded) throw new Error('pairing token is empty');
  try {
    const value = JSON.parse(new TextDecoder().decode(decodeBytes(encoded))) as JsonValue;
    if (!isJsonRecord(value)) throw new Error('pairing token must be an object');
    const token = value as unknown as PairingToken;
    validateShape(token);
    if (token.expiresAt <= now) throw new Error('pairing token has expired');
    return token;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('pairing token')) throw error;
    throw new Error('pairing token is invalid');
  }
}

function validateShape(token: PairingToken): void {
  if (
    token.version !== 1 ||
    !token.appId ||
    !token.strategy ||
    !token.roomId ||
    !token.password ||
    !Number.isSafeInteger(token.expiresAt)
  ) {
    throw new Error('pairing token shape is invalid');
  }
}

function encodeBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decodeBytes(encoded: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('pairing token encoding is invalid');
  const padded =
    encoded.replaceAll('-', '+').replaceAll('_', '/') + '==='.slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
