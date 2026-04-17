import type {
  AppSettings,
  PracticeLogEntry,
  Progress,
  WakabaLogEntry,
} from "./types";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "./types";
import {
  STORAGE_PRACTICE_LOG_KEY,
  STORAGE_PROGRESS_KEY,
  STORAGE_SETTINGS_KEY,
  STORAGE_WAKABA_LOG_KEY,
} from "./storageKeys";

export type StorageMode = "local" | "memory";

const PRACTICE_LOG_MAX = 20;

let memorySettings: AppSettings = { ...DEFAULT_SETTINGS };
let memoryProgress: Progress = structuredClone(DEFAULT_PROGRESS);
let memoryPracticeLog: PracticeLogEntry[] = [];
let memoryWakabaLog: WakabaLogEntry[] = [];

function parseJson<T>(raw: string | null): T | null {
  if (raw == null || raw === "") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizePracticeLog(raw: unknown): PracticeLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: PracticeLogEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const playedAt = typeof o.playedAt === "string" ? o.playedAt : "";
    const questionCount = o.questionCount === 10 ? 10 : null;
    const correctCount =
      typeof o.correctCount === "number" &&
      o.correctCount >= 0 &&
      o.correctCount <= 10
        ? o.correctCount
        : null;
    const wordIds = Array.isArray(o.wordIds)
      ? o.wordIds.filter((x): x is string => typeof x === "string")
      : null;
    if (
      playedAt &&
      questionCount === 10 &&
      correctCount !== null &&
      wordIds
    ) {
      out.push({ playedAt, questionCount, correctCount, wordIds });
    }
  }
  return out;
}

function normalizeWakabaLog(raw: unknown): WakabaLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: WakabaLogEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const playedAt = typeof o.playedAt === "string" ? o.playedAt : "";
    const classId = typeof o.classId === "string" ? o.classId : "";
    const questionCount =
      typeof o.questionCount === "number" &&
      o.questionCount >= 1 &&
      Number.isInteger(o.questionCount)
        ? o.questionCount
        : null;
    const correctCount =
      typeof o.correctCount === "number" &&
      o.correctCount >= 0 &&
      questionCount != null &&
      o.correctCount <= questionCount
        ? o.correctCount
        : null;
    const memberIds = Array.isArray(o.memberIds)
      ? o.memberIds.filter((x): x is string => typeof x === "string")
      : null;
    if (
      playedAt &&
      classId &&
      questionCount != null &&
      correctCount !== null &&
      memberIds &&
      memberIds.length === questionCount
    ) {
      out.push({
        playedAt,
        classId,
        questionCount,
        correctCount,
        memberIds,
      });
    }
  }
  return out;
}

export function getStorageMode(): StorageMode {
  try {
    const k = "__typing_app_probe__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return "local";
  } catch {
    return "memory";
  }
}

export function loadSettings(): AppSettings {
  if (getStorageMode() === "memory") {
    return { ...memorySettings };
  }
  const parsed = parseJson<AppSettings>(
    localStorage.getItem(STORAGE_SETTINGS_KEY),
  );
  return parsed ? { ...DEFAULT_SETTINGS, ...parsed } : { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: AppSettings): void {
  if (getStorageMode() === "memory") {
    memorySettings = { ...settings };
    return;
  }
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
}

export function loadProgress(): Progress {
  if (getStorageMode() === "memory") {
    return structuredClone(memoryProgress);
  }
  const parsed = parseJson<Progress>(
    localStorage.getItem(STORAGE_PROGRESS_KEY),
  );
  if (!parsed) return structuredClone(DEFAULT_PROGRESS);
  return {
    unlockedStageIds:
      parsed.unlockedStageIds?.length > 0
        ? parsed.unlockedStageIds
        : [...DEFAULT_PROGRESS.unlockedStageIds],
    bestStarsByStage: { ...parsed.bestStarsByStage },
    attemptCountByStage: { ...parsed.attemptCountByStage },
  };
}

export function saveProgress(progress: Progress): void {
  if (getStorageMode() === "memory") {
    memoryProgress = structuredClone(progress);
    return;
  }
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
}

export function loadPracticeLog(): PracticeLogEntry[] {
  if (getStorageMode() === "memory") {
    return memoryPracticeLog.map((e) => ({ ...e, wordIds: [...e.wordIds] }));
  }
  const parsed = parseJson<unknown>(
    localStorage.getItem(STORAGE_PRACTICE_LOG_KEY),
  );
  return normalizePracticeLog(parsed);
}

export function appendPracticeLog(entry: PracticeLogEntry): void {
  const next = [entry, ...loadPracticeLog()].slice(0, PRACTICE_LOG_MAX);
  if (getStorageMode() === "memory") {
    memoryPracticeLog = next;
    return;
  }
  localStorage.setItem(STORAGE_PRACTICE_LOG_KEY, JSON.stringify(next));
}

export function loadWakabaLog(): WakabaLogEntry[] {
  if (getStorageMode() === "memory") {
    return memoryWakabaLog.map((e) => ({
      ...e,
      memberIds: [...e.memberIds],
    }));
  }
  const parsed = parseJson<unknown>(
    localStorage.getItem(STORAGE_WAKABA_LOG_KEY),
  );
  return normalizeWakabaLog(parsed);
}

export function appendWakabaLog(entry: WakabaLogEntry): void {
  const next = [entry, ...loadWakabaLog()].slice(0, PRACTICE_LOG_MAX);
  if (getStorageMode() === "memory") {
    memoryWakabaLog = next;
    return;
  }
  localStorage.setItem(STORAGE_WAKABA_LOG_KEY, JSON.stringify(next));
}

export function resetAllStorage(): void {
  memorySettings = { ...DEFAULT_SETTINGS };
  memoryProgress = structuredClone(DEFAULT_PROGRESS);
  memoryPracticeLog = [];
  memoryWakabaLog = [];
  try {
    localStorage.removeItem(STORAGE_SETTINGS_KEY);
    localStorage.removeItem(STORAGE_PROGRESS_KEY);
    localStorage.removeItem(STORAGE_PRACTICE_LOG_KEY);
    localStorage.removeItem(STORAGE_WAKABA_LOG_KEY);
  } catch {
    /* ignore */
  }
}
