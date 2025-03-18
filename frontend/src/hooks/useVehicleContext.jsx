import { useContext } from "react"
import { VehicleContext } from "../context/VehicleContext"

export const useVehicleContext = () => {
    const context = useContext(VehicleContext)

    if (!context) {
        throw Error("useVehicleContext must be used inside VehicleContext")
    }

    return context
}