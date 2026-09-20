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

## 🛠 技術スタック

### フロントエンド & アーキテクチャ

- **Core Framework**: React 19 (`19.3.0`) / React DOM 19
- **React Compiler**: `babel-plugin-react-compiler` (`^1.0.0`) を Vite の本番ビルドで適用
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
- **React Diagnostics**: `react-doctor` (`^0.9.14`)
  - React 19 / RSC boundary、パフォーマンス、アクセシビリティ、セキュリティの自動スキャン
- **Test Framework**: `vitest` (`^5.0.0`)
  - ユニット・統合テスト（87件パス）とPlaywrightのPage Objectブラウザテスト
- **Dependency Audit**: `knip` (`6.35.1`)
  - 未使用ファイル・依存・exportをCIで検出
- **Structural Conventions**: `konsistent` (`1.0.0-beta.4`)
  - `konsistent.json` でfeature/widgetの責務境界、命名規約、Funstackの予約route名を検査
- **Agent Context**: `lat.md` (`0.12.2`)
  - `lat.md/` に設計判断を保持し、wiki linkとソース参照をCIで検証
- **CI / Pipeline**: GitHub Actions
  - `ci.yml`: lockfile再現性、`oxfmt`、TypeScript、Vitest、Knip、Konsistent、lat check、minitype CLI PDF検証
    - `konsistent` と `lat check`も独立ジョブとして実行し、各チェックは並列に動作
  - `react-doctor.yml`: PR変更スキャン、インラインレビューコメント、ヘルススコア計測
  - `concurrency`（最新コミット優先自動キャンセル）および最小権限の原則（Least Privilege）を適用

---

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js `22.x` 以上
- npm

### インストール

```bash
npm ci
```

### Dexie Cloud を有効にする場合

Dexie Cloud の管理画面または `npx dexie-cloud create` で DB を用意し、公開 DB URL をビルド時環境変数に指定します。

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

# 単体テスト (Vitest)
npm test

# プロダクションビルド
npm run build

# 不要なファイル・依存・exportの検出
npm run knip

# 構造規約のschema検証と監査
npm run konsistent:validate
npm run konsistent

# Agent knowledge graphのリンク検証
npm run lat:check

# Node.js上でminitypeの実PDFを生成するスモークテスト
npm run verify:pdf
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
