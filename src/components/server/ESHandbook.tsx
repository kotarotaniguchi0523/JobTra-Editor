import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Compass, Target, Sparkles, Layers } from 'lucide-react';

/**
 * ESHandbook - React Server Component (RSC)
 * Rendered at build time by Funstack Static with zero client bundle overhead.
 * Loaded on-demand via defer() from @funstack/static/server.
 */
export function ESHandbook() {
  return (
    <div className="space-y-6 text-neutral-800">
      {/* Overview Banner */}
      <div className="p-4 bg-neutral-900 text-white rounded-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">就活エントリーシート推敲ハンドブック</h3>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          採用担当者・面接官は何百通ものESを短時間で選考します。
          「1行目で惹きつけ、数字で証明し、論理破綻なく入社後の再現性を示す」ための実践的推敲ガイドです。
        </p>
      </div>

      {/* Section 1: STAR Formula */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
          <Layers className="w-4 h-4 text-neutral-700" />
          <h4 className="text-xs font-bold text-neutral-900">1. STAR論理構造の黄金ステップ</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
            <span className="inline-block px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[10px] rounded font-semibold">1. S & T: Situation / Task (15-20%)</span>
            <p className="text-xs font-medium text-neutral-900">状況と直面した高い壁・課題</p>
            <p className="text-[11px] text-neutral-600 leading-normal">
              単なる事実説明ではなく、「何が困難で、なぜ自分が取り組む必要があったのか」という背景を明瞭にします。
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
            <span className="inline-block px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[10px] rounded font-semibold">2. A: Action (40-50%)</span>
            <p className="text-xs font-medium text-neutral-900">あなた自身の独自の創意工夫・行動</p>
            <p className="text-[11px] text-neutral-600 leading-normal">
              ESの心臓部。「頑張った」ではなく「どのように周囲を動かし、どんな仕組みを考案したか」の施策を具体化します。
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
            <span className="inline-block px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[10px] rounded font-semibold">3. R: Result (15-20%)</span>
            <p className="text-xs font-medium text-neutral-900">定量的成果・客観的変化と学び</p>
            <p className="text-[11px] text-neutral-600 leading-normal">
              「離職率が40%から10%へ減少」「売上対前年比120%達成」など客観的指標を提示し、得た教訓を定義します。
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 space-y-1">
            <span className="inline-block px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[10px] rounded font-semibold">4. C: Contribution (10-15%)</span>
            <p className="text-xs font-medium text-neutral-900">志望企業での再現性と貢献</p>
            <p className="text-[11px] text-neutral-600 leading-normal">
              過去の成功体験を行動特性（ポータブルスキル）に昇華させ、「貴社の〇〇事業においてどう活きるか」を締めに結びます。
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Character Allocation Ratio */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
          <Target className="w-4 h-4 text-neutral-700" />
          <h4 className="text-xs font-bold text-neutral-900">2. 文字数別の配分配分目安</h4>
        </div>
        <div className="p-3.5 bg-white rounded-md border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
            <span>400字ES（最も標準的な分量）の理想配分</span>
            <span className="font-mono text-neutral-500">目標: 360〜400字 (90-100%)</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-3 flex overflow-hidden text-[9px] font-mono text-white text-center">
            <div className="bg-neutral-800 flex items-center justify-center" style={{ width: '15%' }} title="結論: 60字">結論 60</div>
            <div className="bg-neutral-600 flex items-center justify-center" style={{ width: '20%' }} title="課題: 80字">課題 80</div>
            <div className="bg-neutral-900 flex items-center justify-center font-bold" style={{ width: '40%' }} title="施策: 160字">施策・行動 160</div>
            <div className="bg-neutral-500 flex items-center justify-center" style={{ width: '15%' }} title="結果: 60字">結果 60</div>
            <div className="bg-neutral-700 flex items-center justify-center" style={{ width: '10%' }} title="貢献: 40字">結び 40</div>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            ※ 施策・行動（Action）が全体の40%未満だと「結果論」や「環境の幸運」と見なされやすくなります。最も文字数を割いて自己の思考プロセスを伝えましょう。
          </p>
        </div>
      </div>

      {/* Section 3: Elimination of Frequent NG Phrases */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-neutral-900">3. 頻出NG表現の即時置換リスト</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
                <th className="p-2 font-medium">NG・減点表現</th>
                <th className="p-2 font-medium">改善・推奨表現</th>
                <th className="p-2 font-medium">推敲の理由</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-2 text-rose-700 font-mono">御社</td>
                <td className="p-2 text-emerald-700 font-medium">貴社</td>
                <td className="p-2 text-neutral-500">書面・ESでは「貴社」、面接の口頭では「御社」が基本マナー。</td>
              </tr>
              <tr>
                <td className="p-2 text-rose-700 font-mono">〜だと思います / 感じました</td>
                <td className="p-2 text-emerald-700 font-medium">〜と考えます / 〜を確信しました</td>
                <td className="p-2 text-neutral-500">自信のなさを払拭し、論理的思考力と意思決定の強さを伝達。</td>
              </tr>
              <tr>
                <td className="p-2 text-rose-700 font-mono">色々と / 様々な / たくさん</td>
                <td className="p-2 text-emerald-700 font-medium">3つの施策を / 週に4回の頻度で</td>
                <td className="p-2 text-neutral-500">抽象的な強調語を排除し、定量的数値に置き換えて説得力を向上。</td>
              </tr>
              <tr>
                <td className="p-2 text-rose-700 font-mono">〜させていただく（二重敬語）</td>
                <td className="p-2 text-emerald-700 font-medium">〜いたします / 行いました</td>
                <td className="p-2 text-neutral-500">過剰な敬語は文字数を無駄に消費し、文構造を冗長にします。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Evaluation Checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-neutral-900">4. 面接官視点の最終チェックリスト</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200 flex items-start gap-2">
            <Compass className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block">主語と述語のねじれ解消</span>
              <p className="text-[11px] text-neutral-500">一文が60文字を超えるとねじれが発生します。読点で区切らずに2文に分割してください。</p>
            </div>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200 flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block">文末「です・ます」の統一</span>
              <p className="text-[11px] text-neutral-500">「〜である」が混在していないか、体言止めが不自然に多用されていないか点検します。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
