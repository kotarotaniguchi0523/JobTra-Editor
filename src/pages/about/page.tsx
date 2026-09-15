import React from 'react';
import {
  ArrowRight,
  HardDrive,
  Scissors,
  Compass,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  BookOpen,
  Sliders
} from 'lucide-react';

/**
 * Landing Page (LP) for 就活ESクラフト
 * Built as a React Server Component (RSC) optimized with Funstack Static.
 * Zero-client-bundle footprint for static marketing content with high semantic SEO readability.
 */
export default function AboutLpPage() {
  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider group-hover:bg-neutral-800 transition-colors">
                ES
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-900">
                就活ESクラフト
              </span>
            </a>
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
              オフラインIndexedDB対応
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/guide/star-method"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>推敲の極意</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>エディタを開く</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>思考を削ぎ落とし、本質を際立たせる就活専用エディタ</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight max-w-4xl mx-auto">
          面接官が3秒で惹き込まれる黄金構成を、<br className="hidden sm:inline" />
          迷わず書き切る。
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          STAR法の黄金比率メーター、冗長表現を一掃する「削りツール」、次の一手を導くゴーストガイダンス。<br />
          外部サーバーに一切送信されない完全ローカルIndexedDB自動保存で、あなたの努力と志望動機を守り抜きます。
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <span>今すぐ執筆を始める（登録不要）</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/guide/word-balance"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <Sliders className="w-4 h-4 text-neutral-500" />
            <span>400字配分モデルを見る</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
              <HardDrive className="w-4 h-4" />
              <span>IndexedDB 自動保存</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-normal">
              ブラウザが落ちても1文字も消えない堅牢なローカル永続化。
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
              <Scissors className="w-4 h-4" />
              <span>削り（Chisel）ツール</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-normal">
              「〜を行う」「〜という風に」等の贅肉をワンタップで削ぎ落とす。
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
              <Layers className="w-4 h-4" />
              <span>STAR黄金比率メーター</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-normal">
              結論15% : 課題20% : 行動45% : 成果10% : 貢献10%を視覚化。
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-2 text-neutral-800 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>完全プライベート</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-normal">
              外部送信ゼロ。大切な個人情報・企業研究メモを安心執筆。
            </p>
          </div>
        </div>
      </section>

      {/* In-depth Features Showcase */}
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
              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-[11px] font-mono text-neutral-600 space-y-1">
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
              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="line-through text-rose-500">〜という風に考える</span>
                  <span className="text-emerald-600 font-semibold">→ 〜と考える（-4字）</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="line-through text-rose-500">〜を行うことができる</span>
                  <span className="text-emerald-600 font-semibold">→ 〜できる（-5字）</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
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
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>推奨される次の一手: 具体的な創意工夫</span>
                </div>
                <p className="text-neutral-200 text-[11px]">
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
              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-700">編集中の一文文字数</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                    42字（適正範囲: 30〜55字）
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
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
              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-rose-700">
                  <span className="font-semibold">× 御社（話し言葉）</span>
                  <span>→ ○ 貴社（書き言葉）</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-rose-700">
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
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>ローカルファースト設計（通信失敗ゼロ）</span>
                </div>
                <p className="text-[11px] text-emerald-800">
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
              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs flex items-center justify-between">
                <span className="text-[11px] text-neutral-600">余分な空白・連続改行を除去</span>
                <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-semibold">ワンクリック完了</span>
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
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs text-teal-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-teal-700" />
                  <span>Static RSC Payload & ゼロバンドル</span>
                </div>
                <p className="text-[11px] text-teal-800">
                  モバイル環境でも引っかかりなく即座にエディタが立ち上がります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              200字・300字・400字・600字・800字から提出要件を選択。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-xs text-neutral-900">STAR構造化</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              行動45%の黄金比率を意識しながら5ブロックを埋める。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-xs text-neutral-900">贅肉の削り & 推敲</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              削りツールと一文フォーカスで文字数を削り、論理を研ぎ澄ます。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
            <span className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-xs text-neutral-900">提出用ワンクリック</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
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

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-neutral-200 text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
              ES
            </div>
            <span className="font-semibold text-neutral-800">就活ESクラフト</span>
            <span>- 本質的・洗練されたES執筆スタジオ</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
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
    </div>
  );
}
