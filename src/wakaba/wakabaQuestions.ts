import type { Question, WakabaClassDef, WakabaMember } from "@/types";
import { wakabaNameKanaToRomaji } from "./kanaToRomaji";

/** Fisher–Yates（右端固定でランダム順） */
export function shuffleMemberOrder<T>(items: T[], random: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function memberToQuestion(
  cls: WakabaClassDef,
  member: WakabaMember,
): Question {
  const { answer, display } = wakabaNameKanaToRomaji(member.nameKana);
  return {
    id: `wakaba-${cls.classId}-${member.id}`,
    label: member.nameKana,
    answer,
    acceptedAnswers: [answer],
    voiceText: member.nameKana,
    voiceFirstChar: [...member.nameKana.replace(/\s+/g, "")][0],
    displayHint: display,
    wakabaMemberId: member.id,
  };
}

export function buildWakabaQuestions(
  cls: WakabaClassDef,
  random: () => number = Math.random,
): Question[] {
  const order = shuffleMemberOrder(cls.members, random);
  return order.map((m) => memberToQuestion(cls, m));
}
