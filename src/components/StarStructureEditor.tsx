"use client";

import React, { useState, useRef, useDeferredValue, useId, memo, useTransition, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { StarBlocks } from '../types';

interface StarStructureEditorProps {
  currentStarBlocks: StarBlocks;
  onBlockChange: (field: keyof StarBlocks, value: string) => void;
  onSwitchToWriteMode: () => void;
  onApplyBlocksToContent: () => void;
  hasUnappliedChanges?: boolean;
  starGuideSlot?: React.ReactNode;
}

interface BlockFieldProps {
  id: string;
  field: keyof StarBlocks;
  stepNum: number;
  label: string;
  placeholder: string;
  value: string;
  onBlockChange: (field: keyof StarBlocks, val: string) => void;
  rows?: number;
  highlight?: boolean;
}

const StarBlockField: React.FC<BlockFieldProps> = memo(({
  id,
  field,
  stepNum,
  label,
  placeholder,
  value,
  onBlockChange,
  rows = 2,
  highlight = false,
}) => {
  const [localVal, setLocalVal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [, startTransition] = useTransition();
  const isComposingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // レンダー中同期（useEffectでのsetStateを回避）
  if (value !== prevValue) {
    setPrevValue(value);
    if (!isComposingRef.current) {
      setLocalVal(value);
    }
  }

  const commitValue = (val: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        onBlockChange(field, val);
      });
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const deferredCount = useDeferredValue(localVal.length);

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-md transition-colors ${
        highlight
          ? 'bg-neutral-50 rounded-md border-2 border-neutral-900 ring-2 ring-neutral-900/10'
          : 'bg-neutral-50 rounded-md border border-neutral-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className={`flex items-center gap-2 font-bold cursor-pointer ${
            highlight ? 'text-lg sm:text-xl text-neutral-950' : 'text-base font-semibold text-neutral-900'
          }`}
        >
          <span
            className={`rounded bg-neutral-900 text-white flex items-center justify-center font-mono ${
              highlight ? 'w-6 h-6 text-sm font-bold' : 'w-5 h-5 text-xs'
            }`}
          >
            {stepNum}
          </span>
          {label}
        </label>
        <span
          className={`font-mono ${
            highlight ? 'text-sm font-bold text-neutral-900' : 'text-sm text-neutral-500'
          }`}
        >
          {deferredCount}字
        </span>
      </div>
      <textarea
        id={id}
        value={localVal}
        onChange={(e) => {
          const v = e.target.value;
          setLocalVal(v);
          if (!isComposingRef.current) {
            commitValue(v);
          }
        }}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          const v = e.currentTarget.value;
          setLocalVal(v);
          commitValue(v);
        }}
        placeholder={placeholder}
        aria-label={label}
        rows={rows}
        className={`w-full bg-white rounded leading-relaxed font-sans placeholder:text-neutral-300 focus:outline-hidden ${
          highlight
            ? 'text-2xl sm:text-3xl text-neutral-950 border-2 border-neutral-300 p-3.5 focus:border-neutral-950 font-medium'
            : 'text-lg sm:text-xl text-neutral-900 border border-neutral-200 p-3 focus:border-neutral-900'
        }`}
      />
    </div>
  );
});

StarBlockField.displayName = 'StarBlockField';

export const StarStructureEditor: React.FC<StarStructureEditorProps> = memo(({
  currentStarBlocks,
  onBlockChange,
  onSwitchToWriteMode,
  onApplyBlocksToContent,
  hasUnappliedChanges = false,
  starGuideSlot,
}) => {
  const [, startTransition] = useTransition();
  const conclusionId = useId();
  const situationId = useId();
  const actionId = useId();
  const resultId = useId();
  const contributionId = useId();

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* RSC Static Knowledge Guide Slot */}
      {starGuideSlot}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-100">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">
            STAR論理構成エディタ
          </h3>
          <p className="text-sm text-neutral-500">
            各項目で思考を整理できます。「本文エディタへ反映」を押すまで本文を誤って上書きすることはありません。
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnappliedChanges && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              未反映の変更あり
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                onApplyBlocksToContent();
                onSwitchToWriteMode();
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <span>本文エディタへ反映して執筆へ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block 1: Conclusion */}
      <StarBlockField
        id={conclusionId}
        field="conclusion"
        stepNum={1}
        label="結論・強み（一言で何を成し遂げたか）"
        placeholder="例: 私の強みは、目標に向かって粘り強く周囲を巻き込む「完遂力」です。学生時代はカフェの離職率低減に注力しました。"
        value={currentStarBlocks.conclusion}
        onBlockChange={onBlockChange}
        rows={2}
      />

      {/* Block 2: Situation & Task */}
      <StarBlockField
        id={situationId}
        field="situation"
        stepNum={2}
        label="状況と課題（直面した困難や高い目標）"
        placeholder="例: 当店では新人の離職率が40%と高く、業務習得の負担と教育体制の不足が原因でした。"
        value={currentStarBlocks.situation}
        onBlockChange={onBlockChange}
        rows={4}
        highlight
      />

      {/* Block 3: Action */}
      <StarBlockField
        id={actionId}
        field="action"
        stepNum={3}
        label="独自の工夫・行動（あなた自身の創意工夫や具体的施策）"
        placeholder="例: そこで私は「新人育成チェックシート」と「バディ制度」を提案し、習得項目を30個に分解して先輩が毎日10分振り返る仕組みを構築しました。"
        value={currentStarBlocks.action}
        onBlockChange={onBlockChange}
        rows={3}
      />

      {/* Block 4: Result */}
      <StarBlockField
        id={resultId}
        field="result"
        stepNum={4}
        label="結果・定量的成果・学び（数値の変化や得られた知見）"
        placeholder="例: その結果、半年後の離職率は10%まで低下し、顧客アンケートでもエリア1位の評価を獲得しました。"
        value={currentStarBlocks.result}
        onBlockChange={onBlockChange}
        rows={2}
      />

      {/* Block 5: Contribution */}
      <StarBlockField
        id={contributionId}
        field="contribution"
        stepNum={5}
        label="入社後の貢献（志望先でどう再現するか）"
        placeholder="例: 貴社においても、現場の潜在課題を見極めて仕組み化で解決する力を活かし、事業貢献いたします。"
        value={currentStarBlocks.contribution}
        onBlockChange={onBlockChange}
        rows={2}
      />
    </div>
  );
});

StarStructureEditor.displayName = 'StarStructureEditor';
