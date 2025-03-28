import { Link } from "react-router-dom"

const HospitalStaffDashBoaerd = () => {
    return (
        <div>
           <div className="hospitalDashboard-container">
                <img src="../../public/assets/hospital-dashboard.jpg" className="hospitalDashboard-container-image"></img>
                <h1 className="hospitalDashboard-container-h1">Hospital  Management <br/> System</h1>
           </div>

           
           
           <div className="hospitalDashboard-container-cards">
                <div className="hospitalDashboard-container-cards-details">
                    <img src="../../public/assets/hospital-rooms.jpg" className="hospitalDashboard-container-cards-details-img"></img><br/>
                    <Link to="hospital_staff_details" className="hospitalDashboard-container-cards-details-img-h3">Hospital Details</Link><br/><br/>
                    <p className="hospitalDashboard-container-cards-details-img-paharagrph">Data must be Update every times to sho the paramedics</p><br></br><br></br>
                </div>


                <div className="hospitalDashboard-container-cards-details">
                    <img src="../../public/assets/doctor-details.jpg" className="hospitalDashboard-container-cards-details-img"></img><br/>
                    <h3 className="hospitalDashboard-container-cards-details-img-h3">Doctor Details</h3><br/><br/>
                    <p className="hospitalDashboard-container-cards-details-img-paharagrph">Check the doctor details and send notification to the doctor</p><br></br><br></br>
                </div>


                <div className="hospitalDashboard-container-cards-details">
                    <img src="../../public/assets/contactwith-paramedic.jpg" className="hospitalDashboard-container-cards-details-img"></img><br/>
                    <h3 className="hospitalDashboard-container-cards-details-img-h3">Contact with paramedics</h3><br/><br/>
                    <p className="hospitalDashboard-container-cards-details-img-paharagrph">Make connection between paramedic and hospital staff to provide meidcale guidance remotely</p><br></br><br></br>
                </div>


                <div className="hospitalDashboard-container-cards-details">
                    <img src="../../public/assets/ambulance-arrival-time.jpg" className="hospitalDashboard-container-cards-details-img"></img><br/>
                    <h3 className="hospitalDashboard-container-cards-details-img-h3">Ambulance Arrival time</h3><br/><br/>
                    <p className="hospitalDashboard-container-cards-details-img-paharagrph">Estimate ambulancee arrival time</p><br></br><br></br>
                </div>
       
           </div>
        </div>
    )
}


export default HospitalStaffDashBoaerd