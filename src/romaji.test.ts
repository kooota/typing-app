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

describe("shi / si", () => {
  const accepted = ["shi", "si"];

  it("s の次は h か i", () => {
    expect(nextKeysFromAccepted("s", accepted).sort()).toEqual(["h", "i"]);
  });

  it("si で完了", () => {
    expect(isComplete("si", accepted)).toBe(true);
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
    acceptedAnswers: ["shi", "si"],
    voiceText: "し",
  };

  it("si ルートでは残りを si 基準で示す", () => {
    expect(representativeRemainder("s", q)).toBe("i");
  });

  it("shi ルートでは残りを shi 基準で示す", () => {
    expect(representativeRemainder("sh", q)).toBe("i");
  });
});
