import { Navigate, useRoutes } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";
import NavBar from "../components/NavBar";
import PermissionDenied from "../components/PermissionDenied";
import AdminDashboard from "../components/AdminDashboard";
import AdminLogin from "../components/AdminLogin";

const AdminLayout = () => {
    const { user } = useAuthContext();
    

    // routes inside of '/vehicle'
    const routes = useRoutes([
        
        {
            index: true,
            element:
                user && user.role == "admin" ? (
                 (
                        <AdminDashboard />
                    )
                ) : (
                    <Navigate to="login" />
                ),
        },
        {
                    path: "login",
                    element: !user ? (
                        <AdminLogin />
                    ) : user && user.role != "admin" ? (
                        <PermissionDenied />
                    ) : (
                        <Navigate to="/admin" />
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

export default AdminLayout;
