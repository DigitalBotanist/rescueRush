import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUpdateLocation } from "./useUpdateLocation";
import { usePatientContext } from "./usePatientContext";

export const usePatientVehicleRegistration = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user } = useAuthContext();
    const { dispatch } = usePatientContext();
    // const { location: currentLocation } = useVehicleContext()

    const registration = async (vin) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/vehicle/register_vehicle", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vin }),
        });

        const json = await response.json();
        console.log(json);
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if (response.ok) {
            localStorage.setItem("vin", JSON.stringify(vin));

            dispatch({ type: "SET_VIN", payload: vin });

            setIsLoading(false);
        }
    };

    return { registration, isLoading, error };
};
