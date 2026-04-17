import { describe, expect, it } from "vitest";
import { getStageById, prepareStageQuestions } from "./stages";

describe("prepareStageQuestions", () => {
  it("shi: 練習を定義順のまま先頭に置き、本番だけシャッフル対象", () => {
    const shi = getStageById("shi")!;
    const prepared = prepareStageQuestions(shi);
    expect(prepared[0]?.id).toBe("shi-p1");
    expect(prepared[1]?.id).toBe("shi-p2");
    const rest = prepared.slice(2);
    expect(rest.every((q) => !q.isPractice)).toBe(true);
    expect(rest).toHaveLength(4);
    expect(new Set(rest.map((q) => q.id)).size).toBe(4);
  });

  it("練習なしステージは全問が並び替え対象", () => {
    const vowels = getStageById("vowels")!;
    const prepared = prepareStageQuestions(vowels);
    expect(prepared).toHaveLength(vowels.questions.length);
    expect(new Set(prepared.map((q) => q.id)).size).toBe(vowels.questions.length);
  });
});
