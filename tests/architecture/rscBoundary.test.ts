import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('build-time RSC boundary', () => {
  // @lat: [[architecture#RSC boundary regression]]
  it('keeps static frames server-owned and scopes DraftRuntime to workspace routes', () => {
    const workspaceFrame = source('src/widgets/workspace/rsc/WorkspaceFrame.tsx');
    const headerFrame = source('src/widgets/workspace/rsc/WorkspaceHeaderFrame.tsx');
    const rootLayout = source('src/pages/layout.tsx');
    const workspaceLayout = source('src/pages/(workspace)/layout.tsx');
    const workspaceComposition = source('src/widgets/workspace/rsc/WorkspaceLayout.tsx');

    expect(workspaceFrame).not.toContain("'use client'");
    expect(headerFrame).not.toContain("'use client'");
    expect(rootLayout).not.toContain('DraftRuntime');
    expect(workspaceLayout).toContain("import { DraftRuntime } from '@app/runtime/DraftRuntime'");
    expect(workspaceComposition).toContain('WorkspaceFrame');
    expect(workspaceComposition).toContain('WorkspaceInteractionProvider');
  });
});
