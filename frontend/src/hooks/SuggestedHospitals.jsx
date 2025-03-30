
import { useState } from "react"


export const SuggestedHospitals = () =>
{
    const [city, setcity] = useState('')
    const [Bed, setBed] = useState('')
    const [ICU, setICU] = useState('')
    const [Emergency_Unit, setEmergency_Unit] = useState('')
    const { hospitalsJSON, sethospitalsJSON} = useState(null)

    const suggest = async (city, Bed, ICU,Emergency_Unit) =>
    {
        try {
            const response = await fetch('/api/patients/suggestHospitals/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, Bed, ICU, Emergency_Unit})
            })

            
            if (!response.ok) {
               
                console.error("couldnt fetch hospitals")
                
            } else {
                const data = await response.json()
                sethospitalsJSON(data)
            }

           

            console.log(hospitalsJSON)

        } catch (err) {
            setError("Something went wrong when fetching hospitals.")
        } finally {
            setIsLoading(false)
        }
    }

    return { suggest, hospitalsJSON }
}
