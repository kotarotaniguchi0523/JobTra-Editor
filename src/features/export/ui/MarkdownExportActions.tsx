import { AlertCircle, Check, Copy, Download, Loader2 } from 'lucide-react';
interface MarkdownExportActionsProps {
  isCopied: boolean;
  isDownloadPending: boolean;
  isCopyPending: boolean;
  errorMessage: string | null;
  onDownload: (formData: FormData) => void;
  onCopy: (formData: FormData) => void;
}

export function MarkdownExportActions({
  isCopied,
  isDownloadPending,
  isCopyPending,
  errorMessage,
  onDownload,
  onCopy,
}: MarkdownExportActionsProps) {
  return (
    <div className="space-y-2 pt-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <form action={onDownload}>
          <button
            type="submit"
            disabled={isDownloadPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-600"
          >
            {isDownloadPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>.md ファイルを保存</span>
              </>
            )}
          </button>
        </form>
        <form action={onCopy}>
          <button
            type="submit"
            disabled={isCopyPending}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
              isCopied
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {isCopyPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>コピー中...</span>
              </>
            ) : isCopied ? (
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
        </form>
      </div>
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
