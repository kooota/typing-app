import { describe, expect, it } from "vitest";
import {
  KANA_TABLE_SEQUENCE,
  KANA_TABLE_TOTAL,
  kanaTableCellAt,
} from "./kanaTableData";

describe("kana table data", () => {
  it("first kana is あ, last romaji is pyo", () => {
    expect(KANA_TABLE_SEQUENCE[0]!.kana).toBe("あ");
    expect(KANA_TABLE_SEQUENCE[0]!.romaji).toBe("a");
    const last = KANA_TABLE_SEQUENCE[KANA_TABLE_TOTAL - 1]!;
    expect(last.kana).toBe("ぴょ");
    expect(last.romaji).toBe("pyo");
  });

  it("おの次は か（固定順）", () => {
    const o = KANA_TABLE_SEQUENCE.find((e) => e.kana === "お")!;
    const ka = KANA_TABLE_SEQUENCE.find((e) => e.kana === "か")!;
    expect(ka.sequenceIndex).toBe(o.sequenceIndex + 1);
  });

  it("んの次は が（だく音ブロック先頭）", () => {
    const n = KANA_TABLE_SEQUENCE.find((e) => e.kana === "ん")!;
    const ga = KANA_TABLE_SEQUENCE.find((e) => e.kana === "が")!;
    expect(ga.sequenceIndex).toBe(n.sequenceIndex + 1);
  });

  it("清音表で空マスはセルなし", () => {
    expect(kanaTableCellAt("basic", 7, 1)).toBeNull();
    expect(kanaTableCellAt("basic", 7, 3)).toBeNull();
    expect(kanaTableCellAt("basic", 9, 3)).toBeNull();
  });

  it("sequenceIndex は 0 から連番", () => {
    KANA_TABLE_SEQUENCE.forEach((e, i) => {
      expect(e.sequenceIndex).toBe(i);
    });
  });
});
