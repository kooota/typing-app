import type { Question } from "./types";
import { ALL_PRACTICE_QUESTIONS } from "./practiceWords";

export const PRACTICE_ROUND_LENGTH = 10;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** プールから 10 問を重複なしで選ぶ */
export function pickPracticeRound(): Question[] {
  if (ALL_PRACTICE_QUESTIONS.length < PRACTICE_ROUND_LENGTH) {
    throw new Error("practice pool too small");
  }
  return shuffle(ALL_PRACTICE_QUESTIONS).slice(0, PRACTICE_ROUND_LENGTH);
}
