import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";

// create context
export const VehicleContext = createContext();

// reducer to manage the VehicleContext state
export const vehicleReducer = (state, action) => {
    let patient = null;
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
        case "SET_PATIENT_PICKED":
            console.log("SET_PATIENT_PICKED");
            patient = state.patient;
            patient.status = "picked";
            localStorage.setItem("patient", JSON.stringify(patient));
            return { ...state, patient };
        case "SET_PATIENT_ASSIGNED":
            console.log("SET_PATIENT_ASSIGNED");
            console.log(state.patient);
            patient = state.patient;
            patient.status = "assigned";
            localStorage.setItem("patient", JSON.stringify(patient));
            return { ...state, patient };
        case "SET_PATIENT":
            console.log("SET_PATIENT");
            localStorage.setItem(
                "patient",
                JSON.stringify(action.payload.patient)
            );
            return { ...state, patient: action.payload.patient };
        case "UNSET_PATIENT":
            console.log("UNSET_PATIENT");
            localStorage.removeItem("patient");
            return { ...state, patient: null };
        case "SET_PARAMEDIC":
            console.log("SET_PARAMEDIC");
            localStorage.setItem(
                "paramedic",
                JSON.stringify(action.payload.paramedic)
            );
            return { ...state, paramedic: action.payload.paramedic };
        case "UNSET_PARAMEDIC":
            console.log("UNSET_PARAMEDIC");
            localStorage.removeItem("paramedic");
            return { ...state, paramedic: null };
        case "SET_HOSPITAL":
            console.log("SET_HOSPITAL");
            // todo:
            // localStorage.setItem(
            //     "hospital",
            //     JSON.stringify(action.payload.hospital)
            // );

            // update the patient status
            patient = state.patient;
            patient.status = "onway";
            return { ...state, hospital: action.payload.hospital };
        case "UNSET_HOSPITAL":
            console.log("UNSET_HOSPITAL");
            // todo:
            // localStorage.setItem(
            //     "hospital",
            //     JSON.stringify(action.payload.hospital)
            // );

        case "SET_STATUS":
            console.log("SET_STATUS");
            return { ...state, status: action.payload.status };

        // case "CURRENT_EMERGENCY_DONE":
        //     console.log("CURRENT_EMERGENCY_DONE");
        //     dispatch({
        //         type: "UNSET_CURRENT_EMERGENCY",
        //     });
        //     dispatch({
        //         type: "UNSET_PATIENT",
        //     });
        //     dispatch({
        //         type: "UNSET_PARAMEDIC",
        //     });
        //     dispatch({
        //         type: "SET_STATUS",
        //         action: { status: null },
        //     });
        //     return { ...state, status: action.payload.status };
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
        patient: null,
        paramedic: null,
        hospital: null,
        status: null,
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

            const patient = JSON.parse(localStorage.getItem("patient"));

            if (patient) {
                dispatch({ type: "SET_PATIENT", payload: { patient } });
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
    if (!user || (user.role !== "driver" && user.role !== "admin")|| !user?.token) return; // check if user is a driver

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
        newSocket.on("new_request", (emergency) => {
            dispatch({ type: "SET_NEW_EMERGENCY", payload: { emergency } });
            tempEmergency = emergency;
        });
        newSocket.on("fleet_connected", (vehicle) => {
            if (vehicle && vehicle.paramedic) {
                dispatch({
                    type: "SET_PARAMEDIC",
                    payload: { paramedic: vehicle.paramedic },
                });
            }
            console.log("new conn");
        });
        newSocket.on("assigned", ({ emergencyId, patient }) => {
            console.log("request assigned");
            console.log(tempEmergency);
            if (tempEmergency) {
                dispatch({
                    type: "SET_CURRENT_EMERGENCY",
                    payload: { emergency: tempEmergency },
                });
                dispatch({
                    type: "SET_PATIENT",
                    payload: { patient },
                });

                dispatch({
                    type: "UNSET_NEW_EMERGENCY",
                });
                dispatch({
                    type: "SET_PATIENT_ASSIGNED",
                });
            } else {
                console.log("No new emergency to assign");
            }
        });

        newSocket.on("accept_error", (error) => {
            console.log("accept_error: ", error);
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

        newSocket.on("picked_confirm", (emergencyId) => {
            console.log("picked confirm");
            dispatch({
                type: "SET_PATIENT_PICKED",
            });
        });

        newSocket.on("paramedic_login", (paramedic) => {
            dispatch({
                type: "SET_PARAMEDIC",
                payload: { paramedic },
            });
        });

        newSocket.on("hospital_details", (hospital) => {
            dispatch({
                type: "SET_HOSPITAL",
                payload: { hospital },
            });
        });

        newSocket.on("dropoff_confirm", () => {
            console.log("drop");
            dispatch({
                type: "SET_STATUS",
                payload: { status: "done" },
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

    // set isConnected to fleet manager
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
