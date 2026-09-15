"use client";

import React from 'react';
import { Compass, CornerDownLeft } from 'lucide-react';
import { GhostGuidance } from '../services/ghostGuidance';

interface GhostGuidanceBarProps {
  guidance: GhostGuidance;
  onInsertSuggestion: (phrase: string) => void;
}

export const GhostGuidanceBar: React.FC<GhostGuidanceBarProps> = ({
  guidance,
  onInsertSuggestion,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-neutral-900 text-neutral-100 rounded-md shadow-xs">
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Compass className="w-4 h-4 text-sky-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sky-300 text-xs tracking-wide">
              {guidance.phaseLabel}
            </span>
            <span className="text-neutral-400 text-xs hidden md:inline">
              思考の伴走ガイド
            </span>
          </div>
          <p className="text-neutral-200 text-sm truncate font-sans">
            {guidance.question}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          onInsertSuggestion(guidance.tabSuggestion);
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded border border-neutral-700 transition-colors cursor-pointer shrink-0 text-xs self-start sm:self-center"
        title="接続フレーズをエディタに挿入します（Tabキーでも挿入可能）"
      >
        <span className="font-mono text-xs bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 text-sky-300 font-bold">
          Tab
        </span>
        <span className="truncate max-w-[180px] sm:max-w-[240px]">
          「{guidance.tabSuggestion}」を挿入
        </span>
        <CornerDownLeft className="w-3.5 h-3.5 text-neutral-400" />
      </button>
    </div>
  );
};
