import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { VehicleContextProvider } from "./context/VehicleContext";
import { useAuthContext } from "./hooks/useAuthContext";
import VehicleLayout from "./pages/VehicleLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";

import "./App.css"


import { PatientContextProvider } from "./context/PatientContext";
import PatientLayout from "./pages/PatientLayout";
import HospitalLayout from "./pages/HospitalLayout";


function App() {
    return (
        <BrowserRouter>
            <div className="">
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
                    <Route
                        path="/patient/*"
                        element={
                            <PatientContextProvider>
                                <PatientLayout />
                            </PatientContextProvider>
                        }
                    />
                    <Route 
                    path="/hospital" 
                    element={<HospitalLayout/>}/>
                    



                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );

}

export default App;
