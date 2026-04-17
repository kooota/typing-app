import { describe, expect, it } from "vitest";
import { hiraganaWordToRomaji, wakabaNameKanaToRomaji } from "./kanaToRomaji";

describe("wakabaNameKanaToRomaji", () => {
  it("し��・ち・ん を含む名前を例外なく変換（スペース区切り）", () => {
    const a = wakabaNameKanaToRomaji("\u3084\u307e\u3060 \u3057\u3085\u3093\u3053");
    expect(a.answer).toBe("yamadashunko");
    expect(a.display).toBe("yamada shunko");

    const b = wakabaNameKanaToRomaji("\u305f\u306a\u304b \u3061\u3042\u304d");
    expect(b.answer).toBe("tanakachiaki");

    const c = wakabaNameKanaToRomaji("\u3059\u305a\u304d \u3042\u3093");
    expect(c.answer).toBe("suzukian");
  });

  it("っ で次音の子音を重ねる", () => {
    expect(hiraganaWordToRomaji("\u304c\u3063\u3053\u3046", "test")).toBe(
      "gakkou",
    );
  });
});
