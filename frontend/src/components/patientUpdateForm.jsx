import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const user = localStorage.getItem('user')
const token = user.Token
console.log('User token:', user)

//client side socket
const socket = io('http://localhost:4600', {
  auth: {
    token: token
  }
});

 const PatientSocket = () => { 
  
  const [patientDetails, setPatientDetails] = useState(null);
  
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');
 

  //form submission handler
  const handleSubmit = async(e) =>
    {
      e.preventDefault()
      alert("patient details submitted!")
    
      const vitalSigns = {id: patientDetails._id,pulse,bloodPressure,temperature}

      const response = await fetch('/api/patients/patientDetails/',
        {
        method: 'POST',
        body: JSON.stringify(vitalSigns),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json()
      
      if(!response.ok)
      {
          throw new Error('Failed to update patient data');
      }

      if (json) {
        dispatch({ type: "SET_PAT", payload: json });
    }
    }
  
  useEffect(() => {
    socket.on('connection', () => {
      socket.emit('ClientToSocket', { name: 'patientform' });
    });

    socket.on('SocketToClient', (data) => {
      console.log('Received patient details:', data);
      setPatientDetails(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

  }, []);

  return (
    <div className='Patient-details-update-form-box'>
      <h1 className='Patient-details-update-form-title'>Update Vital Signs</h1>
      
        <div>
          <form className='Patient-details-update-form' onSubmit={ handleSubmit }>
          <label className='Patient-details-update-label'>Patient ID</label>
          <input className='Patient-details-update-input' value={patientDetails._id}></input>
          <label className='Patient-details-update-label'>Patient Name</label>
          <input className='Patient-details-update-input' value={patientDetails.name} readOnly></input>
          <label className='Patient-details-update-label'>Patient Age</label>
          <input className='Patient-details-update-input' value={patientDetails.age}></input>
          <label className='Patient-details-update-label'>Patient Emergency Type</label>
          <input className='Patient-details-update-input'value={patientDetails.emergencyType} readOnly></input>
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

export default PatientSocket ;
