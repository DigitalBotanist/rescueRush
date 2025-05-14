import { createContext, useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";

// create AuthContext
export const AuthContext = createContext();

// reducer for manage AuthContext state
export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            console.log("log");
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

// manage user data when a user logs in
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });
    const [callSocket, setCallSocket] = useState(null)

    // set intial state values
    useEffect(() => {
        // check if user is already logged in
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "LOGIN", payload: user });
        }
    }, []);

    // socket to the callop
    useEffect(() => {
        if (
            !state.user ||
            (state.user.role !== "driver" && state.user.role !== "admin" && state.user.role !== "callop") ||
            !state.user?.token
        )
            return; // check if user is a driver

        // make a new socket to the server
        const newSocket = io("ws://localhost:4444", {
            auth: {
                token: state.user.token,
            },
        });

        // listeners
        newSocket.on("connect", () => {
            console.log("connected to the call socket");
        });

        newSocket.on("disconnect", () => {
            console.log("disconnected from call manager");
        });

        newSocket.on("call_manager_connected", () => {
            console.log("connected to call manager");
        });

        newSocket.on("call_manager_connection_error", (error) => {
            console.log("call_manager_connection_error: ", error);
        });

        setCallSocket(newSocket);
    }, [state.user]);

    console.log("AuthContext state: ", state);

    return (
        <AuthContext.Provider value={{ ...state, callSocket, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
