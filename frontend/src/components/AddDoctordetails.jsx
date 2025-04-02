import React, { useState } from 'react'
import { useHospitalDetailsContext } from '../hooks/useHospitalDetailContext'
import { AuthContext } from '../context/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'

export default function AddDoctordetails() {
  const {details} = useHospitalDetailsContext()

  const {user} = useAuthContext();

const [fname , setfname] = useState("")
const [lname , setlname] = useState("")
const [special , setspecial] = useState("")
const [time , settime] = useState("")
const [hospital_id , sethospital_id] = useState(null)


  const handleClick  = async() =>
  {
    

    console.log(user)
    if (!user) {
      console.log("no user")
        return;
    } else {
        sethospital_id(details._id)
    }


    const detail = {
      fname,
      lname,
      special,
      time,
      hospital_id: details._id
    };

      console.log(detail)
    const response = await fetch("/api/hospital/doctor_details", {
        method: "POST",
        body: JSON.stringify(detail),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        },
    });

    const json = await response.json();

    if (!response.ok) {
       console.log("no data")
       console.log(user.token)
       
    }

    if (response.ok) {

        console.log("New details added", json);
        dispatch({ type: "CREATE_DETAILS", payload: json });
    }
};

return (
  <div className="AddDoctordetails">
      <div className="AddDoctorDetails-container">
          <h1 className="AddDoctorDetails-container-h1">Add Doctor Details</h1>

          <div className="AddDoctorDetails-container-inputfield">
              <label>Enter First Name:</label>
              <input type="text" placeholder="Enter first name"  onChange={(e) => setfname(e.target.value)} />
          </div>

          <div className="AddDoctorDetails-container-inputfield">
              <label>Enter Last Name:</label>
              <input type="text" placeholder="Enter last name" onChange={(e) => setlname(e.target.value)} />
          </div>

          <div className="AddDoctorDetails-container-inputfield">
              <label>Enter Specialization:</label>
              <input type="text" placeholder="Enter specialization" onChange={(e) => setspecial(e.target.value)} />
          </div>

          <div className="AddDoctorDetails-container-inputfield">
              <label>Enter Time:</label>
              <input type="text" placeholder="Enter time" onChange={(e) => settime(e.target.value)} />
          </div>

          <div className="AddDoctorDetails-container-inputfield">
              <label>Enter Hospital ID:</label>
              <input value={details._id} readOnly  onSubmit={(e) => sethospital_id(e.target.value)}/>
          </div>

          <button type="submit" className="AddDoctorDetails-containe-button" onClick={handleClick}>
              Submit
          </button>

      </div>
  </div>
);

}


  