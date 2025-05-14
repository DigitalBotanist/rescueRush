import { useState } from "react";
import { usePatientContext } from "../hooks/usePatientContext"
import { useNavigate } from "react-router-dom";
import { SuggestedHospitals } from "../hooks/SuggestedHospitals";

const SearchandDisplayHospitals = () => {

  const user = JSON.parse(localStorage.getItem('user'))
  const token = user.Token

  const {vin, patient,hospital,dispatch } = usePatientContext()


  const [city, setCity] = useState("");
  const [Bed, setBed] = useState("");
  const [ICU, setICU] = useState("");
  const [EUisTrue, EUsetIsTrue] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const { suggest, hospitalsJSON } = SuggestedHospitals();

  //navigate to chat window
  const navigate = useNavigate();
  const navigateToChat = () => {
    navigate('/patient/paramedic_chat');
  };

  //search handler
  const handleSearch = async () => {

    if(!city || !Bed || !ICU)
      {
        alert("Mention all requirements")
        return;
      }

    await suggest(city, Bed, ICU, EUisTrue);
  };


  //hospital request handler
  const handleRequest = async(hospital) =>
  {
      const PatientHospital = {Patientid: patient._id, hospitalid : hospital._id , vin : vin, Token : token, paramedicId : user._id}

      dispatch({ type: "SET_HOSP", payload: hospital });

      try {
        const response = await fetch('/api/patients/requestHospitals/', {
            method: 'POST',
            headers: {  "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`, },
            body: JSON.stringify(PatientHospital)
        })

        
        if(response.ok)
        {
          console.log("sucessfully got the patient updated details")
          //updated patient document with hopsital 
          const patient = await response.json()
          dispatch({ type: "SET_PAT", payload: patient });
          setShowChat(true)

        }} 
        catch (err) {
        console.log(err)
      }
  }


  return (
    <div className="hospitals-search-list">
      <div className="hospitals-search-box">
        <h1 className="hospitals-search-box-title"><i class="material-icons">local_hospital</i>Find a Hospital</h1>
        <label className="suggest-label">City<i class="material-icons">location_on</i></label>
        <input className="suggest-input"type="text" required onChange={(e) => setCity(e.target.value)} />
        
        <label className="suggest-label">Bed <i class="material-icons">bed</i></label>
        <input className="suggest-input" type="number" required onChange={(e) => setBed(e.target.value)} />
        
        <label className="suggest-label">ICU <i class="material-icons">emergency</i></label>
        <input type="number" className="suggest-input" required onChange={(e) => setICU(e.target.value)} />
        

        <label className="suggest-label" htmlFor="BooleanEU">Emergency Unit</label>
        <select className="suggest-input-select"
          name="BooleanEU"
          id="BooleanEU"
          onChange={(e) => EUsetIsTrue(e.target.value === "true")}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

       
        <button type="submit" onClick={handleSearch} className="search-btn">Search</button>
         
      </div>

      <div className="hospitalList">
        {hospitalsJSON && hospitalsJSON.length > 0 ? (
          hospitalsJSON.map((hospital, index) => (
            <div key={index} className="Search-hospital-results">
              <h3 className="Search-hospital-name">{hospital.name}</h3>
              <p className="Search-hospital-city">City: {hospital.city}</p>
              <p className="Search-hospital-beds">Beds: {hospital.Bed ? "Available" : "Not Available"}</p>
              <p className="Search-hospital-ICU">ICU: {hospital.ICU ? "Available" : "Not Available"}</p>
              <p className="Search-hospital-EU">Emergency Unit: {hospital.Emergency_Unit ? "Available" : "Not Available"}</p>
              <button onClick={() => {handleRequest(hospital)}} className="Request-btn">Request</button>
              {showChat ? (<button  onClick={navigateToChat} className="Chat-btn-paramedic">Chat</button>) : <p></p>}
            </div>
          ))
        ) : (
          <p className="no-suggestion">No hospitals found</p>
        )}
      </div>
    </div>
  );
};

export default SearchandDisplayHospitals;
