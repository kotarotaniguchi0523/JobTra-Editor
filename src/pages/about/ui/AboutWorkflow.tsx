import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const AboutWorkflow: React.FC = () => {
  return (
    <>
      {/* 4 Steps Workflow */}
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            就活ESクラフトでの合格執筆フロー
          </h2>
          <p className="text-xs text-neutral-500 sm:text-sm">
            構想からWeb提出まで、わずか4つのステップで完成します。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800">
              1
            </span>
            <h4 className="text-xs font-bold text-neutral-900">目標文字数を決定</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              200字・300字・400字・600字・800字から提出要件を選択。
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800">
              2
            </span>
            <h4 className="text-xs font-bold text-neutral-900">STAR構造化</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              行動45%の黄金比率を意識しながら5ブロックを埋める。
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800">
              3
            </span>
            <h4 className="text-xs font-bold text-neutral-900">贅肉の削り & 推敲</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              削りツールと一文フォーカスで文字数を削り、論理を研ぎ澄ます。
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800">
              4
            </span>
            <h4 className="text-xs font-bold text-neutral-900">提出用ワンクリック</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              クリーンコピーで企業のWebエントリーシートへ美しく貼り付け。
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Commitment */}
      <section className="bg-neutral-900 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-4 px-4 text-center sm:px-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            あなたの志望動機と自己PRは、あなただけのものです。
          </h2>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
            就活ESクラフトは完全なブラウザ内実行アーキテクチャを採用しています。
            <br />
            執筆内容が外部のデータベースや解析サーバーに送信されることは一切ありません。
            <br />
            企業研究の機密事項や個人的な経験談も、安心して執筆・推敲していただけます。
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-xs font-bold text-neutral-900 shadow-xs transition-colors hover:bg-neutral-100"
            >
              <span>安全にエディタを開く</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
