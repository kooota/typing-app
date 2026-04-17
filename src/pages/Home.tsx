import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHighestUnlockedStageId, getStageById, STAGE_ORDER } from "@/stages";
import { loadProgress } from "@/storage";
import type { StageId } from "@/types";
import styles from "./Home.module.css";

export function Home() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const highestStageId = getHighestUnlockedStageId(progress);
  const unlockedStages = STAGE_ORDER.filter((id) =>
    progress.unlockedStageIds.includes(id),
  )
    .map((id) => getStageById(id))
    .filter((stage): stage is NonNullable<typeof stage> => Boolean(stage));
  const [selectedStageId, setSelectedStageId] = useState<StageId>(highestStageId);
  const stage = getStageById(selectedStageId);
  const title = stage?.title ?? "";

  useEffect(() => {
    if (!progress.unlockedStageIds.includes(selectedStageId)) {
      setSelectedStageId(highestStageId);
    }
  }, [highestStageId, progress.unlockedStageIds, selectedStageId]);

  const onStart = () => {
    navigate(`/play/${selectedStageId}`);
  };

  const stageLine = useMemo(
    () => (title ? `いまえらんでいるれんしゅう：${title}` : ""),
    [title],
  );

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.gear}
        aria-label="おとなのせってい"
        onClick={() => navigate("/parent")}
      >
        ⚙
      </button>

      <main className={styles.main}>
        <h1 className={styles.title}>ローマ字タイピング</h1>
        {stageLine ? <p className={styles.reach}>{stageLine}</p> : null}
        <div className={styles.stageList} aria-label="れんしゅうをえらぶ">
          {unlockedStages.map((unlockedStage) => {
            const active = unlockedStage.id === selectedStageId;
            return (
              <button
                key={unlockedStage.id}
                type="button"
                className={active ? styles.stageChipActive : styles.stageChip}
                onClick={() => setSelectedStageId(unlockedStage.id)}
              >
                {unlockedStage.title}
              </button>
            );
          })}
        </div>
        <button type="button" className={styles.start} onClick={onStart}>
          はじめる
        </button>
      </main>
    </div>
  );
}
