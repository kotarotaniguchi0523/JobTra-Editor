import { useState, useTransition } from 'react';
import {
  Download,
  FileText,
  FileCode,
  Check,
  Loader2,
  X,
  ExternalLink,
  Printer,
  Sparkles,
  AlertCircle,
  Copy,
} from 'lucide-react';
import type { ESDraft } from '../types';
import { downloadEsPdf } from '../lib/pdfClient';
import { generateEsMarkdown, downloadFile } from '../lib/exportMarkdown';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: ESDraft;
}

export function ExportModal({ isOpen, onClose, draft }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'md'>('pdf');
  const [isPending, startTransition] = useTransition();

  // PDF options
  const [pdfIncludeStar, setPdfIncludeStar] = useState(true);
  const [pdfIncludeMeta, setPdfIncludeMeta] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Markdown options
  const [mdIncludeStar, setMdIncludeStar] = useState(true);
  const [mdIncludeMeta, setMdIncludeMeta] = useState(true);
  const [mdIncludeAudit, setMdIncludeAudit] = useState(true);

  // Copy status
  const [isCopied, setIsCopied] = useState(false);
  const [isPdfSuccess, setIsPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setPdfError(null);
    setIsPdfSuccess(false);

    startTransition(async () => {
      const result = await downloadEsPdf(draft, {
        includeStar: pdfIncludeStar,
        includeMeta: pdfIncludeMeta,
      });

      if (result.success) {
        setIsPdfSuccess(true);
        setTimeout(() => setIsPdfSuccess(false), 3000);
      } else {
        setPdfError(
          result.error ||
            'PDF生成に失敗しました。下の「ブラウザ印刷（PDF保存）」をご利用ください。',
        );
      }
    });
  };

  const handleDownloadMarkdown = () => {
    const mdContent = generateEsMarkdown(draft, {
      includeStar: mdIncludeStar,
      includeFrontmatter: mdIncludeMeta,
      includeAuditSummary: mdIncludeAudit,
    });

    const company = draft.companyName || '';
    const sanitizedCompany = company.replace(/[\s/\\:*?"<>|]+/g, '_');
    const sanitizedTitle = draft.title?.replace(/[\s/\\:*?"<>|]+/g, '_') || 'ES';
    const filename = sanitizedCompany
      ? `ES_${sanitizedCompany}_${sanitizedTitle}.md`
      : `ES_${sanitizedTitle}.md`;

    downloadFile(mdContent, filename, 'text/markdown');
  };

  const handleCopyMarkdown = async () => {
    const mdContent = generateEsMarkdown(draft, {
      includeStar: mdIncludeStar,
      includeFrontmatter: mdIncludeMeta,
      includeAuditSummary: mdIncludeAudit,
    });

    await navigator.clipboard.writeText(mdContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrintFallback = () => {
    window.print();
  };

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="export-modal-dialog"
        role="dialog"
        aria-labelledby="export-modal-title"
        aria-modal="true"
        className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white text-neutral-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-white">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-neutral-900">
                ドキュメントエクスポート
              </h2>
              <p className="text-xs text-neutral-500">
                minitypeによる日本語組版PDFやMarkdownファイルとして保存
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'pdf'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="h-4 w-4 text-amber-600" />
            <span>PDF 出力（minitype組版）</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
              公式推奨
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('md')}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'md'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileCode className="h-4 w-4 text-neutral-600" />
            <span>Markdown 出力 (.md)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'pdf' ? (
            <div className="space-y-4">
              {/* Feature highlight */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>TypeScript製組版エンジン「minitype」による本格組版</span>
                </div>
                <p className="mt-1 text-amber-800 leading-relaxed">
                  禁則処理、段落揃え、行間調整が施されたA4縦の就活提出用PDFを生成します。
                  面接官が読みやすいレイアウトで出力されます。
                </p>
              </div>

              {/* Document Summary */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">タイトル:</span>
                  <span className="font-semibold text-neutral-800 truncate max-w-[280px]">
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
                    {draft.content ? draft.content.replace(/\s/g, '').length : 0} 字 / 目標 {draft.targetCount || 400} 字
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold text-neutral-700">PDF出力オプション</span>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={pdfIncludeMeta}
                    onChange={(e) => setPdfIncludeMeta(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>応募先企業名・文字数・作成日などのメタ情報を上部に含める</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={pdfIncludeStar}
                    onChange={(e) => setPdfIncludeStar(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>STAR論理構成メモ（Situation, Task, Action, Result）を含める</span>
                </label>
              </div>

              {/* Error feedback */}
              {pdfError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">{pdfError}</p>
                    <button
                      type="button"
                      onClick={handlePrintFallback}
                      className="flex items-center gap-1 font-semibold text-red-900 underline hover:text-red-700"
                    >
                      <Printer className="h-3 w-3" />
                      <span>ブラウザの印刷ダイアログを開いてPDF保存する</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isPending}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all shadow-xs ${
                    isPdfSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : isPending
                        ? 'bg-neutral-600 cursor-not-allowed'
                        : 'bg-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>minitype で組版PDFを生成中...</span>
                    </>
                  ) : isPdfSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>PDFダウンロードが完了しました</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>PDF をダウンロード（minitype組版）</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Feature highlight */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-700 leading-relaxed">
                Notion、Obsidian、GitHub、各種テキストエディタで管理しやすい構造化Markdownファイル（.md）を出力します。
                YAMLフロントマターにより、応募履歴や文字数のメタデータも保持されます。
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold text-neutral-700">Markdown出力オプション</span>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={mdIncludeMeta}
                    onChange={(e) => setMdIncludeMeta(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>YAMLフロントマター（企業名・設問・更新日時メタデータ）を含める</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={mdIncludeStar}
                    onChange={(e) => setMdIncludeStar(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>STAR論理構成メモ（Situation / Task / Action / Result）を含める</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={mdIncludeAudit}
                    onChange={(e) => setMdIncludeAudit(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>推敲メモ・構成比率バランス情報を含める</span>
                </label>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>.md ファイルを保存</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
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
            </div>
          )}
        </div>

        {/* Footer Credit & Reference */}
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/80 px-5 py-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span>組版エンジン:</span>
            <a
              href="https://zenn.dev/inaniwaudon/articles/62f1def4bad627"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-neutral-700 underline hover:text-neutral-950"
            >
              <span>minitype by inaniwaudon</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded px-2.5 py-1 font-medium text-neutral-600 hover:text-neutral-900"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
