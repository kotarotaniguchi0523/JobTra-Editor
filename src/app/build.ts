import type { BuildEntryFunction } from '@funstack/static/server';
import { cp } from 'node:fs/promises';
import path from 'node:path';

/**
 * Funstack Static カスタムビルドエントリ
 * ビルド完了後、静的ホスティングが dist/ 直下を配信する構成に合わせるため、
 * outDir (dist/public) の全成果物を dist/ 直下へ確実に展開します。
 */
export default (async ({ build, outDir }) => {
  await build();
  const rootDist = path.dirname(outDir);
  await cp(outDir, rootDist, { recursive: true });
}) satisfies BuildEntryFunction;
