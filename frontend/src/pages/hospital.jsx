import { useEffect,useState } from "react"

//components 
import HospitalDetails from '../components/HospitalDetails'
import HosptaDetails_form from "../components/HospitalDetails_form"

const Hospital = () => {
    const [details, setDetails] = useState([])


    //fetxhing all data from backend
    useEffect(()=>{
        const fetchHospitalDetails = async()=>{
            const response = await fetch('http://localhost:4000/api/hospital')
            const json = await response.json()

            if(response.ok){
                setDetails(json)
            }
        }
        fetchHospitalDetails()
    },[])
    return (
        <div className="hospital ">
            <div className="details">
                {details && details.map((detail)=>(
                   <HospitalDetails key={detail._id}detail={detail}/>
                ))}
            </div>
            <HosptaDetails_form /> 
        </div>
    )
}


export default Hospital