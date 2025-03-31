import { usePatientContext } from "../hooks/usePatientContext"
import PatientUpdateform from "../components/patientUpdateForm"
import SearchandDisplayHospitals from "./GetHospitals"
import { useAuthContext } from "../hooks/useAuthContext"

const ParamedicDashboard = () => {

    const {vin, patient, dispatch } = usePatientContext()
    const {user} =  useAuthContext()
    console.log("Patient in context:", patient);

    return (
        <div className="paramedicDashboard">
             <div >
                <h2>Paramedic name: {user.firstName} {user.lastName}</h2>
                <h2>Email: {user.email}</h2>
             </div>
            {patient ? (
                <div>
                <div className="patientUpdateform">
                    <PatientUpdateform />
                </div>
                <div className="SearchHospitals">
                    <SearchandDisplayHospitals />
                </div>
                </div>
            ) : (
                <p className="noPatientUpdate">No patient selected</p>
            )}
        </div>
    )
}

//
export default ParamedicDashboard