import { Check, Copy, Download } from 'lucide-react';

interface MarkdownExportActionsProps {
  isCopied: boolean;
  onDownload: () => void;
  onCopy: () => void;
}

export function MarkdownExportActions({
  isCopied,
  onDownload,
  onCopy,
}: MarkdownExportActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
      <button
        type="button"
        onClick={onDownload}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800"
      >
        <Download className="h-4 w-4" />
        <span>.md ファイルを保存</span>
      </button>
      <button
        type="button"
        onClick={onCopy}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
          isCopied
            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        {isCopied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span>コピーしました</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-neutral-500" />
            <span>Markdownをコピー</span>
          </>
        )}
      </button>
    </div>
  );
}
