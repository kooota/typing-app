import { useLocation, useNavigate, useParams } from "react-router-dom";
import { nextStageId } from "@/stages";
import type { StageId } from "@/types";
import styles from "./Result.module.css";

type LocationState = {
  stars?: 1 | 2 | 3;
  mistakes?: number;
  unlockedNewStage?: boolean;
};

const MSG_LAST = "\u3044\u307e\u306e\u306f\u3072\u3068\u3084\u3059\u307f";
const MSG_UNLOCK =
  "\u3064\u304e\u306e\u308c\u3063\u3057\u3085\u3046\u304c\u3072\u3089\u304b\u308c\u305f\u3088";
const MSG_REPLAY =
  "\u3064\u304e\u306e\u308c\u3063\u3057\u3085\u3046\u3082\u3042\u305d\u3079\u308b\u3088";
const BTN_NEXT = "\u3064\u304e\u306e\u308c\u3063\u3057\u3085\u3046\u3078";

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
    subMessage = MSG_LAST;
  } else if (unlockedNewStage) {
    subMessage = MSG_UNLOCK;
  } else {
    subMessage = MSG_REPLAY;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {"\u3067\u304d\u305f\uff01"}
        </h1>
        <p className={styles.stars} aria-label={`${stars}\u3064`}>
          {"\u2605".repeat(stars)}
          {"\u2606".repeat(3 - stars)}
        </p>
        <p className={styles.msg}>{subMessage}</p>
        <div className={styles.actions}>
          {nextInCurriculum ? (
            <button
              type="button"
              className={styles.nextStage}
              onClick={() => navigate(`/play/${nextInCurriculum}`)}
            >
              {BTN_NEXT}
            </button>
          ) : null}
          <button
            type="button"
            className={styles.home}
            onClick={() => navigate("/")}
          >
            {"\u30c8\u30c3\u30d7\u306b\u3082\u3069\u308b"}
          </button>
        </div>
      </main>
    </div>
  );
}
