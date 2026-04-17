import type { WakabaClassDef, WakabaMember } from "@/types";
import { WAKABA_CLASSES as LOCAL_WAKABA_CLASSES } from "@wakaba-local";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function normalizeMember(raw: unknown): WakabaMember | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.nameKana)) {
    return null;
  }
  return {
    id: item.id.trim(),
    nameKana: item.nameKana.trim(),
  };
}

function normalizeClass(raw: unknown): WakabaClassDef | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  if (!isNonEmptyString(item.classId) || !isNonEmptyString(item.classLabel)) {
    return null;
  }
  if (!Array.isArray(item.members)) return null;
  const members = item.members
    .map((member) => normalizeMember(member))
    .filter((member): member is WakabaMember => member !== null);
  return {
    classId: item.classId.trim(),
    classLabel: item.classLabel.trim(),
    members,
  };
}

export function parseWakabaClassesJson(raw: string): WakabaClassDef[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(
      `VITE_WAKABA_CLASSES_JSON の JSON 解析に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("VITE_WAKABA_CLASSES_JSON は配列である必要があります");
  }

  return parsed
    .map((entry) => normalizeClass(entry))
    .filter((entry): entry is WakabaClassDef => entry !== null);
}

export function loadWakabaClassesFromEnv(
  raw: string | undefined,
): WakabaClassDef[] | null {
  if (!raw || raw.trim() === "") return null;
  return parseWakabaClassesJson(raw);
}

export function classesWithMembers(classes: WakabaClassDef[]): WakabaClassDef[] {
  return classes.filter((cls) => cls.members.length > 0);
}

const envClasses = loadWakabaClassesFromEnv(
  import.meta.env.VITE_WAKABA_CLASSES_JSON,
);

export const WAKABA_CLASSES: WakabaClassDef[] =
  envClasses ?? LOCAL_WAKABA_CLASSES;
