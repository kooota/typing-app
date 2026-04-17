import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appendWakabaLog,
  loadWakabaLog,
  resetAllStorage,
} from "./storage";
import type { WakabaLogEntry } from "./types";

describe("wakaba log storage", () => {
  afterEach(() => {
    resetAllStorage();
    vi.unstubAllGlobals();
  });

  it("prepends entries and enforces memberIds length === questionCount", () => {
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

    const ok: WakabaLogEntry = {
      playedAt: "2026-01-01T00:00:00.000Z",
      classId: "kuma",
      questionCount: 2,
      correctCount: 1,
      memberIds: ["x", "y"],
    };
    appendWakabaLog(ok);
    expect(loadWakabaLog()).toHaveLength(1);

    appendWakabaLog({
      ...ok,
      playedAt: "2026-01-02T00:00:00.000Z",
      memberIds: ["a"],
    });
    expect(loadWakabaLog()).toHaveLength(1);
  });
});
