# 簡略ローマ字・英字大文字化・Mac 効果音修正計画

## Summary

- この plan は、`docs/kana-table-mode-plan.md` で決めた一般表記寄りのローマ字方針を上書きする最新方針とする。
- ローマ字規則を初学者向けの単一路へ寄せる。`し=si` `ち=ti` `つ=tu` `じ=zi` `ず=zu` `づ=du` を採用し、拗音も `sya/syu/syo` `tya/tyu/tyo` `zya/zyu/zyo` に統一する。
- 画面上に表示する英字はすべて大文字にする。五十音表、通常ステージ、実践モード、わかばモード、進行中の残りローマ字表示まで対象にする。
- Mac で判定音が鳴らない問題は、今の音色は維持したまま Web Audio の初回アンロックと `resume()` タイミングを修正して解消する。

## Key Changes

### 1. ローマ字規則の全面更新

- ローマ字の定義元を新ルールに更新する。
  - 清音: `し=si` `ち=ti` `つ=tu` `ふ=hu`
  - 濁音: `じ=zi` `ず=zu` `ぢ=di` `づ=du`
  - そのほか: `を=wo` `ん=n`
  - 拗音: `しゃ/しゅ/しょ=sya/syu/syo` `ちゃ/ちゅ/ちょ=tya/tyu/tyo` `じゃ/じゅ/じょ=zya/zyu/zyo`
- 五十音表データ、通常ステージ、実践モード語彙、わかばモードの `かな -> ローマ字` 変換を同じ規則に揃える。
- `romaji.ts` の入力判定ロジック自体はそのまま活かし、各 `acceptedAnswers` と `answer` を新ルールへ更新する。
- `wakaba/kanaToRomaji.ts` は五十音表データを参照しているため、表データ更新後に自動で新ルールへ揃う前提で進める。
- 五十音表の拗音エントリは既存定義を保ったまま、`sha/cha/ja` 系を `sya/tya/zya` 系へ一括で置換する。
- 既存のペア問題や単語の文字列も新ルールに合わせて更新する。
  - 例: `sashi -> sasi`, `tachi -> tati`, `shio -> sio`, `chizu -> tizu`, `tsuki -> tuki`

### 2. 英字表示の大文字化

- 画面上で見せるローマ字はすべて大文字にする。
- 対象は以下を含む。
  - 通常プレイ、実践モード、わかばモードの進行表示
  - `displayHint` のような補助ローマ字
  - 五十音表の各マス内ローマ字
  - 残りローマ字や入力済み英字の可視表示
- 入力判定は今までどおり小文字正規化で扱い、`Shift` を要求しない。
- 実装は CSS の `text-transform` に寄せず、表示文字列側で大文字化する方針にする。
  - 理由: 進行表示やテスト期待値を一貫させやすい。
- 音声読み上げや `voiceText` は変更しない。

### 3. Mac の判定音修正

- `useAudioFeedback` を、毎回新しい文脈を雑に叩く形ではなく、同一 `AudioContext` を安定して再利用する形へ整理する。
- `playOk` `playSoftNg` `playClear` は、ノード生成前に `ctx.state !== "running"` を確認し、必要なら `await ctx.resume()` 後に再生する。
- 初回のキーボード入力やクリックを使って最初の `resume()` を確実に完了させる。`resume` 中に重なった再生要求は直列化せず、その呼び出し単位で再生してよい。
- 音色そのものは維持する。
  - `OK`: 現在の高い `sine`
  - `NG`: 現在の低い `triangle`
  - `CLEAR`: 現在の三和音
- gain は即値代入ではなく短い envelope を必須にする。
  - 開始時: `0 -> peak` を約 `5ms` で線形に上げる
  - 終了時: 音の終端までに `0` へ線形に戻す
  - これで Mac Safari / Chrome の pop ノイズを避ける
- ページ側の呼び出しシグネチャは基本維持し、`Play` `PracticePlay` `KanaTablePlay` `WakabaPlay` 側の変更は最小限に留める。

## Public Interfaces / Types

- 型追加は不要。
- 既存の `Question.answer` `acceptedAnswers` `displayHint` の中身が新ローマ字・大文字表示へ変わる。
- 五十音表データと `wakaba` の変換結果が新ローマ字規則へ変わる。
- `useAudioFeedback` の戻り値名は維持するが、内部実装は非同期再開前提に変わる。

## Test Plan

- `romaji.test.ts` の期待値を新ルールに更新し、`si` `ti` `tu` `zi` `du` の完了・接頭辞判定を確認する。
- `kanaTable.test.ts` で `し/ち/つ/じ/づ` と `しゃ/ちゃ/じゃ` 系のローマ字が新ルールになっていることを確認する。
- `stages.test.ts` と実践モード関連テストで、通常ステージと単語出題が新ローマ字で成立することを確認する。
- `wakaba/kanaToRomaji.test.ts` で `しゅ -> syu` `ち -> ti` `づ -> du` 系が反映されることを確認する。
- 表示テストでは、進行表示やヒントの英字が大文字で描画されることを確認する。
- `Play.test.tsx` `Result.test.tsx` など既存のプレイ系テストと、単語・五十音表まわりの期待値は新ローマ字へ一括更新し、その上で正解進行とミス判定が壊れていないことを確認する。
- Mac 想定の音まわりは、`AudioContext` の `resume` をモックして、停止状態からでも `playOk` `playSoftNg` `playClear` が再生処理に到達することを確認する。
- `npm test` と `npm run build` が通ること。

## Assumptions

- 今回の簡略ローマ字は、一般的表記ではなく教材の一貫性を優先する。
- `ず=zu`、`づ=du` で区別する。
- 拗音は `sya/tya/zya` 系に揃える。
- 大文字化は表示のみで、入力は小文字ベースのまま受け付ける。
- 効果音は Mac での再生率改善を優先しつつ、聞こえ方は現状から大きく変えない。
