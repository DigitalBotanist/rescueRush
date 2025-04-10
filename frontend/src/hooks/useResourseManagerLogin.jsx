import { useState } from "react"
import { useAuthContext } from "./useAuthContext"


export const useResourseManagerLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    

    const login = async(email, password) => {
        setIsLoading(true)
        setError(null)

        // making the http request for r.manager login
        const response = await fetch('/api/resources/resourse_manager', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })

        const json = await response.json()

        // checking the response 
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if (response.ok) {
            // save the user to local storage 
            localStorage.setItem('user', JSON.stringify(json))

            // update the authcontext 
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }
    }

    return { login, isLoading, error } 
}