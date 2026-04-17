import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { useSpeech } from "@/hooks/useSpeech";
import {
  KANA_TABLE_SEQUENCE,
  KANA_TABLE_TOTAL,
  kanaTableCellAt,
  kanaTableGridSize,
  kanaTableSectionLabel,
} from "@/kanaTableData";
import {
  isComplete,
  isValidPrefix,
  nextKeysFromAccepted,
  normalizeKeyChar,
  representativeRemainder,
} from "@/romaji";
import { loadSettings } from "@/storage";
import type { KanaTableEntry, KanaTableSectionKind, Question } from "@/types";
import styles from "./KanaTablePlay.module.css";

const ADVANCE_MS = 400;

const SECTIONS: KanaTableSectionKind[] = ["basic", "dakuon", "yoon"];

function entryToQuestion(entry: KanaTableEntry): Question {
  return {
    id: entry.id,
    label: entry.kana,
    answer: entry.romaji,
    acceptedAnswers: [entry.romaji],
    voiceText: entry.kana,
  };
}

function KanaTableGrid(props: {
  section: KanaTableSectionKind;
  currentSeq: number;
}) {
  const { rows, cols } = kanaTableGridSize(props.section);
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ent = kanaTableCellAt(props.section, r, c);
      if (!ent) {
        cells.push(
          <div
            key={`${props.section}-${r}-${c}`}
            className={`${styles.cell} ${styles.cellEmpty}`}
            aria-hidden
          />,
        );
        continue;
      }
      const i = ent.sequenceIndex;
      let cellClass = styles.cell;
      if (i < props.currentSeq) cellClass += ` ${styles.cellDone}`;
      else if (i === props.currentSeq) cellClass += ` ${styles.cellCurrent}`;
      else cellClass += ` ${styles.cellPending}`;

      cells.push(
        <div key={ent.id} className={cellClass}>
          <span className={styles.kana}>{ent.kana}</span>
          <span className={styles.romaji}>{ent.romaji}</span>
        </div>,
      );
    }
  }
  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {cells}
    </div>
  );
}

export function KanaTablePlay() {
  const navigate = useNavigate();
  const settings = loadSettings();
  const { speakQuestion, cancel: cancelSpeech } = useSpeech();
  const { playOk, playSoftNg, playClear } = useAudioFeedback();

  const inputRef = useRef<HTMLInputElement>(null);

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const advanceTimerRef = useRef<number | null>(null);
  const advancingRef = useRef(false);

  const entry = KANA_TABLE_SEQUENCE[index]!;
  const q = useMemo(() => entryToQuestion(entry), [entry]);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput, index]);

  useEffect(() => {
    advancingRef.current = false;
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

  const finishAll = useCallback(() => {
    cancelSpeech();
    playClear();
    navigate("/kana-table/result", { state: { completed: true as const } });
  }, [cancelSpeech, navigate, playClear]);

  const goNext = useCallback(() => {
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
      if (index >= KANA_TABLE_TOTAL - 1) {
        finishAll();
        return;
      }
      goNext();
    }, ADVANCE_MS);
  }, [finishAll, goNext, index, playOk]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    [onCorrectComplete, playOk, playSoftNg, q.acceptedAnswers, typed],
  );

  const highlightKeys = nextKeysFromAccepted(typed, q.acceptedAnswers);

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
        <span className={styles.title}>五十音ひょう</span>
      </header>

      <div className={styles.tablesWrap}>
        {SECTIONS.map((section) => (
          <section key={section} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {kanaTableSectionLabel(section)}
            </h2>
            <KanaTableGrid section={section} currentSeq={index} />
          </section>
        ))}
      </div>

      <div className={styles.card}>
        <p className={styles.label} key={q.id}>
          {q.label}
        </p>
        <p className={styles.progress} aria-live="polite">
          <span className={styles.typed}>{typed}</span>
          <span className={styles.rest}>{representativeRemainder(typed, q)}</span>
        </p>
        <p className={styles.meta}>
          {index + 1} / {KANA_TABLE_TOTAL}
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
