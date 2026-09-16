import React, { memo } from 'react';
import { GhostGuidanceBar } from './GhostGuidanceBar';
import type { GhostGuidance } from '../services/ghostGuidance';

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
export const DeferredGhostGuidance: React.FC<DeferredGhostGuidanceProps> = memo(
  ({ guidance, onInsertSuggestion }) => {
    return (
      <div className="border-t border-neutral-800 bg-neutral-900 p-2.5">
        <GhostGuidanceBar guidance={guidance} onInsertSuggestion={onInsertSuggestion} />
      </div>
    );
  },
);

DeferredGhostGuidance.displayName = 'DeferredGhostGuidance';
