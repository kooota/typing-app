import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAudioFeedback } from "./useAudioFeedback";

describe("useAudioFeedback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("AudioContext が suspended のとき resume してからオシレータを鳴らす", async () => {
    const start = vi.fn();
    const stop = vi.fn();

    let captured: CtxMock | undefined;

    class CtxMock {
      state: AudioContextState = "suspended";
      currentTime = 0;
      destination = {} as AudioDestinationNode;
      resume = vi.fn(async () => {
        this.state = "running";
      });
      constructor() {
        captured = this;
      }
      createOscillator = () => ({
        type: "sine" as OscillatorType,
        frequency: { value: 0 },
        connect: vi.fn(),
        start,
        stop,
      });
      createGain = () => ({
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      });
    }

    vi.stubGlobal("AudioContext", CtxMock);

    const { result } = renderHook(() => useAudioFeedback());

    await act(async () => {
      result.current.playOk();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(captured?.resume).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });
});
