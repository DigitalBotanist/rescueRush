import { useState } from "react";
import { useVehicleContext } from "./useVehicleContext";

export const useUpdateLocation = () => {
    const {dispatch} = useVehicleContext()
    
    const getPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };
    
    const updateLocation = async () => {
        try {
            const position = await getPosition();
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
    
            // ✅ Dispatch immediately without waiting for state update
            dispatch({ type: "SET_LOCATION", payload: newLocation });
            return newLocation
        } catch (error) {
            console.log("Error getting location:", error.message);
        }
    };
    

    return { updateLocation };
};
