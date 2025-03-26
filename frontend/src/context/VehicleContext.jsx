import { createContext, useEffect, useReducer, useState } from "react";
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
        // todo: implement
        // case "SET_NEW_EMERGENCY":
        //     console.log("SET_NEW_EMERGENCY", action.payload.emergency);
        //     return { ...state, newEmergency: action.payload.emergency };
        // case "SET_CURRENT_EMERGENCY":
        //     console.log("SET_CURRENT_EMERGENCY", action.payload.emergency);
        //     return { ...state, currentEmergency: action.payload.emergency };
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

            // set ongoing emergency
            if (ongoingEmergency) {
                tempEmergency = ongoingEmergency;
                setCurrentEmergency(ongoingEmergency);
            }
        };

        // async wrapper to update the location
        const fetchLocation = async () => {
            await updateLocation(state.location, dispatch);
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

    // dev: check if the newEmergency changed 
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


// update the vehicle location
const updateLocation = async (location, dispatch) => {
    try {
        console.log("update location");
        // get the current position 
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // todo: if the location is same, don't update the location
                if (
                    location &&
                    location.lat === newLocation.lat &&
                    location.lng === newLocation.lng
                ) {
                    return;
                }

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
