import { describe, expect, it } from "vitest";
import { classesWithMembers, parseWakabaClassesJson } from "./data";

describe("parseWakabaClassesJson", () => {
  it("環境変数の JSON からクラス定義を読める", () => {
    const classes = parseWakabaClassesJson(`
      [
        {
          "classId": "kuma",
          "classLabel": "くま組",
          "members": [
            { "id": "kuma-a", "nameKana": "やまだ しゅんこ" },
            { "id": "kuma-b", "nameKana": "たなか ちあき" }
          ]
        }
      ]
    `);

    expect(classes).toEqual([
      {
        classId: "kuma",
        classLabel: "くま組",
        members: [
          { id: "kuma-a", nameKana: "やまだ しゅんこ" },
          { id: "kuma-b", nameKana: "たなか ちあき" },
        ],
      },
    ]);
  });

  it("空 members のクラスは導線用の抽出で落とせる", () => {
    const classes = parseWakabaClassesJson(`
      [
        { "classId": "kuma", "classLabel": "くま組", "members": [] },
        {
          "classId": "sakura",
          "classLabel": "さくら組",
          "members": [{ "id": "sakura-a", "nameKana": "すずき あん" }]
        }
      ]
    `);

    expect(classesWithMembers(classes).map((cls) => cls.classId)).toEqual([
      "sakura",
    ]);
  });

  it("JSON が壊れていたら例外にする", () => {
    expect(() => parseWakabaClassesJson("{")).toThrow(
      /VITE_WAKABA_CLASSES_JSON/,
    );
  });
});
