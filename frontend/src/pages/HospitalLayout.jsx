import { Navigate, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";
import NavBar from "../components/NavBar";
import PermissionDenied from "../components/PermissionDenied";
import HospitalStaffLogin from "../components/HospitalStaffLogin";
import HospitalStaffDashBoaerd from "../components/HospitalStaffDashBoard"
import HospitalDetails from "../components/HospitalDetails"
import HospitalDettails_from from "../components/HospitalDetails_form"
import AddDoctordetails from "../components/AddDoctordetails";

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
            path: "hospital_staff_details",   // New Route for Hospital Details
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalDetails />
                ) : (
                    <Navigate to="/hospital_staff_login" />
                ),
        },

        {
            path: "hospital_details_form",   // New Route for Hospital Details from
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalDettails_from />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "add_doctor_details",   // New Route for Hospital Details from
            element:
                user && user.role == "hospital_staff" ? (
                    <AddDoctordetails />
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
