import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHighestUnlockedStageId, getStageById, STAGE_ORDER } from "@/stages";
import { loadPracticeLog, loadProgress, loadWakabaLog } from "@/storage";
import type { StageId } from "@/types";
import {
  bestWakabaEntryForClass,
  latestWakabaEntryForClass,
} from "@/wakaba/wakabaStats";
import { classesWithMembers, WAKABA_CLASSES } from "@/wakaba/data";
import styles from "./Home.module.css";

export function Home() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const practiceLog = loadPracticeLog();
  const wakabaLog = loadWakabaLog();
  const wakabaClasses = useMemo(() => classesWithMembers(WAKABA_CLASSES), []);
  const highestStageId = getHighestUnlockedStageId(progress);
  const unlockedStages = STAGE_ORDER.filter((id) =>
    progress.unlockedStageIds.includes(id),
  )
    .map((id) => getStageById(id))
    .filter((stage): stage is NonNullable<typeof stage> => Boolean(stage));
  const [selectedStageId, setSelectedStageId] = useState<StageId>(highestStageId);
  const [selectedWakabaClassId, setSelectedWakabaClassId] = useState<string>(
    () => classesWithMembers(WAKABA_CLASSES)[0]?.classId ?? "",
  );
  const stage = getStageById(selectedStageId);
  const title = stage?.title ?? "";

  useEffect(() => {
    if (!progress.unlockedStageIds.includes(selectedStageId)) {
      setSelectedStageId(highestStageId);
    }
  }, [highestStageId, progress.unlockedStageIds, selectedStageId]);

  useEffect(() => {
    if (
      wakabaClasses.length > 0 &&
      !wakabaClasses.some((c) => c.classId === selectedWakabaClassId)
    ) {
      setSelectedWakabaClassId(wakabaClasses[0]!.classId);
    }
  }, [selectedWakabaClassId, wakabaClasses]);

  const onStart = () => {
    navigate(`/play/${selectedStageId}`);
  };

  const stageLine = useMemo(
    () => (title ? `\u3044\u307e\u3048\u3089\u3093\u3067\u3044\u308b\u308c\u3093\u3057\u3085\u3046\uff1a${title}` : ""),
    [title],
  );

  const practiceBest = useMemo(() => {
    if (practiceLog.length === 0) return null;
    return Math.max(...practiceLog.map((e) => e.correctCount));
  }, [practiceLog]);

  const practiceRecent = practiceLog.slice(0, 3);

  const wakabaLatest = useMemo(
    () => latestWakabaEntryForClass(wakabaLog, selectedWakabaClassId),
    [wakabaLog, selectedWakabaClassId],
  );
  const wakabaBest = useMemo(
    () => bestWakabaEntryForClass(wakabaLog, selectedWakabaClassId),
    [wakabaLog, selectedWakabaClassId],
  );

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.gear}
        aria-label="\u304a\u3068\u306a\u306e\u305b\u3063\u3066\u3044"
        onClick={() => navigate("/parent")}
      >
        {"\u2699"}
      </button>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {"\u30ed\u30fc\u30de\u5b57\u30bf\u30a4\u30d4\u30f3\u30b0"}
        </h1>
        {stageLine ? <p className={styles.reach}>{stageLine}</p> : null}
        <div className={styles.stageList} aria-label="\u308c\u3093\u3057\u3085\u3046\u3092\u3048\u3089\u3076">
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
          {"\u306f\u3058\u3081\u308b"}
        </button>

        <section className={styles.practiceSection} aria-label="\u3058\u3063\u305b\u3093\u30e2\u30fc\u30c9">
          <h2 className={styles.practiceTitle}>
            {"\u5b9f\u8df5\u30e2\u30fc\u30c9"}
          </h2>
          <p className={styles.practiceHint}>
            {
              "\u3084\u3055\u3057\u3044\u305f\u3093\u3054\u3092 10\u3082\u3093 \u308c\u3093\u3057\u3085\u3046\u3057\u3088\u3046\u3002\u30ce\u30fc\u30df\u30b9\u3067\u304a\u308f\u3063\u305f\u3082\u3093\u3092\u304b\u305e\u3048\u307e\u3059"
            }
          </p>
          {practiceLog.length > 0 ? (
            <div className={styles.practiceStats}>
              <p className={styles.practiceStatLine}>
                {"\u305c\u3093\u304b\u3044\u30ce\u30fc\u30df\u30b9 "}
                {practiceLog[0]!.correctCount} / 10
              </p>
              {practiceBest != null ? (
                <p className={styles.practiceStatLine}>
                  {"\u30d9\u30b9\u30c8\uff08\u30ce\u30fc\u30df\u30b9\uff09 "}
                  {practiceBest} / 10
                </p>
              ) : null}
              <ul className={styles.practiceHistory}>
                {practiceRecent.map((entry) => (
                  <li key={entry.playedAt}>
                    {"\u30ce\u30fc\u30df\u30b9 "}
                    {entry.correctCount} / 10
                    <span className={styles.practiceHistoryDate}>
                      {" "}
                      ({entry.playedAt.slice(0, 10)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.practiceEmpty}>
              {"\u307e\u3060\u304d\u308d\u304f\u304c\u306a\u3044\u3088"}
            </p>
          )}
          <button
            type="button"
            className={styles.practiceStart}
            onClick={() => navigate("/practice")}
          >
            {"\u3058\u3063\u305b\u3093\u3092\u306f\u3058\u3081\u308b"}
          </button>
        </section>

        {wakabaClasses.length > 0 ? (
          <section
            className={styles.wakabaSection}
            aria-label="\u308f\u304b\u3070\u30e2\u30fc\u30c9"
          >
            <h2 className={styles.wakabaTitle}>
              {"\u308f\u304b\u3070\u30e2\u30fc\u30c9"}
            </h2>
            <p className={styles.wakabaHint}>
              {
                "\u304f\u3089\u3059\u3068\u306e \u306a\u307e\u3048\u3092 \u30ed\u30fc\u30de\u5b57\u3067 \u3046\u3061\u3042\u308f\u305b\u307e\u3057\u3087\u3046"
              }
            </p>
            <div
              className={styles.wakabaClassList}
              aria-label="\u7d44\u3092\u3048\u3089\u3076"
            >
              {wakabaClasses.map((wc) => {
                const active = wc.classId === selectedWakabaClassId;
                return (
                  <button
                    key={wc.classId}
                    type="button"
                    className={
                      active ? styles.wakabaChipActive : styles.wakabaChip
                    }
                    onClick={() => setSelectedWakabaClassId(wc.classId)}
                  >
                    {wc.classLabel}
                  </button>
                );
              })}
            </div>
            {wakabaLatest || wakabaBest ? (
              <div className={styles.wakabaStats}>
                {wakabaLatest ? (
                  <p className={styles.wakabaStatLine}>
                    {"\u305c\u3093\u304b\u3044\u30ce\u30fc\u30df\u30b9 "}
                    {wakabaLatest.correctCount} / {wakabaLatest.questionCount}
                  </p>
                ) : null}
                {wakabaBest ? (
                  <p className={styles.wakabaStatLine}>
                    {"\u30d9\u30b9\u30c8\uff08\u30ce\u30fc\u30df\u30b9\uff09 "}
                    {wakabaBest.correctCount} / {wakabaBest.questionCount}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className={styles.wakabaEmpty}>
                {"\u307e\u3060\u304d\u308d\u304f\u304c\u306a\u3044\u3088"}
              </p>
            )}
            <button
              type="button"
              className={styles.wakabaStart}
              onClick={() =>
                navigate("/wakaba", {
                  state: { classId: selectedWakabaClassId },
                })
              }
            >
              {"\u306f\u3058\u3081\u308b"}
            </button>
          </section>
        ) : null}

        <section className={styles.kanaSection} aria-label="\u4e94\u5341\u97f3\u8868\u30e2\u30fc\u30c9">
          <h2 className={styles.kanaTitle}>
            {"\u4e94\u5341\u97f3\u3072\u3087\u3046"}
          </h2>
          <p className={styles.kanaHint}>
            {
              "\u3072\u3089\u304c\u306a\u3068 \u30ed\u30fc\u30de\u5b57\u3092 1\u3064\u305a\u3064 \u3058\u3085\u3093\u3070\u3093\u306b \u304a\u307c\u3048\u3088\u3046"
            }
          </p>
          <button
            type="button"
            className={styles.kanaStart}
            onClick={() => navigate("/kana-table")}
          >
            {"\u4e94\u5341\u97f3\u3072\u3087\u3046\u3092\u306f\u3058\u3081\u308b"}
          </button>
        </section>
      </main>
    </div>
  );
}
