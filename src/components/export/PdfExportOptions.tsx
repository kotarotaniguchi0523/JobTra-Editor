export interface PdfPanelOptions {
  includeStar: boolean;
  includeMeta: boolean;
}

interface PdfExportOptionsProps {
  options: PdfPanelOptions;
  onChange: (options: PdfPanelOptions) => void;
}

export function PdfExportOptions({ options, onChange }: PdfExportOptionsProps) {
  return (
    <fieldset className="space-y-2.5 pt-1">
      <legend className="text-xs font-bold text-neutral-700">PDF出力オプション</legend>
      <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
        <input
          type="checkbox"
          checked={options.includeMeta}
          onChange={(event) => onChange({ ...options, includeMeta: event.target.checked })}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <span>応募先企業名・文字数・作成日などのメタ情報を上部に含める</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
        <input
          type="checkbox"
          checked={options.includeStar}
          onChange={(event) => onChange({ ...options, includeStar: event.target.checked })}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <span>STAR論理構成メモ（Situation, Task, Action, Result）を含める</span>
      </label>
    </fieldset>
  );
}
