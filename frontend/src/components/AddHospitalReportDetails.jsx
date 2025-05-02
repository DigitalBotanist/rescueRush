import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHospitalDetailsContext } from '../hooks/useHospitalDetailContext'
import { useAuthContext } from '../hooks/useAuthContext'

export default function AddHospitalReportDetails() {

    const {details}= useHospitalDetailsContext()
    const {user} = useAuthContext();

    const[fname,setfname]=useState("")
    const[lname,setlname]=useState("")
    const[guardian,setguardian]=useState("")
    const[DoctorName,setDoctorName]=useState("")
    const[AmbulanceID,setAmbulanceID]=useState("")
    const[FirstAid,setFirstAid]=useState("")
    const[Disease,setDisease]=useState("")
    const[Symptoms,setSymptoms]=useState("")
    const [hospital_id , sethospital_id] = useState(null)

    const handleClick = async()=>{
        if (!user) {
            console.log("no user")
              return;
          } else {
              sethospital_id(details._id)
          }

          const detail = {
            fname,
            lname,
            guardian,
            DoctorName,
            AmbulanceID,
            FirstAid,
            Disease,
            Symptoms,
            hospital_id:details._id
          };

          const response = await fetch("/api/hospital/hospitalRepoet", {
            method: "POST",
            body: JSON.stringify(detail),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const json = await response.json();

    if (!response.ok) {
       console.log("no data")
       console.log(user.token)
       
    }

    if (response.ok) {

        console.log("New report added", json);
        dispatch({ type: "CREATE_DETAILS", payload: json });
    }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 w-96 p-6 rounded shadow-md mt-16 mb-16">
        <h1 className="text-black text-xl font-bold mb-4 text-center">Hospital Report</h1>

            <div className="flex flex-col gap-3">
                <label>
                    Enter First Name:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setfname(e.target.value)}/>
                </label>

                <label>
                    Enter Last Name:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setlname(e.target.value)}/>
                </label>

                <label>
                    Enter Guardian Name:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setguardian(e.target.value)}/>
                </label>

                <label>
                    Enter Doctor Name:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setDoctorName(e.target.value)} />
                </label>

                <label>
                    Enter Ambulance ID:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setAmbulanceID(e.target.value)} />
                </label>

                <label>
                    First Aid:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setFirstAid(e.target.value)} />
                </label>

                <label>
                    Disease:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setDisease(e.target.value)}/>
                </label>

                <label>
                    Symptoms:
                    <input type="text" className="block w-full mt-1 p-2 border border-gray-300 rounded" onChange={(e) => setSymptoms(e.target.value)}/>
                </label>
            </div>
            <Link to='/hospital/Report'>
                <div className="flex justify-center mt-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={handleClick}>
                        Submit
                    </button>
                </div>
            </Link>

        </div>
    </div>

  )
}


