import React from 'react';
import { HardDrive, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

/**
 * SidebarFooter - React Server Component (RSC)
 * サイドバー最下部の静的情報・リンクエリア。
 * ゼロクライアントJSで完全静的にレンダリングされます。
 */
export function SidebarFooter() {
  return (
    <div className="space-y-2 border-t border-neutral-200 bg-white p-3 text-xs">
      <a
        href="/about"
        className="flex items-center justify-between rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        title="就活ESクラフトの機能一覧・LPを見る"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>機能一覧・LP</span>
        </div>
        <ArrowRight className="h-3 w-3 text-neutral-400" />
      </a>

      <a
        href="/guide/star-method"
        className="flex items-center justify-between rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        title="STAR法・文字数配分などの就活推敲ハンドブック"
      >
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-neutral-600" />
          <span>推敲ハンドブック</span>
        </div>
        <ArrowRight className="h-3 w-3 text-neutral-400" />
      </a>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-1 text-neutral-500">
        <div className="flex items-center gap-1.5 text-xs">
          <HardDrive className="h-3.5 w-3.5 text-neutral-500" />
          <span>IndexedDB オフライン・端末同期</span>
        </div>
        <span
          className="inline-block h-2 w-2 rounded-full bg-emerald-500"
          title="IndexedDBローカル永続化が有効です"
        />
      </div>
    </div>
  );
}
