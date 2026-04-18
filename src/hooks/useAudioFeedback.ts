import { useCallback, useRef } from "react";

const ATTACK_SEC = 0.005;

function getCtx(): AudioContext | null {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

function envelopeGain(
  g: GainNode,
  t0: number,
  peak: number,
  attackEnd: number,
  tEnd: number,
) {
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, attackEnd);
  g.gain.linearRampToValueAtTime(0, tEnd);
}

export function useAudioFeedback() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = getCtx();
    return ctxRef.current;
  }, []);

  const runWhenRunning = useCallback(
    (fn: (ctx: AudioContext) => void) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      void (async () => {
        try {
          if (ctx.state !== "running") await ctx.resume();
        } catch {
          return;
        }
        fn(ctx);
      })();
    },
    [ensureCtx],
  );

  const playOk = useCallback(() => {
    runWhenRunning((ctx) => {
      const t0 = ctx.currentTime;
      const dur = 0.08;
      const tEnd = t0 + dur;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      const atk = Math.min(ATTACK_SEC, dur * 0.4);
      envelopeGain(g, t0, 0.08, t0 + atk, tEnd);
      o.start(t0);
      o.stop(tEnd + 0.002);
    });
  }, [runWhenRunning]);

  const playSoftNg = useCallback(() => {
    runWhenRunning((ctx) => {
      const t0 = ctx.currentTime;
      const dur = 0.06;
      const tEnd = t0 + dur;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 220;
      o.connect(g);
      g.connect(ctx.destination);
      const atk = Math.min(ATTACK_SEC, dur * 0.4);
      envelopeGain(g, t0, 0.05, t0 + atk, tEnd);
      o.start(t0);
      o.stop(tEnd + 0.002);
    });
  }, [runWhenRunning]);

  const playClear = useCallback(() => {
    runWhenRunning((ctx) => {
      const base = ctx.currentTime;
      const noteDur = 0.12;
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, i) => {
        const t0 = base + i * 0.07;
        const tEnd = t0 + noteDur;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        o.connect(g);
        g.connect(ctx.destination);
        const atk = Math.min(ATTACK_SEC, noteDur * 0.4);
        envelopeGain(g, t0, 0.06, t0 + atk, tEnd);
        o.start(t0);
        o.stop(tEnd + 0.002);
      });
    });
  }, [runWhenRunning]);

  return { playOk, playSoftNg, playClear };
}
