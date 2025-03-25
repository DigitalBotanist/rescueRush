import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useVehicleContext } from "../hooks/useVehicleContext";

const NavBar = () => {
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
        <nav
            className={`relative flex justify-between select-none ${
                user && "bg-white"
            }  lg:flex lg:items-stretch w-full h-1/15 p-3`}
        >
            {/* logo */}
            <div className="flex h-full">
                <Link to="/">
                    <img
                        className="h-full"
                        src="/assets/rescueRushLogo.svg"
                        alt="logo"
                    />
                </Link>
            </div>
            {/* profile menu */}
            {user && (
                <div className="w-100 h-full rounded-4xl flex justify-between items-center px-10">
                    <div className="group relative w-full h-full">
                        {/* profile menu user name */}
                        <div className=" flex h-full justify-between px-5 items-center overflow-hidden rounded-4xl w-full bg-secondary">
                            <a href="#" className="text-sm">
                                {user.firstName + " " + user.lastName}
                            </a>

                            {/* drop down button */}
                            <button className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700">
                                <span className="sr-only">Menu</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* drop down content */}
                        <div
                            className="absolute end-0 z-10 w-full divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-opacity duration-200"
                            role="menu"
                        >
                            <div className="p-2">
                                {/* <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    View on Storefront
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    View Warehouse Info
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    Duplicate Product
                                </a> */}

                                <Link
                                    to="/"
                                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    Profile
                                </Link>
                            </div>
                            
                            {/* logout button */}
                            <div className="p-2">
                                <button
                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    role="menuitem"
                                    onClick={onLogout}
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
