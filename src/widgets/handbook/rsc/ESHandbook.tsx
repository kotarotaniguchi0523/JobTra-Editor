import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react';

/**
 * ESHandbook - React Server Component (RSC)
 * Rendered at build time by Funstack Static with zero client bundle overhead.
 * Loaded on-demand via defer() from @funstack/static/server.
 */
export function ESHandbook() {
  return (
    <div className="space-y-6 text-neutral-800">
      {/* Overview Banner */}
      <div className="rounded-lg bg-neutral-900 p-4 text-white">
        <div className="mb-1.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">就活エントリーシート推敲ハンドブック</h3>
        </div>
        <p className="text-xs leading-relaxed text-neutral-300">
          採用担当者・面接官は何百通ものESを短時間で選考します。
          「1行目で惹きつけ、数字で証明し、論理破綻なく入社後の再現性を示す」ための実践的推敲ガイドです。
        </p>
      </div>

      {/* Section 1: STAR Formula */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1.5">
          <Layers className="h-4 w-4 text-neutral-700" />
          <h4 className="text-xs font-bold text-neutral-900">1. STAR論理構造の黄金ステップ</h4>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <span className="inline-block rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
              1. S & T: Situation / Task (15-20%)
            </span>
            <p className="text-xs font-medium text-neutral-900">状況と直面した高い壁・課題</p>
            <p className="text-xs leading-normal text-neutral-600">
              単なる事実説明ではなく、「何が困難で、なぜ自分が取り組む必要があったのか」という背景を明瞭にします。
            </p>
          </div>
          <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <span className="inline-block rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
              2. A: Action (40-50%)
            </span>
            <p className="text-xs font-medium text-neutral-900">あなた自身の独自の創意工夫・行動</p>
            <p className="text-xs leading-normal text-neutral-600">
              ESの心臓部。「頑張った」ではなく「どのように周囲を動かし、どんな仕組みを考案したか」の施策を具体化します。
            </p>
          </div>
          <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <span className="inline-block rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
              3. R: Result (15-20%)
            </span>
            <p className="text-xs font-medium text-neutral-900">定量的成果・客観的変化と学び</p>
            <p className="text-xs leading-normal text-neutral-600">
              「離職率が40%から10%へ減少」「売上対前年比120%達成」など客観的指標を提示し、得た教訓を定義します。
            </p>
          </div>
          <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <span className="inline-block rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
              4. C: Contribution (10-15%)
            </span>
            <p className="text-xs font-medium text-neutral-900">志望企業での再現性と貢献</p>
            <p className="text-xs leading-normal text-neutral-600">
              過去の成功体験を行動特性（ポータブルスキル）に昇華させ、「貴社の〇〇事業においてどう活きるか」を締めに結びます。
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Character Allocation Ratio */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1.5">
          <Target className="h-4 w-4 text-neutral-700" />
          <h4 className="text-xs font-bold text-neutral-900">2. 文字数別の配分配分目安</h4>
        </div>
        <div className="space-y-2.5 rounded-md border border-neutral-200 bg-white p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
            <span>400字ES（最も標準的な分量）の理想配分</span>
            <span className="font-mono text-neutral-500">目標: 360〜400字 (90-100%)</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-100 text-center font-mono text-xs text-white">
            <div
              className="flex items-center justify-center bg-neutral-800"
              style={{ width: '15%' }}
              title="結論: 60字"
            >
              結論 60
            </div>
            <div
              className="flex items-center justify-center bg-neutral-600"
              style={{ width: '20%' }}
              title="課題: 80字"
            >
              課題 80
            </div>
            <div
              className="flex items-center justify-center bg-neutral-900 font-bold"
              style={{ width: '40%' }}
              title="施策: 160字"
            >
              施策・行動 160
            </div>
            <div
              className="flex items-center justify-center bg-neutral-500"
              style={{ width: '15%' }}
              title="結果: 60字"
            >
              結果 60
            </div>
            <div
              className="flex items-center justify-center bg-neutral-700"
              style={{ width: '10%' }}
              title="貢献: 40字"
            >
              結び 40
            </div>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            ※
            施策・行動（Action）が全体の40%未満だと「結果論」や「環境の幸運」と見なされやすくなります。最も文字数を割いて自己の思考プロセスを伝えましょう。
          </p>
        </div>
      </div>

      {/* Section 3: Elimination of Frequent NG Phrases */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h4 className="text-xs font-bold text-neutral-900">3. 頻出NG表現の即時置換リスト</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100 text-neutral-700">
                <th className="p-2 font-medium">NG・減点表現</th>
                <th className="p-2 font-medium">改善・推奨表現</th>
                <th className="p-2 font-medium">推敲の理由</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-2 font-mono text-rose-700">御社</td>
                <td className="p-2 font-medium text-emerald-700">貴社</td>
                <td className="p-2 text-neutral-500">
                  書面・ESでは「貴社」、面接の口頭では「御社」が基本マナー。
                </td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-rose-700">〜だと思います / 感じました</td>
                <td className="p-2 font-medium text-emerald-700">
                  〜と考えます / 〜を確信しました
                </td>
                <td className="p-2 text-neutral-500">
                  自信のなさを払拭し、論理的思考力と意思決定の強さを伝達。
                </td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-rose-700">色々と / 様々な / たくさん</td>
                <td className="p-2 font-medium text-emerald-700">3つの施策を / 週に4回の頻度で</td>
                <td className="p-2 text-neutral-500">
                  抽象的な強調語を排除し、定量的数値に置き換えて説得力を向上。
                </td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-rose-700">〜させていただく（二重敬語）</td>
                <td className="p-2 font-medium text-emerald-700">〜いたします / 行いました</td>
                <td className="p-2 text-neutral-500">
                  過剰な敬語は文字数を無駄に消費し、文構造を冗長にします。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Evaluation Checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-neutral-900">4. 面接官視点の最終チェックリスト</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded border border-neutral-200 bg-neutral-50 p-2.5">
            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
            <div>
              <span className="block font-semibold text-neutral-900">主語と述語のねじれ解消</span>
              <p className="text-xs text-neutral-500">
                一文が60文字を超えるとねじれが発生します。読点で区切らずに2文に分割してください。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded border border-neutral-200 bg-neutral-50 p-2.5">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
            <div>
              <span className="block font-semibold text-neutral-900">文末「です・ます」の統一</span>
              <p className="text-xs text-neutral-500">
                「〜である」が混在していないか、体言止めが不自然に多用されていないか点検します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
