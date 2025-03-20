import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          {/* <Route path="/vehicle" element={<NotFound />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
