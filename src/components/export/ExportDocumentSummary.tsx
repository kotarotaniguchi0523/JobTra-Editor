import type { ESDraft } from '../../types';

interface ExportDocumentSummaryProps {
  draft: ESDraft;
}

function countNonWhitespace(text: string): number {
  return text.replace(/\s/g, '').length;
}

export function ExportDocumentSummary({ draft }: ExportDocumentSummaryProps) {
  const currentCharCount = countNonWhitespace(draft.content || '');

  return (
    <section
      aria-label="ドキュメント概要"
      className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs"
    >
      <div className="flex justify-between">
        <span className="text-neutral-500">タイトル:</span>
        <span className="max-w-[280px] truncate font-semibold text-neutral-800">
          {draft.title || '無題のエントリーシート'}
        </span>
      </div>
      {draft.companyName && (
        <div className="flex justify-between">
          <span className="text-neutral-500">応募先企業:</span>
          <span className="font-medium text-neutral-800">{draft.companyName}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-neutral-500">文字数:</span>
        <span className="font-mono text-neutral-800">
          {currentCharCount} 字 / 目標 {draft.targetCount || 400} 字
        </span>
      </div>
    </section>
  );
}
