import { Navigate, useRoutes } from "react-router-dom";
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

    // routes inside of '/vehicle'
    const routes = useRoutes([
        /* 
        index route - DriverDashboard
        if the driver is not logged in redirect to the driver_login 
        if there is ongoing emergency redirect to ongoing_emergency    
        otherwise show dashboard
        */
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
        /* 
        driver_login 
        if the vin is not registered in show VehicleNotRegistered 
        if user is not a driver show PermissionDenied
        if driver is logged in redirect to index
        otherwise show DriverLogin 
        */
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
        /* 
        maintainer_login
        if user logged in is a maintainer, redirect to the registration
        if not show the maintainerLogin
         */
        {
            path: "maintainer_login",
            element:
                user && user.role == "maintainer" ? (
                    <Navigate to="../registration" />
                ) : (
                    <MaintainerLogin backPath={"/vehicle"} />
                ),
        },
        /* 
        registration 
        if user is a maintainer, show VehicleSettings
        if not redirect to maintainer_login
         */
        {
            path: "registration",
            element:
                user && user.role == "maintainer" ? (
                    <VehicleSettings />
                ) : (
                    <Navigate to="../maintainer_login" />
                ),
        },
        /*
        ongoing emergency
        show VehicleOngoingEmergency
         */
        {
            path: "ongoing_emergency",
            element: <VehicleOngoingEmergency />,
        },
        /* for all the other paths show NotFound */
        {
            path: "*",
            element: <NotFound />,
        },
    ]);
    return (
        <div className="h-screen ">
            {/* when there is a new emergency show VehicleNewEmergency */}
            {newEmergency && <VehicleNewEmergency />}
            <NavBar />
            <div className="h-14/15 box-border m-0">{routes}</div>
        </div>
    );
};

export default VehicleLayout;
