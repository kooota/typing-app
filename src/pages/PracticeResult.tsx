import { useLocation, useNavigate } from "react-router-dom";
import type { PracticeSessionResultState } from "@/types";
import styles from "./PracticeResult.module.css";

export function PracticeResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as Partial<PracticeSessionResultState>;

  const correctCount = state.correctCount;
  const questionCount = state.questionCount;

  if (
    correctCount == null ||
    questionCount !== 10 ||
    correctCount < 0 ||
    correctCount > 10
  ) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>じっせん おしまい</h1>
        <p className={styles.score} aria-live="polite">
          ノーミス {correctCount} / {questionCount}
        </p>
        <p className={styles.scoreNote}>
          まちがいなしで おわった もん を かぞえています
        </p>
        <button
          type="button"
          className={styles.home}
          onClick={() => navigate("/")}
        >
          トップにもどる
        </button>
      </main>
    </div>
  );
}
