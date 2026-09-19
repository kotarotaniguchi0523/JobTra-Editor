import React from 'react';
import type { ESDraft } from '@entities/draft/model/types';
import { getCategoryLabel } from '@entities/draft/model/categoryLabels';
import { SidebarDraftItem } from '@widgets/workspace/ui/SidebarDraftItem';

interface SidebarDraftListProps {
  drafts: ESDraft[];
  currentDraftId: string;
  onSelectDraft: (id: string) => void;
  onCloseMobile: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function SidebarDraftList({
  drafts,
  currentDraftId,
  onSelectDraft,
  onCloseMobile,
  onDeleteDraft,
  onDuplicateDraft,
  onToggleStar,
}: SidebarDraftListProps) {
  return (
    <div className="space-y-2 p-3">
      {drafts.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          条件に一致する下書きはありません
        </div>
      ) : (
        drafts.map((draft) => (
          <SidebarDraftItem
            key={draft.id}
            draft={draft}
            isSelected={draft.id === currentDraftId}
            onSelect={(id) => {
              onSelectDraft(id);
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            onDuplicate={onDuplicateDraft}
            onDelete={onDeleteDraft}
            onToggleStar={onToggleStar}
            categoryLabel={getCategoryLabel(draft.category)}
          />
        ))
      )}
    </div>
  );
}
