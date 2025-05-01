import { createContext, useEffect, useReducer, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { io } from "socket.io-client";

// create callopContext
export const CallopContext = createContext();

// reducer for manage callopContext state
export const callopReducer = (state, action) => {
    switch (action.type) {
        case "SET_VEHICLE":
            console.log("SET_VEHICLE");
            return {
                ...state,
                connectedVehicles: [...state.connectedVehicles, action.payload],
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
                connectedVehicles: []
            }
        default:
            return state;
    }
};

export const CallopContextProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [state, dispatch] = useReducer(callopReducer, {
        connectedVehicles: [],
    });

    useEffect(() => {
        if (!user || (user.role !== "callop" && user.role !== "admin") || !user?.token) return; // check if user is a driver

        // make a new socket to the server
        const newSocket = io("ws://localhost:4400", {
            auth: {
                token: user.token,
            },
        });

        // listeners
        newSocket.on("connect", () => {
            setIsConnected(true);

            // send callop_connect event 
            newSocket.emit("connect_callop", user._id)
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            
            // clear state 
            dispatch({type: "UNSET_VEHICLES"})
        });


        newSocket.on("callop_connected", () => {
            // todo: handle this correctly
            setIsConnected(true)
        });

        newSocket.on("callop_vehicle_connect", (vehicle) => {
            // update state 
            dispatch({type: "SET_VEHICLE", payload: vehicle})
        })

        setSocket(newSocket); // set socket state
        console.log("socket is created: ", newSocket);

        // call back
        return () => {
            // Cleanup on unmount
            newSocket.disconnect();
        };
    }, [user]);

    // set isConnected when socket changes
    useEffect(() => {
        if (socket && socket.connected) setIsConnected(true);
        else setIsConnected(false);
    }, [socket]);

    return (
        <CallopContext.Provider value={{ ...state, socket, isConnected, dispatch }}>
            {children}
        </CallopContext.Provider>
    );
};
