import type { ESDraft } from './types';

/** Compares persisted draft snapshots without introducing a second state owner. */
export function areDraftCollectionsEqual(
  left: readonly ESDraft[],
  right: readonly ESDraft[],
): boolean {
  if (left.length !== right.length) return false;

  const serialize = (drafts: readonly ESDraft[]) =>
    JSON.stringify([...drafts].sort((a, b) => a.id.localeCompare(b.id)));
  return serialize(left) === serialize(right);
}
