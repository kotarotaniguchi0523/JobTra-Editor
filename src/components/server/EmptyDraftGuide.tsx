import React from 'react';
import { Layers, Scissors, HardDrive } from 'lucide-react';

/**
 * EmptyDraftGuide - React Server Component (RSC)
 * 下書きが存在しないときや初期ロード時に表示する静的案内ガイド。
 */
export function EmptyDraftGuide() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-8 sm:p-12 text-center space-y-6">
      <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-mono font-bold text-lg mx-auto shadow-xs">
        ES
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-neutral-900">
          就活ESクラフトへようこそ
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          思考をクリアにし、論理破綻のない洗練されたエントリーシートを作成・推敲するためのワークスペースです。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
        <div className="p-3.5 bg-neutral-50 rounded space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
            <Layers className="w-3.5 h-3.5 text-neutral-700" />
            <span>1. STAR法で骨格整理</span>
          </div>
          <p className="text-xs text-neutral-600 leading-normal">
            結論・課題・行動・成果・貢献の5つの問いに答えて論理破綻を防止。
          </p>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
            <Scissors className="w-3.5 h-3.5 text-neutral-700" />
            <span>2. 冗長表現の彫刻</span>
          </div>
          <p className="text-xs text-neutral-600 leading-normal">
            「〜ということ」「色々と」など無駄な文字数を1クリックで圧縮。
          </p>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
            <HardDrive className="w-3.5 h-3.5 text-neutral-700" />
            <span>3. 安全なローカル保存</span>
          </div>
          <p className="text-xs text-neutral-600 leading-normal">
            IndexedDBによる完全オフライン自動保存で、文章の外部流出を完全遮断。
          </p>
        </div>
      </div>
    </div>
  );
}
