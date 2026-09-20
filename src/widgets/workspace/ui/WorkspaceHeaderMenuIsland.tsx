'use client';

import { Menu } from 'lucide-react';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

export function WorkspaceHeaderMenuIsland() {
  const { setPanel } = useWorkspaceInteraction();

  return (
    <button
      type="button"
      onClick={() => setPanel('sidebar')}
      className="shrink-0 cursor-pointer rounded-md p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:p-2 lg:hidden"
      title="下書き一覧を開く"
      aria-label="下書き一覧を開く"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
