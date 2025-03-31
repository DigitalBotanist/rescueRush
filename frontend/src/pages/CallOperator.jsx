import { Navigate, useRoutes } from "react-router-dom";
import PermissionDenied from "../components/PermissionDenied";
import NavBar from "../components/NavBar";
import { useAuthContext } from "../hooks/useAuthContext";
import NotFound from "./NotFound";
import CallOpDashboard from "../components/CallOpDashboard";
import CallOpLogin from "../components/CallOpLogin";

const CallOperator = () => {
    const { user } = useAuthContext()

    const routes = useRoutes([
        {
            index: true,
            element:
                user && user.role == "callop" ? (
                    <CallOpDashboard />
                ) : (
                    <Navigate to="login" />
                ),
        },
        {
            path: "login",
            element:!user ? (
                <CallOpLogin />
            ) : user && user.role != "callop" ? (
                <PermissionDenied />
            ) : (
                <Navigate to="/callop" />
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


export default CallOperator
