import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

function HospitalReport() {

    // Display current date 
            const currentDate = new Date().toLocaleDateString();
        
            const { user } = useAuthContext();
    
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
                                <h1 className='ml-7 mt-5 text-2xl '>Report</h1>
                                 <h1 className='ml-7 mt-5 text-2xl'>{currentDate}</h1>
                            </div>
        
                           <div className='bg-[#D9D9D9] w-200 ml-10 mt-6 p-5'>
                                <h1 className='p-0.5'><bold>Patient name : </bold>A.M.Perera</h1>
                                <h1 className='p-0.5'><bold>Age : </bold>30</h1>
                                <h1 className='p-0.5'><bold>Ambulance ID : </bold>v001</h1>
                                <h1 className='p-0.5'><bold>Disease : </bold>Heartattack</h1>
                                <h1 className='p-0.5'><bold>Symptoms : </bold>Difficult to breath</h1>
                                <h1 className='p-0.5'><bold>First Aid provided : </bold>Give medecine</h1>
                                <button className='bg-[#EC221F] w-40 h-10 rounded mt-5 text-white' >Download</button>
                            </div> 

                            <div className='bg-[#D9D9D9] w-200 ml-10 mt-6 p-5'>
                                <h1 className='p-0.5'><bold>Patient name : </bold>A.M.Perera</h1>
                                <h1 className='p-0.5'><bold>Age : </bold>30</h1>
                                <h1 className='p-0.5'><bold>Ambulance ID : </bold>v001</h1>
                                <h1 className='p-0.5'><bold>Disease : </bold>Heartattack</h1>
                                <h1 className='p-0.5'><bold>Symptoms : </bold>Difficult to breath</h1>
                                <h1 className='p-0.5'><bold>First Aid provided : </bold>Give medecine</h1>
                                <button className='bg-[#EC221F] w-40 h-10 rounded mt-5 text-white' >Download</button>
                            </div> 

                           
                        </div>
                        
                        
                </div>
      
    </div>
  )
}

export default HospitalReport
