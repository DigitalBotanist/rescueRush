import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { io } from "socket.io-client";

const useVehicleSocket = (newEmergency, currenEmergency, dispatch) => {
    const { user } = useAuthContext()
    // const { newEmergency, currenEmergency, dispatch} = useVehicleContext()
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "driver" || !user?.token) return;

        const newSocket = io("ws://localhost:4500", {
            auth: {
                token: user.token,
            },
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        newSocket.on("new_request", (emergency) => {
            dispatch({ type: "SET_NEW_EMERGENCY", payload: { emergency } });
        });

        newSocket.on("assigned", (emergencyId) => {
            console.log(newEmergency)
            dispatch({
                type: "SET_CURRENT_EMERGENCY",
                payload: { emergency: newEmergency },
            });
            dispatch({
                type: "SET_NEW_EMERGENCY",
                payload: { emergency: null },
            });
        });

        newSocket.on("request_cancel", () => {
            dispatch({
                type: "SET_CURRENT_EMERGENCY",
                payload: { emergency: null },
            });
            dispatch({
                type: "SET_NEW_EMERGENCY",
                payload: { emergency: null },
            });
        });

        newSocket.on("reject_confirm", () => {
            dispatch({
                type: "SET_CURRENT_EMERGENCY",
                payload: { emergency: null },
            });
            dispatch({
                type: "SET_NEW_EMERGENCY",
                payload: { emergency: null },
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return { socket, isConnected };
};

export default useVehicleSocket