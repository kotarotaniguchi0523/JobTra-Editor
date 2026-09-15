import type { ESDraft } from '../types';
import { CATEGORY_LABELS } from '../types';
import { downloadFile } from './exportMarkdown';

export interface PdfExportOptions {
  includeStar?: boolean;
  includeMeta?: boolean;
}

/**
 * minitype API を呼び出して就活ESのPDFをダウンロードする
 */
export async function downloadEsPdf(
  draft: ESDraft,
  options: PdfExportOptions = {},
): Promise<{ success: boolean; fallbackTriggered?: boolean; error?: string }> {
  const { includeStar = true, includeMeta = true } = options;
  const categoryLabel = CATEGORY_LABELS[draft.category] || draft.category;

  const company = draft.companyName || '';
  const sanitizedCompany = company.replace(/[\s/\\:*?"<>|]+/g, '_');
  const sanitizedTitle = draft.title?.replace(/[\s/\\:*?"<>|]+/g, '_') || 'ES';
  const filename = sanitizedCompany
    ? `ES_${sanitizedCompany}_${sanitizedTitle}.pdf`
    : `ES_${sanitizedTitle}.pdf`;

  const currentCharCount = draft.content ? draft.content.replace(/\s/g, '').length : 0;

  try {
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: draft.title || 'エントリーシート',
        company: company || undefined,
        categoryLabel,
        targetCharCount: draft.targetCount || 400,
        currentCharCount,
        content: draft.content,
        star: draft.starBlocks,
        includeStar,
        includeMeta,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PDF生成サーバーエラー (${response.status}): ${errorText}`);
    }

    const blob = await response.blob();
    downloadFile(blob, filename, 'application/pdf');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF生成中にエラーが発生しました';
    console.warn('minitype PDF API呼び出しに失敗しました。フォールバック印刷を案内します:', err);
    return { success: false, fallbackTriggered: true, error: message };
  }
}
