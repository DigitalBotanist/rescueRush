import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export default function AmbulanceArrivalTime() {
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
                        <h1 className='ml-7 mt-5 text-2xl '>Ambulance Arrival Time</h1>
                         <h1 className='ml-7 mt-5 text-2xl'>{currentDate}</h1>
                    </div> 

                    <div className='flex flex-row gap-90 ml-5 mt-8'>
                        <h1>Time</h1>
                        <h1>Vehicle ID</h1>
                        <h1>Arrival Time</h1>
                    </div>

                    <div className='h-[600px] overflow-y-auto '>
                        <div className='flex flex-row gap-90 ml-5 bg-[#D9D9D9] p-4 mt-2'>
                                <h3>12.00</h3>
                                <h3>v001</h3>
                                <h3>12.30</h3>

                        </div>

                        <div className='flex flex-row gap-90 ml-5 bg-[#D9D9D9] p-4 mt-2'>
                                <h3>12.00</h3>
                                <h3>v001</h3>
                                <h3>12.30</h3>

                        </div>

                        <div className='flex flex-row gap-90 ml-5 bg-[#D9D9D9] p-4 mt-2'>
                                <h3>12.00</h3>
                                <h3>v001</h3>
                                <h3>12.30</h3>

                        </div>
                    </div>
                    
                </div>
                
                
        </div>
    </div>
  )
}
