import type { Question } from "./types";

/**
 * ローマ字入力の正規化（小文字・英字のみ想定）
 */
export function normalizeKeyChar(ch: string): string | null {
  if (ch.length !== 1) return null;
  const lower = ch.toLowerCase();
  if (lower >= "a" && lower <= "z") return lower;
  return null;
}

/** 現在の入力が、いずれかの受理文字列の接頭辞になっているか */
export function isValidPrefix(
  typed: string,
  acceptedAnswers: string[],
): boolean {
  const t = typed.toLowerCase();
  return acceptedAnswers.some((a) => a.toLowerCase().startsWith(t));
}

/** 完全一致する受理があるか */
export function isComplete(
  typed: string,
  acceptedAnswers: string[],
): boolean {
  const t = typed.toLowerCase();
  return acceptedAnswers.some((a) => a.toLowerCase() === t);
}

/**
 * 次に押せるキー（a-z）の一覧。
 */
export function nextKeysFromAccepted(
  typed: string,
  acceptedAnswers: string[],
): string[] {
  const t = typed.toLowerCase();
  const next = new Set<string>();
  for (const raw of acceptedAnswers) {
    const a = raw.toLowerCase();
    if (a.startsWith(t) && a.length > t.length) {
      next.add(a[t.length]!);
    }
  }
  return [...next].sort();
}

/** 代表 answer からの次キー（単一路のみガイドしたい場合用） */
export function nextKeyFromAnswer(typed: string, answer: string): string | null {
  const t = typed.toLowerCase();
  const a = answer.toLowerCase();
  if (!a.startsWith(t) || a.length <= t.length) return null;
  return a[t.length]!;
}

/**
 * 入力プレフィックスに合う残りローマ字。
 * 分岐時は最短の受理文字列を選ぶ。
 */
export function representativeRemainder(typed: string, q: Question): string {
  const t = typed.toLowerCase();
  if (t === "") return q.answer;
  const matches = q.acceptedAnswers.filter((a) =>
    a.toLowerCase().startsWith(t),
  );
  if (matches.length === 0) return q.answer.slice(t.length);
  const pick = matches.reduce((a, b) => (a.length <= b.length ? a : b));
  return pick.slice(t.length);
}
