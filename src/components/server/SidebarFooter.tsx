import React from 'react';
import { HardDrive, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

/**
 * SidebarFooter - React Server Component (RSC)
 * サイドバー最下部の静的情報・リンクエリア。
 * ゼロクライアントJSで完全静的にレンダリングされます。
 */
export function SidebarFooter() {
  return (
    <div className="p-3 border-t border-neutral-200 bg-white text-xs space-y-2">
      <a
        href="/about"
        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs font-medium text-xs"
        title="就活ESクラフトの機能一覧・LPを見る"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>機能一覧・LP</span>
        </div>
        <ArrowRight className="w-3 h-3 text-neutral-400" />
      </a>

      <a
        href="/guide/star-method"
        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs font-medium text-xs"
        title="STAR法・文字数配分などの就活推敲ハンドブック"
      >
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
          <span>推敲ハンドブック</span>
        </div>
        <ArrowRight className="w-3 h-3 text-neutral-400" />
      </a>

      <div className="flex items-center justify-between text-neutral-500 pt-1 border-t border-neutral-100">
        <div className="flex items-center gap-1.5 text-xs">
          <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
          <span>IndexedDB オフライン同期</span>
        </div>
        <span
          className="inline-block w-2 h-2 rounded-full bg-emerald-500"
          title="IndexedDBローカル永続化が有効です"
        />
      </div>
    </div>
  );
}
