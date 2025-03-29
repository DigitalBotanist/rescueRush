import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";

// create context
export const VehicleContext = createContext();

// reducer to manage the VehicleContext state
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
        case "UNSET_NEW_EMERGENCY":
            console.log("UNSET_NEW_EMERGENCY");
            return { ...state, newEmergency: null };
        case "SET_CURRENT_EMERGENCY":
            console.log("SET_CURRENT_EMERGENCY", action.payload.emergency);
            localStorage.setItem(
                "emergency",
                JSON.stringify(action.payload.emergency)
            );
            return { ...state, currentEmergency: action.payload.emergency };
        case "UNSET_CURRENT_EMERGENCY":
            console.log("UNSET_CURRENT_EMERGENCY");
            localStorage.removeItem("emergency");
            return { ...state, currentEmergency: null };
    }
};

export const VehicleContextProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [state, dispatch] = useReducer(vehicleReducer, {
        vin: null,
        location: null,
        newEmergency: null,
        currentEmergency: null,
    });

    let tempEmergency = null;
    const locationRef = useRef();

    // set intial state values
    useEffect(() => {
        const fetchData = async () => {
            // get 'vin' from localhost if exists
            const vin = JSON.parse(localStorage.getItem("vin"));

            // get ongoing emergency from localhost if exists
            const ongoingEmergency = JSON.parse(
                localStorage.getItem("emergency")
            );

            // set vin number
            if (vin) {
                dispatch({ type: "SET_VIN", payload: { vin } });
            }

            console.log(ongoingEmergency);
            // set ongoing emergency
            if (ongoingEmergency) {
                tempEmergency = ongoingEmergency;
                dispatch({
                    type: "SET_CURRENT_EMERGENCY",
                    payload: { emergency: ongoingEmergency },
                });
            }
        };

        // async wrapper to update the location
        const fetchLocation = async () => {
            await updateLocation(locationRef, dispatch);
        };

        fetchData();
        fetchLocation(); // update immediete state

        // update location every 15 seconds
        const locationInterval = setInterval(() => {
            fetchLocation();
        }, 15000);

        // Cleanup interval on unmount
        return () => clearInterval(locationInterval);
    }, []);

    // make a socket connection with fleet management
    useEffect(() => {
        // check if user is a driver
        if (!user || user.role !== "driver" || !user?.token) return;

        // make a new socket
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
            dispatch({ type: "SET_NEW_EMERGENCY", payload: { emergency } });
            tempEmergency = emergency;
        });
        newSocket.on("fleet_connected", () => {
            console.log("new conn");
        });
        newSocket.on("assigned", (emergencyId) => {
            console.log("request assigned");
            console.log(tempEmergency);
            if (tempEmergency) {
                dispatch({
                    type: "SET_CURRENT_EMERGENCY",
                    payload: { emergency: tempEmergency },
                });

                dispatch({
                    type: "UNSET_NEW_EMERGENCY",
                });
            } else {
                console.log("No new emergency to assign");
            }
        });

        newSocket.on("request_cancel", (emergencyId) => {
            console.log("request canceled");
            dispatch({
                type: "UNSET_CURRENT_EMERGENCY",
            });
            dispatch({
                type: "UNSET_NEW_EMERGENCY",
            });
        });

        newSocket.on("reject_confirm", (emergencyId) => {
            console.log("reject confirm");
            dispatch({
                type: "UNSET_CURRENT_EMERGENCY",
            });
            dispatch({
                type: "UNSET_NEW_EMERGENCY",
            });
        });

        setSocket(newSocket); // set socket state
        console.log("socket is created: ", newSocket);

        // call back
        return () => {
            // Cleanup on unmount
            newSocket.off("new_request");
            newSocket.off("assigned");
            newSocket.off("request_cancel");
            newSocket.off("reject_confirm");
            newSocket.disconnect();
        };
    }, [user]);

    // set isConnected
    useEffect(() => {
        if (socket && socket.connected) setIsConnected(true);
        else setIsConnected(false);
    }, [socket]);

    return (
        <VehicleContext.Provider
            value={{
                ...state,
                dispatch,
                socket,
                setSocket,
                isConnected,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
};

// update the vehicle location
const updateLocation = async (locationRef, dispatch) => {
    try {
        console.log("update location");
        // get the current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (
                    locationRef.current &&
                    locationRef.current.lat === newLocation.lat &&
                    locationRef.current.lng === newLocation.lng
                ) {
                    return;
                }

                locationRef.current = newLocation;
                // update the context state
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
