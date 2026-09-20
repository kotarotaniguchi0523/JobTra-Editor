'use client';

import {
  AlertTriangle,
  BookOpen,
  Check,
  Download,
  Link2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { CopyCleanButton } from '@widgets/workspace/ui/CopyCleanButton';
import { useWorkspaceInteraction } from '@widgets/workspace/ui/WorkspaceInteractionProvider';

export function WorkspaceHeaderActionsIsland() {
  const { activeDraft, saveStatus, openPanel, setPanel } = useWorkspaceInteraction();

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <div className="hidden shrink-0 items-center gap-1.5 border-r border-neutral-200 pr-2 text-xs whitespace-nowrap text-neutral-500 xl:flex">
        {saveStatus === 'saving' ? (
          <span className="flex items-center gap-1.5 text-neutral-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
            保存中...
          </span>
        ) : saveStatus === 'error' ? (
          <span
            className="flex items-center gap-1.5 text-rose-700"
            title="自動保存に失敗しました。ブラウザの保存領域を確認してください。"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            保存エラー
          </span>
        ) : (
          <span
            className="flex items-center gap-1.5 text-neutral-500"
            title="IndexedDBに自動保存されています"
          >
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            保存済み
          </span>
        )}
      </div>

      <button
        id="header-handbook-btn"
        type="button"
        onClick={() => setPanel('handbook')}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-neutral-100 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 sm:gap-1.5 sm:px-2.5"
        title="STAR法・配分比率・推敲ガイドを開く"
      >
        <BookOpen className="h-3.5 w-3.5 shrink-0 text-neutral-600" />
        <span className="hidden xl:inline">推敲ガイド</span>
      </button>

      <button
        id="header-audit-toggle-btn"
        type="button"
        onClick={() => setPanel(openPanel === 'audit' ? null : 'audit')}
        className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:gap-1.5 sm:px-2.5 ${
          openPanel === 'audit'
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
        }`}
        title="リアルタイム日本語監査・推敲アドバイス"
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
        <span className="hidden xl:inline">文章監査</span>
      </button>

      {activeDraft && (
        <button
          id="header-export-btn"
          type="button"
          onClick={() => setPanel('export')}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold whitespace-nowrap text-neutral-800 transition-colors hover:bg-neutral-100 sm:gap-1.5 sm:px-2.5"
          title="ブラウザ内minitypeによる日本語組版PDFやMarkdownでエクスポート"
        >
          <Download className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span className="hidden xl:inline">エクスポート</span>
        </button>
      )}

      <button
        id="header-device-sync-btn"
        type="button"
        onClick={() => setPanel('sync')}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold whitespace-nowrap text-neutral-800 transition-colors hover:bg-neutral-100 sm:gap-1.5 sm:px-2.5"
        title="QRコードで別の端末と下書きを同期"
      >
        <Link2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <span className="hidden xl:inline">端末同期</span>
      </button>

      <CopyCleanButton content={activeDraft?.content || null} />
    </div>
  );
}
