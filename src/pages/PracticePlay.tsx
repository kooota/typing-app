import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { pickPracticeRound, PRACTICE_ROUND_LENGTH } from "@/practiceSession";
import { appendPracticeLog, loadSettings } from "@/storage";
import styles from "./Play.module.css";

const ADVANCE_MS = 400;

export function PracticePlay() {
  const navigate = useNavigate();

  const settings = loadSettings();
  const { speakQuestion, cancel: cancelSpeech } = useSpeech();
  const { playOk, playSoftNg, playClear } = useAudioFeedback();

  const inputRef = useRef<HTMLInputElement>(null);

  const questions = useMemo(() => pickPracticeRound(), []);
  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);
  const questionMissedRef = useRef(false);
  /** 誤キーなしで最後まで打てた問題数（「せいかい」ではなくノーミス完答数） */
  const noMissQuestionCountRef = useRef(0);
  const advanceTimerRef = useRef<number | null>(null);
  const advancingRef = useRef(false);

  const q = questions[index];

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
    cancelSpeech();
    const correctCount = noMissQuestionCountRef.current;
    const wordIds = questions.map((x) => x.id);
    appendPracticeLog({
      playedAt: new Date().toISOString(),
      questionCount: 10,
      correctCount,
      wordIds,
    });
    playClear();
    navigate("/practice/result", {
      state: { correctCount, questionCount: 10, wordIds },
    });
  }, [cancelSpeech, navigate, playClear, questions]);

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

  if (!q) {
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
          じっせん {index + 1} / {PRACTICE_ROUND_LENGTH}
        </span>
      </header>

      <div className={styles.card}>
        <p className={styles.label} key={q.id}>
          {q.label}
        </p>
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
