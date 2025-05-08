import { usePatientContext } from "../hooks/usePatientContext"
import SearchandDisplayHospitals from "./GetHospitals"
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PatientUpdateform from "./patientUpdateForm";
import { useAuthContext } from "../hooks/useAuthContext";

 const  ParamedicDashboard = () => {

    // const user = JSON.parse(localStorage.getItem('user'))
    const {user} = useAuthContext()
    const token = user.Token

    const {vin, patient, dispatch } = usePatientContext()
    
    const [patientDetails, setPatientDetails] = useState(null);
    
    useEffect(() => {
      console.log(user)
      if(!user || user.role !== "paramedic" || !user?.Token) return;

      const patinetSocket = io('http://localhost:4600', {
        auth: { token: user.Token }
      });
    
      patinetSocket.on('connect', () => {
        console.log("client connecting........")
        patinetSocket.emit('ClientToSocket', { name: 'patientform' });
      });
    
      patinetSocket.on('SocketToClient', (data) => {
        console.log('Received patient details:', data);
        setPatientDetails(data);
        dispatch({ type: "SET_PAT", payload: data });
      });
    
      patinetSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    
      return () => {
        patinetSocket.disconnect(); 
        console.log('Socket disconnected on unmount');
      };
    }, [user]);
    
    
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