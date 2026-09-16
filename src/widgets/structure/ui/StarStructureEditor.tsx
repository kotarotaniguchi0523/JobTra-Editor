import React, { useId } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { StarBlocks } from '@entities/draft/model/types';

interface StarStructureEditorProps {
  currentStarBlocks: StarBlocks;
  onBlockChange: (field: keyof StarBlocks, value: string) => void;
  writeModeHref: string;
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

function StarBlockField({
  id,
  field,
  stepNum,
  label,
  placeholder,
  value,
  onBlockChange,
  rows = 2,
  highlight = false,
}: BlockFieldProps) {
  return (
    <div
      className={`rounded-md p-3.5 transition-colors sm:p-4 ${
        highlight
          ? 'rounded-md border-2 border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10'
          : 'rounded-md border border-neutral-200 bg-neutral-50'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className={`flex cursor-pointer items-center gap-2 font-bold ${
            highlight
              ? 'text-lg text-neutral-950 sm:text-xl'
              : 'text-base font-semibold text-neutral-900'
          }`}
        >
          <span
            className={`flex items-center justify-center rounded bg-neutral-900 font-mono text-white ${
              highlight ? 'h-6 w-6 text-sm font-bold' : 'h-5 w-5 text-xs'
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
          {value.length}字
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onBlockChange(field, v);
        }}
        placeholder={placeholder}
        aria-label={label}
        rows={rows}
        className={`w-full rounded bg-white font-sans leading-relaxed placeholder:text-neutral-300 focus:outline-hidden ${
          highlight
            ? 'border-2 border-neutral-300 p-3.5 text-2xl font-medium text-neutral-950 focus:border-neutral-950 sm:text-3xl'
            : 'border border-neutral-200 p-3 text-lg text-neutral-900 focus:border-neutral-900 sm:text-xl'
        }`}
      />
    </div>
  );
}

export function StarStructureEditor({
  currentStarBlocks,
  onBlockChange,
  writeModeHref,
  onApplyBlocksToContent,
  hasUnappliedChanges = false,
  starGuideSlot,
}: StarStructureEditorProps) {
  const conclusionId = useId();
  const situationId = useId();
  const actionId = useId();
  const resultId = useId();
  const contributionId = useId();

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-5">
      {/* RSC Static Knowledge Guide Slot */}
      {starGuideSlot}

      <div className="flex flex-col gap-3 border-b border-neutral-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">STAR論理構成エディタ</h3>
          <p className="text-xs text-neutral-500 sm:text-sm">
            各項目で思考を整理できます。「本文エディタへ反映」を押すまで本文を誤って上書きすることはありません。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:self-center">
          {hasUnappliedChanges && (
            <span className="flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              <AlertCircle className="h-3.5 w-3.5" />
              未反映の変更あり
            </span>
          )}
          <a
            href={writeModeHref}
            onClick={onApplyBlocksToContent}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:px-4"
          >
            <span>本文エディタへ反映して執筆へ</span>
            <ArrowRight className="h-4 w-4" />
          </a>
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
}
