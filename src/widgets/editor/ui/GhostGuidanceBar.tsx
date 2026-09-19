import React from 'react';
import { Compass, CornerDownLeft } from 'lucide-react';
import type { GhostGuidance } from '@features/writing-assistance/model/types';

interface GhostGuidanceBarProps {
  guidance: GhostGuidance;
  onInsertSuggestion: (phrase: string) => void;
}

export const GhostGuidanceBar: React.FC<GhostGuidanceBarProps> = ({
  guidance,
  onInsertSuggestion,
}) => {
  return (
    <div className="flex flex-col justify-between gap-2.5 rounded-md bg-neutral-900 px-3.5 py-2.5 text-neutral-100 shadow-xs sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-800 sm:mt-0">
          <Compass className="h-4 w-4 text-sky-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-sky-300">
              {guidance.phaseLabel}
            </span>
            <span className="hidden text-xs text-neutral-400 md:inline">思考の伴走ガイド</span>
          </div>
          <p className="truncate font-sans text-sm text-neutral-200">{guidance.question}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          onInsertSuggestion(guidance.tabSuggestion);
        }}
        className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white sm:w-auto sm:self-center sm:py-1.5"
        title="接続フレーズをエディタに挿入します（Tabキーでも挿入可能）"
      >
        <span className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 font-mono text-xs font-bold text-sky-300">
          Tab
        </span>
        <span className="max-w-[200px] truncate sm:max-w-[240px]">
          「{guidance.tabSuggestion}」を挿入
        </span>
        <CornerDownLeft className="h-3.5 w-3.5 text-neutral-400" />
      </button>
    </div>
  );
};
