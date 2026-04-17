import { describe, expect, it } from "vitest";
import { ALL_PRACTICE_QUESTIONS } from "./practiceWords";
import { pickPracticeRound, PRACTICE_ROUND_LENGTH } from "./practiceSession";

describe("pickPracticeRound", () => {
  it("10問・重複なし・プール内の ID のみ", () => {
    const round = pickPracticeRound();
    expect(round).toHaveLength(PRACTICE_ROUND_LENGTH);
    const ids = round.map((q) => q.id);
    expect(new Set(ids).size).toBe(PRACTICE_ROUND_LENGTH);
    const poolIds = new Set(ALL_PRACTICE_QUESTIONS.map((q) => q.id));
    for (const id of ids) {
      expect(poolIds.has(id)).toBe(true);
    }
  });
});
