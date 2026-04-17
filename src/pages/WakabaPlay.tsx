import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { useSpeech } from "@/hooks/useSpeech";
import {
  isComplete,
  isValidPrefix,
  nextKeysFromAccepted,
  normalizeKeyChar,
  representativeRemainder,
} from "@/romaji";
import { appendWakabaLog, loadSettings } from "@/storage";
import { classesWithMembers, WAKABA_CLASSES } from "@/wakaba/data";
import { buildWakabaQuestions } from "@/wakaba/wakabaQuestions";
import styles from "./Play.module.css";

const ADVANCE_MS = 400;

export function WakabaPlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const classId = (location.state as { classId?: string } | null)?.classId;

  const cls = useMemo(
    () => classesWithMembers(WAKABA_CLASSES).find((c) => c.classId === classId),
    [classId],
  );

  const questions = useMemo(
    () => (cls ? buildWakabaQuestions(cls) : []),
    [cls],
  );

  const settings = loadSettings();
  const { speakQuestion, cancel: cancelSpeech } = useSpeech();
  const { playOk, playSoftNg, playClear } = useAudioFeedback();

  const inputRef = useRef<HTMLInputElement>(null);

  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);
  const questionMissedRef = useRef(false);
  const noMissQuestionCountRef = useRef(0);
  const advanceTimerRef = useRef<number | null>(null);
  const advancingRef = useRef(false);

  const q = questions[index];

  useEffect(() => {
    if (!classId || !cls || questions.length === 0) {
      navigate("/", { replace: true });
    }
  }, [classId, cls, navigate, questions.length]);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput, index]);

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

  const finishRound = useCallback(() => {
    if (!cls) return;
    cancelSpeech();
    const correctCount = noMissQuestionCountRef.current;
    const questionCount = questions.length;
    const memberIds = questions.map((x) => x.wakabaMemberId!);
    appendWakabaLog({
      playedAt: new Date().toISOString(),
      classId: cls.classId,
      questionCount,
      correctCount,
      memberIds,
    });
    playClear();
    navigate("/wakaba/result", {
      state: { correctCount, questionCount, classId: cls.classId, memberIds },
    });
  }, [cancelSpeech, cls, navigate, playClear, questions]);

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
        finishRound();
        return;
      }
      goNextQuestion();
    }, ADVANCE_MS);
  }, [finishRound, goNextQuestion, index, playOk, questions.length]);

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
        if (!questionMissedRef.current) {
          noMissQuestionCountRef.current += 1;
        }
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
      }
    },
    [onCorrectComplete, playOk, playSoftNg, q, typed],
  );

  const highlightKeys = q
    ? nextKeysFromAccepted(typed, q.acceptedAnswers)
    : [];

  if (!cls || !q) {
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
        <span className={styles.stageName}>
          わかば {cls.classLabel} {index + 1} / {questions.length}
        </span>
      </header>

      <div className={styles.card}>
        <p className={styles.label} key={q.id}>
          {q.label}
        </p>
        {q.displayHint ? (
          <p className={styles.romajiHint} aria-hidden>
            {q.displayHint}
          </p>
        ) : null}
        <p className={styles.progress} aria-live="polite">
          <span className={styles.typed}>{typed}</span>
          <span className={styles.rest}>{representativeRemainder(typed, q)}</span>
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
