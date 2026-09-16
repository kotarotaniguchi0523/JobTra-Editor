export interface MarkdownPanelOptions {
  includeStar: boolean;
  includeMeta: boolean;
  includeAudit: boolean;
}

interface MarkdownExportOptionsProps {
  options: MarkdownPanelOptions;
  onChange: (options: MarkdownPanelOptions) => void;
}

export function MarkdownExportOptions({ options, onChange }: MarkdownExportOptionsProps) {
  return (
    <fieldset className="space-y-2.5 pt-1">
      <legend className="text-xs font-bold text-neutral-700">Markdown出力オプション</legend>
      <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
        <input
          type="checkbox"
          checked={options.includeMeta}
          onChange={(event) => onChange({ ...options, includeMeta: event.target.checked })}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <span>YAMLフロントマター（企業名・設問・更新日時メタデータ）を含める</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
        <input
          type="checkbox"
          checked={options.includeStar}
          onChange={(event) => onChange({ ...options, includeStar: event.target.checked })}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <span>STAR論理構成メモ（Situation / Task / Action / Result）を含める</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
        <input
          type="checkbox"
          checked={options.includeAudit}
          onChange={(event) => onChange({ ...options, includeAudit: event.target.checked })}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <span>推敲メモ・構成比率バランス情報を含める</span>
      </label>
    </fieldset>
  );
}
