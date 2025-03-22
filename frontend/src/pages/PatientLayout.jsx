import { Navigate, useRoutes } from "react-router-dom";
import { useVehicleContext } from "../hooks/useVehicleContext";
import ParamedicDashboard from "../components/ParamedicDashboard";
import ParamedicLogin from "../components/ParamedicLogin";
import VehicleNotRegistered from "../components/VehicleNotRegistered";
import PermissionDenied from "../components/PermissionDenied";
import MaintainerLogin from "../components/MaintainerLogin";
import VehicleSettings from "../components/VehicleSettings";
import PatientVehicleSettings from "../components/PatientVehicleSettings";
import NavBar from "../components/NavBar";
import { usePatientContext } from "../hooks/usePatientContext";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";

const PatientLayout = () => {
    const { vin } = usePatientContext();
    const { user } = useAuthContext()

    const routes = useRoutes([
        {
            index: true,
            element:
                vin && user && user.role == "paramedic" ? (
                    <ParamedicDashboard />
                ) : (
                    <Navigate to="paramedic_login" />
                ),
        },
        {
            path: "paramedic_login",
            element: !vin ? (
                <VehicleNotRegistered />
            ) : !user ? (
                <ParamedicLogin />
            ) : user && user.role != "paramedic" ? (
                <PermissionDenied />
            ) : (
                <Navigate to="/patient" />
            ),
        },
        {
            path: "maintainer_login",
            element:
                user && user.role == "maintainer" ? (
                    <Navigate to="../registration" />
                ) : (
                    <MaintainerLogin backPath={'/patient'}/>
                ),
        },
        {
            path: "registration",
            element:
                user && user.role == "maintainer" ? (
                    <PatientVehicleSettings />
                ) : (
                    <Navigate to="../maintainer_login" />
                ),
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ]);


    return (
        <div className="h-screen ">
            <NavBar />
            <div className="h-14/15 box-border m-0">{routes}</div>
        </div>
    );
};


export default PatientLayout
