import React from 'react';
import { ArrowRight, HardDrive, Scissors, Layers, ShieldCheck } from 'lucide-react';

export const AboutHero: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>就活生のためのローカルファーストES推敲スタジオ</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
        「削り」と「比率」で勝つ、<br className="hidden sm:inline" />
        本質的なエントリーシート推敲。
      </h1>

      <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        文字数オーバーで焦る夜に。贅肉フレーズを削ぎ落とし、STAR法の黄金比率（Action 45%）をリアルタイム可視化。外部通信ゼロの完全プライベート環境で安心して思考を研ぎ澄ませます。
      </p>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>今すぐエディタで書く</span>
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="/guide/star-method"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 transition-colors shadow-2xs"
        >
          <span>STAR法の極意を読む</span>
        </a>
      </div>

      {/* Feature Badges */}
      <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
            <HardDrive className="w-4 h-4" />
            <span>IndexedDB 自動保存</span>
          </div>
          <p className="text-xs text-neutral-500 leading-normal">
            ブラウザが落ちても1文字も消えない堅牢なローカル永続化。
          </p>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
            <Scissors className="w-4 h-4" />
            <span>削り（Chisel）ツール</span>
          </div>
          <p className="text-xs text-neutral-500 leading-normal">
            「〜を行う」「〜という風に」等の贅肉をワンタップで削ぎ落とす。
          </p>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
            <Layers className="w-4 h-4" />
            <span>STAR黄金比率メーター</span>
          </div>
          <p className="text-xs text-neutral-500 leading-normal">
            結論15% : 課題20% : 行動45% : 成果10% : 貢献10%を視覚化。
          </p>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 text-neutral-800 font-semibold text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>完全プライベート</span>
          </div>
          <p className="text-xs text-neutral-500 leading-normal">
            外部送信ゼロ。大切な個人情報・企業研究メモを安心執筆。
          </p>
        </div>
      </div>
    </section>
  );
};
