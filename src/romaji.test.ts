import { describe, expect, it } from "vitest";
import type { Question } from "./types";
import {
  isComplete,
  nextKeysFromAccepted,
  normalizeKeyChar,
  representativeRemainder,
} from "./romaji";

describe("normalizeKeyChar", () => {
  it("英字を小文字にそろえる", () => {
    expect(normalizeKeyChar("A")).toBe("a");
    expect(normalizeKeyChar("z")).toBe("z");
  });
  it("英字以外は null", () => {
    expect(normalizeKeyChar("1")).toBeNull();
  });
});

describe("shi", () => {
  const accepted = ["shi"];

  it("sh の次は i", () => {
    expect(nextKeysFromAccepted("sh", accepted).sort()).toEqual(["i"]);
  });

  it("shi で完了", () => {
    expect(isComplete("shi", accepted)).toBe(true);
  });
});

describe("representativeRemainder", () => {
  const q: Question = {
    id: "x",
    label: "し",
    answer: "shi",
    acceptedAnswers: ["shi"],
    voiceText: "し",
  };

  it("sh の次は i を示す", () => {
    expect(representativeRemainder("sh", q)).toBe("i");
  });
});
