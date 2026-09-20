import React from 'react';
import { ArrowLeft, Cloud } from 'lucide-react';

/**
 * Static, server-rendered explanation of the BYOD Dexie Cloud setup.
 * The AI-facing Markdown remains a separate on-demand asset under /ai/.
 */
export default function DexieCloudGuidePage() {
  return (
    <div className="min-h-[100dvh] bg-neutral-50 px-4 py-8 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-2xs transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>エディタに戻る</span>
          </a>
          <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-400">
            Static RSC: /guide/dexie-cloud
          </span>
        </div>

        <header className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-700 uppercase">
            <Cloud className="h-4 w-4" />
            個人クラウド同期
          </div>
          <h1 className="text-xl font-bold">Dexie Cloud を自分の環境で使う</h1>
          <p className="text-sm leading-relaxed text-neutral-600">
            JobTra は共有クラウドを固定せず、ユーザー自身が用意した Dexie Cloud URL に接続できます。
            URL を設定しない場合は、これまでどおりローカル IndexedDB だけで動作します。
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold">設定手順</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-neutral-700">
            <li>Dexie Cloud CLI または管理画面で自分のデータベースを作成します。</li>
            <li>
              JobTra の公開 Origin を許可します。例:{' '}
              <code>npx dexie-cloud whitelist https://your-origin.example</code>
            </li>
            <li>JobTra の同期設定に、データベース URL だけを入力します。</li>
            <li>PC とスマートフォンで同じ URL・同じ認証方法を使います。</li>
          </ol>
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            <strong>秘密情報を入力しないでください。</strong> <code>dexie-cloud.key</code> の client
            secret や OTP は JobTra に渡しません。
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold">AI に説明させる</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            対応ブラウザの AI は、ページ内の WebMCP ツールから同じ説明を取得できます。AI 専用
            Markdown は通常画面のナビゲーションや React
            バンドルには含めず、必要なときだけ取得します。
          </p>
        </section>

        <div className="flex justify-end">
          <a
            href="/"
            className="rounded-md bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-2xs transition-colors hover:bg-neutral-700"
          >
            エディタで設定する
          </a>
        </div>
      </div>
    </div>
  );
}
