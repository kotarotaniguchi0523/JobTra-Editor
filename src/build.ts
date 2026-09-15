import type { BuildEntryFunction } from '@funstack/static/server';
import { cp } from 'node:fs/promises';
import path from 'node:path';

/**
 * Funstack Static カスタムビルドエントリ
 * ビルド完了後、AI Studio の SPA 静的ホスティング（dist/ 直下参照）に対応するため
 * outDir (dist/public) の全成果物を dist/ 直下へ確実に展開します。
 */
export default (async ({ build, outDir }) => {
  await build();
  const rootDist = path.dirname(outDir);
  await cp(outDir, rootDist, { recursive: true });
}) satisfies BuildEntryFunction;
