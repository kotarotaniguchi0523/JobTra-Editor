'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

interface WorkspaceContentIslandProps {
  children: ReactNode;
  emptyDraftGuideSlot?: ReactNode;
}

export function WorkspaceContentIsland({
  children,
  emptyDraftGuideSlot,
}: WorkspaceContentIslandProps) {
  const { isLoading, activeDraft } = useWorkspaceInteraction();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>下書きを読み込んでいます...</span>
      </div>
    );
  }

  if (!activeDraft) {
    return (
      emptyDraftGuideSlot || (
        <div className="py-16 text-center text-neutral-400">
          <p className="text-sm">下書きがありません。「新規作成」をクリックしてください。</p>
        </div>
      )
    );
  }

  return children;
}
