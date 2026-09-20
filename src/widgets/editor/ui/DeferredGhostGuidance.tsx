import React from 'react';
import { GhostGuidanceBar } from '@widgets/editor/ui/GhostGuidanceBar';
import type { GhostGuidanceProps } from '@widgets/editor/ui/types';

/**
 * DeferredGhostGuidance:
 * 思考の伴走ロジック（接続フレーズ・論理ガイド）を独立させたコンポーネント。
 * useDeferredValue による低優先度更新を受け取るため、
 * 入力中のメインスレッドをブロックしません。
 */
export function DeferredGhostGuidance({ guidance, onInsertSuggestion }: GhostGuidanceProps) {
  return (
    <div className="border-t border-neutral-800 bg-neutral-900 p-2.5">
      <GhostGuidanceBar guidance={guidance} onInsertSuggestion={onInsertSuggestion} />
    </div>
  );
}
