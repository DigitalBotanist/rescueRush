import {Link} from 'react-router-dom';
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"
import {useEffect, useState} from 'react'

const HospitalStaffDashBoaerd = () => {
   
   

    
    return (

        <div>
            
            <div className="hospitalDashboard">
           

                <h1 className="hospitalDashboard-h1">DashBoard</h1>
                <div className="hospitalDashboard-container">
                    <div className="hospitalDashboard-container-contenr">
                        <div className="hospitalDashboard-container-contenr-leftside">
                            <div className="hospitalDashboard-container-hospital-details">
                                <h1>hospital details</h1>

                                <div className="hospitalDashboard-container-hospital-details-content">
                                    <p><strong>Location :</strong></p>
                                    <p><strong>Name :</strong></p>
                                    <p><strong>Rooms :</strong></p>
                                    <p><strong>ICU Beds :</strong></p>
                                    <p><strong>Emergency unit :</strong></p><br/>
                                    <div className="hospitalDashboard-container-hospital-details-cotent-button">
                                    <Link to ="/hospital/hospital_details_form">< button className="hospitalDashboard-container-hospital-details-cotent-button-deisgn">Update</button></Link>
                                </div>
                                </div>

                                
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
                               <p className="hospitalDashboard-container-doctor-details-content-p">12.00-16.00 </p>
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


export default HospitalStaffDashBoaerd