# 就活ESクラフト (Shukatsu ES Craft)

> 🌐 **Web サイト**: [https://jobtra-editor.lolipop-now.app/](https://jobtra-editor.lolipop-now.app/)  
> 📄 **ライセンス**: MIT License

就活エントリーシート（ES）の本質的・高機能下書き＆推敲エディタ。  
思考の言語化（STAR法）、リアルタイム構造監査、文字数・文体バランス調整、版管理をスムーズに行えるモダンWebアプリケーションです。

---

## 💡 プロダクト概要

エントリーシート作成において多くの就活生が直面する「何をどう書けばいいかわからない」「結論ファーストになっているか不安」「文字数調整で内容が削られすぎる」という課題を解決するために設計されました。

### 主な特徴・機能

1. **STAR法 構造化エディタ**
   - **S**ituation（状況）、**T**ask（課題）、**A**ction（行動）、**R**esult（成果）に分解して思考を整理。
   - 黄金比（行動・成果に重きを置いた構成比率）のリアルタイムビジュアルメーター表示。

2. **リアルタイム推敲・監査エンジン**
   - 結論ファースト（一文目の訴求力）の自動検出とフィードバック。
   - 「〜と思います」等の曖昧表現、「〜させていただく」等の過剰敬語、冗長表現の検知。
   - 1文の長さや文字数リミット（200字 / 400字 / 800字等）の超過アラート。

3. **ゴーストガイダンス（Ghost Guidance）**
   - 入力中の文脈に応じた適切な接続詞や次の一手を示唆するリアルタイムアシスト。

4. **マルチドラフト & バージョン履歴管理**
   - 設問別（学生時代に力を入れたこと、志望動機、自己PRなど）のドラフト管理。
   - 過去のスナップショット復元・比較機能。
   - ブラウザストレージ（IndexedDB / localStorage）を活用した完全ローカル・オートセーブ。

5. **提出前チェックリスト & 推敲ハンドブック**
   - 誤字脱字、指示代名詞の多用、業界用語の過多などを確認できる提出前確認リスト。
   - RSC（React Server Components）非同期配信による軽量なハンドブック表示。

6. **ブラウザ内エクスポート**
   - Markdown（`.md`）と、日本語組版エンジン minitype による印刷用PDFをブラウザ内で生成。
   - PDF生成APIやアプリ用データベースを必要とせず、静的ホスティングだけで利用可能。

7. **QR 1回の端末間同期**
   - 端末間の同期時だけ、短命のQRペアリング情報を使ってTrystero/WebRTCで接続。
   - 下書き・revision DAGは各端末のIndexedDBに保持し、共通祖先からの3-way mergeと競合選択をブラウザ内で実行。
   - アプリ独自の実行時サーバー、クラウドDB、ファイルダウンロードは不要。WebRTCの接続確立に公開シグナリング網を利用しますが、原稿データはP2P DataChannelで送ります。

8. **任意の Dexie Cloud 同期**
   - `VITE_DEXIE_CLOUD_SYNC_URL` を設定した静的デプロイでは、既存の `es_craft_indexed_db` を Dexie Cloud と同期できます。
   - アプリ用の API サーバーは不要ですが、Dexie Cloud の管理サービスとブラウザからの実行時通信は必要です。未設定時は従来の完全ローカル動作を維持します。
   - 同期テーブルは既存のドラフト ID をそのまま使い、認証は Dexie Cloud のブラウザ側ログイン（OTP/OAuth）に委ねます。秘密鍵やカスタムトークン取得処理は静的バンドルに含めません。

---

## 📘 利用チュートリアル

### 1. 初回利用

1. 「新規作成」で下書きを作ります。
2. タイトル、企業名・設問テーマを入力します。
3. 必要に応じて設問カテゴリ、上限字数、進捗を選びます。初期状態は未選択です。
4. 本文を書き始めると、文字数、構成バランス、文章上の注意点が更新されます。
5. 入力内容はブラウザの IndexedDB に自動保存されます。

### 2. 下書きの検索と整理

- サイドバーの検索欄で、タイトル・企業名・本文を横断検索できます。
- カテゴリフィルターは単一選択で、「すべて」「未分類」「ガクチカ」「志望動機」「自己PR」「困難・挫折」「就活の軸」「入社後」「自由記述」を切り替えられます。
- 「重要」フィルターではスターを付けた下書きだけを表示します。
- 下書きの作成、選択、複製、スター付け、削除に対応しています。

### 3. 執筆支援

- **ゴーストガイダンス**: 文脈に応じた接続詞や次の一文の候補を表示します。
- **フォーカス・センテンス**: カーソルのある一文だけを強調し、その文の文字数を表示します。
- **タイプライター視線固定**: 入力中の行を画面中央付近に保ちます。
- **書式整理**: 行末空白や連続改行を整理します。
- **削りツール**: 冗長表現を候補として示し、個別または一括で削除できます。
- **文字数・監査**: 上限字数、一文の長さ、曖昧表現、過剰敬語、冗長表現を確認できます。

### 4. 問題構成と STAR 構成

「STAR構成」タブでは、次の5項目に分けて内容を整理できます。

- 結論
- 状況・課題
- 行動
- 成果
- 貢献・再現性

構成比率メーターで行動・成果に十分な文字数を使えているか確認し、「本文エディタへ反映して執筆へ」で本文へ反映します。カテゴリを変更すると、そのカテゴリに対応した構成指標へ切り替わります。

### 5. プレビュー、レビュー、履歴

- 「プレビュー」で提出前の見た目を確認します。
- 提出前チェックリストで、設問への回答、主体性、具体性、誤字、敬語、論理の流れを確認します。
- 推敲ハンドブックで STAR 法、文字数配分、書面マナー、採点基準を確認できます。
- スナップショットを保存すると、過去の推敲段階を比較・復元できます。

### 6. エクスポートと提出

プレビューまたはヘッダーの「エクスポート」から、Markdown または PDF を生成できます。

- **Markdown**: YAML メタデータ、本文、STAR 構成メモ、推敲メモを含めて `.md` として出力できます。
- **PDF**: 日本語組版をブラウザ内で実行し、企業名・文字数・作成日・STAR メモの有無を選べます。
- **提出用にコピー**: 行末空白と不要な改行を整理してクリップボードへコピーします。

本文はエクスポート時にアプリ用サーバーへ送信されません。

### 7. QR コード端末同期

1. 「端末同期」を開き、送信側で「QRを発行する」を押します。
2. 受信側で「QRを読み取る」を押します。
3. カメラが使えない場合は、一時トークンを手入力します。
4. 同期中は両方の画面を開いたままにします。
5. 競合が発生した場合は、項目ごとにこの端末・相手の端末のどちらを残すか選択します。

QR は短時間で失効する一時鍵で、本文は同期リレーへ保存されません。接続時だけ WebRTC DataChannel で端末間転送します。

### 8. 個人 Dexie Cloud 同期

個人 Dexie Cloud を使う場合は、[Dexie Cloud 設定ガイド](/guide/dexie-cloud)を開いてください。自分のデータベース URL と公開 Origin を設定し、PC とスマートフォンで同じ URL・認証を使用します。URL を設定しない場合はローカル IndexedDB のみで動作します。

### 9. AI / WebMCP チュートリアル

対応ブラウザの AI は WebMCP からチュートリアルを取得できます。

- `get_jobtra_tutorial`: 初回利用、執筆、レビュー、同期の説明
- `get_jobtra_cloud_setup_guide`: 個人 Dexie Cloud の設定説明
- `apply_tutorial_example`: ユーザー確認後に例文を入力
- `get_writing_context`: 本文、選択範囲、STAR 構成を取得
- `analyze_writing`: 文字数、監査、構成比、冗長表現を分析
- `compare_writing_versions`: 現在の本文と履歴を比較

AI は例文を入力した後に `analyze_writing` を呼び出し、結果を説明できます。本文の上書きや履歴変更は、ユーザーの明示的な確認なしには実行しません。

AI 向けの原文は [`public/ai/jobtra-tutorial.ja.md`](public/ai/jobtra-tutorial.ja.md) として静的配信されます。通常の React バンドルや画面のナビゲーションには含めず、WebMCP が必要なときだけ取得します。

---

## 🛠 技術スタック

### フロントエンド & アーキテクチャ

- **Core Framework**: React 19 (`19.3.0`) / React DOM 19
- **React Compiler**: Vite 8 の Rust 製 `oxc-transform-react` (`0.145.0`) をビルド時に適用
  - 手動の `memo` / `useMemo` / `useCallback` に頼らず、コンパイラが再利用最適化を担当
- **Build Tool**: Vite 8 (`^8.2.2`)
- **Static & Routing**: [`@funstack/static`](https://uhyo.github.io/funstack-static/) (`^1.3.2`), [`@funstack/router`](https://github.com/uhyo/funstack-static) (`^1.4.0`)
  - [FUNSTACK Static 公式ドキュメント](https://uhyo.github.io/funstack-static/) / [GitHub リポジトリ](https://github.com/uhyo/funstack-static)
  - サーバーレス・静的ホスティング上で React Server Components (RSC) をビルド時事前レンダリング
  - `defer()` による遅延ペイロード分割配信とクライアントルーターとの協調動作
- **State composition**: サーバーコンポーネントのレイアウトはスロットと `<Outlet />` を合成し、ブラウザローカルのドラフト状態は `useSyncExternalStore` の末端クライアントコンポーネントから購読
  - Context / Provider で RSC ツリーをラップせず、IndexedDB のみをブラウザ側で利用
- **Styling**: Tailwind CSS v4 (`^4.1.14`)
- **Icons**: `lucide-react`
- **PDF Export**: [`@minitype/minitype`](https://www.npmjs.com/package/@minitype/minitype) (`0.1.6`)
  - ブラウザ用エントリと同梱フォントを使い、PDFをクライアント側で生成
- **Language**: TypeScript (`~5.8.2`)

### 開発・品質管理・CI (Quality Assurance)

- **Formatter**: `oxfmt` (`^0.68.0`)
  - Rust製の高速フォーマッター（Tailwind クラス順序自動ソート対応）
- **React Diagnostics**: `react-doctor` (`0.9.14`)
  - React 19 / RSC boundary、パフォーマンス、アクセシビリティ、セキュリティの自動スキャン
- **Test Framework**: `vitest` (`^5.0.0`)
  - ユニット・統合テストとPlaywrightのPage Objectブラウザテスト
- **Dependency Audit**: `knip` (`6.35.1`) plus the npm-only lockfile policy check
  - 未使用ファイル・依存・exportと、余分なパッケージマネージャーlockfileをCIで検出
- **Package Manifest Policy**: `npm-package-json-lint` (`11.0.0`)
  - npm-onlyのroot package manifestについて、依存元、実行環境、ESM、private設定、scriptsと依存関係の順序をCIで検証
- **Structural Conventions**: `konsistent` (`1.0.0-beta.4`)
  - `konsistent.json` でfeature/widgetの責務境界、命名規約、Funstackの予約route名を検査
- **Agent Context**: `lat.md` (`0.12.2`)
  - `lat.md/` に設計判断を保持し、wiki linkとソース参照をCIで検証
- **CI / Pipeline**: GitHub Actions
  - `ci.yml`: lockfile再現性、`oxfmt`、TypeScript、Vitest、Knip、Konsistent、lat check、minitype CLI PDF検証
    - `konsistent` と `lat check`も独立ジョブとして実行し、各チェックは並列に動作
    - Playwrightの主要正常系をChromium、Firefox、WebKitで実行
  - `react-doctor.yml`: PR変更スキャン、インラインレビューコメント、ヘルススコア計測
  - `concurrency`（最新コミット優先自動キャンセル）および最小権限の原則（Least Privilege）を適用

---

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js `^22.22.2` / `^24.15.0` / `>=26.0.0`
- npm `12.0.2`

### インストール

```bash
npm ci
```

### Dexie Cloud を有効にする場合

Dexie Cloud の管理画面または `npm exec -- dexie-cloud create` で DB を用意し、公開 DB URL をビルド時環境変数に指定します。

```bash
VITE_DEXIE_CLOUD_SYNC_URL=https://<your-db>.dexie.cloud npm run build
```

URL が空の場合はクラウド同期を行いません。サービスワーカーは使用せず、アプリが開いている間は WebSocket、オフライン中は IndexedDB のキューで同期します。アプリ用サーバー秘密情報を `VITE_` 変数に入れないでください。

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスします。

### コード品質チェック & テスト

```bash
# フォーマットチェック (oxfmt)
npm run format:check

# フォーマット自動修正 (oxfmt)
npm run format

# TypeScript 型チェック
npm run lint

# Reactコードと依存関係の全件診断
npm run doctor -- . --verbose --no-cache --blocking warning --yes

# 単体テスト (Vitest)
npm test

# プロダクションビルド
npm run build

# 不要なファイル・依存・exportと余分なlockfileの検出
npm run knip

# package.jsonのnpm-onlyポリシーとメタデータ検証
npm run lint:package-json

# npm-only lockfile policy (knip does not inspect repository artifacts)
npm run check:lockfiles

# 依存パッケージの既知脆弱性監査
npm audit

# 構造規約のschema検証と監査
npm run konsistent:validate
npm run konsistent

# Agent knowledge graphのリンク検証
npm run lat:check

# Node.js上でminitypeの実PDFを生成するスモークテスト
npm run verify:pdf

# Playwright ブラウザテスト（CIでは主要3エンジンを先にインストール）
npm exec -- playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

---

## 📂 ディレクトリ構成（抜粋）

```
.
├── .github/workflows/         # GitHub Actions CI 設定 (ci.yml, react-doctor.yml)
├── .oxfmtrc.json              # oxfmt 設定ファイル
├── konsistent.json             # feature-slice・命名・route構造の規約
├── AGENTS.md                  # lat.md運用を含むエージェント向け作業規約
├── lat.md/                    # 設計判断・状態所有権・出力仕様のknowledge graph
├── src/
│   ├── app/                   # Static RSCのアプリシェル・build entry・runtime
│   │   ├── Root.tsx
│   │   ├── build.ts
│   │   ├── runtime/DraftRuntime.tsx
│   │   └── styles/index.css
│   ├── entities/draft/        # Draftの型、純粋な遷移、IndexedDB adapter
│   ├── features/              # ユーザー機能（export、snapshot、文章支援）
│   ├── widgets/               # 画面パーツ（workspace、editor、preview等）
│   │   └── */{ui,rsc}/         # interaction islandとbuild-time静的スロット
│   ├── pages/                 # ファイルシステムルーティングのページ合成
│   └── shared/validation/     # feature間で共有するValibot schema
├── knip.json                  # 未使用コード・依存の検査設定
└── tests/                     # 所有者別のユニットテスト (Vitest)
    ├── entities/draft/        # Draft状態遷移
    ├── features/export/       # Export変換・PDF
    ├── features/writing-assistance/ # 文章支援ロジック
    └── shared/                # 共有Valibot境界
```

ファイル名は、Reactコンポーネントを`PascalCase.tsx`、Hook・処理モジュールを`camelCase.ts`、featureディレクトリを`kebab-case`とします。`page.tsx`などFunstack Staticのルート予約名だけは例外です。型はDraft固有なら`entities/draft/model/types.ts`、文章支援固有なら`features/writing-assistance/model/types.ts`のように所有者の近くへ置き、汎用型の投げ込みファイルは作りません。

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
