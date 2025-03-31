import { useState } from "react"
import { SuggestedHospitals } from "../hooks/SuggestedHospitals"


const SearchandDisplayHospitals = () =>{

  const [city, setCity] = useState("");
  const [Bed, setBed] = useState("");
  const [ICU, setICU] = useState("false");
  const [Emergency_Unit, setEmergency_Unit] = useState("false");
  
  const { suggest, hospitalsJSON  } = SuggestedHospitals

    const handleSearch = async ()=>
    {
        preventDefault()
        await suggest(city, Bed, ICU, Emergency_Unit)
    }

    return (
        <div>
        <div className="hospitals-search-box">
            <label className="suggest-label">City</label>
            <input type="text" required onChange={(e)=> {setCity(e.target.value)}} ></input>
            <label className="suggest-label">Bed</label>
            <input type="number" required onChange={(e)=> {setBed(e.target.value)}}></input>
            <label htmlFor="BooleanICU">ICU</label>
                <select name="BooleanICU" id="BooleanICU"  onChange={(e)=> {setICU(e.target.value)}}>
                <option value="true">true</option>
                <option value="false">false</option>
                </select>
            <label htmlFor="BooleanEU">Emergency Unit</label>
                <select name="BooleanEU" id="BooleanEU"  onChange={(e)=> {setEmergency_Unit(e.target.value)}}>
                <option value="true">true</option>
                <option value="false">false</option>
                </select>
            <button type="submit" onSubmit={handleSearch}>Search</button>
        </div>

        <div className="hospitalList">
        {hospitalsJSON && hospitalsJSON.length > 0 ? (
          hospitalsJSON.map((hospital, index) => (
            <div key={index}> 
              <h3>{hospital.name}</h3>
              <p>City: {hospital.city}</p>
              <p>Beds: {hospital.Bed}</p>
              <p>ICU: {hospital.ICU ? "Available" : "Not Available"}</p>
              <p>Emergency: {hospital.Emergency_Unit ? "Available" : "Not Available"}</p>
            </div>
          ))
        ) : (
          <p>No hospitals found</p>
        )}
      </div>
        </div>
    )

}

export default SearchandDisplayHospitals