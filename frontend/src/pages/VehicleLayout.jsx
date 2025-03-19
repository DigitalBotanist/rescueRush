import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useVehicleContext } from "../hooks/useVehicleContext";
import VehicleNotRegistered from "../components/VehicleNotRegistered";
import DriverDashboard from "../components/DriverDashboard";
import NotFound from "./NotFound";
import MaintainerLogin from "../components/MaintainerLogin";
import VehicleSettings from "../components/VehicleSettings";
import NavBar from "../components/NavBar";

const VehicleLayout = () => {
    const { user } = useAuthContext()
    const { vin } = useVehicleContext()

    console.log('user', user)
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
            element: user && user.role == 'maintainer' ? <VehicleSettings /> :  <MaintainerLogin /> 
        },
        {
            path: "*", 
            element: <NotFound/> 
        }
    ]);
    return (
        <div className="h-screen ">
            <NavBar/>
            <div className="h-14/15 box-border p-1">
                {routes}
            </div>
        </div>
    );
};

export default VehicleLayout;
