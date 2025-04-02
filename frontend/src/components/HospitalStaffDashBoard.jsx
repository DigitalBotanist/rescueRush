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

            
        const response = await fetch('/api/hospital/doctor_details/', {
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
  

   // Delete Doctor Details
   const handleDelete = async (doctorId) => {
    if (!user) return;

    try {
        const response = await fetch(`/api/hospital/doctor_details/${doctorId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.log("Error deleting doctor:", await response.json());
            return;
        }


        setdoctordetails(doctordetails.filter(doc => doc._id !== doctorId));

        console.log("Doctor deleted successfully");
    } catch (error) {
        console.error("Error deleting doctor:", error);
    }
};


   console.log(doctordetails)
    return (

        <div>
            
            <div className="hospitalDashboard">
           

                <h1 className="hospitalDashboard-h1">{user.firstName} {user.lastName}</h1>
                <div className="hospitalDashboard-container">
                    <div className="hospitalDashboard-container-contenr">
                        <div className="hospitalDashboard-container-contenr-leftside">
                            <div className="hospitalDashboard-container-hospital-details">
                                <h1>Hospital details</h1>
                                <HospitalDetails />


                                
                            </div>

                            <div className="hospitalDashboard-container-map">
                                <p className="hospitalDashboard-container-map-pharagrph">Ambulance Arrival Time &nbsp;&nbsp; 00:00 </p>
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
    
                               <p className="hospitalDashboard-container-doctor-details-content-p">
                               {doctordetails && doctordetails.map((doctordetail) => (
                                    <div key={doctordetail._id} className='doctor-detail-box'>
                                        <p>Hospital Name: {doctordetail.hospital_name}</p>
                                        <p>Doctor Name: {doctordetail.fname}  {doctordetail.lname}</p>
                                    
                                        <p><bold>Specialist:</bold> {doctordetail.special}</p>
                                        <p>Available time: {doctordetail.time}</p>
                                        <div className="hospitalDashboard-container-doctor-details-content-button">
                                    <button onClick={()=>handleDelete(doctordetail._id)} className="hospitalDashboard-container-doctor-details-content-button-delete">Delete</button>
                                    <button className="hospitalDashboard-container-doctor-details-content-button-request">Request</button>
                               </div>
                                    </div>
                                ))}
                                
                                
                                 </p>
                               
                            


                            
                            

                        </div>
                        
                    </div>

                </div>

            </div>
           
       
        </div>

















































)
}


export default HospitalStaffDashBoard