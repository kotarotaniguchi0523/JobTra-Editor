import React from 'react';
import { Layers, Scissors, HardDrive } from 'lucide-react';

/**
 * EmptyDraftGuide - React Server Component (RSC)
 * 下書きが存在しないときや初期ロード時に表示する静的案内ガイド。
 */
export function EmptyDraftGuide() {
  return (
    <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-8 text-center sm:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 font-mono text-lg font-bold text-white shadow-xs">
        ES
      </div>

      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
          就活ESクラフトへようこそ
        </h3>
        <p className="text-xs leading-relaxed text-neutral-500 sm:text-sm">
          思考をクリアにし、論理破綻のない洗練されたエントリーシートを作成・推敲するためのワークスペースです。
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
        <div className="space-y-1 rounded bg-neutral-50 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <Layers className="h-3.5 w-3.5 text-neutral-700" />
            <span>1. STAR法で骨格整理</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            結論・課題・行動・成果・貢献の5つの問いに答えて論理破綻を防止。
          </p>
        </div>

        <div className="space-y-1 rounded bg-neutral-50 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <Scissors className="h-3.5 w-3.5 text-neutral-700" />
            <span>2. 冗長表現の彫刻</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            「〜ということ」「色々と」など無駄な文字数を1クリックで圧縮。
          </p>
        </div>

        <div className="space-y-1 rounded bg-neutral-50 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <HardDrive className="h-3.5 w-3.5 text-neutral-700" />
            <span>3. 安全なローカル保存</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            IndexedDBによる完全オフライン自動保存で、文章の外部流出を完全遮断。
          </p>
        </div>
      </div>
    </div>
  );
}
