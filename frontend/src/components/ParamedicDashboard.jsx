import { usePatientContext } from "../hooks/usePatientContext"
import SearchandDisplayHospitals from "./GetHospitals"
import { useAuthContext } from "../hooks/useAuthContext"
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PatientUpdateform from "./patientUpdateForm";




 const  ParamedicDashboard = () => {

  const user = JSON.parse(localStorage.getItem('user'))
  const token = user.Token
  console.log("123456....");
  console.log('User token:', token)

    const {vin, patient, dispatch } = usePatientContext()
    
    const [patientDetails, setPatientDetails] = useState(null);

      
      useEffect(() => {
        const socket = io('http://localhost:4600', {
            auth: {
            token: token
            }
        });
        
        console.log("helllo2222")
        console.log(vin, patient, dispatch)

        console.log("12222client connecting........")
        socket.on('connect', () => {
          console.log("client connecting........")
          socket.emit('ClientToSocket', { name: 'patientform' });
        });
        socket.on('SocketToClient', (data) => {
          console.log('Received patient details:', data);
          setPatientDetails(data);
          console.log("dataaa: ",data)
          dispatch({ type: "SET_PAT", payload: data });
          console.log("dispatch done") 
          console.log(patient)
        });
    
        socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });
    
      }, []);

    console.log("Patient in context:", patient);

    return (
        <div className="paramedicDashboard">
          
             <div className="paramedicDashboard-profile" >
                <h2 className="paramedicDashboard-profile-name">{user.firstName} {user.lastName}</h2>
                <h2 className="paramedicDashboard-profile-mail">{user.email}</h2>
                <h3 className="paramedicDashboard-profile-role">{user.role}</h3>
             </div>
             <div className="paramedicDashboard-right-div">
            {patient ? (
                <div className="paramedicDashboard-form" >
                <div className="patientUpdateform">
                    <PatientUpdateform />
                </div>
                <div className="SearchHospitals">
                    <SearchandDisplayHospitals />
                </div>
                </div>
            ) : (
                <p className="noPatientUpdate">No patient selected</p>
            )}
            </div>
        </div>
    )
}

//
export default ParamedicDashboard