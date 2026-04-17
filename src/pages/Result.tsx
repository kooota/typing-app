import { useLocation, useNavigate, useParams } from "react-router-dom";
import { nextStageId } from "@/stages";
import type { StageId } from "@/types";
import styles from "./Result.module.css";

type LocationState = {
  stars?: 1 | 2 | 3;
  mistakes?: number;
  /** このクリアで新しく次ステージが解放されたか */
  unlockedNewStage?: boolean;
};

export function Result() {
  const { stageId: raw } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const stars = state.stars ?? 1;
  const sid = raw as StageId | undefined;
  const nextInCurriculum = sid ? nextStageId(sid) : null;
  const unlockedNewStage = state.unlockedNewStage === true;

  if (!sid || state.stars == null) {
    navigate("/", { replace: true });
    return null;
  }

  let subMessage: string;
  if (!nextInCurriculum) {
    subMessage = "いまのはひとやすみ";
  } else if (unlockedNewStage) {
    subMessage = "つぎのれっしゅうがひらかれたよ";
  } else {
    subMessage = "つぎのれっしゅうもあそべるよ";
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>できた！</h1>
        <p className={styles.stars} aria-label={`星${stars}つ`}>
          {"★".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </p>
        <p className={styles.msg}>{subMessage}</p>
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
