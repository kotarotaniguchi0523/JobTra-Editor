import React from 'react';
import { HardDrive, Compass, Zap } from 'lucide-react';

export const AboutFeatures: React.FC = () => {
  return (
    <section className="border-y border-neutral-200 bg-white py-12">
      <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            就活生の勝率を最大化する8つの核
          </h2>
          <p className="text-xs text-neutral-500 sm:text-sm">
            一般のメモ帳やWordではカバーできない、就活エントリーシート特有の推敲課題を解決するために設計されています。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Feature 1 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
              01
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              STAR法構造化エディタ & 黄金比率メーター
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              「結論（Headline）」「状況・課題（Context）」「独自の行動（Action）」「定量的成果（Result）」「再現性・貢献（Future）」の5ステップに分けて思考を整理。リアルタイムに各ブロックの文字数と比率を計算し、面接官が好む「行動に45%割く配分」ができているかを視覚的に評価します。
            </p>
            <div className="space-y-1 rounded-lg bg-white p-3 font-mono text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>結論（Headline）</span>
                <span className="font-semibold text-neutral-800">15%</span>
              </div>
              <div className="flex justify-between">
                <span>状況・課題（Context）</span>
                <span className="font-semibold text-neutral-800">20%</span>
              </div>
              <div className="flex justify-between font-bold text-amber-700">
                <span>独自の創意工夫（Action）</span>
                <span>45% ★最重視</span>
              </div>
              <div className="flex justify-between">
                <span>定量的成果（Result）</span>
                <span className="font-semibold text-neutral-800">10%</span>
              </div>
              <div className="flex justify-between">
                <span>入社後の再現性（Contribution）</span>
                <span className="font-semibold text-neutral-800">10%</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-sm font-bold text-white">
              02
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              冗長表現を削ぎ落とす「削り（Chisel）ツール」
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              400字や300字の厳格な制限の中で最も無駄なのは、日本語の贅肉表現です。「〜という風に考える」「〜を行うことができる」「〜のサポートを担当した」などのまわりくどい言い回しを検出し、ワンタップで「〜と考える」「〜できる」「〜を支援した」に置換。貴重な文字数を生み出します。
            </p>
            <div className="space-y-2 rounded-lg bg-white p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-rose-500 line-through">〜という風に考える</span>
                <span className="font-semibold text-emerald-600">→ 〜と考える（-4字）</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-500 line-through">〜を行うことができる</span>
                <span className="font-semibold text-emerald-600">→ 〜できる（-5字）</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-500 line-through">〜のサポートを担当した</span>
                <span className="font-semibold text-emerald-600">→ 〜を支援した（-5字）</span>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              03
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              思考を止まらせない「ゴーストガイダンス」
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              エディタ上で執筆中、直前の文末や構成位置を自動検知。「次の一手（独自の工夫・定量的根拠・接続語）」をガイダンスとしてエディタ下部に提示します。「その際、最も注力したのは」「これにより」などの論理展開フレーズは、Tabキー1つでカーソル位置へ即座に補完できます。
            </p>
            <div className="space-y-1.5 rounded-lg bg-neutral-900 p-3 text-xs text-white">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span>推奨される次の一手: 具体的な創意工夫</span>
              </div>
              <p className="text-neutral-200">
                「その際、最も注力したのは」
                <span className="text-neutral-400">（[Tab] キーで挿入）</span>
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
              04
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              一文一義を死守する「フォーカスセンテンス解析」
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              採用担当者が読みにくいと感じるESの第1位は「一文が長すぎる文章」です。就活ESクラフトは現在編集中の文章をリアルタイムで特定し文字数を計測。60文字を超えた瞬間にアラートを表示し、句点での分割（一文一義）を促します。
            </p>
            <div className="space-y-1.5 rounded-lg bg-white p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700">編集中の一文文字数</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-xs text-emerald-800">
                  42字（適正範囲: 30〜55字）
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                長文になりがちな理由説明や行動の羅列を、すっきりと読みやすいリズムに矯正します。
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-sm font-bold text-white">
              05
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              厳格な敬語・誤字脱字・文体統一チェック
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              「貴社」と「御社」の混同、敬体（です・ます）と常体（である）の混在、二重敬語（ご覧になられる等）、体言止めによるぶっきらぼうさ、主語と述語のねじれをリアルタイムで監視。ワンクリックで修正案を適用できます。
            </p>
            <div className="space-y-1 rounded-lg bg-white p-3 text-xs">
              <div className="flex items-center gap-2 text-rose-700">
                <span className="font-semibold">× 御社（話し言葉）</span>
                <span>→ ○ 貴社（書き言葉）</span>
              </div>
              <div className="flex items-center gap-2 text-rose-700">
                <span className="font-semibold">× ご覧になられる</span>
                <span>→ ○ ご覧になる</span>
              </div>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
              06
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              完全オフライン & IndexedDB 自動永続化 + QR端末同期
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              入力内容はブラウザのIndexedDBに保存されるため、電波のない場所でも作業を続けられます。別の端末へ移すときだけQRを1回読み取り、実行時のP2P通信で下書きを同期できます。サーバーに原稿を預ける必要はありません。
            </p>
            <div className="space-y-1 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold">
                <HardDrive className="h-3.5 w-3.5" />
                <span>ローカルファースト設計（通信失敗ゼロ）</span>
              </div>
              <p className="text-xs text-emerald-800">
                サーバーのダウンやネットワーク切断で原稿が失われる心配は一切ありません。
              </p>
            </div>
          </div>

          {/* Feature 7 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-sm font-bold text-white">
              07
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Web提出用クリーンコピー & バージョンスナップショット
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              執筆中に意図せず紛れ込む「行末の半角スペース」や「無意味な空行」は、文字数オーバーの原因になります。「提出用コピー」ボタンを押すだけで、各社マイページのエントリーフォームに最適な形に自動整形してクリップボードにコピー。また、いつでも過去の推敲段階に戻れるスナップショット保存も可能です。
            </p>
            <div className="flex items-center justify-between rounded-lg bg-white p-3 text-xs">
              <span className="text-neutral-600">余分な空白・連続改行を除去</span>
              <span className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
                ワンクリック完了
              </span>
            </div>
          </div>

          {/* Feature 8 */}
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
              08
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Funstack Static によるゼロクライアントJS RSC最適化
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600">
              巨大な就活ハンドブックや採点ルーブリック、文法規則集をクライアントのJavaScriptバンドルに含めず、React
              Server
              Components（RSC）の事前ビルドスロットとして提供。驚異的な初期ロード速度とバッテリー消費削減を実現しています。
            </p>
            <div className="space-y-1 rounded-lg bg-teal-50 p-3 text-xs text-teal-950">
              <div className="flex items-center gap-1.5 font-bold">
                <Zap className="h-3.5 w-3.5 text-teal-700" />
                <span>Static RSC Payload & ゼロバンドル</span>
              </div>
              <p className="text-xs text-teal-800">
                モバイル環境でも引っかかりなく即座にエディタが立ち上がります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
