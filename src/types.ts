export type StageId = "vowels" | "k-row" | "s-row" | "shi";

export type Question = {
  id: string;
  label: string;
  answer: string;
  acceptedAnswers: string[];
  voiceText: string;
  /** 単語のとき先頭文字だけを読む第2発話用（省略時は label の先頭1文字） */
  voiceFirstChar?: string;
  /** 練習見本として扱う（shi ステージの導入など） */
  isPractice?: boolean;
};

export type StageDef = {
  id: StageId;
  title: string;
  questions: Question[];
};

export type AppSettings = {
  keyGuideEnabled: boolean;
  speechEnabled: boolean;
};

export type Progress = {
  unlockedStageIds: StageId[];
  bestStarsByStage: Partial<Record<StageId, 1 | 2 | 3>>;
  attemptCountByStage: Partial<Record<StageId, number>>;
};

export const DEFAULT_SETTINGS: AppSettings = {
  keyGuideEnabled: true,
  speechEnabled: true,
};

export const DEFAULT_PROGRESS: Progress = {
  unlockedStageIds: ["vowels"],
  bestStarsByStage: {},
  attemptCountByStage: {},
};
