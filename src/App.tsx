import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@/pages/Home";
import { ParentSettings } from "@/pages/ParentSettings";
import { Play } from "@/pages/Play";
import { Result } from "@/pages/Result";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play/:stageId" element={<Play />} />
      <Route path="/result/:stageId" element={<Result />} />
      <Route path="/parent" element={<ParentSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
