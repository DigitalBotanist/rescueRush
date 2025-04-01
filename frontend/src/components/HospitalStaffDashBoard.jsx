import {Link} from 'react-router-dom';
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"
import {useEffect, useState} from 'react'
import HospitalDetails from './HospitalDetails';
import { useAuthContext } from "../hooks/useAuthContext";

const HospitalStaffDashBoard = () => {
   
   const [doctordetails, setdoctordetails] = useState(null)
    const {user} = useAuthContext()
   useEffect(()=>{

    const fetchdoctordetails =async ()=>{
        try{

            
        const response = await fetch('/api/hospital/doctor_details', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`, 
                "Content-Type": "application/json"
            },
           
        });
        const json = await response.json();

        if (!response.ok) {
            console.log("Error:", json) 
             return
        }

       
        setdoctordetails(json);

        }catch(error){
            console.error("Error fetching doctor details:", error);
        }
    }
    fetchdoctordetails()
   },[user])
  
    return (

        <div>
            
            <div className="hospitalDashboard">
           

                <h1 className="hospitalDashboard-h1">DashBoard</h1>
                <div className="hospitalDashboard-container">
                    <div className="hospitalDashboard-container-contenr">
                        <div className="hospitalDashboard-container-contenr-leftside">
                            <div className="hospitalDashboard-container-hospital-details">
                                <h1>hospital details</h1>
                                <HospitalDetails />


                                
                            </div>

                            <div className="hospitalDashboard-container-map">
                                <p className="hospitalDashboard-container-map-pharagrph">Ambulance Arrival Time  </p>
                            </div>

                            <div className="hospitalDashboard-container-openchatWindow">
                                <p className="hospitalDashboard-container-openchatWindow-chatWindow">Open Chat Window</p>
                            </div>
                        </div>
                        

                        
                    </div>
                    
                    <div className="hospitalDashboard-container-doctor-details">
                        <div className="hospitalDashboard-container-doctor-details-header-part">
                            <h1 className="hospitalDashboard-container-doctor-details-h1">Doctor Details</h1>
                            <input type="text" placeholder="search" className="hospitalDashboard-container-doctor-details-searchbar"></input>
                           <Link to ="/hospital/add_doctor_details"> <button className="hospitalDashboard-container-doctor-details-searchbar-button">+ Add Doctor Details</button></Link>
                        </div>
     
                        <div className="hospitalDashboard-container-doctor-details-content">
                            <h3 className="hospitalDashboard-container-doctor-details-content-h3">Cardiologist</h3>
                            <div className="hospitalDashboard-container-doctor-details-content-cardiologist">
                               <p className="hospitalDashboard-container-doctor-details-content-p">
                               {doctordetails && doctordetails.map((doctordetail) => (
                                    <div key={doctordetail._id}>
                                        <p>{doctordetail.hospital_name}</p>
                                    </div>
                                ))}
                                
                                
                                 </p>
                               <div className="hospitalDashboard-container-doctor-details-content-button">
                                    <button className="hospitalDashboard-container-doctor-details-content-button-delete">Delete</button>
                                    <button className="hospitalDashboard-container-doctor-details-content-button-request">Request</button>
                               </div>
                            


                            
                            

                        </div>
                        
                    </div>

                </div>

            </div>
           
        </div>
        </div>

















































)
}


export default HospitalStaffDashBoard