import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appendPracticeLog,
  loadPracticeLog,
  resetAllStorage,
} from "./storage";
import type { PracticeLogEntry } from "./types";

describe("practice log storage", () => {
  afterEach(() => {
    resetAllStorage();
    vi.unstubAllGlobals();
  });

  it("prepends entries and drops oldest after 21 appends", () => {
    vi.stubGlobal(
      "localStorage",
      (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (k: string) => store[k] ?? null,
          setItem: (k: string, v: string) => {
            store[k] = v;
          },
          removeItem: (k: string) => {
            delete store[k];
          },
        };
      })(),
    );

    const mk = (i: number): PracticeLogEntry => ({
      playedAt: `2026-01-${String(i).padStart(2, "0")}T00:00:00.000Z`,
      questionCount: 10,
      correctCount: i % 11,
      wordIds: [`w${i}`],
    });

    for (let i = 1; i <= 21; i++) {
      appendPracticeLog(mk(i));
    }
    const log = loadPracticeLog();
    expect(log).toHaveLength(20);
    expect(log[0]!.playedAt).toBe("2026-01-21T00:00:00.000Z");
    expect(log[19]!.playedAt).toBe("2026-01-02T00:00:00.000Z");
  });
});
