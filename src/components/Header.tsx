"use client";

import React, { useTransition, memo } from 'react';
import { 
  Menu, 
  Check, 
  Copy, 
  Loader2,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenHandbook: () => void;
  isSaving: boolean;
  isPending: boolean;
  isCopied: boolean;
  onCopyClean: () => void;
  lastSavedText?: string;
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = memo(({
  onToggleMobileSidebar,
  onOpenHandbook,
  isSaving,
  isPending,
  isCopied,
  onCopyClean,
  lastSavedText,
  brandSlot,
  linksSlot,
}) => {
  const [, startTransition] = useTransition();
  return (
    <header
      id="app-top-header"
      className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30"
    >
      <div className="flex items-center gap-3.5">
        {/* Mobile menu toggle */}
        <button
          id="toggle-mobile-menu-btn"
          type="button"
          onClick={() => {
            startTransition(() => {
              onToggleMobileSidebar();
            });
          }}
          className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="下書き一覧を開く"
          aria-label="下書き一覧を開く"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand identity (RSC slot preferred) */}
        {brandSlot ? (
          <div className="flex items-center gap-2">
            {brandSlot}
            {isPending && (
              <span className="flex items-center gap-1 text-xs text-neutral-400 font-medium animate-pulse ml-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                処理中
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
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
                    処理中
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                思考をクリアにし、推敲を深めるエントリーシート執筆スタジオ
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Tools */}
      <div className="flex items-center gap-2.5">
        {/* Autosave status */}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-neutral-500 pr-2.5 border-r border-neutral-200">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              自動保存中...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-neutral-500" title="IndexedDBに自動保存されています">
              <Check className="w-4 h-4 text-emerald-600" />
              {lastSavedText || '保存済み'}
            </span>
          )}
        </div>

        {/* Features / LP links (RSC slot preferred) */}
        {linksSlot ? (
          linksSlot
        ) : (
          <a
            id="header-lp-link"
            href="/about"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            title="機能紹介・LPを見る（STAR法・削りツール・IndexedDB自動保存）"
            aria-label="機能紹介・LPを見る"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">機能紹介</span>
          </a>
        )}

        {/* ES Handbook button */}
        <button
          id="header-handbook-btn"
          type="button"
          onClick={() => {
            startTransition(() => {
              onOpenHandbook();
            });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          title="STAR法・配分比率・頻出NG表現の推敲極意"
          aria-label="推敲の極意を開く"
        >
          <BookOpen className="w-4 h-4 text-neutral-600" />
          <span className="hidden sm:inline">推敲ガイド</span>
        </button>

        {/* Clean copy for web entry forms */}
        <button
          id="clean-copy-btn"
          type="button"
          onClick={onCopyClean}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            isCopied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
          title="余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー"
          aria-label="余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              <span>コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">提出用にコピー</span>
              <span className="sm:hidden">コピー</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
