'use client';

import { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import type { ESDraft } from '../../types';
import { downloadEsPdf } from '../../lib/pdfClient';
import { ExportDocumentSummary } from './ExportDocumentSummary';
import { PdfExportButton } from './PdfExportButton';
import { PdfExportFeedback, type PdfExportError } from './PdfExportFeedback';
import { PdfExportOptions, type PdfPanelOptions } from './PdfExportOptions';

const DEFAULT_PDF_OPTIONS: PdfPanelOptions = {
  includeStar: true,
  includeMeta: true,
};

interface PdfExportPanelProps {
  draft: ESDraft;
}

export function PdfExportPanel({ draft }: PdfExportPanelProps) {
  const [options, setOptions] = useState<PdfPanelOptions>(DEFAULT_PDF_OPTIONS);
  const [error, setError] = useState<PdfExportError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    setError(null);
    setIsSuccess(false);

    startTransition(async () => {
      const result = await downloadEsPdf(draft, options);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
        return;
      }

      setError({
        kind: 'error',
        message:
          result.error ||
          'PDF生成に失敗しました。下の「ブラウザ印刷（PDF保存）」をご利用ください。',
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>ブラウザ内TypeScript製組版エンジン「minitype」</span>
        </div>
        <p className="mt-1 leading-relaxed text-amber-800">
          禁則処理、段落揃え、行間調整が施されたA4縦の就活提出用PDFを生成します。
          面接官が読みやすいレイアウトで出力されます。
        </p>
      </div>

      <ExportDocumentSummary draft={draft} />
      <PdfExportOptions options={options} onChange={setOptions} />
      <PdfExportFeedback error={error} />
      <div className="pt-2">
        <PdfExportButton isPending={isPending} isSuccess={isSuccess} onClick={handleDownload} />
      </div>
    </div>
  );
}
