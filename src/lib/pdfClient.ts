import type { ESDraft } from '../types';
import { CATEGORY_LABELS } from '../types';
import { downloadFile } from './exportMarkdown';
import { getExportFilename } from './exportFilename';
import { generateEsPdf } from './exportPdf';

export interface PdfExportOptions {
  includeStar?: boolean;
  includeMeta?: boolean;
}

/**
 * サーバーを経由せず、ブラウザ内で就活ESのPDFを生成してダウンロードする。
 */
export async function downloadEsPdf(
  draft: ESDraft,
  options: PdfExportOptions = {},
): Promise<{ success: boolean; fallbackTriggered?: boolean; error?: string }> {
  const { includeStar = true, includeMeta = true } = options;
  const categoryLabel = CATEGORY_LABELS[draft.category] || draft.category;

  const company = draft.companyName || '';
  const filename = getExportFilename(draft, 'pdf');

  const currentCharCount = draft.content ? draft.content.replace(/\s/g, '').length : 0;

  try {
    const pdfBytes = await generateEsPdf({
      title: draft.title || 'エントリーシート',
      company: company || undefined,
      categoryLabel,
      targetCharCount: draft.targetCount || 400,
      currentCharCount,
      content: draft.content,
      star: draft.starBlocks,
      includeStar,
      includeMeta,
    });

    downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), filename, 'application/pdf');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF生成中にエラーが発生しました';
    console.warn('ブラウザ内PDF生成に失敗しました。フォールバック印刷を案内します:', err);
    return { success: false, fallbackTriggered: true, error: message };
  }
}
