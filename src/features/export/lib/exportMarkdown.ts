import type { ESDraft } from '@entities/draft/model/types';
import { getCategoryLabel } from '@entities/draft/model/categoryLabels';
import { parseMarkdownYamlString } from './exportSchemas';
import { countNonWhitespaceCharacters } from '@shared/lib/text';
import type { MarkdownExportOptions } from '@features/export/model/types';

/**
 * 下書きデータから構造化されたMarkdownテキストを生成する
 */
export function generateEsMarkdown(draft: ESDraft, options: MarkdownExportOptions): string {
  const {
    includeStar = true,
    includeAuditSummary = true,
    includeFrontmatter = true,
    exportedAt,
  } = options;

  const categoryLabel = getCategoryLabel(draft.category);
  const company = draft.companyName || (draft as unknown as { company?: string }).company || '';
  const targetCount =
    draft.targetCount ?? (draft as unknown as { targetCharCount?: number }).targetCharCount ?? null;
  const currentCount = countNonWhitespaceCharacters(draft.content);
  const star =
    draft.starBlocks ||
    (
      draft as unknown as {
        starStructure?: {
          situation?: string;
          task?: string;
          action?: string;
          result?: string;
          conclusion?: string;
          contribution?: string;
        };
      }
    ).starStructure;

  const lines: string[] = [];

  if (includeFrontmatter) {
    lines.push('---');
    lines.push(`title: "${parseMarkdownYamlString(draft.title || '無題')}"`);
    if (company) {
      lines.push(`company: "${parseMarkdownYamlString(company)}"`);
    }
    lines.push(`category: "${draft.category ?? ''}"`);
    lines.push(`category_label: "${categoryLabel}"`);
    if (targetCount) lines.push(`target_char_count: ${targetCount}`);
    lines.push(`current_char_count: ${currentCount}`);
    lines.push(`updated_at: "${new Date(draft.updatedAt).toISOString()}"`);
    lines.push(`exported_at: "${exportedAt}"`);
    lines.push('---');
    lines.push('');
  }

  // タイトル
  lines.push(`# ${draft.title || 'エントリーシート'}`);
  lines.push('');

  // メタ情報
  lines.push(`- **応募先企業**: ${company || '未指定'}`);
  lines.push(`- **設問カテゴリ**: ${categoryLabel}`);
  lines.push(
    targetCount
      ? `- **文字数**: ${currentCount} 字 / 上限 ${targetCount} 字（${Math.round((currentCount / targetCount) * 100)}%）`
      : `- **文字数**: ${currentCount} 字 / 上限未設定`,
  );
  lines.push('');

  // 本文
  lines.push('## 本文');
  lines.push('');
  if (draft.content.trim()) {
    lines.push(draft.content.trim());
  } else {
    lines.push('（本文未記入）');
  }
  lines.push('');

  // STAR論理構成
  if (includeStar && star) {
    const hasAnyStar =
      Boolean(star.conclusion) ||
      Boolean(star.situation) ||
      Boolean((star as unknown as { task?: string }).task) ||
      Boolean(star.action) ||
      Boolean(star.result) ||
      Boolean(star.contribution);

    if (hasAnyStar) {
      lines.push('## STAR論理構成');
      lines.push('');
      if (star.conclusion) {
        lines.push('### Conclusion（結論・核となる強み）');
        lines.push(star.conclusion.trim());
        lines.push('');
      }
      if (star.situation) {
        lines.push('### Situation（状況・直面した課題）');
        lines.push(star.situation.trim());
        lines.push('');
      }
      const taskText = (star as unknown as { task?: string }).task;
      if (taskText) {
        lines.push('### Task（課題・目標）');
        lines.push(taskText.trim());
        lines.push('');
      }
      if (star.action) {
        lines.push('### Action（工夫した具体的な行動）');
        lines.push(star.action.trim());
        lines.push('');
      }
      if (star.result) {
        lines.push('### Result（成果・定量的変化・学び）');
        lines.push(star.result.trim());
        lines.push('');
      }
      if (star.contribution) {
        lines.push('### Contribution（入社後の活かし方・貢献）');
        lines.push(star.contribution.trim());
        lines.push('');
      }
    }
  }

  // 推敲メモ・スナップショット
  if (includeAuditSummary) {
    lines.push('## 推敲メモ');
    lines.push('');
    const ratios = (
      draft as unknown as {
        ratios?: { situation?: number; task?: number; action?: number; result?: number };
      }
    ).ratios;
    if (ratios) {
      lines.push(`- **比率バランス**:`);
      lines.push(
        `  - 状況: ${ratios.situation || 0}% / 課題: ${ratios.task || 0}% / 行動: ${ratios.action || 0}% / 成果: ${ratios.result || 0}%`,
      );
    }
    if (draft.snapshots && draft.snapshots.length > 0) {
      lines.push(`- **保存スナップショット数**: ${draft.snapshots.length} 件`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Exported from 就活ESクラフト*');

  return lines.join('\n');
}
