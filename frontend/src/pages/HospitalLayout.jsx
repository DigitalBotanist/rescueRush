import { Navigate, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";
import NavBar from "../components/NavBar";
import PermissionDenied from "../components/PermissionDenied";
import HospitalStaffLogin from "../components/HospitalStaffLogin";
import HospitalStaffDashBoaerd from "../components/HospitalStaffDashBoard";
import HospitalDetails from "../components/HospitalDetails";
import HospitalDettails_from from "../components/HospitalDetails_form";
import AddDoctordetails from "../components/AddDoctordetails";
import HospitalDetailpage from "../components/HospitalDetailsPage";
import AmbulanceArrivalTime from "../components/AmbulanceArrivalTime";
import ChatWindow from "../components/ChatWindow";
import HospitalReport from "../components/HospitalReport";
import DoctorDetails from "../components/HospitalStaffDashBoard";
import AddHospitalReport from "../components/AddHospitalReportDetails";

const HospitalLayout = () => {
    const { user } = useAuthContext();

    // routes inside of '/vehicle'
    const routes = useRoutes([
        {
            index: true,
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalStaffDashBoaerd />
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
            path: "HospitalStaffDashBoard", // New Route for Hospital Details
            element:
                user && user.role == "hospital_staff" ? (
                    <DoctorDetails />
                ) : (
                    <Navigate to="hospital_staff_login" />
                ),
        },

        {
            path: "hospital_staff_details", // New Route for Hospital Details
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalDetails />
                ) : (
                    <Navigate to="hospital_staff_login" />
                ),
        },

        {
            path: "hospital_details_form", // New Route for Hospital Details from
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalDettails_from />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "add_doctor_details", // New Route for doctor Details from
            element:
                user && user.role == "hospital_staff" ? (
                    <AddDoctordetails />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "HospitalDetail", // New Route for Hospital Details apge
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalDetailpage />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "AmbulanceArrivalTime", // New Route for AMbulance arival time
            element:
                user && user.role == "hospital_staff" ? (
                    <AmbulanceArrivalTime />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "ChatWindow", // New Route for Chat Window
            element:
                user && user.role == "hospital_staff" ? (
                    <ChatWindow />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "Report", // New Route for Report
            element:
                user && user.role == "hospital_staff" ? (
                    <HospitalReport />
                ) : (
                    <Navigate to="/hospital" />
                ),
        },

        {
            path: "hospitalRepoet", // New Route for Report
            element:
                user && user.role == "hospital_staff" ? (
                    <AddHospitalReport />
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
