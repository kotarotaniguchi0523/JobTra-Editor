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
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm">なぜSTAR法が就活で重視されるのか</h3>
          <p>
            採用担当者は1日に何百通ものESを読みます。論理展開が不透明な文章は「何を言いたいのかわからない」として即座に不合格になります。STAR法は「Situation（状況）」「Task（課題）」「Action（行動）」「Result（成果）」の順序を厳格に守ることで、初見の読者にもストレスなく状況と努力を伝えることができます。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-white rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Action（行動）に6割を割く</span>
            <p className="text-neutral-500 text-[11px]">状況説明が長すぎると「あなたが何をしたのか」が伝わりません。独自の工夫に最も文字数を使ってください。</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">再現性（自己PRへの接続）</span>
            <p className="text-neutral-500 text-[11px]">過去の武勇伝で終わらせず、その経験で得た強みを「入社後どう発揮するか」まで書き切ることが合格の条件です。</p>
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
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
          <h3 className="font-bold text-neutral-900 text-sm">400文字エントリーシートの配分モデル</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-neutral-200">
              <span className="font-semibold text-neutral-800">結論（Headline）</span>
              <span className="font-mono text-neutral-500">約60字 (15%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-neutral-200">
              <span className="font-semibold text-neutral-800">状況・課題（Context & Conflict）</span>
              <span className="font-mono text-neutral-500">約80字 (20%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-neutral-200">
              <span className="font-semibold text-neutral-800">独自の創意工夫（Action）</span>
              <span className="font-mono text-neutral-500">約180字 (45%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-neutral-200">
              <span className="font-semibold text-neutral-800">定量的成果（Measurable Result）</span>
              <span className="font-mono text-neutral-500">約40字 (10%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-800">入社後の貢献（Future Contribution）</span>
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
    summary: '「御社」と「貴社」の混同や、重複表現、長すぎる一文を排除してビジネス文書の品格を保ちます。',
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-neutral-200 rounded-lg overflow-hidden text-xs">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-2.5 font-semibold">NG・減点表現</th>
                <th className="p-2.5 font-semibold">推奨される改善表現</th>
                <th className="p-2.5 font-semibold">理由・背景</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              <tr>
                <td className="p-2.5 text-rose-700 font-mono">御社</td>
                <td className="p-2.5 text-emerald-700 font-semibold font-mono">貴社</td>
                <td className="p-2.5 text-neutral-500">書面では「貴社」、面接の口頭では「御社」。</td>
              </tr>
              <tr>
                <td className="p-2.5 text-rose-700 font-mono">〜させていただく</td>
                <td className="p-2.5 text-emerald-700 font-semibold font-mono">〜いたします / 〜しました</td>
                <td className="p-2.5 text-neutral-500">過剰敬語・回りくどい表現による文字数の無駄遣い。</td>
              </tr>
              <tr>
                <td className="p-2.5 text-rose-700 font-mono">様々 / 色々</td>
                <td className="p-2.5 text-emerald-700 font-semibold font-mono">多岐にわたる / 3つの</td>
                <td className="p-2.5 text-neutral-500">具体性に欠け、内容の解像度が低く見えてしまう。</td>
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
        <div className="p-3 bg-white rounded-lg border border-neutral-200">
          <span className="font-bold text-neutral-900 block mb-0.5">1. 設問に対するストレートな回答</span>
          <p className="text-neutral-500 text-[11px]">「ガクチカ」を聞かれているのに「自己PR」を書いていないか。「最初の一文」で問いに答えているか。</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-neutral-200">
          <span className="font-bold text-neutral-900 block mb-0.5">2. 自発的な行動と主体性</span>
          <p className="text-neutral-500 text-[11px]">指示待ちではなく、自ら問題を発見して周囲を巻き込み動いたプロセスが描かれているか。</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-neutral-200">
          <span className="font-bold text-neutral-900 block mb-0.5">3. 定量的な根拠と客観的実績</span>
          <p className="text-neutral-500 text-[11px]">「すごく改善した」ではなく「離職率を30%から5%に削減した」などの数字があるか。</p>
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

export default function GuideTopicPage({
  params,
}: FsRouteComponentProps<{ slug: string }>) {
  const guide = GUIDE_DATA[params.slug] || GUIDE_DATA['star-method'];

  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white px-3 py-1.5 rounded-md border border-neutral-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>エディタに戻る</span>
          </a>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
            Funstack Static SSG: /guide/{params.slug}
          </span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              就活ES推敲極意
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900">
            {guide.title}
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {guide.subtitle}
          </p>
          <p className="text-xs text-neutral-600 pt-1 leading-relaxed">
            {guide.summary}
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          {guide.content}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-neutral-900 text-white rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="font-semibold text-xs block">この原則をエディタで実践</span>
            <p className="text-[11px] text-neutral-400">リアルタイム推敲チェックと文字数カウントを活用して執筆しましょう。</p>
          </div>
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            エディタを開く
          </a>
        </div>
      </div>
    </div>
  );
}
