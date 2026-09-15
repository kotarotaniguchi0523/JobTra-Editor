import React from 'react';
import type { FsRouteComponentProps } from '@funstack/static/fs-routes';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface GuideSectionData {
  title: string;
  subtitle: string;
  summary: string;
  content: React.ReactNode;
}

const GUIDE_DATA: Record<string, GuideSectionData> = {
  'star-method': {
    title: 'STAR法による論理構成術',
    subtitle: '面接官が3秒で理解できる黄金の論理構造',
    summary: '結論ファーストから再現性のある貢献まで、就活ESで最も評価される基本骨格を解説します。',
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
        <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-bold text-neutral-900">なぜSTAR法が就活で重視されるのか</h3>
          <p>
            採用担当者は1日に何百通ものESを読みます。論理展開が不透明な文章は「何を言いたいのかわからない」として即座に不合格になります。STAR法は「Situation（状況）」「Task（課題）」「Action（行動）」「Result（成果）」の順序を厳格に守ることで、初見の読者にもストレスなく状況と努力を伝えることができます。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <div className="rounded border border-neutral-200 bg-white p-3">
            <span className="mb-1 block font-bold text-neutral-900">Action（行動）に6割を割く</span>
            <p className="text-xs text-neutral-500">
              状況説明が長すぎると「あなたが何をしたのか」が伝わりません。独自の工夫に最も文字数を使ってください。
            </p>
          </div>
          <div className="rounded border border-neutral-200 bg-white p-3">
            <span className="mb-1 block font-bold text-neutral-900">再現性（自己PRへの接続）</span>
            <p className="text-xs text-neutral-500">
              過去の武勇伝で終わらせず、その経験で得た強みを「入社後どう発揮するか」まで書き切ることが合格の条件です。
            </p>
          </div>
        </div>
      </div>
    ),
  },
  'word-balance': {
    title: '文字数配分の黄金比率（400字ES）',
    subtitle: '結論15% : 課題20% : 行動45% : 成果10% : 貢献10%',
    summary: '字数制限ギリギリまで効果的に使い切るためのパラグラフ配分基準です。',
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
        <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-bold text-neutral-900">
            400文字エントリーシートの配分モデル
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1 text-xs">
              <span className="font-semibold text-neutral-800">結論（Headline）</span>
              <span className="font-mono text-neutral-500">約60字 (15%)</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1 text-xs">
              <span className="font-semibold text-neutral-800">
                状況・課題（Context & Conflict）
              </span>
              <span className="font-mono text-neutral-500">約80字 (20%)</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1 text-xs">
              <span className="font-semibold text-neutral-800">独自の創意工夫（Action）</span>
              <span className="font-mono text-neutral-500">約180字 (45%)</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1 text-xs">
              <span className="font-semibold text-neutral-800">
                定量的成果（Measurable Result）
              </span>
              <span className="font-mono text-neutral-500">約40字 (10%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">
                入社後の貢献（Future Contribution）
              </span>
              <span className="font-mono text-neutral-500">約40字 (10%)</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  'business-etiquette': {
    title: '頻出NG表現・書面マナーの推敲基準',
    subtitle: '口頭語の混入や主述のねじれを徹底排除',
    summary:
      '「御社」と「貴社」の混同や、重複表現、長すぎる一文を排除してビジネス文書の品格を保ちます。',
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full overflow-hidden rounded-lg border border-neutral-200 text-left text-xs">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-2.5 font-semibold">NG・減点表現</th>
                <th className="p-2.5 font-semibold">推奨される改善表現</th>
                <th className="p-2.5 font-semibold">理由・背景</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              <tr>
                <td className="p-2.5 font-mono text-rose-700">御社</td>
                <td className="p-2.5 font-mono font-semibold text-emerald-700">貴社</td>
                <td className="p-2.5 text-neutral-500">
                  書面では「貴社」、面接の口頭では「御社」。
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-rose-700">〜させていただく</td>
                <td className="p-2.5 font-mono font-semibold text-emerald-700">
                  〜いたします / 〜しました
                </td>
                <td className="p-2.5 text-neutral-500">
                  過剰敬語・回りくどい表現による文字数の無駄遣い。
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-rose-700">様々 / 色々</td>
                <td className="p-2.5 font-mono font-semibold text-emerald-700">
                  多岐にわたる / 3つの
                </td>
                <td className="p-2.5 text-neutral-500">
                  具体性に欠け、内容の解像度が低く見えてしまう。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  'scoring-rubric': {
    title: '採用担当者の採点基準ルーブリック',
    subtitle: '面接官がチェックシートで見ている5大評価項目',
    summary: '書類選考を通過するESが必ず満たしている評価軸とチェックポイントです。',
    content: (
      <div className="space-y-3 text-xs leading-relaxed text-neutral-700">
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <span className="mb-0.5 block font-bold text-neutral-900">
            1. 設問に対するストレートな回答
          </span>
          <p className="text-xs text-neutral-500">
            「ガクチカ」を聞かれているのに「自己PR」を書いていないか。「最初の一文」で問いに答えているか。
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <span className="mb-0.5 block font-bold text-neutral-900">2. 自発的な行動と主体性</span>
          <p className="text-xs text-neutral-500">
            指示待ちではなく、自ら問題を発見して周囲を巻き込み動いたプロセスが描かれているか。
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <span className="mb-0.5 block font-bold text-neutral-900">
            3. 定量的な根拠と客観的実績
          </span>
          <p className="text-xs text-neutral-500">
            「すごく改善した」ではなく「離職率を30%から5%に削減した」などの数字があるか。
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * generateStaticParams for /guide/[slug]
 * Pre-renders guide topics at build time.
 */
export function generateStaticParams() {
  return [
    { slug: 'star-method' },
    { slug: 'word-balance' },
    { slug: 'business-etiquette' },
    { slug: 'scoring-rubric' },
  ];
}

export default function GuideTopicPage({ params }: FsRouteComponentProps<{ slug: string }>) {
  const guide = GUIDE_DATA[params.slug] || GUIDE_DATA['star-method'];

  return (
    <div className="min-h-[100dvh] bg-neutral-50 px-4 py-8 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-2xs transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>エディタに戻る</span>
          </a>
          <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-400">
            Funstack Static SSG: /guide/{params.slug}
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              就活ES推敲極意
            </span>
          </div>
          <h1 className="text-lg font-bold text-neutral-900 sm:text-xl">{guide.title}</h1>
          <p className="text-xs font-medium text-neutral-500">{guide.subtitle}</p>
          <p className="pt-1 text-xs leading-relaxed text-neutral-600">{guide.summary}</p>
        </div>

        {/* Content Body */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          {guide.content}
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between rounded-xl bg-neutral-900 p-4 text-white shadow-xs">
          <div>
            <span className="block text-xs font-semibold">この原則をエディタで実践</span>
            <p className="text-xs text-neutral-400">
              リアルタイム推敲チェックと文字数カウントを活用して執筆しましょう。
            </p>
          </div>
          <a
            href="/"
            className="rounded-md bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-100"
          >
            エディタを開く
          </a>
        </div>
      </div>
    </div>
  );
}
