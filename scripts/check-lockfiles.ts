import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const allowedLockfile = path.join(repositoryRoot, 'package-lock.json');

// Knip analyzes JavaScript/TypeScript dependency usage. It does not own the
// repository's package-manager policy, so keep that policy explicit here.
const forbiddenLockfileNames = new Set([
  'bun.lock',
  'bun.lockb',
  'npm-shrinkwrap.json',
  'pnpm-lock.yaml',
  'pnpm-lock.yml',
  'pnpm-workspace.yaml',
  'skills-lock.json',
  'yarn.lock',
]);

const ignoredDirectories = new Set(['.git', '.lat', 'dist', 'node_modules']);

async function findForbiddenLockfiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const violations: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        violations.push(...(await findForbiddenLockfiles(path.join(directory, entry.name))));
      }
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    if (forbiddenLockfileNames.has(entry.name)) {
      violations.push(path.relative(repositoryRoot, entryPath));
      continue;
    }

    if (entry.name === 'package-lock.json' && entryPath !== allowedLockfile) {
      violations.push(path.relative(repositoryRoot, entryPath));
    }
  }

  return violations;
}

const violations = await findForbiddenLockfiles(repositoryRoot);

if (violations.length > 0) {
  console.error(
    [
      'Only the root package-lock.json is allowed for dependency installation.',
      'Remove these additional package-manager lock files:',
      ...violations.map((filePath) => `- ${filePath}`),
    ].join('\n'),
  );
  process.exitCode = 1;
} else {
  console.log('Lockfile policy verified: root package-lock.json is the only dependency lockfile.');
}
