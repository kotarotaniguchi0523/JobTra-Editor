import React from 'react';

export const AboutFooter: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8 text-xs text-neutral-500">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-neutral-900 font-mono text-xs font-bold text-white">
            ES
          </div>
          <span className="font-semibold text-neutral-800">就活ESクラフト</span>
          <span>- 本質的・洗練されたES執筆スタジオ</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a href="/" className="font-medium transition-colors hover:text-neutral-900">
            エディタ
          </a>
          <a href="/guide/star-method" className="transition-colors hover:text-neutral-900">
            STAR法解説
          </a>
          <a href="/guide/word-balance" className="transition-colors hover:text-neutral-900">
            文字数配分モデル
          </a>
          <a href="/guide/business-etiquette" className="transition-colors hover:text-neutral-900">
            ビジネスマナー
          </a>
          <a href="/guide/scoring-rubric" className="transition-colors hover:text-neutral-900">
            採点ルーブリック
          </a>
        </div>
      </div>
    </footer>
  );
};
