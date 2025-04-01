import { useState } from "react";
import { SuggestedHospitals } from "../hooks/SuggestedHospitals";

const SearchandDisplayHospitals = () => {
  const [city, setCity] = useState("");
  const [Bed, setBed] = useState("");
  const [ICU, setICU] = useState("");
  const [EUisTrue, EUsetIsTrue] = useState(true);

  const { suggest, hospitalsJSON } = SuggestedHospitals();

  const handleSearch = async () => {

    console.log(city)
    console.log(Bed)
    console.log(ICU)
    console.log(EUisTrue)
    console.log("clicked hospitals");

    
    await suggest(city, Bed, ICU, EUisTrue);
  };

  return (
    <div>
      <div className="hospitals-search-box">
        <label className="suggest-label">City</label>
        <input type="text" required onChange={(e) => setCity(e.target.value)} />
        
        <label className="suggest-label">Bed</label>
        <input type="number" required onChange={(e) => setBed(e.target.value)} />
        
        <label className="suggest-label">ICU</label>
        <input type="number" required onChange={(e) => setICU(e.target.value)} />
        

        <label htmlFor="BooleanEU">Emergency Unit</label>
        <select
          name="BooleanEU"
          id="BooleanEU"
          onChange={(e) => EUsetIsTrue(e.target.value === "true")}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

        <button type="submit" onClick={handleSearch}>Search</button>
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
  );
};

export default SearchandDisplayHospitals;
