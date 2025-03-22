import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useVehicleContext } from "../hooks/useVehicleContext";
import VehicleNotRegistered from "../components/VehicleNotRegistered";
import DriverDashboard from "../components/DriverDashboard";
import NotFound from "./NotFound";
import MaintainerLogin from "../components/MaintainerLogin";
import VehicleSettings from "../components/VehicleSettings";
import NavBar from "../components/NavBar";
import DriverLogin from "../components/DriverLogin";
import PermissionDenied from "../components/PermissionDenied";
import VehicleNewEmergency from "../components/VehicleNewEmergency";
import VehicleOngoingEmergency from "../components/VehicleOngoingEmergency";

const VehicleLayout = () => {
    const { user } = useAuthContext();
    const { vin, newEmergency, currentEmergency } = useVehicleContext();

    const routes = useRoutes([
        {
            index: true,
            element:
                vin && user && user.role == "driver" ? (
                    currentEmergency ? (
                        <Navigate to="ongoing_emergency" />
                    ) : (
                        <DriverDashboard />
                    )
                ) : (
                    <Navigate to="driver_login" />
                ),
        },
        {
            path: "driver_login",
            element: !vin ? (
                <VehicleNotRegistered />
            ) : !user ? (
                <DriverLogin />
            ) : user && user.role != "driver" ? (
                <PermissionDenied />
            ) : (
                <Navigate to="/vehicle" />
            ),
        },
        {
            path: "maintainer_login",
            element:
                user && user.role == "maintainer" ? (
                    <Navigate to="../registration" />
                ) : (
                    <MaintainerLogin />
                ),
        },
        {
            path: "registration",
            element:
                user && user.role == "maintainer" ? (
                    <VehicleSettings />
                ) : (
                    <Navigate to="../maintainer_login" />
                ),
        },
        {
            path: "ongoing_emergency",
            element: <VehicleOngoingEmergency />,
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ]);
    return (
        <div className="h-screen ">
            {newEmergency && <VehicleNewEmergency />}
            <NavBar />
            <div className="h-14/15 box-border m-0">{routes}</div>
        </div>
    );
};

export default VehicleLayout;
