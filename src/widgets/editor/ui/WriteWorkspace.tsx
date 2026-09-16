import React from 'react';
import type { JapaneseMetrics } from '@features/writing-assistance/model/types';
import { WriteEditorSurface } from '@widgets/editor/ui/WriteEditorSurface';
import { WriteToolbar } from '@widgets/editor/ui/WriteToolbar';

interface WriteWorkspaceProps {
  content: string;
  metrics: JapaneseMetrics;
  deferredContent: string;
  onCleanFormatting: () => void;
  onContentCommit: (val: string, pos: number) => void;
}

/**
 * WriteWorkspace:
 * 執筆モードにおける入力エリア、フォーカスセンテンス、視線固定、ゴースト補完の責務を担うコンポーネント
 */
export function WriteWorkspace({
  content,
  metrics,
  deferredContent,
  onCleanFormatting,
  onContentCommit,
}: WriteWorkspaceProps) {
  return (
    <div className="space-y-2">
      <WriteToolbar onCleanFormatting={onCleanFormatting}>
        {({ isFocusSentenceEnabled, isTypewriterScrollEnabled }) => (
          <WriteEditorSurface
            content={content}
            metrics={metrics}
            deferredContent={deferredContent}
            isFocusSentenceEnabled={isFocusSentenceEnabled}
            isTypewriterScrollEnabled={isTypewriterScrollEnabled}
            onContentCommit={onContentCommit}
          />
        )}
      </WriteToolbar>
    </div>
  );
}
