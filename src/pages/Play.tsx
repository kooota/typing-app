import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { useSpeech } from "@/hooks/useSpeech";
import {
  isComplete,
  isValidPrefix,
  nextKeysFromAccepted,
  normalizeKeyChar,
  displayRomaji,
  representativeRemainder,
} from "@/romaji";
import { starsForStage } from "@/stars";
import { getStageById, nextStageId, prepareStageQuestions } from "@/stages";
import type { StageId } from "@/types";
import { loadProgress, loadSettings, saveProgress } from "@/storage";
import styles from "./Play.module.css";

const ADVANCE_MS = 400;

export function Play() {
  const { stageId: rawId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stageId = rawId as StageId | undefined;

  const settings = loadSettings();
  const { speakQuestion, cancel: cancelSpeech } = useSpeech();
  const { playOk, playSoftNg, playClear } = useAudioFeedback();

  const inputRef = useRef<HTMLInputElement>(null);

  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);
  const [stageMistakes, setStageMistakes] = useState(0);
  const stageMistakesRef = useRef(0);
  const questionMissedRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const advancingRef = useRef(false);

  useEffect(() => {
    stageMistakesRef.current = stageMistakes;
  }, [stageMistakes]);

  const stage = stageId ? getStageById(stageId) : undefined;
  const questions = useMemo(() => {
    if (!stage) return [];
    return prepareStageQuestions(stage);
  }, [stage]);

  const q = questions[index];

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!stageId || !stage) {
      navigate("/", { replace: true });
      return;
    }
    const p = loadProgress();
    if (!p.unlockedStageIds.includes(stageId)) {
      navigate("/", { replace: true });
      return;
    }
    const bumpKey = `typing-app/attempt-bump/${stageId}/${location.key}`;
    try {
      if (sessionStorage.getItem(bumpKey)) return;
      sessionStorage.setItem(bumpKey, "1");
    } catch {
      /* sessionStorage 不可時は二重計上の抑止を諦める */
    }
    const n = (p.attemptCountByStage[stageId] ?? 0) + 1;
    saveProgress({
      ...p,
      attemptCountByStage: { ...p.attemptCountByStage, [stageId]: n },
    });
  }, [location.key, navigate, stage, stageId]);

  useEffect(() => {
    focusInput();
  }, [focusInput, index, stageId]);

  useEffect(() => {
    if (!q) return;
    advancingRef.current = false;
    questionMissedRef.current = false;
    setTyped("");
    cancelSpeech();
    speakQuestion(q, settings.speechEnabled);
    return () => {
      if (advanceTimerRef.current != null) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      advancingRef.current = false;
    };
  }, [cancelSpeech, q, settings.speechEnabled, speakQuestion]);

  const finishStage = useCallback(
    (mistakes: number) => {
      cancelSpeech();
      const stars = starsForStage(mistakes);
      const p = loadProgress();
      const sid = stageId!;
      const prevBest = p.bestStarsByStage[sid] ?? 0;
      const best = Math.max(prevBest, stars) as 1 | 2 | 3;
      const next = nextStageId(sid);
      const unlockedNewStage = Boolean(
        next && !p.unlockedStageIds.includes(next),
      );
      let unlocked = p.unlockedStageIds;
      if (next && !unlocked.includes(next)) {
        unlocked = [...unlocked, next];
      }
      saveProgress({
        ...p,
        unlockedStageIds: unlocked,
        bestStarsByStage: { ...p.bestStarsByStage, [sid]: best },
      });
      playClear();
      navigate(`/result/${sid}`, {
        state: { stars, mistakes, unlockedNewStage },
      });
    },
    [cancelSpeech, navigate, playClear, stageId],
  );

  const goNextQuestion = useCallback(() => {
    setIndex((i) => i + 1);
    focusInput();
  }, [focusInput]);

  const onCorrectComplete = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    playOk();
    if (advanceTimerRef.current != null) {
      window.clearTimeout(advanceTimerRef.current);
    }
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      advancingRef.current = false;
      if (index >= questions.length - 1) {
        finishStage(stageMistakesRef.current);
        return;
      }
      goNextQuestion();
    }, ADVANCE_MS);
  }, [finishStage, goNextQuestion, index, playOk, questions.length]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!q) return;
      if (e.repeat) return;
      if (advancingRef.current) {
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setTyped((t) => t.slice(0, -1));
        return;
      }

      const ch = normalizeKeyChar(e.key);
      if (!ch) return;
      e.preventDefault();

      const next = typed + ch;
      if (isComplete(next, q.acceptedAnswers)) {
        setTyped(next);
        onCorrectComplete();
        return;
      }
      if (isValidPrefix(next, q.acceptedAnswers)) {
        setTyped(next);
        playOk();
        return;
      }

      playSoftNg();
      if (!questionMissedRef.current) {
        questionMissedRef.current = true;
        setStageMistakes((m) => m + 1);
      }
    },
    [onCorrectComplete, playOk, playSoftNg, q, typed],
  );

  const highlightKeys = q
    ? nextKeysFromAccepted(typed, q.acceptedAnswers)
    : [];

  if (!stage || !q) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate("/")}
        >
          もどる
        </button>
        <span className={styles.stageName}>{stage.title}</span>
      </header>

      <div className={styles.card}>
        <p className={styles.label} key={q.id}>
          {q.label}
        </p>
        <p className={styles.progress} aria-live="polite">
          <span className={styles.typed}>{displayRomaji(typed)}</span>
          <span className={styles.rest}>
            {displayRomaji(representativeRemainder(typed, q))}
          </span>
        </p>
      </div>

      <VirtualKeyboard
        highlightKeys={highlightKeys}
        guideEnabled={settings.keyGuideEnabled}
      />

      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="text"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="off"
        aria-label="ローマ字入力"
        value=""
        onChange={() => {}}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
