import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { user, dispatch } = useAuthContext();

    const logout = async () => {
        // if driver, send a logout request
        if (user.role == "driver") {
            await driverLogout();
        }
        localStorage.removeItem("user");

        dispatch({ type: "LOGOUT" });
    };

    const driverLogout = async () => {
        const vin = JSON.parse(localStorage.getItem("vin"))

        console.log("vin", vin)

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

        if (!response.ok) {
            console.log("Error:", json)
        }
    };

    return { logout };
};
