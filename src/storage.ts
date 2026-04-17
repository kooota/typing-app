import type { AppSettings, Progress } from "./types";
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from "./types";
import { STORAGE_PROGRESS_KEY, STORAGE_SETTINGS_KEY } from "./storageKeys";

export type StorageMode = "local" | "memory";

let memorySettings: AppSettings = { ...DEFAULT_SETTINGS };
let memoryProgress: Progress = structuredClone(DEFAULT_PROGRESS);

function parseJson<T>(raw: string | null): T | null {
  if (raw == null || raw === "") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
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

export function resetAllStorage(): void {
  memorySettings = { ...DEFAULT_SETTINGS };
  memoryProgress = structuredClone(DEFAULT_PROGRESS);
  try {
    localStorage.removeItem(STORAGE_SETTINGS_KEY);
    localStorage.removeItem(STORAGE_PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}
