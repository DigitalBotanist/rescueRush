import { useVehicleContext } from "./useVehicleContext";

export const useUpdateLocation = () => {
    const { dispatch } = useVehicleContext();

    // get position from navigator
    const getPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const updateLocation = async () => {
        // try getting current location 
        try {
            const position = await getPosition(); // wait until position is fetched
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            dispatch({ type: "SET_LOCATION", payload: newLocation }); // update the VehicleContext state
            return newLocation; // return the newLocation
        } catch (error) {
            console.log("Error getting location:", error.message);
        }
    };

    return { updateLocation };
};
