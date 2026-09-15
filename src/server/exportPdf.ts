import { minitype, mdString } from '@minitype/minitype';

export interface ExportPdfOptions {
  title: string;
  company?: string;
  categoryLabel: string;
  targetCharCount: number;
  currentCharCount: number;
  content: string;
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

/**
 * minitype を用いたエントリーシートの日本語組版PDFバイナリ生成
 */
export async function generateEsPdf(options: ExportPdfOptions): Promise<Uint8Array> {
  const {
    title,
    company,
    categoryLabel,
    targetCharCount,
    currentCharCount,
    content,
    star,
    includeStar = true,
    includeMeta = true,
  } = options;

  const nowStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // minitype 向け Markdown テンプレートの構築
  const lines: string[] = [];

  // メインタイトル
  lines.push(`# ${title || 'エントリーシート'}`);
  lines.push('');

  // メタ情報ボックス
  if (includeMeta) {
    if (company) {
      lines.push(`- **応募先企業**: ${company}`);
    }
    lines.push(`- **設問カテゴリ**: ${categoryLabel}`);
    lines.push(
      `- **文字数**: ${currentCharCount} 字 / 目標 ${targetCharCount} 字（充足率: ${Math.round((currentCharCount / (targetCharCount || 1)) * 100)}%）`,
    );
    lines.push(`- **作成日**: ${nowStr}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // 本文
  lines.push('## 本文');
  lines.push('');
  const contentParagraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0);
  if (contentParagraphs.length > 0) {
    for (const para of contentParagraphs) {
      // 内部改行はそのまま保持
      lines.push(para.trim());
      lines.push('');
    }
  } else if (content.trim()) {
    lines.push(content.trim());
    lines.push('');
  } else {
    lines.push('（本文未記入）');
    lines.push('');
  }

  // STAR論理構成（オプション指定時）
  if (
    includeStar &&
    star &&
    (star.conclusion || star.situation || star.task || star.action || star.result || star.contribution)
  ) {
    lines.push('---');
    lines.push('');
    lines.push('## STAR論理構成メモ');
    lines.push('');
    if (star.conclusion) {
      lines.push(`### 結論（核となる強み・アピール）`);
      lines.push(star.conclusion.trim());
      lines.push('');
    }
    if (star.situation) {
      lines.push(`### 1. Situation（背景・状況）`);
      lines.push(star.situation.trim());
      lines.push('');
    }
    if (star.task) {
      lines.push(`### 2. Task（直面した課題・目標）`);
      lines.push(star.task.trim());
      lines.push('');
    }
    if (star.action) {
      lines.push(`### 3. Action（工夫した具体的な行動）`);
      lines.push(star.action.trim());
      lines.push('');
    }
    if (star.result) {
      lines.push(`### 4. Result（結果・定量的成果・学び）`);
      lines.push(star.result.trim());
      lines.push('');
    }
    if (star.contribution) {
      lines.push(`### 貢献（入社後の活かし方）`);
      lines.push(star.contribution.trim());
      lines.push('');
    }
  }

  lines.push('');
  lines.push('---');
  lines.push(
    '*生成元: 就活ESクラフト (Typeset with minitype)*',
  );

  const markdownSource = lines.join('\n');
  const { blocks } = mdString(markdownSource);

  const doc = minitype(
    [
      {
        body: blocks,
      },
    ],
    {
      size: 'A4',
    },
  );

  return await doc.toPdf();
}
