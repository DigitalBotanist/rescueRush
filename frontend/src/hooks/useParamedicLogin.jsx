import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { usePatientContext } from "./usePatientContext"

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()
    const { vin } = usePatientContext()

    const login = async (email, password) => {

        console.log('Login function called with:', email, password)

        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/patients/paramedic_login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vin, email, password })
            })

            const json = await response.json()

            console.log(json)

            if (!response.ok) {
                setError(json.error)
                
            } else {
                console.log(json)
                localStorage.setItem('user', JSON.stringify(json))
                dispatch({ type: 'LOGIN', payload: json })
            }
        } catch (err) {
            setError("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}
