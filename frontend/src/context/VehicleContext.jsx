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
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuthContext();
    const [state, dispatch] = useReducer(vehicleReducer, {
        vin: null,
        location: null,
    });

    let tempEmergency = null

    const [newEmergency, setNewEmergency] = useState(null);
    const [currentEmergency, setCurrentEmergency] = useState(null);

    // get 'vin' from localhost if exists
    useEffect(() => {
        const vin = JSON.parse(localStorage.getItem("vin"));

        if (vin) {
            dispatch({ type: "SET_VIN", payload: { vin } });
        }
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
            tempEmergency = emergency
            console.log(newEmergency)
        });
        newSocket.on("fleet_connected", () => {
            console.log("new conn");
        });
        newSocket.on("assigned", (emergencyId) => {
            console.log("request assigned");
            console.log(tempEmergency)
            if (tempEmergency) {
                setCurrentEmergency(tempEmergency);
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
