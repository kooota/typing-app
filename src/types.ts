export type StageId =
  | "vowels"
  | "k-row"
  | "s-row"
  | "t-row"
  | "n-row"
  | "h-row"
  | "m-row"
  | "y-row"
  | "r-row"
  | "w-row";

export type Question = {
  id: string;
  label: string;
  answer: string;
  acceptedAnswers: string[];
  voiceText: string;
  /** 単語のとき先頭文字だけを読む第2発話用（省略時は label の先頭1文字） */
  voiceFirstChar?: string;
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

/** 実践モード 1 プレイの履歴（永続化） */
export type PracticeLogEntry = {
  playedAt: string;
  questionCount: 10;
  /** その回で「誤キーなしで最後まで打てた」問題数（0〜10）。全問クリア済みでもミスがあった問は含めない */
  correctCount: number;
  wordIds: string[];
};

/** 実践モード結果画面へ渡す state */
export type PracticeSessionResultState = {
  /** {@link PracticeLogEntry.correctCount} と同じ意味（ノーミス完答数） */
  correctCount: number;
  questionCount: 10;
  wordIds: string[];
};
