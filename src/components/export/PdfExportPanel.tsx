'use client';

import { useActionState, useOptimistic, useState, useTransition } from 'react';
import type { FormEvent } from 'react';
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

type PdfExportState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const INITIAL_PDF_STATE: PdfExportState = { status: 'idle' };

interface PdfExportPanelProps {
  draft: ESDraft;
}

export function PdfExportPanel({ draft }: PdfExportPanelProps) {
  const [options, setOptions] = useState<PdfPanelOptions>(DEFAULT_PDF_OPTIONS);
  const [actionState, submitExport, isPending] = useActionState(
    async (): Promise<PdfExportState> => {
      const result = await downloadEsPdf(draft, options);

      if (result.success) return { status: 'success' };

      return {
        status: 'error',
        message:
          result.error ||
          'PDF生成に失敗しました。下の「ブラウザ印刷（PDF保存）」をご利用ください。',
      };
    },
    INITIAL_PDF_STATE,
  );
  const [optimisticState, setOptimisticState] = useOptimistic(
    actionState,
    (_currentState, nextState: PdfExportState) => nextState,
  );
  const [, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    startTransition(() => {
      setOptimisticState({ status: 'pending' });
      submitExport();
    });
  };

  const error: PdfExportError | null =
    optimisticState.status === 'error' ? { kind: 'error', message: optimisticState.message } : null;

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
      <form onSubmit={handleSubmit} className="pt-2">
        <PdfExportButton status={optimisticState.status} isPending={isPending} />
      </form>
    </div>
  );
}
