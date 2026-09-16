import { AlertCircle, Printer } from 'lucide-react';
import { printCurrentPage } from '@features/export/lib/exportActions';

export interface PdfExportError {
  kind: 'error';
  message: string;
}

interface PdfExportFeedbackProps {
  error: PdfExportError | null;
}

export function PdfExportFeedback({ error }: PdfExportFeedbackProps) {
  if (!error) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <div className="space-y-1">
        <p className="font-medium">{error.message}</p>
        <button
          type="button"
          onClick={printCurrentPage}
          className="flex items-center gap-1 font-semibold text-red-900 underline hover:text-red-700"
        >
          <Printer className="h-3 w-3" />
          <span>ブラウザの印刷ダイアログを開いてPDF保存する</span>
        </button>
      </div>
    </div>
  );
}
