import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

/**
 * HeaderBrand - React Server Component (RSC)
 * サーバー側で完全静的にレンダリングされ、クライアントJSバンドルに含まれません。
 */
export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 font-mono text-sm font-bold tracking-wider text-white shadow-2xs">
        ES
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-neutral-900">
            就活ESクラフト
          </span>
          <span className="hidden items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 sm:inline-flex">
            静的RSC
          </span>
        </div>
        <p className="hidden text-xs text-neutral-500 sm:block">
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
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 sm:px-3"
        title="機能紹介・LPを見る（STAR法・削りツール・IndexedDB自動保存）"
        aria-label="機能紹介・LPを見る"
      >
        <Sparkles className="h-4 w-4 text-amber-600" />
        <span className="hidden md:inline">機能紹介</span>
      </a>

      <a
        href="/guide/star-method"
        className="hidden cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 sm:px-3 lg:flex"
        title="STAR法・配分比率の推敲極意ガイド"
        aria-label="推敲の極意を見る"
      >
        <BookOpen className="h-4 w-4 text-neutral-600" />
        <span>極意解説</span>
      </a>
    </div>
  );
}
