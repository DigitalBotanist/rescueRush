import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useVehicleContext } from "../hooks/useVehicleContext";
import VehicleNotRegistered from "../components/VehicleNotRegistered";
import DriverDashboard from "../components/DriverDashboard";
import NotFound from "./NotFound";
import MaintainerLogin from "../components/MaintainerLogin";

const VehicleLayout = () => {
    const { user } = useAuthContext()
    const { vin } = useVehicleContext()

    console.log('vin', vin)
    const routes = useRoutes([
        {
            index: true,
            element:
                vin && user.role == "driver" ? (
                    <DriverDashboard />
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
            ) : !user.role == "driver" ? (
                <PermissionDenied />
            ) : (
                <Navigate to="" />
            ),
        },
        {
            path: "maintainer_login", 
            element: <MaintainerLogin />
        },
        {
            path: "*", 
            element: <NotFound/> 
        }
    ]);
    return (
        <div className="h-screen  bg-gradient-to-r from-secondary-50 via to-secondary-400">
            hi
            <div className="h-9/10">
                {routes}
            </div>
        </div>
    );
};

export default VehicleLayout;
