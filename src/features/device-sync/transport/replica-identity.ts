const REPLICA_ID_KEY = 'jobtra-sync-replica-id-v1';

/** Returns the stable identity used to author local revisions. */
export function getReplicaId(): string {
  if (typeof window === 'undefined') return 'server-render';

  try {
    const existing = window.localStorage.getItem(REPLICA_ID_KEY);
    if (existing) return existing;
    const replicaId = crypto.randomUUID();
    window.localStorage.setItem(REPLICA_ID_KEY, replicaId);
    return replicaId;
  } catch {
    // Private browsing can deny localStorage. A per-tab fallback still keeps
    // vector clocks correct for the current session.
    return crypto.randomUUID();
  }
}
