import React from 'react';
import { Sparkles, BookOpen, Cloud } from 'lucide-react';

/**
 * HeaderBrand - React Server Component (RSC)
 * サーバー側で完全静的にレンダリングされ、クライアントJSバンドルに含まれません。
 */
export function HeaderBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2.5 select-none sm:gap-3">
      <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-mono text-xs font-bold tracking-wider text-white shadow-2xs sm:h-8 sm:w-8 sm:text-sm">
        ES
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="truncate text-sm font-bold tracking-tight text-neutral-900 sm:text-base">
            就活ESクラフト
          </span>
          <span className="hidden shrink-0 items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 lg:inline-flex">
            静的RSC
          </span>
        </div>
        <p className="hidden text-xs text-neutral-500 xl:block xl:max-w-md xl:truncate">
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
    <div className="flex shrink-0 items-center gap-1.5">
      <a
        href="/about"
        className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 md:flex"
        title="機能紹介・LPを見る（STAR法・削りツール・IndexedDB自動保存）"
        aria-label="機能紹介・LPを見る"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
        <span>機能紹介</span>
      </a>

      <a
        href="/guide/star-method"
        className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 xl:flex"
        title="STAR法・配分比率の推敲極意ガイド"
        aria-label="推敲の極意を見る"
      >
        <BookOpen className="h-3.5 w-3.5 text-neutral-600" />
        <span>極意解説</span>
      </a>

      <a
        href="/guide/dexie-cloud"
        className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200 xl:flex"
        title="個人Dexie Cloudの作成と別端末同期の設定手順"
        aria-label="クラウド同期ガイドを見る"
      >
        <Cloud className="h-3.5 w-3.5 text-sky-600" />
        <span>同期ガイド</span>
      </a>
    </div>
  );
}
