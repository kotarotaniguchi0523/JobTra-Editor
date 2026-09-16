import React from 'react';
import { GhostGuidanceBar } from '@widgets/editor/ui/GhostGuidanceBar';
import type { GhostGuidance } from '@features/writing-assistance/lib/ghostGuidance';

interface DeferredGhostGuidanceProps {
  guidance: GhostGuidance;
  onInsertSuggestion: (phrase: string) => void;
}

/**
 * DeferredGhostGuidance:
 * 思考の伴走ロジック（接続フレーズ・論理ガイド）を独立させたコンポーネント。
 * useDeferredValue による低優先度更新を受け取るため、
 * 入力中のメインスレッドをブロックしません。
 */
export function DeferredGhostGuidance({
  guidance,
  onInsertSuggestion,
}: DeferredGhostGuidanceProps) {
  return (
    <div className="border-t border-neutral-800 bg-neutral-900 p-2.5">
      <GhostGuidanceBar guidance={guidance} onInsertSuggestion={onInsertSuggestion} />
    </div>
  );
}
