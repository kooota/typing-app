import { useLocation, useNavigate } from "react-router-dom";
import type { KanaTableResultState } from "@/types";
import styles from "./KanaTableResult.module.css";

export function KanaTableResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as KanaTableResultState | null;

  if (!state || state.completed !== true) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>五十音ひょう おしまい</h1>
        <p className={styles.msg}>
          ぜんぶの もじを おわりました。もういちど れんしゅう できます。
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.again}
            onClick={() => navigate("/kana-table", { replace: true })}
          >
            もういちど
          </button>
          <button
            type="button"
            className={styles.home}
            onClick={() => navigate("/", { replace: true })}
          >
            トップにもどる
          </button>
        </div>
      </main>
    </div>
  );
}
