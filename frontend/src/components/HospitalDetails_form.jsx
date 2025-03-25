import { useState } from "react"

const HosptaDetails_form =() =>{

    const [location_lat,setlocation_lat]=useState('')
    const [location_long,setlocation_long]=useState('')
    const [name,setName]=useState('')
    const [Bed,setBeds]=useState('')
    const [ICU,setICU]=useState('')
    const [Emergency_Unit,setEmergency_Unit]=useState('')
    const [error,setError]=useState(null)
    
    const handleSubmit = async (e) =>{
        e.preventDefault()


        const detail ={location: {
            lat: location_lat, 
            long: location_long
        },name,Bed,ICU,Emergency_Unit}

        const response = await fetch('/api/hospital',{
            method: 'POST',
            body:JSON.stringify(detail),
            headers : {
                'Content-Type': 'application/json'
            }
        })

        const json =await response.json()

        if(!response.ok){
            setError(json.error)
        }

        if(response.ok) {
            setlocation_lat('')
            setlocation_long('')
            setName('')
            setBeds('')
            setICU('')
            setEmergency_Unit('')
            setError(null)
            console.log('New details added', json)
        }
        
    }
    return(
        <form className="form" onSubmit={handleSubmit}>
            <h3>Add a new Hospital</h3>

            <label>Location (lat) : </label>
            <input
                type="float"
                onChange={(e)=>setlocation_lat(e.target.value)}
                value={location_lat}
            />

            <label>Location (long) : </label>
            <input
                type="float"
                onChange={(e)=>setlocation_long(e.target.value)}
                value={location_long}
            />
            <label>Name : </label>
            <input
                type="text"
                onChange={(e)=>setName(e.target.value)}
                value={name}
            />

            <label>Beds : </label>
            <input
                type="number"
                onChange={(e)=>setBeds(e.target.value)}
                value={Bed}
            />

            <label>ICU : </label>
            <input
                type="boolean"
                onChange={(e)=>setICU(e.target.value)}
                value={ICU}
            />

            <label>Emergency Unit : </label>
            <input
                type="boolean"
                onChange={(e)=>setEmergency_Unit(e.target.value)}
                value={Emergency_Unit}
            />

            <button>Submit</button>
        </form>
    )
}

export default HosptaDetails_form