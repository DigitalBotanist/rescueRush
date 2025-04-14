import {Link} from 'react-router-dom';
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"
import {useEffect, useState} from 'react'
import HospitalDetails from './HospitalDetails';
import { useAuthContext } from "../hooks/useAuthContext";


const HospitalStaffDashBoard = () => {
    // Display current date 
    const currentDate = new Date().toLocaleDateString();
   
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
            <div className='flex flex-row'>
                <div className='h-screen bg-[#EC221F] p-10 w-80 flex flex-col space-y-8 '>
                    <h1 className='text-white text-2xl ' >{user.firstName} {user.lastName}</h1>
                    <Link to ="/hospital/HospitalStaffDashBoard"> <h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Doctor Details</h3></Link>
                    <Link to ="/hospital/AmbulanceArrivalTime"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Ambulance Arrival Time</h3></Link>
                    <Link to ="/hospital/HospitalDetail"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Hospital detials</h3></Link>
                    <Link to ="/hospital/Report"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Report</h3></Link>
                    <Link to ="/hospital/ChatWindow"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Chat Window</h3></Link>
                </div>

                <div>
                    <div className='flex flex-row flex space-x-100'>
                        <h1 className='ml-7 mt-5 text-2xl '>Doctor Details</h1>
                        <div>
                            <h1 className='ml-7 mt-5 text-2xl'>{currentDate}</h1>
                            <Link to ="/hospital/add_doctor_details"> <h1 className='text-white bg-[#EC221F] w-70 p-5 rounded mt-3 ml-20'>+ Add Doctor Details</h1></Link>
                        </div>
                    </div>

                    <div className='h-[600px] overflow-y-auto p-4 mt-5 bg-[#D9D9D9] ml-20'>
                    {doctordetails && doctordetails.map((doctordetail) => (
                                    <div key={doctordetail._id} className='flex justify-between items-center w-250 bg-white rounded-2xl p-6 shadow-md mb-6 ml-4 mt-4  '>
                                       

                                        <p> {doctordetail.fname}  {doctordetail.lname}</p>
                                    
                                        <p className=''>{doctordetail.special}</p>
                                        <p>{doctordetail.time}</p>
                                    
                                        <div class="flex space-x-4">
                                                    <button class="bg-black text-white px-4 py-2 rounded">Delete</button>
                                                    <button class="bg-red-500 text-white px-4 py-2 rounded">Request</button>
                                        </div>
                                    </div>
                    ))}
                    </div>
                    
                </div>
                
            </div>
        </div>






























































       /* <div>
            
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
           
       
        </div>*/
    
)
}


export default HospitalStaffDashBoard