const HospitalDetails = ({detail}) =>{
    return(
        <div className="hospital_details">
            <p><strong>Location :</strong>{detail.location.lat}, {detail.location.long}</p>
            <p><strong>Name :</strong>{detail.name}</p>
            <p><strong>Bed :</strong>{detail.Bed}</p>
            <p><strong>ICU :</strong>{detail.ICU}</p>
            <p><strong>Emergency_Unit :</strong>{detail.Emergency_Unit}</p>
            
        </div>
    )
}
export default HospitalDetails
