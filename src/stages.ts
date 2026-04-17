import type { Progress, Question, StageDef, StageId } from "./types";

export const STAGE_ORDER: StageId[] = ["vowels", "k-row", "s-row", "shi"];

export function nextStageId(current: StageId): StageId | null {
  const i = STAGE_ORDER.indexOf(current);
  if (i < 0 || i >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[i + 1]!;
}

export const STAGES: StageDef[] = [
  {
    id: "vowels",
    title: "あいうえお",
    questions: [
      {
        id: "v-a",
        label: "あ",
        answer: "a",
        acceptedAnswers: ["a"],
        voiceText: "あ",
      },
      {
        id: "v-i",
        label: "い",
        answer: "i",
        acceptedAnswers: ["i"],
        voiceText: "い",
      },
      {
        id: "v-u",
        label: "う",
        answer: "u",
        acceptedAnswers: ["u"],
        voiceText: "う",
      },
      {
        id: "v-e",
        label: "え",
        answer: "e",
        acceptedAnswers: ["e"],
        voiceText: "え",
      },
      {
        id: "v-o",
        label: "お",
        answer: "o",
        acceptedAnswers: ["o"],
        voiceText: "お",
      },
      {
        id: "v-ai",
        label: "あい",
        answer: "ai",
        acceptedAnswers: ["ai"],
        voiceText: "あい",
        voiceFirstChar: "あ",
      },
      {
        id: "v-ie",
        label: "いえ",
        answer: "ie",
        acceptedAnswers: ["ie"],
        voiceText: "いえ",
        voiceFirstChar: "い",
      },
    ],
  },
  {
    id: "k-row",
    title: "かきくけこ",
    questions: [
      {
        id: "k-ka",
        label: "か",
        answer: "ka",
        acceptedAnswers: ["ka"],
        voiceText: "か",
      },
      {
        id: "k-ki",
        label: "き",
        answer: "ki",
        acceptedAnswers: ["ki"],
        voiceText: "き",
      },
      {
        id: "k-ku",
        label: "く",
        answer: "ku",
        acceptedAnswers: ["ku"],
        voiceText: "く",
      },
      {
        id: "k-ke",
        label: "け",
        answer: "ke",
        acceptedAnswers: ["ke"],
        voiceText: "け",
      },
      {
        id: "k-ko",
        label: "こ",
        answer: "ko",
        acceptedAnswers: ["ko"],
        voiceText: "こ",
      },
      {
        id: "k-kao",
        label: "かお",
        answer: "kao",
        acceptedAnswers: ["kao"],
        voiceText: "かお",
        voiceFirstChar: "か",
      },
      {
        id: "k-kiku",
        label: "きく",
        answer: "kiku",
        acceptedAnswers: ["kiku"],
        voiceText: "きく",
        voiceFirstChar: "き",
      },
      {
        id: "k-koke",
        label: "こけ",
        answer: "koke",
        acceptedAnswers: ["koke"],
        voiceText: "こけ",
        voiceFirstChar: "こ",
      },
    ],
  },
  {
    id: "s-row",
    title: "さすせそ",
    questions: [
      {
        id: "s-sa",
        label: "さ",
        answer: "sa",
        acceptedAnswers: ["sa"],
        voiceText: "さ",
      },
      {
        id: "s-su",
        label: "す",
        answer: "su",
        acceptedAnswers: ["su"],
        voiceText: "す",
      },
      {
        id: "s-se",
        label: "せ",
        answer: "se",
        acceptedAnswers: ["se"],
        voiceText: "せ",
      },
      {
        id: "s-so",
        label: "そ",
        answer: "so",
        acceptedAnswers: ["so"],
        voiceText: "そ",
      },
      {
        id: "s-sasu",
        label: "さす",
        answer: "sasu",
        acceptedAnswers: ["sasu"],
        voiceText: "さす",
        voiceFirstChar: "さ",
      },
      {
        id: "s-seso",
        label: "せそ",
        answer: "seso",
        acceptedAnswers: ["seso"],
        voiceText: "せそ",
        voiceFirstChar: "せ",
      },
      {
        id: "s-sake",
        label: "さけ",
        answer: "sake",
        acceptedAnswers: ["sake"],
        voiceText: "さけ",
        voiceFirstChar: "さ",
      },
      {
        id: "s-soso",
        label: "そそ",
        answer: "soso",
        acceptedAnswers: ["soso"],
        voiceText: "そそ",
        voiceFirstChar: "そ",
      },
    ],
  },
  {
    id: "shi",
    title: "し",
    questions: [
      {
        id: "shi-p1",
        label: "し",
        answer: "shi",
        acceptedAnswers: ["shi", "si"],
        voiceText: "し",
        isPractice: true,
      },
      {
        id: "shi-p2",
        label: "し",
        answer: "shi",
        acceptedAnswers: ["shi", "si"],
        voiceText: "もういちど、し",
        isPractice: true,
      },
      {
        id: "shi-1",
        label: "し",
        answer: "shi",
        acceptedAnswers: ["shi", "si"],
        voiceText: "し",
      },
      {
        id: "shi-2",
        label: "し",
        answer: "shi",
        acceptedAnswers: ["shi", "si"],
        voiceText: "し",
      },
      {
        id: "shi-3",
        label: "しあ",
        answer: "shia",
        acceptedAnswers: ["shia", "sia"],
        voiceText: "しあ",
        voiceFirstChar: "し",
      },
      {
        id: "shi-4",
        label: "しお",
        answer: "shio",
        acceptedAnswers: ["shio", "sio"],
        voiceText: "しお",
        voiceFirstChar: "し",
      },
    ],
  },
];

export function getStageById(id: StageId): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}

/** 同一ステージ内の軽いランダム化（配列のコピーを返す） */
export function shuffleQuestions<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * `isPractice` の問題は定義順を保ち先頭に置き、その後ろだけシャッフルする。
 */
export function prepareStageQuestions(stage: StageDef): Question[] {
  const practice = stage.questions.filter((q) => q.isPractice);
  const rest = stage.questions.filter((q) => !q.isPractice);
  return [...practice, ...shuffleQuestions(rest)];
}

/** 解放済みのうち、カリキュラム上もっとも先のステージ */
export function getHighestUnlockedStageId(progress: Progress): StageId {
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    const id = STAGE_ORDER[i]!;
    if (progress.unlockedStageIds.includes(id)) return id;
  }
  return "vowels";
}
