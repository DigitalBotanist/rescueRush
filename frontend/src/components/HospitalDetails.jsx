import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"

const HospitalDetails = ({}) =>{
    const {details, dispatch} =useHospitalDetailsContext()

    const handleClick = async ()=>{
            const response = await fetch ('api/hospital/' + details._id , {
                method: 'DELETE'
            })

            const json = await response.json()

            if(response.ok){
                dispatch({type:'DELETE_DETAILS', payload:json})
            }
    }

    console.log(details)

    return(
        <div className="flex bg-white justify-between p-5 rounded-2xl">
        
            
            <div>
                <p><strong>Location :</strong>{details.location && `${details.location.lat} ${details.location.long}`}</p>
                <p><strong>Name :</strong>{details.name}</p>
                <p><strong>Bed :</strong>{details.Bed}</p>
                <p><strong>ICU :</strong>{details.ICU ? 'true' : 'false'}</p>
                <p><strong>Emergency_Unit :</strong>{details.Emergency_Unit ? 'true' : 'false'}</p>
            </div>

           <div className="h-10 flex gap-2 self-end ">
                <button className="bg-black rounded-lg p-3 text-white text-xs" onClick={handleClick}>Delete</button>
                <button className="bg-primary rounded-lg p-3 text-white text-xs">Update</button>
           </div>
            
        
        </div>
    )
}
export default HospitalDetails
