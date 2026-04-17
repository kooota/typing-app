import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Result } from "./Result";

function renderResult(
  pathname: string,
  state: {
    stars: 1 | 2 | 3;
    mistakes?: number;
    unlockedNewStage?: boolean;
  },
) {
  render(
    <MemoryRouter initialEntries={[{ pathname, state }]}>
      <Routes>
        <Route path="/result/:stageId" element={<Result />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Result", () => {
  it("次ステージをこのクリアで新しく解放したとき", () => {
    renderResult("/result/vowels", {
      stars: 3,
      mistakes: 0,
      unlockedNewStage: true,
    });
    expect(
      screen.getByText("つぎのれっしゅうがひらかれたよ"),
    ).toBeInTheDocument();
  });

  it("次ステージがすでに開いている再プレイのとき", () => {
    renderResult("/result/vowels", {
      stars: 2,
      mistakes: 2,
      unlockedNewStage: false,
    });
    expect(
      screen.getByText("つぎのれっしゅうもあそべるよ"),
    ).toBeInTheDocument();
  });

  it("カリキュラム上つぎがないステージのとき", () => {
    renderResult("/result/w-row", {
      stars: 3,
      mistakes: 0,
      unlockedNewStage: false,
    });
    expect(screen.getByText("いまのはひとやすみ")).toBeInTheDocument();
  });
});
