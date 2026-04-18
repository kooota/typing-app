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

describe("si", () => {
  const accepted = ["si"];

  it("s の次は i", () => {
    expect(nextKeysFromAccepted("s", accepted).sort()).toEqual(["i"]);
  });

  it("si で完了", () => {
    expect(isComplete("si", accepted)).toBe(true);
  });
});

describe("representativeRemainder", () => {
  const q: Question = {
    id: "x",
    label: "し",
    answer: "si",
    acceptedAnswers: ["si"],
    voiceText: "し",
  };

  it("s の次は i を示す", () => {
    expect(representativeRemainder("s", q)).toBe("i");
  });
});
