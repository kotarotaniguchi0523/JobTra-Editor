import React from 'react';
import { HardDrive, Compass, Zap } from 'lucide-react';

export const AboutFeatures: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            就活生の勝率を最大化する8つの核
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            一般のメモ帳やWordではカバーできない、就活エントリーシート特有の推敲課題を解決するために設計されています。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              STAR法構造化エディタ & 黄金比率メーター
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              「結論（Headline）」「状況・課題（Context）」「独自の行動（Action）」「定量的成果（Result）」「再現性・貢献（Future）」の5ステップに分けて思考を整理。リアルタイムに各ブロックの文字数と比率を計算し、面接官が好む「行動に45%割く配分」ができているかを視覚的に評価します。
            </p>
            <div className="p-3 bg-white rounded-lg text-xs font-mono text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>結論（Headline）</span>
                <span className="font-semibold text-neutral-800">15%</span>
              </div>
              <div className="flex justify-between">
                <span>状況・課題（Context）</span>
                <span className="font-semibold text-neutral-800">20%</span>
              </div>
              <div className="flex justify-between text-amber-700 font-bold">
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
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              冗長表現を削ぎ落とす「削り（Chisel）ツール」
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              400字や300字の厳格な制限の中で最も無駄なのは、日本語の贅肉表現です。「〜という風に考える」「〜を行うことができる」「〜のサポートを担当した」などのまわりくどい言い回しを検出し、ワンタップで「〜と考える」「〜できる」「〜を支援した」に置換。貴重な文字数を生み出します。
            </p>
            <div className="p-3 bg-white rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="line-through text-rose-500">〜という風に考える</span>
                <span className="text-emerald-600 font-semibold">→ 〜と考える（-4字）</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="line-through text-rose-500">〜を行うことができる</span>
                <span className="text-emerald-600 font-semibold">→ 〜できる（-5字）</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="line-through text-rose-500">〜のサポートを担当した</span>
                <span className="text-emerald-600 font-semibold">→ 〜を支援した（-5字）</span>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              思考を止まらせない「ゴーストガイダンス」
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              エディタ上で執筆中、直前の文末や構成位置を自動検知。「次の一手（独自の工夫・定量的根拠・接続語）」をガイダンスとしてエディタ下部に提示します。「その際、最も注力したのは」「これにより」などの論理展開フレーズは、Tabキー1つでカーソル位置へ即座に補完できます。
            </p>
            <div className="p-3 bg-neutral-900 text-white rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>推奨される次の一手: 具体的な創意工夫</span>
              </div>
              <p className="text-neutral-200">
                「その際、最も注力したのは」<span className="text-neutral-400">（[Tab] キーで挿入）</span>
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              一文一義を死守する「フォーカスセンテンス解析」
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              採用担当者が読みにくいと感じるESの第1位は「一文が長すぎる文章」です。就活ESクラフトは現在編集中の文章をリアルタイムで特定し文字数を計測。60文字を超えた瞬間にアラートを表示し、句点での分割（一文一義）を促します。
            </p>
            <div className="p-3 bg-white rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700">編集中の一文文字数</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs">
                  42字（適正範囲: 30〜55字）
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                長文になりがちな理由説明や行動の羅列を、すっきりと読みやすいリズムに矯正します。
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              厳格な敬語・誤字脱字・文体統一チェック
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              「貴社」と「御社」の混同、敬体（です・ます）と常体（である）の混在、二重敬語（ご覧になられる等）、体言止めによるぶっきらぼうさ、主語と述語のねじれをリアルタイムで監視。ワンクリックで修正案を適用できます。
            </p>
            <div className="p-3 bg-white rounded-lg text-xs space-y-1">
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
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              06
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              完全オフライン & IndexedDB 自動永続化 + タブ同期
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              一般的なWebアプリと異なり、入力内容は1文字ごとにブラウザのIndexedDBに安全に記録されます。万が一誤ってブラウザやタブを閉じても、電波のない新幹線やカフェでも、完全にオフラインで作業を再開可能。複数タブ間のリアルタイム同期機能も標準装備しています。
            </p>
            <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <HardDrive className="w-3.5 h-3.5" />
                <span>ローカルファースト設計（通信失敗ゼロ）</span>
              </div>
              <p className="text-xs text-emerald-800">
                サーバーのダウンやネットワーク切断で原稿が失われる心配は一切ありません。
              </p>
            </div>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold text-sm">
              07
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              Web提出用クリーンコピー & バージョンスナップショット
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              執筆中に意図せず紛れ込む「行末の半角スペース」や「無意味な空行」は、文字数オーバーの原因になります。「提出用コピー」ボタンを押すだけで、各社マイページのエントリーフォームに最適な形に自動整形してクリップボードにコピー。また、いつでも過去の推敲段階に戻れるスナップショット保存も可能です。
            </p>
            <div className="p-3 bg-white rounded-lg text-xs flex items-center justify-between">
              <span className="text-neutral-600">余分な空白・連続改行を除去</span>
              <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-xs font-semibold">ワンクリック完了</span>
            </div>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
              08
            </div>
            <h3 className="font-bold text-sm text-neutral-900">
              Funstack Static によるゼロクライアントJS RSC最適化
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              巨大な就活ハンドブックや採点ルーブリック、文法規則集をクライアントのJavaScriptバンドルに含めず、React Server Components（RSC）の事前ビルドスロットとして提供。驚異的な初期ロード速度とバッテリー消費削減を実現しています。
            </p>
            <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-teal-700" />
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
