import { describe, expect, it } from "vitest";
import type { WakabaLogEntry } from "@/types";
import { bestWakabaEntryForClass } from "./wakabaStats";

describe("bestWakabaEntryForClass", () => {
  it("比率が高い回を選ぶ。同率なら correctCount 優先", () => {
    const log: WakabaLogEntry[] = [
      {
        playedAt: "2026-01-01T00:00:00.000Z",
        classId: "kuma",
        questionCount: 4,
        correctCount: 2,
        memberIds: ["a", "b", "c", "d"],
      },
      {
        playedAt: "2026-01-02T00:00:00.000Z",
        classId: "kuma",
        questionCount: 4,
        correctCount: 3,
        memberIds: ["a", "b", "c", "d"],
      },
      {
        playedAt: "2026-01-03T00:00:00.000Z",
        classId: "kuma",
        questionCount: 2,
        correctCount: 1,
        memberIds: ["a", "b"],
      },
    ];
    const best = bestWakabaEntryForClass(log, "kuma")!;
    expect(best.correctCount).toBe(3);
    expect(best.questionCount).toBe(4);
  });
});
