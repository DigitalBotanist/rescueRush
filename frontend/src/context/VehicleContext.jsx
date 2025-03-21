import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";

export const VehicleContext = createContext();

export const vehicleReducer = (state, action) => {
    switch (action.type) {
        case "SET_VIN":
            console.log("SET_VIN", action.payload.vin);
            return { ...state, vin: action.payload.vin };
        case "SET_LOCATION":
            console.log("SET_LOCATION", action.payload.location);
            return { ...state, location: action.payload.location };
        case "SET_NEW_EMERGENCY":
            console.log("SET_NEW_EMERGENCY", action.payload.emergency);
            return { ...state, newEmergency: action.payload.emergency };
        case "SET_CURRENT_EMERGENCY":
            console.log("SET_CURRENT_EMERGENCY", action.payload.emergency);
            return { ...state, currentEmergency: action.payload.emergency };
    }
};

export const VehicleContextProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [newEmergency, setNewEmergency] = useState(null);
    const [currentEmergency, setCurrentEmergency] = useState(null);
    const [state, dispatch] = useReducer(vehicleReducer, {
        vin: null,
        location: null,
    });

    let tempEmergency = null;

    // get 'vin' from localhost if exists
    useEffect(() => {
        const fetchData = async () => {
            const vin = JSON.parse(localStorage.getItem("vin"));
            const ongoingEmergency = JSON.parse(
                localStorage.getItem("emergency")
            );

            if (vin) {
                dispatch({ type: "SET_VIN", payload: { vin } });
            }

            if (ongoingEmergency) {
                tempEmergency = ongoingEmergency;
                setCurrentEmergency(ongoingEmergency);
            }
        };
        const fetchLocation = async () => {
            await updateLocation(state.location, dispatch);
        };

        fetchData();
        fetchLocation();
        const locationInterval = setInterval(() => {
            fetchLocation();
        }, 15000);

        // Cleanup interval on unmount
        return () => clearInterval(locationInterval);
    }, []);

    // make a socket connection with fleet management
    useEffect(() => {
        if (!user || user.role !== "driver" || !user?.token) return;

        const newSocket = io("ws://localhost:4500", {
            auth: {
                token: user.token,
            },
        });

        // listeners
        newSocket.on("connect", () => {
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });
        newSocket.on("new_request", (emergency) => {
            setNewEmergency(emergency);
            tempEmergency = emergency;
        });
        newSocket.on("fleet_connected", () => {
            console.log("new conn");
        });
        newSocket.on("assigned", (emergencyId) => {
            console.log("request assigned");
            console.log(tempEmergency);
            if (tempEmergency) {
                setCurrentEmergency(tempEmergency);

                // localStorage.setItem("emergency", JSON.stringify(tempEmergency))
                setNewEmergency(null);
            } else {
                console.log("No new emergency to assign");
            }
        });

        newSocket.on("request_cancel", (emergencyId) => {
            console.log("request canceled");
            setCurrentEmergency(null);
            setNewEmergency(null);
        });

        newSocket.on("reject_confirm", (emergencyId) => {
            console.log("reject confirm");
            setCurrentEmergency(null);
            setNewEmergency(null);
        });

        setSocket(newSocket);

        console.log("socket is created: ", newSocket);

        return () => {
            newSocket.off("new_request");
            newSocket.off("assigned");
            newSocket.off("request_cancel");
            newSocket.off("reject_confirm");
            newSocket.disconnect(); // Cleanup on unmount
        };
    }, [user]);

    // set isConnected
    useEffect(() => {
        if (socket && socket.connected) setIsConnected(true);
        else setIsConnected(false);
    }, [socket]);

    useEffect(() => {
        if (newEmergency) {
            console.log("newEmergency after update:", newEmergency);
        }
    }, [newEmergency]);
    return (
        <VehicleContext.Provider
            value={{
                ...state,
                dispatch,
                socket,
                setSocket,
                isConnected,
                newEmergency,
                setNewEmergency,
                currentEmergency,
                setCurrentEmergency,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
};

const updateLocation = async (location, dispatch) => {
    try {
        console.log("update location");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (
                    location &&
                    location.lat === newLocation.lat &&
                    location.lng === newLocation.lng
                ) {
                    return;
                }
                dispatch({
                    type: "SET_LOCATION",
                    payload: { location: newLocation },
                });
            },
            (error) => {
                console.log("Error getting location:", error.message);
            }
        );
    } catch (error) {
        console.log("Error in updateLocation:", error.message);
    }
};
