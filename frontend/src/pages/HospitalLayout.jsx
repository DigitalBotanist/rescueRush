import { Navigate, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";
import NavBar from "../components/NavBar";
import PermissionDenied from "../components/PermissionDenied";
import HospitalStaffLogin from "../components/HospitalStaffLogin";
import HospitalStaffDashBoaerd from "../components/HospitalStaffDashBoard"

const HospitalLayout = () => {
    const { user } = useAuthContext();
    

    // routes inside of '/vehicle'
    const routes = useRoutes([
        
        {
            index: true,
            element:
                user && user.role == "hospital_staff" ? (
                 (
                        <HospitalStaffDashBoaerd />
                    )
                ) : (
                    <Navigate to="hospital_staff_login" />
                ),
        },
        
        {
                    path: "hospital_staff_login",
                    element: !user ? (
                        <HospitalStaffLogin />
                    ) : user && user.role != "hospital_staff" ? (
                        <PermissionDenied />
                    ) : (
                        <Navigate to="/hospital" />
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

export default HospitalLayout;
