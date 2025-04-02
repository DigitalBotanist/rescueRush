import React, { useEffect, useState } from 'react';
import { usePatientContext } from "../hooks/usePatientContext"


//client side socket

 const PatientUpdateform = () => { 
  
  console.log("update form compnente")
  
  const { patient } = usePatientContext()
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');

  
  //form submission handler
  const handleSubmit = async(e) =>
    {
      e.preventDefault()
      alert("patient details submitted!")
    
      const vitalSigns = {id: patient._id,pulse,bloodPressure,temperature}

      const response = await fetch('/api/patients/patientDetails/',
        {
        method: 'POST',
        body: JSON.stringify(vitalSigns),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const patinetjson = await response.json()
      
      if(!response.ok)
      {
          throw new Error('Failed to update patient data');
      }

      if (patinetjson) {
        console.log("sucessfully got the patient updated details")
       
    }
    }
  
  

  return (
    <div className='Patient-details-update-form-box'>
      <h1 className='Patient-details-update-form-title'>Update Vital Signs</h1>
      
        <div className='Patient-details-update-form-box-sub'>
          <form className='Patient-details-update-form' onSubmit={ handleSubmit }>
          <label className='Patient-details-update-label'>Patient ID</label>
          <input className='Patient-details-update-input' value={patient._id}></input>
          <label className='Patient-details-update-label'>Patient Name</label>
          <input className='Patient-details-update-input' value={patient.name} readOnly></input>
          <label className='Patient-details-update-label'>Patient Age</label>
          <input className='Patient-details-update-input' value={patient.age}></input>
          <label className='Patient-details-update-label'>Patient Emergency Type</label>
          <input className='Patient-details-update-input'value={patient.emergencyType} readOnly></input>
          <label className='Patient-details-update-label'>Blood Pressure</label>
          <input className='Patient-details-update-input' type='text' onChange={(e)=> setBloodPressure(e.target.value)}></input>
          <label className='Patient-details-update-label'>Pulse</label>
          <input className='Patient-details-update-input' type='number' onChange={(e)=> setPulse(e.target.value)}></input>
          <label className='Patient-details-update-label'>Temperature in Celcius</label>
          <input className='Patient-details-update-input' type='number' onChange={(e)=> setTemperature(e.target.value)}></input>
          <button className='Patient-details-update-btn' type='submit'>Update</button>
          </form>
        </div>
    </div>
  );

};


;

export default PatientUpdateform ;
