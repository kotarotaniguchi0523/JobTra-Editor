/** Runtime boundary for wall-clock reads; sync algorithms receive the value explicitly. */
export function currentTimeMs(): number {
  return Date.now();
}
