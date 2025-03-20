import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import {
  VehicleContextProvider,
} from "./context/VehicleContext";
import { useAuthContext } from "./hooks/useAuthContext";
import VehicleLayout from "./pages/VehicleLayout";

function App() {

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route
            path="/vehicle/*"
            element={
              <VehicleContextProvider>
                <VehicleLayout />
              </VehicleContextProvider>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
