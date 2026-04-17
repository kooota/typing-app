import type { WakabaClassDef } from "./types";

/**
 * このファイルを `wakaba.local.ts` にコピーして、members を実データに差し替えてください。
 * 実名を含む `wakaba.local.ts` は .gitignore され、リポジトリには載りません。
 */
export const WAKABA_CLASSES: WakabaClassDef[] = [
  {
    classId: "kuma",
    classLabel: "\u304f\u307e\u7d44",
    members: [
      // \u4f8b\uff08\u67b6\u7a7a\u306e\u30b5\u30f3\u30d7\u30eb\u3002id \u306f\u5c65\u6b74\u7528\u306b\u56fa\u5b9a\u306e\u307e\u307e\u306b\u3057\u3066\u304f\u3060\u3055\u3044\uff09
      {
        id: "sample-01",
        nameKana: "\u3084\u307e\u3060 \u3057\u3085\u3093\u3053",
      },
      {
        id: "sample-02",
        nameKana: "\u305f\u306a\u304b \u3061\u3042\u304d",
      },
      {
        id: "sample-03",
        nameKana: "\u3059\u305a\u304d \u3042\u3093",
      },
    ],
  },
];
