import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const AboutWorkflow: React.FC = () => {
  return (
    <>
      {/* 4 Steps Workflow */}
      <section className="py-14 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            就活ESクラフトでの合格執筆フロー
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            構想からWeb提出まで、わずか4つのステップで完成します。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-xs text-neutral-900">目標文字数を決定</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              200字・300字・400字・600字・800字から提出要件を選択。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-xs text-neutral-900">STAR構造化</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              行動45%の黄金比率を意識しながら5ブロックを埋める。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-xs text-neutral-900">贅肉の削り & 推敲</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              削りツールと一文フォーカスで文字数を削り、論理を研ぎ澄ます。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-xs text-neutral-900">提出用ワンクリック</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              クリーンコピーで企業のWebエントリーシートへ美しく貼り付け。
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Commitment */}
      <section className="py-10 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            あなたの志望動機と自己PRは、あなただけのものです。
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            就活ESクラフトは完全なブラウザ内実行アーキテクチャを採用しています。<br />
            執筆内容が外部のデータベースや解析サーバーに送信されることは一切ありません。<br />
            企業研究の機密事項や個人的な経験談も、安心して執筆・推敲していただけます。
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs"
            >
              <span>安全にエディタを開く</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
