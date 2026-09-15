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

---

## 🛠 技術スタック

### フロントエンド & アーキテクチャ

- **Core Framework**: React 19 (`19.3.0`) / React DOM 19
- **Build Tool**: Vite 8 (`^8.2.2`)
- **Static & Routing**: [`@funstack/static`](https://uhyo.github.io/funstack-static/) (`^1.3.2`), [`@funstack/router`](https://github.com/uhyo/funstack-static) (`^1.4.0`)
  - [FUNSTACK Static 公式ドキュメント](https://uhyo.github.io/funstack-static/) / [GitHub リポジトリ](https://github.com/uhyo/funstack-static)
  - サーバーレス・静的ホスティング上で React Server Components (RSC) をビルド時事前レンダリング
  - `defer()` による遅延ペイロード分割配信とクライアントルーターとの協調動作
- **Styling**: Tailwind CSS v4 (`^4.1.14`)
- **Motion / Animation**: `motion` (`^12.23.24`), `canvas-confetti`
- **Icons**: `lucide-react`
- **Language**: TypeScript (`~5.8.2`)

### 開発・品質管理・CI (Quality Assurance)

- **Formatter**: `oxfmt` (`^0.68.0`)
  - Rust製の高速フォーマッター（Tailwind クラス順序自動ソート対応）
- **React Diagnostics**: `react-doctor` (`^0.9.14`)
  - React 19 / RSC boundary、パフォーマンス、アクセシビリティ、セキュリティの自動スキャン
- **Test Framework**: `vitest` (`^5.0.0`)
  - ユニットテスト・ロジックテスト（26/26 件パス）
- **CI / Pipeline**: GitHub Actions
  - `ci.yml`: 依存関係の1回インストール、キャッシュ共有、`oxfmt --check` & `vitest` の高速並列実行
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
```

---

## 📂 ディレクトリ構成（抜粋）

```
.
├── .github/workflows/         # GitHub Actions CI 設定 (ci.yml, react-doctor.yml)
├── .oxfmtrc.json              # oxfmt 設定ファイル
├── public/                    # 静的アセット
├── src/
│   ├── components/            # UIコンポーネント
│   │   ├── server/            # React Server Components (ガイド、ハンドブック等)
│   │   └── ...                # Client Components (エディタ、サイドバー等)
│   ├── context/               # DraftContext (ドラフト・状態管理)
│   ├── services/              # 分析・ロジック層 (STAR法、文体監査、IndexedDB)
│   ├── App.tsx                # ルートコンポーネント (RSC composition)
│   └── types.ts               # グローバル型定義
└── tests/                     # ユニットテスト (Vitest)
```

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
