import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext"

const HospitalDetails = ({detail}) =>{
    const {dispatch} =useHospitalDetailsContext()

    const handleClick = async ()=>{
            const response = await fetch ('api/hospital/' + detail._id , {
                method: 'DELETE'
            })

            const json = await response.json()

            if(response.ok){
                dispatch({type:'DELETE_DETAILS', payload:json})
            }
    }

    return(
        <div className="flex bg-white justify-between p-5 rounded-2xl">
        
            
            <div>
                <p><strong>Location :</strong>{detail.location.lat}, {detail.location.long}</p>
                <p><strong>Name :</strong>{detail.name}</p>
                <p><strong>Bed :</strong>{detail.Bed}</p>
                <p><strong>ICU :</strong>{detail.ICU}</p>
                <p><strong>Emergency_Unit :</strong>{detail.Emergency_Unit}</p>
            </div>

           <div className="h-10 flex gap-2 self-end ">
                <button className="bg-black rounded-lg p-3 text-white text-xs" onClick={handleClick}>Delete</button>
                <button className="bg-primary rounded-lg p-3 text-white text-xs">Update</button>
           </div>
            
        
        </div>
    )
}
export default HospitalDetails
