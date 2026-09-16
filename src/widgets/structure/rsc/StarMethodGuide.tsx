import React from 'react';
import { Layers, Target, CheckCircle2, Lightbulb } from 'lucide-react';

/**
 * StarMethodGuide - React Server Component (RSC)
 * STAR法（結論・状況・課題・行動・成果・貢献）の静的ナレッジガイド。
 * クライアントバンドルに含めず、サーバー側で事前レンダリングします。
 */
export function StarMethodGuide() {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
          <Layers className="h-4 w-4 text-neutral-800" />
          <span>STAR法思考整理の黄金ルール</span>
        </div>
        <span className="font-mono text-xs text-neutral-400">RSC Static Knowledge</span>
      </div>

      <p className="leading-relaxed text-neutral-600">
        エントリーシートは「小説」ではなく「ビジネス文書」です。
        採用担当者が一読して情景と行動特性を把握できるよう、以下の配分と着眼点を意識して各ブロックを埋めましょう。
      </p>

      <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
        <div className="space-y-1 rounded bg-white/80 p-2.5">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
            <Target className="h-3.5 w-3.5 text-neutral-600" />
            <span>1. 結論ファースト</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            冒頭で強みと成果を一言で提示。「私の強みは〜です」から始め、読者の認知負荷を最小化します。
          </p>
        </div>

        <div className="space-y-1 rounded bg-white/80 p-2.5">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            <span>2. 行動に45%割く</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            「頑張った」はNG。どのような独自の仕組みを考案し、どう周囲を巻き込んだかのプロセスを書きます。
          </p>
        </div>

        <div className="space-y-1 rounded bg-white/80 p-2.5">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>3. 定量成果と再現性</span>
          </div>
          <p className="text-xs leading-normal text-neutral-600">
            「数字」で成果を示し、過去の経験を「入社後にどう活かせるか」という再現性に結びつけます。
          </p>
        </div>
      </div>
    </div>
  );
}
