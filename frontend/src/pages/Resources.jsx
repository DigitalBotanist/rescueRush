import { Navigate, useRoutes } from "react-router-dom";
import ManagerDashboard from "../components/ManagerDashbaord";
import ResourseManagerLogin from "../components/ResourseManagerLogin";
import NotFound from "./NotFound";
import PermissionDenied from "../components/PermissionDenied";
import { useAuthContext } from "../hooks/useAuthContext";
import ResourseNavBar from "../components/ResourseNavBar";
import Home from "../components/PublicNavBar";
import Medicalresources from "../components/Medicalresources";
import AddNewResource from "../components/AddNewResource";
import StaffDetail from "../components/StaffDetail";
import AddStaff from "../components/AddStaff";
import WorkingSchedule from "../components/WorkingSchedule";
import leaveform from "../components/leaveform";
import leave from "../components/leave";
import CreateNewSchedule from "../components/CreateNewSchedule";
import NavBar from "../components/NavBar";
import EditSchedule from "../components/EditSchedule";



const Resources = () => {
    const { user } = useAuthContext()

    const routes = useRoutes([
        {
            index: true,
            element:
                user && user.role == "manager" ? (
                    <ManagerDashboard />
                ) : (
                    <Navigate to="manager_login" />
                ),
        },
        {
            path: "manager_login",
            element:!user ? (
                <ResourseManagerLogin />
            ) : user && user.role != "manager" ? (
                <PermissionDenied />
            ) : (
                <Navigate to="/resources" />
            ),
        },

        {
            path: "/",
            element: user && user.role === "manager" ? (
                <Home />
            ) : (
                <Navigate to="manager_login" />
            ),
        },
        {
        path: "ResourseNavBar",
            element: user && user.role === "manager" ? (
                <ResourseNavBar />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "ResourseNavBar",
                element: user && user.role === "manager" ? (
                    <ResourseNavBar />
                ) : (
                    <PermissionDenied />
                ),
            },

        {
            path: "Medicalresources", 
            element: user && user.role === "manager" ? (
                <Medicalresources />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "AddNewResource", 
            element: user && user.role === "manager" ? (
                <AddNewResource />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "create-schedule",
            element: user && user.role === "manager" ? (
                <CreateNewSchedule />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "working-schedule",
            element: user && user.role === "manager" ? (
                <WorkingSchedule />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "edit-schedule/:id",
            element: user && user.role === "manager" ? (
                <EditSchedule />
            ) : (
                <PermissionDenied />
            ),
        },
       
       {
            path: "staff-detail",
            element: user && user.role === "manager" ? (
                <StaffDetail />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "add_staff",
            element: user && user.role === "manager" ? (
                <AddStaff/>
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "add_resources",
            element: user && user.role === "manager" ? (
                <AddNewResource/>
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "leave",
            element: user && user.role === "manager" ? (
                <leave />
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "leaveform",
            element: user && user.role === "manager" ? (
                <leaveform/>
            ) : (
                <PermissionDenied />
            ),
        },

        {
            path: "*",
            element: <NotFound />,
        },
    ]);

    // useEffect(() => {
    //     fetch('http://localhost:4000/api/resoursrcontroller')
    //         .then(response => response.json())
    //         .then(data => setSchedules(data))
    //         .catch(error => console.error('Error:', error));
    // }, []);

    // useEffect(() => {
    //     fetch('http://localhost:4000/api/resoursrcontroller')
    //         .then(response => response.json())
    //         .then(data => setSchedules(data))
    //         .catch(error => console.error('Error:', error));
    // }, []);

    return (
        <div className="h-screen flex flex-col">
            <NavBar />
            
            <div className="flex-1 p-4 overflow-auto">
                {routes}
            </div>
        </div>
    );
}


export default Resources