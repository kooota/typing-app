import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStorageMode,
  loadSettings,
  resetAllStorage,
  saveSettings,
} from "@/storage";
import { DEFAULT_SETTINGS } from "@/types";
import styles from "./ParentSettings.module.css";

export function ParentSettings() {
  const navigate = useNavigate();
  const storageMode = getStorageMode();
  const [guide, setGuide] = useState(() => loadSettings().keyGuideEnabled);
  const [speech, setSpeech] = useState(() => loadSettings().speechEnabled);

  const persist = (next: { keyGuideEnabled: boolean; speechEnabled: boolean }) => {
    saveSettings(next);
  };

  const onGuide = (v: boolean) => {
    setGuide(v);
    persist({ keyGuideEnabled: v, speechEnabled: speech });
  };

  const onSpeech = (v: boolean) => {
    setSpeech(v);
    persist({ keyGuideEnabled: guide, speechEnabled: v });
  };

  const onReset = () => {
    if (
      !window.confirm(
        "きろくをぜんぶけして、はじめからにしますか？（もとにもどせません）",
      )
    ) {
      return;
    }
    resetAllStorage();
    setGuide(DEFAULT_SETTINGS.keyGuideEnabled);
    setSpeech(DEFAULT_SETTINGS.speechEnabled);
    alert("きろくをけしました。");
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate("/")}
        >
          とじる
        </button>
        <h1 className={styles.title}>おとなのせってい</h1>
      </header>

      {storageMode === "memory" ? (
        <p className={styles.warn}>
          このブラウザではきろくをほぞんできません（たいおうしています）。ブラウザを閉じるときえます。
        </p>
      ) : null}

      <section className={styles.section}>
        <label className={styles.row}>
          <span>キーのガイドをみせる</span>
          <input
            type="checkbox"
            checked={guide}
            onChange={(e) => onGuide(e.target.checked)}
          />
        </label>
        <label className={styles.row}>
          <span>よみあげをつかう</span>
          <input
            type="checkbox"
            checked={speech}
            onChange={(e) => onSpeech(e.target.checked)}
          />
        </label>
      </section>

      <section className={styles.section}>
        <button type="button" className={styles.danger} onClick={onReset}>
          きろくをリセット
        </button>
      </section>

      <p className={styles.note}>
        ひらがなはローマじで入力します。IME が にほんごのときは、えいじモードにしてからあそんでください。
      </p>
    </div>
  );
}
