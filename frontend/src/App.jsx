import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import {
  VehicleContextProvider,
} from "./context/VehicleContext";
import { useAuthContext } from "./hooks/useAuthContext";
import VehicleLayout from "./pages/VehicleLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Hospital from "./pages/hospital";

function App() {

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route
            path="/vehicle/*"
            element={
              <VehicleContextProvider>
                <VehicleLayout />
              </VehicleContextProvider>
            }
          />
          <Route path="/hospital" element={<Hospital/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
