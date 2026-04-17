import type { Progress, Question, StageDef, StageId } from "./types";

type KanaItem = {
  kana: string;
  romaji: string;
};

type PairItem = {
  label: string;
  answer: string;
  voiceFirstChar: string;
};

function makeQuestion(
  id: string,
  label: string,
  answer: string,
  voiceFirstChar?: string,
): Question {
  return {
    id,
    label,
    answer,
    acceptedAnswers: [answer],
    voiceText: label,
    voiceFirstChar,
  };
}

function buildStage(
  id: StageId,
  title: string,
  prefix: string,
  singles: KanaItem[],
  pairs: PairItem[],
): StageDef {
  return {
    id,
    title,
    questions: [
      ...singles.map((item) => makeQuestion(`${prefix}-${item.romaji}`, item.kana, item.romaji)),
      ...pairs.map((item, index) =>
        makeQuestion(`${prefix}-pair-${index + 1}`, item.label, item.answer, item.voiceFirstChar),
      ),
    ],
  };
}

export const STAGE_ORDER: StageId[] = [
  "vowels",
  "k-row",
  "s-row",
  "t-row",
  "n-row",
  "h-row",
  "m-row",
  "y-row",
  "r-row",
  "w-row",
];

export function nextStageId(current: StageId): StageId | null {
  const i = STAGE_ORDER.indexOf(current);
  if (i < 0 || i >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[i + 1]!;
}

export const STAGES: StageDef[] = [
  buildStage(
    "vowels",
    "あいうえお",
    "v",
    [
      { kana: "あ", romaji: "a" },
      { kana: "い", romaji: "i" },
      { kana: "う", romaji: "u" },
      { kana: "え", romaji: "e" },
      { kana: "お", romaji: "o" },
    ],
    [
      { label: "あい", answer: "ai", voiceFirstChar: "あ" },
      { label: "うえ", answer: "ue", voiceFirstChar: "う" },
      { label: "いえ", answer: "ie", voiceFirstChar: "い" },
      { label: "あお", answer: "ao", voiceFirstChar: "あ" },
    ],
  ),
  buildStage(
    "k-row",
    "かきくけこ",
    "k",
    [
      { kana: "か", romaji: "ka" },
      { kana: "き", romaji: "ki" },
      { kana: "く", romaji: "ku" },
      { kana: "け", romaji: "ke" },
      { kana: "こ", romaji: "ko" },
    ],
    [
      { label: "かき", answer: "kaki", voiceFirstChar: "か" },
      { label: "くけ", answer: "kuke", voiceFirstChar: "く" },
      { label: "かこ", answer: "kako", voiceFirstChar: "か" },
      { label: "きこ", answer: "kiko", voiceFirstChar: "き" },
    ],
  ),
  buildStage(
    "s-row",
    "さしすせそ",
    "s",
    [
      { kana: "さ", romaji: "sa" },
      { kana: "し", romaji: "shi" },
      { kana: "す", romaji: "su" },
      { kana: "せ", romaji: "se" },
      { kana: "そ", romaji: "so" },
    ],
    [
      { label: "さし", answer: "sashi", voiceFirstChar: "さ" },
      { label: "すせ", answer: "suse", voiceFirstChar: "す" },
      { label: "さそ", answer: "saso", voiceFirstChar: "さ" },
      { label: "しそ", answer: "shiso", voiceFirstChar: "し" },
    ],
  ),
  buildStage(
    "t-row",
    "たちつてと",
    "t",
    [
      { kana: "た", romaji: "ta" },
      { kana: "ち", romaji: "chi" },
      { kana: "つ", romaji: "tsu" },
      { kana: "て", romaji: "te" },
      { kana: "と", romaji: "to" },
    ],
    [
      { label: "たち", answer: "tachi", voiceFirstChar: "た" },
      { label: "つて", answer: "tsute", voiceFirstChar: "つ" },
      { label: "たと", answer: "tato", voiceFirstChar: "た" },
      { label: "ちと", answer: "chito", voiceFirstChar: "ち" },
    ],
  ),
  buildStage(
    "n-row",
    "なにぬねの",
    "n",
    [
      { kana: "な", romaji: "na" },
      { kana: "に", romaji: "ni" },
      { kana: "ぬ", romaji: "nu" },
      { kana: "ね", romaji: "ne" },
      { kana: "の", romaji: "no" },
    ],
    [
      { label: "なに", answer: "nani", voiceFirstChar: "な" },
      { label: "ぬね", answer: "nune", voiceFirstChar: "ぬ" },
      { label: "なの", answer: "nano", voiceFirstChar: "な" },
      { label: "にの", answer: "nino", voiceFirstChar: "に" },
    ],
  ),
  buildStage(
    "h-row",
    "はひふへほ",
    "h",
    [
      { kana: "は", romaji: "ha" },
      { kana: "ひ", romaji: "hi" },
      { kana: "ふ", romaji: "hu" },
      { kana: "へ", romaji: "he" },
      { kana: "ほ", romaji: "ho" },
    ],
    [
      { label: "はひ", answer: "hahi", voiceFirstChar: "は" },
      { label: "ふへ", answer: "huhe", voiceFirstChar: "ふ" },
      { label: "はほ", answer: "haho", voiceFirstChar: "は" },
      { label: "ひほ", answer: "hiho", voiceFirstChar: "ひ" },
    ],
  ),
  buildStage(
    "m-row",
    "まみむめも",
    "m",
    [
      { kana: "ま", romaji: "ma" },
      { kana: "み", romaji: "mi" },
      { kana: "む", romaji: "mu" },
      { kana: "め", romaji: "me" },
      { kana: "も", romaji: "mo" },
    ],
    [
      { label: "まみ", answer: "mami", voiceFirstChar: "ま" },
      { label: "むめ", answer: "mume", voiceFirstChar: "む" },
      { label: "まも", answer: "mamo", voiceFirstChar: "ま" },
      { label: "みも", answer: "mimo", voiceFirstChar: "み" },
    ],
  ),
  buildStage(
    "y-row",
    "やゆよ",
    "y",
    [
      { kana: "や", romaji: "ya" },
      { kana: "ゆ", romaji: "yu" },
      { kana: "よ", romaji: "yo" },
    ],
    [
      { label: "やゆ", answer: "yayu", voiceFirstChar: "や" },
      { label: "ゆよ", answer: "yuyo", voiceFirstChar: "ゆ" },
      { label: "やよ", answer: "yayo", voiceFirstChar: "や" },
    ],
  ),
  buildStage(
    "r-row",
    "らりるれろ",
    "r",
    [
      { kana: "ら", romaji: "ra" },
      { kana: "り", romaji: "ri" },
      { kana: "る", romaji: "ru" },
      { kana: "れ", romaji: "re" },
      { kana: "ろ", romaji: "ro" },
    ],
    [
      { label: "らり", answer: "rari", voiceFirstChar: "ら" },
      { label: "るれ", answer: "rure", voiceFirstChar: "る" },
      { label: "らろ", answer: "raro", voiceFirstChar: "ら" },
      { label: "りろ", answer: "riro", voiceFirstChar: "り" },
    ],
  ),
  buildStage(
    "w-row",
    "わをん",
    "w",
    [
      { kana: "わ", romaji: "wa" },
      { kana: "を", romaji: "wo" },
      { kana: "ん", romaji: "n" },
    ],
    [
      { label: "わを", answer: "wawo", voiceFirstChar: "わ" },
      { label: "わん", answer: "wan", voiceFirstChar: "わ" },
      { label: "をん", answer: "won", voiceFirstChar: "を" },
    ],
  ),
];

export function getStageById(id: StageId): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}

export function prepareStageQuestions(stage: StageDef): Question[] {
  return [...stage.questions];
}

export function getHighestUnlockedStageId(progress: Progress): StageId {
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    const id = STAGE_ORDER[i]!;
    if (progress.unlockedStageIds.includes(id)) return id;
  }
  return "vowels";
}
