import { useCallback, useRef } from "react";
import type { Question } from "@/types";

function speakLine(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/**
 * 単語: 全体 → 間 → 先頭（入力開始の合図）
 * 1文字: voiceText のみ
 */
export function useSpeech() {
  const seqRef = useRef(0);

  const speakQuestion = useCallback((q: Question, enabled: boolean) => {
    if (!enabled || !("speechSynthesis" in window)) return;
    const id = ++seqRef.current;
    window.speechSynthesis.cancel();

    const run = async () => {
      await speakLine(q.voiceText, "ja-JP");
      if (seqRef.current !== id) return;
      const isWord = q.label.length >= 2;
      if (!isWord) return;
      await new Promise((r) => setTimeout(r, 450));
      if (seqRef.current !== id) return;
      const head = q.voiceFirstChar ?? [...q.label][0] ?? "";
      if (head) await speakLine(head, "ja-JP");
    };
    void run();
  }, []);

  const cancel = useCallback(() => {
    seqRef.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { speakQuestion, cancel };
}
