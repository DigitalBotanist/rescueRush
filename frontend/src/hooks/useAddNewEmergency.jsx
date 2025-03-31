import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

export const useAddNewEmergency = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {user, dispatch} = useAuthContext()


    const makeNewEmergency = async(emergency) => {
        setIsLoading(true)
        setError(null)

        console.log(emergency)

        // making the http request for makeNewEmergency 
        const response = await fetch('/api/call_op/new_emergency', {
            method: 'POST', 
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${user.token}`
            },
            body: JSON.stringify({...emergency})
        })

        const json = await response.json()

        // checking the response 
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if (response.ok) {
            setIsLoading(false)
            return json
        }

    }

    return { makeNewEmergency, isLoading, error } 
}
