const FNV_OFFSET_BASIS = 2_166_136_261;
const FNV_PRIME = 16_777_619;

/**
 * Produces a stable, non-cryptographic content revision for stale-read checks.
 * It is a revision token, not an integrity or security hash.
 */
export function getContentDigest(text: string): string {
  let hash = FNV_OFFSET_BASIS;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }

  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
