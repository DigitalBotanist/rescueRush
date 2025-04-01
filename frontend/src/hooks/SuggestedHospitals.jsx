
import { useState } from "react"


export const SuggestedHospitals = () =>
{
    const [city, setcity] = useState('')
    const [Bed, setBed] = useState('')
    const [ICU, setICU] = useState("");
    const [EUisTrue, EUsetIsTrue] = useState(true);
    const [hospitalsJSON, sethospitalsJSON] = useState(null)


    const suggest = async (city, Bed, ICU, EUisTrue) =>
    {
        try {
            const response = await fetch('/api/patients/suggestHospitals/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, Bed, ICU, EUisTrue})
            })

            
            if (!response.ok) {
               
                console.error("couldnt fetch hospitals")
                
            } else {
                const data = await response.json()
                sethospitalsJSON(data)
                console.log(hospitalsJSON)
            }

           

            console.log(hospitalsJSON)

        } catch (err) {
           console.log(err)
        } finally {
            //setIsLoading(false)
        }
    }

    return { suggest, hospitalsJSON }
}
