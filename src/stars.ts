/**
 * ステージ全体のミス数から星を算出。
 * 3: ノーミス / 2: ミス2回以下（1〜2） / 1: クリア（ミス3回以上）
 */
export function starsForStage(totalMistakes: number): 1 | 2 | 3 {
  if (totalMistakes === 0) return 3;
  if (totalMistakes <= 2) return 2;
  return 1;
}
