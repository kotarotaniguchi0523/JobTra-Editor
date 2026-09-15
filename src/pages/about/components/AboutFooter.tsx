import React from 'react';

export const AboutFooter: React.FC = () => {
  return (
    <footer className="py-8 bg-white border-t border-neutral-200 text-xs text-neutral-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
            ES
          </div>
          <span className="font-semibold text-neutral-800">就活ESクラフト</span>
          <span>- 本質的・洗練されたES執筆スタジオ</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a href="/" className="hover:text-neutral-900 transition-colors font-medium">
            エディタ
          </a>
          <a href="/guide/star-method" className="hover:text-neutral-900 transition-colors">
            STAR法解説
          </a>
          <a href="/guide/word-balance" className="hover:text-neutral-900 transition-colors">
            文字数配分モデル
          </a>
          <a href="/guide/business-etiquette" className="hover:text-neutral-900 transition-colors">
            ビジネスマナー
          </a>
          <a href="/guide/scoring-rubric" className="hover:text-neutral-900 transition-colors">
            採点ルーブリック
          </a>
        </div>
      </div>
    </footer>
  );
};
