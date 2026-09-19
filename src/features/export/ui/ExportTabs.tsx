import { FileCode, FileText } from 'lucide-react';

export type ExportTab = 'pdf' | 'md';

interface ExportTabsProps {
  activeTab: ExportTab;
  onTabChange: (tab: ExportTab) => void;
}

export function ExportTabs({ activeTab, onTabChange }: ExportTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="エクスポート形式"
      className="flex border-b border-neutral-200 bg-neutral-50 px-5 pt-3"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'pdf'}
        onClick={() => onTabChange('pdf')}
        className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
          activeTab === 'pdf'
            ? 'border-neutral-900 text-neutral-900'
            : 'border-transparent text-neutral-500 hover:text-neutral-800'
        }`}
      >
        <FileText className="h-4 w-4 text-amber-600" />
        <span>PDF 出力（ブラウザ内minitype組版）</span>
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
          公式推奨
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'md'}
        onClick={() => onTabChange('md')}
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
  );
}
