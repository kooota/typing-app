import { useLocation, useNavigate } from "react-router-dom";
import type { WakabaResultState } from "@/types";
import styles from "./WakabaResult.module.css";

export function WakabaResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as Partial<WakabaResultState>;

  const correctCount = state.correctCount;
  const questionCount = state.questionCount;
  const classId = state.classId;
  const memberIds = state.memberIds;

  const ok =
    typeof correctCount === "number" &&
    typeof questionCount === "number" &&
    questionCount >= 1 &&
    correctCount >= 0 &&
    correctCount <= questionCount &&
    typeof classId === "string" &&
    Array.isArray(memberIds) &&
    memberIds.length === questionCount &&
    memberIds.every((x) => typeof x === "string");

  if (!ok) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {"\u308f\u304b\u3070 \u304a\u3057\u307e\u3044"}
        </h1>
        <p className={styles.score} aria-live="polite">
          {"\u30ce\u30fc\u30df\u30b9 "}
          {correctCount} / {questionCount}
        </p>
        <p className={styles.scoreNote}>
          {
            "\u307e\u3061\u304c\u3044\u306a\u3057\u3067 \u304a\u308f\u3063\u305f \u306a\u307e\u3048 \u3092 \u304b\u305e\u3048\u3066\u3044\u307e\u3059"
          }
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.again}
            onClick={() =>
              navigate("/wakaba", { replace: true, state: { classId } })
            }
          >
            {"\u3082\u3046\u3044\u3061\u3069"}
          </button>
          <button
            type="button"
            className={styles.home}
            onClick={() => navigate("/", { replace: true })}
          >
            {"\u30c8\u30c3\u30d7\u306b\u3082\u3069\u308b"}
          </button>
        </div>
      </main>
    </div>
  );
}
