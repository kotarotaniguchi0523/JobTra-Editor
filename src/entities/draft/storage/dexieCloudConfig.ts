/**
 * Normalizes a build-time Dexie Cloud URL without making any browser or
 * network calls. An empty value deliberately keeps the app local-only.
 */
export function normalizeDexieCloudDatabaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const isHttps = url.protocol === 'https:';
    const isLocalDevelopment =
      url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
    if (!isHttps && !isLocalDevelopment) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

/**
 * Reads the public build-time setting. The database URL is safe to expose in
 * a static bundle; authentication remains handled by Dexie Cloud in the
 * browser and no secret is accepted here.
 */
export function getDexieCloudDatabaseUrl(): string | null {
  return normalizeDexieCloudDatabaseUrl(import.meta.env.VITE_DEXIE_CLOUD_SYNC_URL);
}
