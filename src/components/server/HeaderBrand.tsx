import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

/**
 * HeaderBrand - React Server Component (RSC)
 * サーバー側で完全静的にレンダリングされ、クライアントJSバンドルに含まれません。
 */
export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider shadow-2xs">
        ES
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-neutral-900 tracking-tight">
            就活ESクラフト
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            静的RSC
          </span>
        </div>
        <p className="text-xs text-neutral-500 hidden sm:block">
          思考をクリアにし、推敲を深めるエントリーシート執筆スタジオ
        </p>
      </div>
    </div>
  );
}

/**
 * HeaderStaticLinks - React Server Component (RSC)
 * 静的なLPやガイドへのアンカーリンク群。
 */
export function HeaderStaticLinks() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <a
        href="/about"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
        title="機能紹介・LPを見る（STAR法・削りツール・IndexedDB自動保存）"
        aria-label="機能紹介・LPを見る"
      >
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span className="hidden md:inline">機能紹介</span>
      </a>

      <a
        href="/guide/star-method"
        className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
        title="STAR法・配分比率の推敲極意ガイド"
        aria-label="推敲の極意を見る"
      >
        <BookOpen className="w-4 h-4 text-neutral-600" />
        <span>極意解説</span>
      </a>
    </div>
  );
}
