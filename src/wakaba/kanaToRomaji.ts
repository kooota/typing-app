import { KANA_TABLE_SEQUENCE } from "@/kanaTableData";

const MORA_TO_ROMAJI = new Map<string, string>();
for (const e of KANA_TABLE_SEQUENCE) {
  MORA_TO_ROMAJI.set(e.kana, e.romaji);
}

function readMora(
  s: string,
  i: number,
): { romaji: string; len: number } | null {
  if (i >= s.length) return null;
  const two = s.slice(i, i + 2);
  if (two.length === 2) {
    const r2 = MORA_TO_ROMAJI.get(two);
    if (r2 != null) return { romaji: r2, len: 2 };
  }
  const one = s[i]!;
  const r1 = MORA_TO_ROMAJI.get(one);
  if (r1 != null) return { romaji: r1, len: 1 };
  return null;
}

/**
 * ひらがなの単語（スペースなし）をローマ字に変換。表にない文字は例外。
 */
export function hiraganaWordToRomaji(word: string, context: string): string {
  let i = 0;
  let out = "";
  while (i < word.length) {
    const ch = word[i]!;
    if (ch === "っ") {
      if (i + 1 >= word.length) {
        throw new Error(`「っ」の後に文字がありません: "${context}"`);
      }
      const next = readMora(word, i + 1);
      if (!next || next.romaji.length === 0) {
        throw new Error(
          `「っ」のあとをローマ字にできません: "${context}" @${i}`,
        );
      }
      out += next.romaji[0]! + next.romaji;
      i += 1 + next.len;
      continue;
    }
    const m = readMora(word, i);
    if (!m) {
      throw new Error(
        `未対応の文字 "${ch}" (位置 ${i}): "${context}" — ひらがな・五十音表のルール内のみ対応しています`,
      );
    }
    out += m.romaji;
    i += m.len;
  }
  return out;
}

/**
 * 名前用。かなは単語を半角スペースで区切る想定。入力用は連結、表示用は単語間スペース。
 */
export function wakabaNameKanaToRomaji(nameKana: string): {
  answer: string;
  display: string;
} {
  const trimmed = nameKana.trim();
  if (!trimmed) {
    throw new Error("空の名前は変換できません");
  }
  const words = trimmed.split(/\s+/);
  const parts: string[] = [];
  for (const w of words) {
    parts.push(hiraganaWordToRomaji(w, nameKana));
  }
  return {
    answer: parts.join(""),
    display: parts.join(" "),
  };
}
