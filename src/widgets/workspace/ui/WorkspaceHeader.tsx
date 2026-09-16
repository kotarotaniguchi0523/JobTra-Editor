import React from 'react';
import {
  Menu,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Check,
  Loader2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { CopyCleanButton } from '@widgets/workspace/ui/CopyCleanButton';
import type { DraftSaveStatus } from '@entities/draft/model/draftStore';

interface WorkspaceHeaderProps {
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  onOpenSidebar: () => void;
  saveStatus: DraftSaveStatus;
  isAuditOpen: boolean;
  onToggleAudit: () => void;
  onOpenHandbook: () => void;
  copyContent: string | null;
  onOpenExport?: () => void;
}

export function WorkspaceHeader({
  brandSlot,
  linksSlot,
  onOpenSidebar,
  saveStatus,
  isAuditOpen,
  onToggleAudit,
  onOpenHandbook,
  copyContent,
  onOpenExport,
}: WorkspaceHeaderProps) {
  return (
    <header
      id="app-top-header"
      className="z-20 flex min-h-[48px] shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-2.5 py-1.5 sm:min-h-[52px] sm:px-4 sm:py-2"
    >
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="shrink-0 cursor-pointer rounded-md p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:p-2 lg:hidden"
          title="下書き一覧を開く"
          aria-label="下書き一覧を開く"
        >
          <Menu className="h-5 w-5" />
        </button>

        {brandSlot || (
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <a
              href="/"
              className="flex min-w-0 items-center gap-2 text-inherit no-underline sm:gap-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-mono text-xs font-bold tracking-wider text-white sm:h-8 sm:w-8 sm:text-sm">
                ES
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="truncate text-sm font-bold tracking-tight text-neutral-900 sm:text-base">
                    就活ESクラフト
                  </h1>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* 自動保存ステータス */}
        <div className="hidden shrink-0 items-center gap-1.5 border-r border-neutral-200 pr-2 text-xs whitespace-nowrap text-neutral-500 md:flex">
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

        {/* 静的リンクスロット (RSC) */}
        {linksSlot || (
          <a
            id="header-lp-link"
            href="/about"
            className="hidden shrink-0 items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 sm:flex"
            title="機能紹介・LPを見る"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>機能紹介</span>
          </a>
        )}

        {/* 推敲ハンドブック */}
        <button
          id="header-handbook-btn"
          type="button"
          onClick={onOpenHandbook}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-neutral-100 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 sm:gap-1.5 sm:px-2.5"
          title="STAR法・配分比率・推敲ガイドを開く"
        >
          <BookOpen className="h-3.5 w-3.5 shrink-0 text-neutral-600" />
          <span className="hidden sm:inline">推敲ガイド</span>
          <span className="sm:hidden">ガイド</span>
        </button>

        {/* 監査パネル展開トグル */}
        <button
          id="header-audit-toggle-btn"
          type="button"
          onClick={onToggleAudit}
          className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:gap-1.5 sm:px-2.5 ${
            isAuditOpen
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
          }`}
          title="リアルタイム日本語監査・推敲アドバイス"
        >
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
          <span className="hidden sm:inline">文章監査</span>
          <span className="sm:hidden">監査</span>
        </button>

        {/* エクスポート（ブラウザ内minitype PDF / Markdown） */}
        {onOpenExport && (
          <button
            id="header-export-btn"
            type="button"
            onClick={onOpenExport}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold whitespace-nowrap text-neutral-800 transition-colors hover:bg-neutral-100 sm:gap-1.5 sm:px-2.5"
            title="ブラウザ内minitypeによる日本語組版PDFやMarkdownでエクスポート"
          >
            <Download className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span className="hidden sm:inline">エクスポート</span>
            <span className="sm:hidden">出力</span>
          </button>
        )}

        {/* 提出用コピー */}
        <CopyCleanButton content={copyContent} />
      </div>
    </header>
  );
}
