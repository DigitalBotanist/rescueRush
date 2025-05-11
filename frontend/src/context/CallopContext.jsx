import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { io } from "socket.io-client";

// create callopContext
export const CallopContext = createContext();

// reducer for manage callopContext state
export const callopReducer = (state, action) => {
    switch (action.type) {
        case "SET_VEHICLE":
            console.log("SET_VEHICLE");
            console.log(action.payload.vehicle._id);
            return {
                ...state,
                connectedVehicles: [
                    ...state.connectedVehicles,
                    action.payload.vehicle,
                ],
                connectedVehicleId: action.payload.vehicle._id,
            };
        case "UNSET_VEHICLE":
            console.log("UNSET_VEHICLE");
            return {
                ...state,
                connectedVehicles: state.connectedVehicles.filter(
                    (vehicle) => vehicle.id !== action.payload
                ),
            };
        case "UNSET_VEHICLES":
            console.log("UNSET_VEHICLES");
            return {
                ...state,
                connectedVehicles: [],
            };
        case "SET_CURRENT_EMERGENCY":
            console.log("SET_CURRENT_EMERGENCY", action.payload);
            localStorage.setItem("emergency", JSON.stringify(action.payload));
            return { ...state, currentEmergency: action.payload };
        case "UNSET_CURRENT_EMERGENCY":
            console.log("UNSET_CURRENT_EMERGENCY");
            localStorage.removeItem("emergency");
            return { ...state, currentEmergency: null };
        default:
            return state;
    }
};

export const CallopContextProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [socket, setSocket] = useState(null);
    const [callSocket, setCallSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [state, dispatch] = useReducer(callopReducer, {
        connectedVehicles: [],
        connectedVehicleId: null,
        currentEmergency: null,
    });

    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (
            !user ||
            (user.role !== "callop" && user.role !== "admin") ||
            !user?.token
        )
            return; // check if user is a driver

        const callsock = initCallSocket(user, dispatch, setCallSocket);
        const fleetsock = initFleetSocket(
            user,
            dispatch,
            setSocket,
            setIsConnected,
            stateRef
        );

        // call back
        return () => {
            // Cleanup on unmount
            callsock.disconnect();
            fleetsock.disconnect();
        };
    }, [user]);

    // set isConnected when socket changes
    useEffect(() => {
        if (socket && socket.connected) setIsConnected(true);
        else setIsConnected(false);
    }, [socket]);

    useEffect(() => {
        const currentEmergency = JSON.parse(localStorage.getItem("emergency"));
        if (currentEmergency) {
            dispatch({
                type: "SET_CURRENT_EMERGENCY",
                payload: currentEmergency,
            });
        }
    }, []);

    return (
        <CallopContext.Provider
            value={{ ...state, socket, isConnected, callSocket, dispatch }}
        >
            {children}
        </CallopContext.Provider>
    );
};

// fleet socket
const initFleetSocket = (user, dispatch, setSocket, setIsConnected, stateRef) => {
    console.log("connecting to the fleet... ");
    // make a new socket to the server
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

    newSocket.on("fleet_connected", () => {
        console.log("fleet_connected");
        setIsConnected(true);
    });

    newSocket.on("callop_connect_error", (error) => {
        console.log("callop_connect_error", error);
    });

    newSocket.on("vehicle_assign", (data) => {
        console.log("vehicle_assign");
        const { emergencyId, patientId, vehicle } = data;

        console.log(emergencyId, patientId, vehicle);

        if (emergencyId === stateRef.current.currentEmergency?._id) {
            const updatedPatients = stateRef.current.currentEmergency.patients.map(
                (patient) => {
                    if (patient._id === patientId) {
                        return { ...patient, vehicle };
                    }
                    return patient;
                }
            );
        
            dispatch({
                type: "SET_CURRENT_EMERGENCY",
                payload: {
                    ...stateRef.current.currentEmergency,
                    patients: updatedPatients,
                },
            });
        }
        
    });

    setSocket(newSocket);
    return newSocket;
};

// call socket
const initCallSocket = (user, dispatch, setCallSocket) => {
    // make a new socket to the server
    const newSocket = io("ws://localhost:4400", {
        auth: {
            token: user.token,
        },
    });

    // listeners
    newSocket.on("connect", () => {
        // send callop_connect event
        newSocket.emit("connect_callop", user._id);
    });

    newSocket.on("disconnect", () => {
        // clear state
        dispatch({ type: "UNSET_VEHICLES" });
    });

    newSocket.on("callop_connected", () => {
        // todo: handle this correctly
    });

    newSocket.on("callop_vehicle_connect_error", (error) => {
        // todo: handle this correctly
        console.log("callop connect error:", error);
    });
    newSocket.on("callop_vehicle_connect", (vehicle) => {
        // update state
        dispatch({ type: "SET_VEHICLE", payload: vehicle });
        console.log(state);
    });

    setCallSocket(newSocket); // set socket state
    console.log("socket is created: ", newSocket);
    return newSocket;
};
