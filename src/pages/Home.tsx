import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHighestUnlockedStageId, getStageById } from "@/stages";
import { loadProgress } from "@/storage";
import styles from "./Home.module.css";

const LONG_PRESS_MS = 2000;

export function Home() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const stageId = getHighestUnlockedStageId(progress);
  const stage = getStageById(stageId);
  const title = stage?.title ?? "";

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const onGearPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      navigate("/parent");
    }, LONG_PRESS_MS);
  };

  const onStart = () => {
    navigate(`/play/${stageId}`);
  };

  const stageLine = useMemo(
    () => (title ? `いまのところ：${title}` : ""),
    [title],
  );

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.gear}
        aria-label="おとなのせってい（ながおし）"
        onPointerDown={onGearPointerDown}
        onPointerUp={clearTimer}
        onPointerCancel={clearTimer}
        onPointerLeave={clearTimer}
      >
        ⚙
      </button>

      <main className={styles.main}>
        <h1 className={styles.title}>ローマ字タイピング</h1>
        {stageLine ? <p className={styles.reach}>{stageLine}</p> : null}
        <button type="button" className={styles.start} onClick={onStart}>
          はじめる
        </button>
      </main>
    </div>
  );
}
