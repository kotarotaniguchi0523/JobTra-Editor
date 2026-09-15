"use client";

import React, { memo } from 'react';
import {
  Menu,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Check,
  Copy,
  Loader2,
} from 'lucide-react';

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

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = memo(({
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
      className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between shrink-0 z-20"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="下書き一覧を開く"
          aria-label="下書き一覧を開く"
        >
          <Menu className="w-5 h-5" />
        </button>

        {brandSlot || (
          <div className="flex items-center gap-2.5">
            <a href="/" className="flex items-center gap-2.5 text-inherit no-underline">
              <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider">
                ES
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-neutral-900 tracking-tight">
                    就活ESクラフト
                  </h1>
                  {isPending && (
                    <span className="flex items-center gap-1 text-xs text-neutral-400 font-medium animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
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
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 pr-2 border-r border-neutral-200">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
              保存中...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-neutral-500" title="IndexedDBに自動保存されています">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              保存済み
            </span>
          )}
        </div>

        {/* 静的リンクスロット (RSC) */}
        {linksSlot || (
          <a
            id="header-lp-link"
            href="/about"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            title="機能紹介・LPを見る"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>機能紹介</span>
          </a>
        )}

        {/* 推敲ハンドブック */}
        <button
          id="header-handbook-btn"
          type="button"
          onClick={onOpenHandbook}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          title="STAR法・配分比率・推敲ガイドを開く"
        >
          <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
          <span>推敲ガイド</span>
        </button>

        {/* 監査パネル展開トグル */}
        <button
          id="header-audit-toggle-btn"
          type="button"
          onClick={onToggleAudit}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
            isAuditOpen
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
          }`}
          title="リアルタイム日本語監査・推敲アドバイス"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span className="hidden sm:inline">文章監査</span>
        </button>

        {/* 提出用コピー */}
        <button
          id="clean-copy-btn"
          type="button"
          onClick={onCopyClean}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            isCopied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
          title="余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>提出用にコピー</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
});
