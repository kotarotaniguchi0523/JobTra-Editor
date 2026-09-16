import React, { memo } from 'react';
import { JapaneseMetrics } from '../types';
import { WriteEditorSurface } from './WriteEditorSurface';
import { WriteToolbar } from './WriteToolbar';

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
export const WriteWorkspace: React.FC<WriteWorkspaceProps> = memo(
  ({ content, metrics, deferredContent, onCleanFormatting, onContentCommit }) => {
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
  },
);

WriteWorkspace.displayName = 'WriteWorkspace';
