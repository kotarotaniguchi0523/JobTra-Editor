"use client";

import React from 'react';
import { Scissors, Check, ArrowRight } from 'lucide-react';
import { RedundancyMatch } from '../services/sculptor';

interface ChiselToolbarProps {
  matches: RedundancyMatch[];
  onApplyOne: (match: RedundancyMatch) => void;
  onApplyAll: () => void;
  totalSaved: number;
}

export const ChiselToolbar: React.FC<ChiselToolbarProps> = ({
  matches,
  onApplyOne,
  onApplyAll,
  totalSaved,
}) => {
  if (matches.length === 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-md text-xs text-emerald-800">
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="font-medium">贅肉のない引き締まった文体です</span>
        <span className="text-xs text-emerald-600 ml-auto">二重敬語・迂言表現 0件</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium">
          <Scissors className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>文字数を削れる冗長表現: {matches.length}箇所</span>
          <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-mono text-xs font-bold">
            合計 -{totalSaved}字
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            onApplyAll();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded shadow-xs transition-colors cursor-pointer"
          title="すべての冗長表現を一括で簡潔な表現に置換します"
        >
          <span>一括で引き締める (-{totalSaved}字)</span>
        </button>
      </div>

      {/* Quick Individual Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {matches.slice(0, 4).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              onApplyOne(m);
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-amber-300/80 rounded text-xs text-neutral-800 hover:bg-amber-100/60 hover:border-amber-400 transition-colors cursor-pointer group"
            title={`${m.label}: 「${m.original}」を「${m.suggested}」に置換`}
          >
            <span className="line-through text-neutral-400 max-w-[120px] truncate">
              {m.original}
            </span>
            <ArrowRight className="w-2.5 h-2.5 text-amber-600" />
            <span className="font-semibold text-amber-900">
              {m.suggested}
            </span>
            <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-1 rounded">
              -{m.charsSaved}字
            </span>
          </button>
        ))}
        {matches.length > 4 && (
          <span className="text-xs text-amber-700 self-center">
            他 {matches.length - 4}件
          </span>
        )}
      </div>
    </div>
  );
};
