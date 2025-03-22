import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { user, dispatch } = useAuthContext();

    const logout = async () => {
        // if driver, send a logout request
        if (user.role == "driver") {
            await driverLogout();
        }

        localStorage.removeItem("user"); // remove user from the localstorage
        dispatch({ type: "LOGOUT" }); // remove from AuthContext
    };

    // when a driver logs out, client send a logout request to the server 
    const driverLogout = async () => {
        const vin = JSON.parse(localStorage.getItem("vin"))

        // make the http request
        const response = await fetch("/api/vehicle/driver_logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vin }),
        });

        const json = await response.json();
        console.log(json);

        // check the response 
        if (!response.ok) {
            console.log("Error:", json)
        }
    };

    return { logout };
};
