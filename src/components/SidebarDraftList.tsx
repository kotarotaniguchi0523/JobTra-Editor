import React, { memo } from 'react';
import type { ESDraft } from '../types';
import { SidebarDraftItem } from './SidebarDraftItem';

interface SidebarDraftListProps {
  drafts: ESDraft[];
  currentDraftId: string;
  onSelectDraft: (id: string) => void;
  onCloseMobile: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export const SidebarDraftList: React.FC<SidebarDraftListProps> = memo(
  ({
    drafts,
    currentDraftId,
    onSelectDraft,
    onCloseMobile,
    onDeleteDraft,
    onDuplicateDraft,
    onToggleStar,
  }) => {
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
  },
);

function getCategoryLabel(category: ESDraft['category']): string {
  switch (category) {
    case 'gakuchika':
      return 'ガクチカ';
    case 'shibou':
      return '志望動機';
    case 'pr':
      return '自己PR';
    case 'zasetsu':
      return '困難・挫折';
    case 'jiku':
      return '就活軸';
    case 'future':
      return '入社後';
    case 'custom':
      return '自由記述';
  }
}

SidebarDraftList.displayName = 'SidebarDraftList';
