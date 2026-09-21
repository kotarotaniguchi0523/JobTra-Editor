# JobTra の個人 Dexie Cloud 設定

この手順は、JobTra と自分で用意した Dexie Cloud データベースを接続するための説明です。

## 1. 自分の Dexie Cloud データベースを作る

Dexie Cloud の CLI または管理画面で、自分のデータベースを作成します。

```bash
npm exec -- dexie-cloud create
```

作成時に表示されるデータベース URL だけを JobTra に入力します。`dexie-cloud.key` に含まれるクライアント秘密情報は、JobTra やブラウザに入力しません。

## 2. JobTra の Origin を許可する

JobTra を公開している Origin を Dexie Cloud に登録します。例:

```bash
npm exec -- dexie-cloud whitelist https://your-jobtra-origin.example
```

開発中は `http://localhost:3000` も必要に応じて許可します。

## 3. JobTra に URL を入力する

JobTra の同期設定で、作成したデータベース URL だけを入力します。URL はこのブラウザのローカル設定に保存され、共有データベース URL をアプリ側で固定しません。

## 4. 同じアカウントで別端末から使う

PC とスマートフォンの両方で同じデータベース URL を設定し、Dexie Cloud の同じ認証方法でサインインします。ローカルの IndexedDB は各端末にありますが、Dexie Cloud が同期対象を保持します。

## 注意

- データベース URL は接続先であり、管理者秘密情報ではありません。
- Dexie Cloud のデータベース作成、Origin 許可、料金や容量の管理はデータベース所有者が行います。
- URL を設定しない場合、JobTra は従来どおりローカル IndexedDB だけで動作します。
