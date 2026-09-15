"use client";

import React, { memo } from 'react';
import { GhostGuidanceBar } from './GhostGuidanceBar';
import { analyzeGhostContext } from '../services/ghostGuidance';

interface DeferredGhostGuidanceProps {
  content: string;
  cursorPos: number;
  onInsertSuggestion: (phrase: string) => void;
}

/**
 * DeferredGhostGuidance:
 * 思考の伴走ロジック（接続フレーズ・論理ガイド）を独立させたコンポーネント。
 * useDeferredValue による低優先度更新を受け取るため、
 * 入力中のメインスレッドをブロックしません。
 */
export const DeferredGhostGuidance: React.FC<DeferredGhostGuidanceProps> = memo(({
  content,
  cursorPos,
  onInsertSuggestion,
}) => {
  const ghostGuidance = analyzeGhostContext(content, cursorPos);

  return (
    <div className="p-2.5 bg-neutral-900 border-t border-neutral-800">
      <GhostGuidanceBar
        guidance={ghostGuidance}
        onInsertSuggestion={onInsertSuggestion}
      />
    </div>
  );
});

DeferredGhostGuidance.displayName = 'DeferredGhostGuidance';
