import { Check, Download, Loader2 } from 'lucide-react';

interface PdfExportButtonProps {
  status: 'idle' | 'pending' | 'success' | 'error';
  isPending: boolean;
}

export function PdfExportButton({ status, isPending }: PdfExportButtonProps) {
  const isSuccess = status === 'success';
  const buttonClass = isSuccess
    ? 'bg-emerald-600 hover:bg-emerald-700'
    : isPending
      ? 'cursor-not-allowed bg-neutral-600'
      : 'bg-neutral-900 hover:bg-neutral-800';

  return (
    <button
      type="submit"
      disabled={isPending}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-xs transition-all ${buttonClass}`}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>ブラウザ内minitype で組版PDFを生成中...</span>
        </>
      ) : isSuccess ? (
        <>
          <Check className="h-4 w-4" />
          <span>PDFダウンロードが完了しました</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>PDF をダウンロード（ブラウザ内minitype組版）</span>
        </>
      )}
    </button>
  );
}
