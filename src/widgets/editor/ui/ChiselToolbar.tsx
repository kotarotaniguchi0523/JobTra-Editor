import React from 'react';
import { Scissors, Check, ArrowRight } from 'lucide-react';
import { RedundancyMatch } from '@features/writing-assistance/lib/sculptor';

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
      <div className="flex items-center gap-1.5 rounded-md border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-800">
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <span className="font-medium">贅肉のない引き締まった文体です</span>
        <span className="ml-auto text-xs text-emerald-600">二重敬語・迂言表現 0件</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-amber-200/80 bg-amber-50/70 p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-900">
          <Scissors className="h-3.5 w-3.5 shrink-0 text-amber-700" />
          <span>文字数を削れる冗長表現: {matches.length}箇所</span>
          <span className="py-0.2 rounded-full bg-amber-200 px-1.5 font-mono text-xs font-bold text-amber-900">
            合計 -{totalSaved}字
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            onApplyAll();
          }}
          className="flex cursor-pointer items-center gap-1 rounded bg-amber-800 px-2.5 py-1 text-xs font-medium text-white shadow-xs transition-colors hover:bg-amber-900"
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
            className="group flex cursor-pointer items-center gap-1.5 rounded border border-amber-300/80 bg-white px-2 py-0.5 text-xs text-neutral-800 transition-colors hover:border-amber-400 hover:bg-amber-100/60"
            title={`${m.label}: 「${m.original}」を「${m.suggested}」に置換`}
          >
            <span className="max-w-[120px] truncate text-neutral-400 line-through">
              {m.original}
            </span>
            <ArrowRight className="h-2.5 w-2.5 text-amber-600" />
            <span className="font-semibold text-amber-900">{m.suggested}</span>
            <span className="rounded bg-emerald-50 px-1 font-mono text-xs text-emerald-700">
              -{m.charsSaved}字
            </span>
          </button>
        ))}
        {matches.length > 4 && (
          <span className="self-center text-xs text-amber-700">他 {matches.length - 4}件</span>
        )}
      </div>
    </div>
  );
};
