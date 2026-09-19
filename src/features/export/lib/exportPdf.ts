import type { BrowserFontData } from '@minitype/minitype';

export interface ExportPdfOptions {
  title: string;
  company?: string;
  categoryLabel: string;
  targetCharCount?: number;
  currentCharCount: number;
  content: string;
  exportedAt: string;
  star?: {
    conclusion?: string;
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    contribution?: string;
  };
  includeStar?: boolean;
  includeMeta?: boolean;
}

const FONT_URLS = [
  {
    fontKey: 'SourceHanSerifJP-Regular' as const,
    url: new URL(
      '../../node_modules/@minitype/minitype/fonts/SourceHanSerifJP-Regular.otf',
      import.meta.url,
    ),
  },
  {
    fontKey: 'SourceHanSerifJP-Bold' as const,
    url: new URL(
      '../../node_modules/@minitype/minitype/fonts/SourceHanSerifJP-Bold.otf',
      import.meta.url,
    ),
  },
] satisfies ReadonlyArray<{
  fontKey: BrowserFontData['fontKey'];
  url: URL;
}>;

let browserFontsPromise: Promise<BrowserFontData[]> | undefined;

async function loadBrowserFonts(): Promise<BrowserFontData[]> {
  if (!browserFontsPromise) {
    browserFontsPromise = Promise.all(
      FONT_URLS.map(async ({ fontKey, url }) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`PDFフォントの読み込みに失敗しました (${response.status})`);
        }

        return {
          fontKey,
          data: await response.arrayBuffer(),
        };
      }),
    ).catch((error: unknown) => {
      browserFontsPromise = undefined;
      throw error;
    });
  }

  return browserFontsPromise;
}

/**
 * ブラウザ用minitypeに渡す、就活ESのMarkdownソースを組み立てる。
 */
export function buildEsPdfMarkdown(options: ExportPdfOptions): string {
  const {
    title,
    company,
    categoryLabel,
    targetCharCount,
    currentCharCount,
    content,
    exportedAt,
    star,
    includeStar = true,
    includeMeta = true,
  } = options;

  const lines: string[] = [`# ${title || 'エントリーシート'}`, ''];

  if (includeMeta) {
    if (company) {
      lines.push(`- **応募先企業**: ${company}`);
    }
    lines.push(`- **設問カテゴリ**: ${categoryLabel}`);
    lines.push(
      targetCharCount
        ? `- **文字数**: ${currentCharCount} 字 / 上限 ${targetCharCount} 字（充足率: ${Math.round((currentCharCount / targetCharCount) * 100)}%）`
        : `- **文字数**: ${currentCharCount} 字 / 上限未設定`,
    );
    lines.push(`- **作成日**: ${exportedAt}`);
    lines.push('', '---', '');
  }

  lines.push('## 本文', '');
  const contentParagraphs = content
    .split(/\n\n+/)
    .filter((paragraph) => paragraph.trim().length > 0);
  if (contentParagraphs.length > 0) {
    for (const paragraph of contentParagraphs) {
      lines.push(paragraph.trim(), '');
    }
  } else {
    lines.push('（本文未記入）', '');
  }

  const hasStar =
    star &&
    (star.conclusion ||
      star.situation ||
      star.task ||
      star.action ||
      star.result ||
      star.contribution);

  if (includeStar && hasStar) {
    lines.push('---', '', '## STAR論理構成メモ', '');
    if (star.conclusion) {
      lines.push('### 結論（核となる強み・アピール）', star.conclusion.trim(), '');
    }
    if (star.situation) {
      lines.push('### 1. Situation（背景・状況）', star.situation.trim(), '');
    }
    if (star.task) {
      lines.push('### 2. Task（直面した課題・目標）', star.task.trim(), '');
    }
    if (star.action) {
      lines.push('### 3. Action（工夫した具体的な行動）', star.action.trim(), '');
    }
    if (star.result) {
      lines.push('### 4. Result（結果・定量的成果・学び）', star.result.trim(), '');
    }
    if (star.contribution) {
      lines.push('### 貢献（入社後の活かし方）', star.contribution.trim(), '');
    }
  }

  lines.push('', '---', '*生成元: 就活ESクラフト (Typeset with minitype)');
  return lines.join('\n');
}

/**
 * サーバーを経由せず、ブラウザ内のminitypeで日本語組版PDFを生成する。
 */
export async function generateEsPdf(options: ExportPdfOptions): Promise<Uint8Array> {
  const [{ minitype, mdString }, fonts] = await Promise.all([
    import('@minitype/minitype'),
    loadBrowserFonts(),
  ]);
  const { blocks } = mdString(buildEsPdfMarkdown(options));
  const document = minitype(
    [{ body: blocks }],
    { size: 'A4' },
    {
      fonts,
      metadata: {
        title: options.title || 'エントリーシート',
        author: '就活ESクラフト',
        subject: 'エントリーシート',
        keywords: '就活, エントリーシート, ES',
      },
    },
  );

  return document.toPdf();
}
