import { useContext } from "react"
import { CallopContext } from "../context/CallopContext"


export const useCallopContext = () => {
    const context = useContext(CallopContext)

    if(!context) {
        throw Error("useCallopContext must be used inside an CallopContextProvider")
    }

    return context
}