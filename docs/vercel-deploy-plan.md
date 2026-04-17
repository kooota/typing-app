# Vercel 無料枠での初回デプロイ計画

## Summary

現在のアプリは Vite + React + BrowserRouter 構成で、バックエンド不要の静的 SPA として公開できる。
初回テスト公開先は Vercel Hobby を使い、URL は `*.vercel.app` のまま運用する。
目的は「無料範囲だけで、娘さんが実機テストできる公開環境を整えること」で、独自ドメインや有料機能は入れない。
公開環境は HTTPS が標準で有効になるため、`Web Speech API` や `AudioContext` の secure context 前提も満たせる。

参考:

- Vercel Hobby は無料枠あり: https://vercel.com/docs/accounts/plans/hobby
- Vercel の rewrite 設定: https://vercel.com/docs/routing/rewrites

## Key Changes

### デプロイ方式

- Vercel アカウント作成済みで、GitHub リポジトリ `kooota/typing-app` に Vercel から接続できることを事前条件にする。
- GitHub リポジトリは `origin` の実設定どおり `kooota/typing-app` を使い、`main` ブランチを本番デプロイ対象にする。
- Vercel 側の framework preset は `Vite` を使う。
- build command は `npm run build`、output directory は `dist` にする。
- `npm run build` は `tsc --noEmit && vite build` なので、TypeScript エラーが 1 件でも残っているとデプロイは失敗する前提で運用する。
- 環境変数は初版では不要。Preview / Production とも未設定で進める。
- ローカルと Vercel の差分を減らすため、Node バージョンは `package.json` の `engines.node` で固定する前提にする。

### SPA 対応

- `BrowserRouter` を使っているため、直接 `/play/:stageId` や `/result/:stageId` を開いても `index.html` に返す rewrite を入れる。
- Vercel の `Vite` preset 依存の暗黙挙動には寄せず、`vercel.json` に SPA fallback を明示して挙動を固定する。
- `vercel.json` には次の rewrite を定義する。

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- キャッシュヘッダや独自レスポンスヘッダは初版では追加しない。Vite のハッシュ付き asset と Vercel デフォルト挙動を使う。

### 公開と運用

- 初回公開 URL は Vercel 自動発行の `*.vercel.app` を使う。
- GitHub に push したら自動で Preview / Production デプロイされる状態にする。
- テスト共有は Production URL を基本にし、変更確認は Preview URL を使う。
- 無料範囲に限定するため、独自ドメイン、Analytics、有料監視、有料アドオンは設定しない。
- Vercel 固有機能の `Edge Functions`、`ISR`、`Image Optimization` は使わず、将来 Cloudflare Pages へ移しやすい構成を保つ。
- `public/favicon.ico` を追加し、公開時の `/favicon.ico` リクエストが SPA rewrite に吸われない状態にする。

### テスト前チェック

- Production URL で `/`、`/play/vowels`、`/result/vowels`、`/parent` に直接アクセスして 404 にならないことを確認する。
- `/result/vowels` は SPA fallback により `index.html` が返り、クライアントルータがトップへ戻せることを確認する。結果画面そのものの直アクセス成功は期待しない。
- MacBook Pro の Chrome で、音声あり・音声なし、キーガイド ON/OFF、保護者設定画面の遷移を確認する。
- `localStorage` による進捗保存が公開環境でも機能することを確認する。
- push 後に自動デプロイが走り、失敗時に Vercel 上で build log を見られることを確認する。

## Important Interfaces / Config

- 追加する公開設定ファイルは `vercel.json`。
- framework preset は `Vite`。
- build command は `npm run build`。
- output directory は `dist`。
- production branch は `main`。
- SPA fallback 用 rewrite は次を使う。

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- Node バージョンは `package.json` の `engines.node` で固定する。
- ルーティングは `BrowserRouter` を継続し、Vercel rewrite で SPA fallback を吸収する。
- `/result/:stageId` は `location.state` 欠如時にトップへリダイレクトする現実装を前提にする。
- HTTPS は Vercel 標準設定を使い、音声関連 API の secure context 条件を満たす。
- favicon 用に `public/favicon.ico` を追加する。

## Test Plan

- 事前条件として、Vercel アカウント作成と GitHub リポジトリ接続権限確認が済んでいること。
- `main` への push で Production デプロイが成功すること。
- Preview deploy が PR ごとに発行されること。
- Preview / Production とも build log 上で TypeScript エラー 0 件のまま `npm run build` が通ること。
- `/` へ直接アクセスしてトップ画面が開くこと。
- `/play/vowels` へ直接アクセスしてプレイ画面が開くこと。
- `/result/vowels` へ直接アクセスしても 404 にならず、クライアント側でトップへ戻ること。
- `/parent` へ直接アクセスしても 404 にならず、保護者設定画面のルーティングが生きていること。
- 本番 URL 上でステージ開始、キーガイド表示、進捗保存、結果画面遷移が成立すること。
- 公開環境でも保護者設定の長押し導線、ガイド切替、音声切替、リセットが動くこと。
- Chrome 再読込後も進捗が保持されること。

## Assumptions

- 初回公開はテスト目的で、一般公開や本格運用はまだ想定しない。
- 独自ドメインは使わず、`vercel.app` の無料 URL で十分とする。
- 無料枠を超える規模のアクセスは想定しない。
- Production URL は家族など限定した相手にのみ共有し、不特定多数へ配布しない。
- 今後 Cloudflare Pages へ移す余地はあるが、初回は最短公開を優先して Vercel を採用する。
