import { describe, expect, it } from "vitest";
import { getStageById, prepareStageQuestions } from "./stages";

describe("prepareStageQuestions", () => {
  it("母音ステージは1文字を先に、その後で2文字問題に進む", () => {
    const vowels = getStageById("vowels")!;
    const prepared = prepareStageQuestions(vowels);
    expect(prepared.map((q) => q.id)).toEqual([
      "v-a",
      "v-i",
      "v-u",
      "v-e",
      "v-o",
      "v-pair-1",
      "v-pair-2",
      "v-pair-3",
      "v-pair-4",
    ]);
  });

  it("さ行は さしすせそ になっている", () => {
    const sRow = getStageById("s-row")!;
    expect(sRow.title).toBe("さしすせそ");
    expect(sRow.questions.slice(0, 5).map((q) => q.label)).toEqual([
      "さ",
      "し",
      "す",
      "せ",
      "そ",
    ]);
  });

  it("五十音の最後は わをん ステージ", () => {
    const wRow = getStageById("w-row")!;
    const prepared = prepareStageQuestions(wRow);
    expect(wRow.title).toBe("わをん");
    expect(prepared.map((q) => q.label)).toEqual([
      "わ",
      "を",
      "ん",
      "わを",
      "わん",
      "をん",
    ]);
  });
});
