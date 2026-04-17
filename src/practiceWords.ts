import type { Question } from "./types";

/**
 * 実践モード用。通常ステージ・五十音表モードと同じローマ字ルール（単一路）。
 */
function pq(
  id: string,
  label: string,
  answer: string,
  voiceFirstChar?: string,
): Question {
  return {
    id: `practice-${id}`,
    label,
    answer,
    acceptedAnswers: [answer],
    voiceText: label,
    voiceFirstChar,
  };
}

/** 出題プール（各回 10 問を重複なしで抽出） */
export const ALL_PRACTICE_QUESTIONS: Question[] = [
  pq("neko", "\u306d\u3053", "neko", "\u306d"),
  pq("inu", "\u3044\u306c", "inu", "\u3044"),
  pq("umi", "\u3046\u307f", "umi", "\u3046"),
  pq("sora", "\u305d\u3089", "sora", "\u305d"),
  pq("kumo", "\u304f\u3082", "kumo", "\u304f"),
  pq("hana", "\u306f\u306a", "hana", "\u306f"),
  pq("ki", "\u304d", "ki"),
  pq("tori", "\u3068\u308a", "tori", "\u3068"),
  pq("sakana", "\u3055\u304b\u306a", "sakana", "\u3055"),
  pq("ringo", "\u308a\u3093\u3054", "ringo", "\u308a"),
  pq("denwa", "\u3067\u3093\u308f", "denwa", "\u3067"),
  pq("hune", "\u3075\u306d", "hune", "\u3075"),
  pq("tizu", "\u3061\u305a", "chizu", "\u3061"),
  pq("tuki", "\u3064\u304d", "tsuki", "\u3064"),
  pq("sio", "\u3057\u304a", "shio", "\u3057"),
  pq("nami", "\u306a\u307f", "nami", "\u306a"),
  pq("yama", "\u3084\u307e", "yama", "\u3084"),
  pq("kuruma", "\u304f\u308b\u307e", "kuruma", "\u304f"),
  pq("mizu", "\u307f\u305a", "mizu", "\u307f"),
  pq("hosi", "\u307b\u3057", "hoshi", "\u307b"),
];
