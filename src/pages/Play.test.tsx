import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/types";
import { Play } from "./Play";

const playSoftNg = vi.fn();
const playOk = vi.fn();

const { speakQuestionMock, cancelSpeechMock } = vi.hoisted(() => ({
  speakQuestionMock: vi.fn(),
  cancelSpeechMock: vi.fn(),
}));

vi.mock("@/hooks/useSpeech", () => ({
  useSpeech: () => ({
    speakQuestion: speakQuestionMock,
    cancel: cancelSpeechMock,
  }),
}));

vi.mock("@/hooks/useAudioFeedback", () => ({
  useAudioFeedback: () => ({
    playOk,
    playSoftNg,
    playClear: vi.fn(),
  }),
}));

vi.mock("@/storage", () => ({
  loadSettings: () => ({
    keyGuideEnabled: true,
    speechEnabled: false,
  }),
  loadProgress: () => ({
    unlockedStageIds: ["vowels"],
    bestStarsByStage: {},
    attemptCountByStage: {},
  }),
  saveProgress: vi.fn(),
}));

const fixedQuestion: Question = {
  id: "t1",
  label: "あ",
  answer: "a",
  acceptedAnswers: ["a"],
  voiceText: "あ",
};

vi.mock("@/stages", async (importOriginal) => {
  const m = await importOriginal<typeof import("@/stages")>();
  return {
    ...m,
    prepareStageQuestions: () => [fixedQuestion],
  };
});

describe("Play", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正解後の進行待ち中は誤入力でもミス扱いにならない", () => {
    const router = createMemoryRouter(
      [
        { path: "/play/:stageId", element: <Play /> },
        { path: "/result/:stageId", element: <span>おわり</span> },
      ],
      { initialEntries: ["/play/vowels"] },
    );

    render(<RouterProvider router={router} />);

    const input = screen.getByRole("textbox", { name: /ローマ字入力/i });

    fireEvent.keyDown(input, { key: "a" });
    expect(playOk).toHaveBeenCalled();
    playSoftNg.mockClear();

    fireEvent.keyDown(input, { key: "z" });
    expect(playSoftNg).not.toHaveBeenCalled();
  });
});
