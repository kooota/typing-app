import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@/pages/Home";
import { KanaTablePlay } from "@/pages/KanaTablePlay";
import { KanaTableResult } from "@/pages/KanaTableResult";
import { WakabaPlay } from "@/pages/WakabaPlay";
import { WakabaResult } from "@/pages/WakabaResult";
import { ParentSettings } from "@/pages/ParentSettings";
import { Play } from "@/pages/Play";
import { PracticePlay } from "@/pages/PracticePlay";
import { PracticeResult } from "@/pages/PracticeResult";
import { Result } from "@/pages/Result";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play/:stageId" element={<Play />} />
      <Route path="/result/:stageId" element={<Result />} />
      <Route path="/practice/result" element={<PracticeResult />} />
      <Route path="/practice" element={<PracticePlay />} />
      <Route path="/kana-table/result" element={<KanaTableResult />} />
      <Route path="/kana-table" element={<KanaTablePlay />} />
      <Route path="/wakaba/result" element={<WakabaResult />} />
      <Route path="/wakaba" element={<WakabaPlay />} />
      <Route path="/parent" element={<ParentSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
