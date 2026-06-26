import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReviewDetail from "./pages/ReviewDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reviews/:id" element={<ReviewDetail />} />
    </Routes>
  );
}
