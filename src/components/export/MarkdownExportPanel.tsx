'use client';

import { useState } from 'react';
import type { ESDraft } from '../../types';
import { downloadFile, generateEsMarkdown } from '../../lib/exportMarkdown';
import { getExportFilename } from '../../lib/exportFilename';
import { MarkdownExportActions } from './MarkdownExportActions';
import { MarkdownExportOptions, type MarkdownPanelOptions } from './MarkdownExportOptions';

const DEFAULT_MARKDOWN_OPTIONS: MarkdownPanelOptions = {
  includeStar: true,
  includeMeta: true,
  includeAudit: true,
};

interface MarkdownExportPanelProps {
  draft: ESDraft;
}

export function MarkdownExportPanel({ draft }: MarkdownExportPanelProps) {
  const [options, setOptions] = useState<MarkdownPanelOptions>(DEFAULT_MARKDOWN_OPTIONS);
  const [isCopied, setIsCopied] = useState(false);

  const buildMarkdown = () =>
    generateEsMarkdown(draft, {
      includeStar: options.includeStar,
      includeFrontmatter: options.includeMeta,
      includeAuditSummary: options.includeAudit,
    });

  const handleDownload = () => {
    downloadFile(buildMarkdown(), getExportFilename(draft, 'md'), 'text/markdown');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildMarkdown());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs leading-relaxed text-neutral-700">
        Notion、Obsidian、GitHub、各種テキストエディタで管理しやすい構造化Markdownファイル（.md）を出力します。
        YAMLフロントマターにより、応募履歴や文字数のメタデータも保持されます。
      </div>
      <MarkdownExportOptions options={options} onChange={setOptions} />
      <MarkdownExportActions isCopied={isCopied} onDownload={handleDownload} onCopy={handleCopy} />
    </div>
  );
}
