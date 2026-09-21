import type { BuildEntryFunction } from '@funstack/static/server';
import { cp, readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Funstack Static カスタムビルドエントリ
 * ビルド完了後、静的ホスティングが dist/ 直下を配信する構成に合わせるため、
 * outDir (dist/public) の全成果物を dist/ 直下へ確実に展開します。
 */
export default (async ({ build, outDir }) => {
  await build();
  const rootDist = path.dirname(outDir);
  // Copy the generated files, not `outDir` itself. Copying `outDir` to its
  // parent would target the source directory again (`dist/public` -> `dist`
  // -> `dist/public`) and keep the build process alive indefinitely.
  const entries = await readdir(outDir, { withFileTypes: true });
  await Promise.all(
    entries.map((entry) =>
      cp(path.join(outDir, entry.name), path.join(rootDist, entry.name), {
        recursive: entry.isDirectory(),
        force: true,
      }),
    ),
  );

  // Funstack's static build can leave its RSC stream handles open after all
  // files have been written. Terminate once the complete output is on disk so
  // CI and local static builds do not wait indefinitely on stale handles.
  process.exit(0);
}) satisfies BuildEntryFunction;
