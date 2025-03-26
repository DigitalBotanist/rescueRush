import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUpdateLocation } from "./useUpdateLocation";
import { useVehicleContext } from "./useVehicleContext";

export const useVehicleRegistration = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user } = useAuthContext();
    const { dispatch } = useVehicleContext();
    // const { location: currentLocation } = useVehicleContext()
    const { updateLocation } = useUpdateLocation();

    // register the vehicle
    // update the server
    const registration = async (vin) => {
        setIsLoading(true);
        setError(null);

        const currentLocation = await updateLocation(); // get the current location
        console.log("registration current location: ", currentLocation);

        // make a http request to register the vehicle
        const response = await fetch("/api/vehicle/register_vehicle", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vin,
                location: {
                    type: "Point",
                    coordinates: [currentLocation.lng, currentLocation.lat],
                },
            }),
        });

        const json = await response.json();
        console.log(json);

        // check the response
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        // if response is update the state
        if (response.ok) {
            localStorage.setItem("vin", JSON.stringify(vin)); // add vin to local storage

            dispatch({ type: "SET_VIN", payload: { vin } }); // add vin to VehicleContext state

            setIsLoading(false);
        }
    };

    return { registration, isLoading, error };
};
