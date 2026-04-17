import type { KanaTableEntry, KanaTableSectionKind } from "./types";

type CellSpec = { row: number; col: number; kana: string; romaji: string };

function cells(
  section: KanaTableSectionKind,
  specs: CellSpec[],
  startSeq: number,
): { entries: KanaTableEntry[]; nextSeq: number } {
  let seq = startSeq;
  const entries = specs.map((s) => {
    const e: KanaTableEntry = {
      id: `kt-${section}-${s.kana}`,
      kana: s.kana,
      romaji: s.romaji,
      section,
      tableRow: s.row,
      tableCol: s.col,
      sequenceIndex: seq,
    };
    seq += 1;
    return e;
  });
  return { entries, nextSeq: seq };
}

const BASIC_SPECS: CellSpec[] = [
  { row: 0, col: 0, kana: "あ", romaji: "a" },
  { row: 0, col: 1, kana: "い", romaji: "i" },
  { row: 0, col: 2, kana: "う", romaji: "u" },
  { row: 0, col: 3, kana: "え", romaji: "e" },
  { row: 0, col: 4, kana: "お", romaji: "o" },
  { row: 1, col: 0, kana: "か", romaji: "ka" },
  { row: 1, col: 1, kana: "き", romaji: "ki" },
  { row: 1, col: 2, kana: "く", romaji: "ku" },
  { row: 1, col: 3, kana: "け", romaji: "ke" },
  { row: 1, col: 4, kana: "こ", romaji: "ko" },
  { row: 2, col: 0, kana: "さ", romaji: "sa" },
  { row: 2, col: 1, kana: "し", romaji: "shi" },
  { row: 2, col: 2, kana: "す", romaji: "su" },
  { row: 2, col: 3, kana: "せ", romaji: "se" },
  { row: 2, col: 4, kana: "そ", romaji: "so" },
  { row: 3, col: 0, kana: "た", romaji: "ta" },
  { row: 3, col: 1, kana: "ち", romaji: "chi" },
  { row: 3, col: 2, kana: "つ", romaji: "tsu" },
  { row: 3, col: 3, kana: "て", romaji: "te" },
  { row: 3, col: 4, kana: "と", romaji: "to" },
  { row: 4, col: 0, kana: "な", romaji: "na" },
  { row: 4, col: 1, kana: "に", romaji: "ni" },
  { row: 4, col: 2, kana: "ぬ", romaji: "nu" },
  { row: 4, col: 3, kana: "ね", romaji: "ne" },
  { row: 4, col: 4, kana: "の", romaji: "no" },
  { row: 5, col: 0, kana: "は", romaji: "ha" },
  { row: 5, col: 1, kana: "ひ", romaji: "hi" },
  { row: 5, col: 2, kana: "ふ", romaji: "hu" },
  { row: 5, col: 3, kana: "へ", romaji: "he" },
  { row: 5, col: 4, kana: "ほ", romaji: "ho" },
  { row: 6, col: 0, kana: "ま", romaji: "ma" },
  { row: 6, col: 1, kana: "み", romaji: "mi" },
  { row: 6, col: 2, kana: "む", romaji: "mu" },
  { row: 6, col: 3, kana: "め", romaji: "me" },
  { row: 6, col: 4, kana: "も", romaji: "mo" },
  { row: 7, col: 0, kana: "や", romaji: "ya" },
  { row: 7, col: 2, kana: "ゆ", romaji: "yu" },
  { row: 7, col: 4, kana: "よ", romaji: "yo" },
  { row: 8, col: 0, kana: "ら", romaji: "ra" },
  { row: 8, col: 1, kana: "り", romaji: "ri" },
  { row: 8, col: 2, kana: "る", romaji: "ru" },
  { row: 8, col: 3, kana: "れ", romaji: "re" },
  { row: 8, col: 4, kana: "ろ", romaji: "ro" },
  { row: 9, col: 0, kana: "わ", romaji: "wa" },
  { row: 9, col: 1, kana: "を", romaji: "wo" },
  { row: 9, col: 2, kana: "ん", romaji: "n" },
];

const DAKUON_SPECS: CellSpec[] = [
  { row: 0, col: 0, kana: "が", romaji: "ga" },
  { row: 0, col: 1, kana: "ぎ", romaji: "gi" },
  { row: 0, col: 2, kana: "ぐ", romaji: "gu" },
  { row: 0, col: 3, kana: "げ", romaji: "ge" },
  { row: 0, col: 4, kana: "ご", romaji: "go" },
  { row: 1, col: 0, kana: "ざ", romaji: "za" },
  { row: 1, col: 1, kana: "じ", romaji: "ji" },
  { row: 1, col: 2, kana: "ず", romaji: "zu" },
  { row: 1, col: 3, kana: "ぜ", romaji: "ze" },
  { row: 1, col: 4, kana: "ぞ", romaji: "zo" },
  { row: 2, col: 0, kana: "だ", romaji: "da" },
  { row: 2, col: 1, kana: "ぢ", romaji: "di" },
  { row: 2, col: 2, kana: "づ", romaji: "zu" },
  { row: 2, col: 3, kana: "で", romaji: "de" },
  { row: 2, col: 4, kana: "ど", romaji: "do" },
  { row: 3, col: 0, kana: "ば", romaji: "ba" },
  { row: 3, col: 1, kana: "び", romaji: "bi" },
  { row: 3, col: 2, kana: "ぶ", romaji: "bu" },
  { row: 3, col: 3, kana: "べ", romaji: "be" },
  { row: 3, col: 4, kana: "ぼ", romaji: "bo" },
  { row: 4, col: 0, kana: "ぱ", romaji: "pa" },
  { row: 4, col: 1, kana: "ぴ", romaji: "pi" },
  { row: 4, col: 2, kana: "ぷ", romaji: "pu" },
  { row: 4, col: 3, kana: "ぺ", romaji: "pe" },
  { row: 4, col: 4, kana: "ぽ", romaji: "po" },
];

const YOON_SPECS: CellSpec[] = [
  { row: 0, col: 0, kana: "きゃ", romaji: "kya" },
  { row: 0, col: 1, kana: "きゅ", romaji: "kyu" },
  { row: 0, col: 2, kana: "きょ", romaji: "kyo" },
  { row: 1, col: 0, kana: "しゃ", romaji: "sha" },
  { row: 1, col: 1, kana: "しゅ", romaji: "shu" },
  { row: 1, col: 2, kana: "しょ", romaji: "sho" },
  { row: 2, col: 0, kana: "ちゃ", romaji: "cha" },
  { row: 2, col: 1, kana: "ちゅ", romaji: "chu" },
  { row: 2, col: 2, kana: "ちょ", romaji: "cho" },
  { row: 3, col: 0, kana: "にゃ", romaji: "nya" },
  { row: 3, col: 1, kana: "にゅ", romaji: "nyu" },
  { row: 3, col: 2, kana: "にょ", romaji: "nyo" },
  { row: 4, col: 0, kana: "ひゃ", romaji: "hya" },
  { row: 4, col: 1, kana: "ひゅ", romaji: "hyu" },
  { row: 4, col: 2, kana: "ひょ", romaji: "hyo" },
  { row: 5, col: 0, kana: "みゃ", romaji: "mya" },
  { row: 5, col: 1, kana: "みゅ", romaji: "myu" },
  { row: 5, col: 2, kana: "みょ", romaji: "myo" },
  { row: 6, col: 0, kana: "りゃ", romaji: "rya" },
  { row: 6, col: 1, kana: "りゅ", romaji: "ryu" },
  { row: 6, col: 2, kana: "りょ", romaji: "ryo" },
  { row: 7, col: 0, kana: "ぎゃ", romaji: "gya" },
  { row: 7, col: 1, kana: "ぎゅ", romaji: "gyu" },
  { row: 7, col: 2, kana: "ぎょ", romaji: "gyo" },
  { row: 8, col: 0, kana: "じゃ", romaji: "ja" },
  { row: 8, col: 1, kana: "じゅ", romaji: "ju" },
  { row: 8, col: 2, kana: "じょ", romaji: "jo" },
  { row: 9, col: 0, kana: "びゃ", romaji: "bya" },
  { row: 9, col: 1, kana: "びゅ", romaji: "byu" },
  { row: 9, col: 2, kana: "びょ", romaji: "byo" },
  { row: 10, col: 0, kana: "ぴゃ", romaji: "pya" },
  { row: 10, col: 1, kana: "ぴゅ", romaji: "pyu" },
  { row: 10, col: 2, kana: "ぴょ", romaji: "pyo" },
];

const b = cells("basic", BASIC_SPECS, 0);
const d = cells("dakuon", DAKUON_SPECS, b.nextSeq);
const y = cells("yoon", YOON_SPECS, d.nextSeq);

/** Input order: seion, dakuon/handakuon, yoon. */
export const KANA_TABLE_SEQUENCE: KanaTableEntry[] = [
  ...b.entries,
  ...d.entries,
  ...y.entries,
];

export const KANA_TABLE_TOTAL = KANA_TABLE_SEQUENCE.length;

const SECTION_LABEL: Record<KanaTableSectionKind, string> = {
  basic: "清音",
  dakuon: "だく音・はんだく音",
  yoon: "ようおん",
};

export function kanaTableSectionLabel(section: KanaTableSectionKind): string {
  return SECTION_LABEL[section];
}

export function kanaTableGridSize(section: KanaTableSectionKind): {
  rows: number;
  cols: number;
} {
  if (section === "yoon") return { rows: 11, cols: 3 };
  if (section === "dakuon") return { rows: 5, cols: 5 };
  return { rows: 10, cols: 5 };
}

export function entriesForKanaTableSection(
  section: KanaTableSectionKind,
): KanaTableEntry[] {
  return KANA_TABLE_SEQUENCE.filter((e) => e.section === section);
}

export function kanaTableCellAt(
  section: KanaTableSectionKind,
  row: number,
  col: number,
): KanaTableEntry | null {
  const hit = KANA_TABLE_SEQUENCE.find(
    (e) => e.section === section && e.tableRow === row && e.tableCol === col,
  );
  return hit ?? null;
}
