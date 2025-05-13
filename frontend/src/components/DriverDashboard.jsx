import { useState } from "react";
import DriverDashboardHome from "./DriverDashboardHome";
import { useLogout } from "../hooks/useLogout";
import { useVehicleContext } from "../hooks/useVehicleContext";
import { useAuthContext } from "../hooks/useAuthContext";

const DriverDashboard = () => {
    const [activeTab, setActiveTab] = useState("home"); // state to keep track of the active tab
    const { user, dispatch } = useAuthContext();

    let vehicleContext = null;

    // check if user is a driver and
    // if driver , get vehicle context
    try {
        const isDriver = user?.role === "driver";
        vehicleContext = isDriver ? useVehicleContext() : null;
    } catch (error) {
        console.log("nar bar: not a driver");
    }

    // set socket if inside of vehicleContext
    const socket = vehicleContext?.socket;
    const setSocket = vehicleContext?.setSocket;

    const { logout } = useLogout(); // use useLogout hook

    // handle logout button click
    const onLogout = async () => {
        console.log("logging out..");

        // if the user is a driver, disconnect the socket
        if (user && user.role == "driver") {
            if (socket) {
                socket.disconnect();
                console.log("socket disconnected");
                setSocket(null);
            }
        }

        await logout();
    };
    return (
        <div className="h-full w-full box-border p-2">
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex flex-col my-20 justify-between">
                    {/* home tab button */}
                    <div>
                        <div
                            className={`flex flex-col justify-center  items-center p-2 hover:bg-secondary-200 text-xl ${
                                activeTab === "home" &&
                                "bg-primary-100 border-r border-primary"
                            }`}
                            onClick={() => {
                                setActiveTab("home");
                            }}
                        >
                            <img
                                src="/assets/Home_light.svg"
                                alt="home"
                                className="w-10 aspect-square"
                            />
                            <button
                                className="text-sm"
                                onClick={() => {
                                    setActiveTab("home");
                                }}
                            >
                                Home
                            </button>
                        </div>
                        {/* settings tab button */}
                        <div
                            className={`flex flex-col justify-center  items-center p-2 hover:bg-secondary-200 text-xl ${
                                activeTab === "maintainance" &&
                                "bg-primary-100 border-r border-primary"
                            }`}
                            onClick={() => {
                                setActiveTab("maintainance");
                            }}
                        >
                            <img
                                src="/assets/Setting_line_light.svg"
                                alt="settings"
                                className="w-10 aspect-square"
                            />
                            <button
                                className="text-sm"
                                onClick={() => {
                                    setActiveTab("maintainance");
                                }}
                            >
                                maintainance
                            </button>
                        </div>
                    </div>

                    {/* logout */}
                    <div
                        className={`flex flex-col justify-center  items-center p-2 hover:bg-secondary-200 text-xl  text-primary-800`}
                        onClick={() => {
                            onLogout();
                        }}
                    >
                        <img
                            src="/assets/Sign_out_squre_light.svg"
                            alt="settings"
                            className="w-10 aspect-square"
                        />
                        <button className="text-sm">logout</button>
                    </div>
                </div>

                {/* content */}
                <div className="flex-4 bg-secondary-300 rounded-2xl inset-shadow-sm inset-shadow-gray-300">
                    {activeTab === "home" && <DriverDashboardHome />}
                    {activeTab === "maintainance" && <div> other</div>}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
