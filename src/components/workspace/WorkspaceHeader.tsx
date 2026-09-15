'use client';

import React, { memo } from 'react';
import { Menu, Sparkles, BookOpen, ShieldCheck, Check, Copy, Loader2 } from 'lucide-react';

interface WorkspaceHeaderProps {
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  onOpenSidebar: () => void;
  isPending: boolean;
  isSaving: boolean;
  isAuditOpen: boolean;
  onToggleAudit: () => void;
  onOpenHandbook: () => void;
  isCopied: boolean;
  onCopyClean: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = memo(
  ({
    brandSlot,
    linksSlot,
    onOpenSidebar,
    isPending,
    isSaving,
    isAuditOpen,
    onToggleAudit,
    onOpenHandbook,
    isCopied,
    onCopyClean,
  }) => {
    return (
      <header
        id="app-top-header"
        className="z-20 flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="cursor-pointer rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            title="下書き一覧を開く"
            aria-label="下書き一覧を開く"
          >
            <Menu className="h-5 w-5" />
          </button>

          {brandSlot || (
            <div className="flex items-center gap-2.5">
              <a href="/" className="flex items-center gap-2.5 text-inherit no-underline">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 font-mono text-sm font-bold tracking-wider text-white">
                  ES
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold tracking-tight text-neutral-900">
                      就活ESクラフト
                    </h1>
                    {isPending && (
                      <span className="flex animate-pulse items-center gap-1 text-xs font-medium text-neutral-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        同期中
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 自動保存ステータス */}
          <div className="hidden items-center gap-1.5 border-r border-neutral-200 pr-2 text-xs text-neutral-500 md:flex">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-neutral-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
                保存中...
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
              className="hidden items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 sm:flex"
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
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
            title="STAR法・配分比率・推敲ガイドを開く"
          >
            <BookOpen className="h-3.5 w-3.5 text-neutral-600" />
            <span>推敲ガイド</span>
          </button>

          {/* 監査パネル展開トグル */}
          <button
            id="header-audit-toggle-btn"
            type="button"
            onClick={onToggleAudit}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              isAuditOpen
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
            title="リアルタイム日本語監査・推敲アドバイス"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-500" />
            <span className="hidden sm:inline">文章監査</span>
          </button>

          {/* 提出用コピー */}
          <button
            id="clean-copy-btn"
            type="button"
            onClick={onCopyClean}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
            title="余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>提出用にコピー</span>
              </>
            )}
          </button>
        </div>
      </header>
    );
  },
);
