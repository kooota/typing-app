import type { WakabaLogEntry } from "@/types";

/** 同率なら correctCount 優先、さらに同率なら playedAt が新しい方 */
export function bestWakabaEntryForClass(
  log: WakabaLogEntry[],
  classId: string,
): WakabaLogEntry | null {
  const filtered = log.filter((e) => e.classId === classId);
  if (filtered.length === 0) return null;
  let best = filtered[0]!;
  for (const e of filtered) {
    const rb = best.correctCount / best.questionCount;
    const re = e.correctCount / e.questionCount;
    if (re > rb) best = e;
    else if (re === rb) {
      if (e.correctCount > best.correctCount) best = e;
      else if (
        e.correctCount === best.correctCount &&
        e.playedAt > best.playedAt
      ) {
        best = e;
      }
    }
  }
  return best;
}

export function latestWakabaEntryForClass(
  log: WakabaLogEntry[],
  classId: string,
): WakabaLogEntry | null {
  return log.find((e) => e.classId === classId) ?? null;
}
