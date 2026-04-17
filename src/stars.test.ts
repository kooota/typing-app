import { describe, expect, it } from "vitest";
import { starsForStage } from "./stars";

describe("starsForStage", () => {
  it("ノーミスは3", () => {
    expect(starsForStage(0)).toBe(3);
  });
  it("ミス1〜2は2", () => {
    expect(starsForStage(1)).toBe(2);
    expect(starsForStage(2)).toBe(2);
  });
  it("ミス3以上は1", () => {
    expect(starsForStage(3)).toBe(1);
    expect(starsForStage(99)).toBe(1);
  });
});
