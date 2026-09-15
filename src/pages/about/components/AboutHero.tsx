import React from 'react';
import { ArrowRight, HardDrive, Scissors, Layers, ShieldCheck } from 'lucide-react';

export const AboutHero: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-14 text-center sm:px-6 sm:py-20">
      <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-2xs">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span>就活生のためのローカルファーストES推敲スタジオ</span>
      </div>

      <h1 className="text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-5xl">
        「削り」と「比率」で勝つ、
        <br className="hidden sm:inline" />
        本質的なエントリーシート推敲。
      </h1>

      <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
        文字数オーバーで焦る夜に。贅肉フレーズを削ぎ落とし、STAR法の黄金比率（Action
        45%）をリアルタイム可視化。外部通信ゼロの完全プライベート環境で安心して思考を研ぎ澄ませます。
      </p>

      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <a
          href="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-neutral-800 sm:w-auto"
        >
          <span>今すぐエディタで書く</span>
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="/guide/star-method"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 sm:w-auto"
        >
          <span>STAR法の極意を読む</span>
        </a>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-2 gap-3 pt-6 text-left md:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <HardDrive className="h-4 w-4" />
            <span>IndexedDB 自動保存</span>
          </div>
          <p className="text-xs leading-normal text-neutral-500">
            ブラウザが落ちても1文字も消えない堅牢なローカル永続化。
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Scissors className="h-4 w-4" />
            <span>削り（Chisel）ツール</span>
          </div>
          <p className="text-xs leading-normal text-neutral-500">
            「〜を行う」「〜という風に」等の贅肉をワンタップで削ぎ落とす。
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Layers className="h-4 w-4" />
            <span>STAR黄金比率メーター</span>
          </div>
          <p className="text-xs leading-normal text-neutral-500">
            結論15% : 課題20% : 行動45% : 成果10% : 貢献10%を視覚化。
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-neutral-800">
            <ShieldCheck className="h-4 w-4" />
            <span>完全プライベート</span>
          </div>
          <p className="text-xs leading-normal text-neutral-500">
            外部送信ゼロ。大切な個人情報・企業研究メモを安心執筆。
          </p>
        </div>
      </div>
    </section>
  );
};
