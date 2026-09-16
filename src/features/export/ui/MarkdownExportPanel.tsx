import { useActionState, useState } from 'react';
import type { ESDraft } from '@entities/draft/model/types';
import { downloadFile, generateEsMarkdown } from '@features/export/lib/exportMarkdown';
import { getExportFilename } from '@features/export/lib/exportFilename';
import { MarkdownExportActions } from '@features/export/ui/MarkdownExportActions';
import {
  MarkdownExportOptions,
  type MarkdownPanelOptions,
} from '@features/export/ui/MarkdownExportOptions';

const DEFAULT_MARKDOWN_OPTIONS: MarkdownPanelOptions = {
  includeStar: true,
  includeMeta: true,
  includeAudit: true,
};

type MarkdownActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const INITIAL_MARKDOWN_STATE: MarkdownActionState = { status: 'idle' };

interface MarkdownExportPanelProps {
  draft: ESDraft;
}

export function MarkdownExportPanel({ draft }: MarkdownExportPanelProps) {
  const [options, setOptions] = useState<MarkdownPanelOptions>(DEFAULT_MARKDOWN_OPTIONS);

  const buildMarkdown = () =>
    generateEsMarkdown(draft, {
      includeStar: options.includeStar,
      includeFrontmatter: options.includeMeta,
      includeAuditSummary: options.includeAudit,
    });

  const [downloadState, submitDownload, isDownloadPending] = useActionState(
    async (_previousState: MarkdownActionState): Promise<MarkdownActionState> => {
      try {
        downloadFile(buildMarkdown(), getExportFilename(draft, 'md'), 'text/markdown');
        return { status: 'success' };
      } catch (error) {
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Markdown保存に失敗しました。',
        };
      }
    },
    INITIAL_MARKDOWN_STATE,
  );
  const [copyState, submitCopy, isCopyPending] = useActionState(
    async (_previousState: MarkdownActionState): Promise<MarkdownActionState> => {
      try {
        await navigator.clipboard.writeText(buildMarkdown());
        return { status: 'success' };
      } catch (error) {
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Markdownのコピーに失敗しました。',
        };
      }
    },
    INITIAL_MARKDOWN_STATE,
  );
  const errorMessage =
    copyState.status === 'error'
      ? copyState.message
      : downloadState.status === 'error'
        ? downloadState.message
        : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs leading-relaxed text-neutral-700">
        Notion、Obsidian、GitHub、各種テキストエディタで管理しやすい構造化Markdownファイル（.md）を出力します。
        YAMLフロントマターにより、応募履歴や文字数のメタデータも保持されます。
      </div>
      <MarkdownExportOptions options={options} onChange={setOptions} />
      <MarkdownExportActions
        isCopied={copyState.status === 'success'}
        isDownloadPending={isDownloadPending}
        isCopyPending={isCopyPending}
        errorMessage={errorMessage}
        onDownload={submitDownload}
        onCopy={submitCopy}
      />
    </div>
  );
}
