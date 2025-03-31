import { Navigate, useRoutes } from "react-router-dom";
import ManagerDashboard from "../components/ManagerDashbaord";
import ResourseManagerLogin from "../components/ResourseManagerLogin";
import NotFound from "./NotFound";
import PermissionDenied from "../components/PermissionDenied";
import NavBar from "../components/NavBar";
import { useAuthContext } from "../hooks/useAuthContext";



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
}


export default Resources