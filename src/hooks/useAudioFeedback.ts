import { useCallback, useRef } from "react";

function getCtx(): AudioContext | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

export function useAudioFeedback() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = getCtx();
    return ctxRef.current;
  }, []);

  const playOk = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.08);
  }, [ensureCtx]);

  const playSoftNg = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = 220;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.06);
  }, [ensureCtx]);

  const playClear = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.07;
      o.start(t);
      o.stop(t + 0.12);
    });
  }, [ensureCtx]);

  return { playOk, playSoftNg, playClear };
}
