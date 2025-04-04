import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { VehicleContextProvider } from "./context/VehicleContext";
import { useAuthContext } from "./hooks/useAuthContext";
import VehicleLayout from "./pages/VehicleLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";

import "./App.css";

import { PatientContextProvider } from "./context/PatientContext";
import PatientLayout from "./pages/PatientLayout";
import HospitalLayout from "./pages/HospitalLayout";

import { DetailHospitalContextProvider } from "./context/DetailHospitalContext";
import Resources from "./pages/Resources";
import Test from "./pages/Test";
import CallOperator from "./pages/CallOperator";
import Careers from "./pages/Careers";
import AdminLayout from "./pages/AdminLayout";

function App() {
    return (
        <BrowserRouter>
            <div className="">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/admin/*" element={<AdminLayout />} />
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

                    <Route path="/callop/*" element={<CallOperator />} />

                      <Route 
                      path="/hospital/*" 
                      element={<DetailHospitalContextProvider>
                        <HospitalLayout/>
                      </DetailHospitalContextProvider>}   
                     />

                    <Route path="/resources/*" element={<Resources />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
