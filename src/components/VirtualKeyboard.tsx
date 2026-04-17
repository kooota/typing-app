import styles from "./VirtualKeyboard.module.css";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

type Props = {
  highlightKeys: string[];
  guideEnabled: boolean;
};

export function VirtualKeyboard({ highlightKeys, guideEnabled }: Props) {
  const set = new Set(highlightKeys.map((k) => k.toLowerCase()));
  return (
    <div className={styles.wrap} aria-hidden>
      {ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map((k) => {
            const on = guideEnabled && set.has(k);
            return (
              <kbd
                key={k}
                className={`${styles.key} ${on ? styles.keyOn : ""}`}
                data-key={k}
              >
                {k.toUpperCase()}
              </kbd>
            );
          })}
        </div>
      ))}
    </div>
  );
}
