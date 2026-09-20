import type { ESDraft } from '@entities/draft/model/types';
import { getCategoryLabel } from '@entities/draft/model/categoryLabels';
import { downloadFile } from '@features/export/lib/exportDownload';
import { getExportFilename } from '@features/export/lib/exportFilename';
import { generateEsPdf } from '@features/export/lib/exportPdf';
import { countNonWhitespaceCharacters } from '@shared/lib/text';
import type { PdfExportOptions } from '@features/export/model/types';

/**
 * サーバーを経由せず、ブラウザ内で就活ESのPDFを生成してダウンロードする。
 */
export async function downloadEsPdf(
  draft: ESDraft,
  options: PdfExportOptions = {},
): Promise<{ success: boolean; fallbackTriggered?: boolean; error?: string }> {
  const { includeStar = true, includeMeta = true } = options;
  const categoryLabel = getCategoryLabel(draft.category);

  const company = draft.companyName || '';
  const filename = getExportFilename(draft, 'pdf');

  const currentCharCount = countNonWhitespaceCharacters(draft.content);
  const exportedAt = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const pdfBytes = await generateEsPdf({
      title: draft.title || 'エントリーシート',
      company: company || undefined,
      categoryLabel,
      targetCharCount: draft.targetCount ?? undefined,
      currentCharCount,
      content: draft.content,
      exportedAt,
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
