import { useEffect} from "react"
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"

//components 
import HospitalDetails from '../components/HospitalDetails'
import HosptaDetails_form from "../components/HospitalDetails_form"
import NavBar from "../components/NavBar"


const Hospital = () => {
    const{details,dispatch} =useHospitalDetailsContext()


    //fetxhing all data from backend
    useEffect(()=>{
        const fetchHospitalDetails = async()=>{
            const response = await fetch('/api/hospital')
            const json = await response.json()

            if(response.ok){
                dispatch({type:'SET_DETAILS', payload:json})
            }
        }
        fetchHospitalDetails()
    },[])
    return (
        <div className="min-h-screen bg-gradient-to-r from-secondary-50 via to-secondary-400">
            <NavBar className="bg-white"/>
            <div className="w-6/10 m-auto flex flex-col justify-center gap-5 p-10">
                {details && details.map((detail)=>(
                   <HospitalDetails key={detail._id}detail={detail}/>
                ))}
            </div>
            <HosptaDetails_form /> 
        </div>
    )
}


export default Hospital