import 'urlpattern-polyfill';
import './styles/index.css';
import type React from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>就活ESクラフト - 楽しく書けるES作成エディタ</title>
        <meta
          name="description"
          content="就活エントリーシートの本質的・高機能下書きエディタ。Static RSCによるページ構成、STAR法思考整理、文体・文字数リアルタイム監査、バージョン履歴、ブラウザ内IndexedDB保存、Markdownと印刷用PDFのローカル出力を搭載。"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
