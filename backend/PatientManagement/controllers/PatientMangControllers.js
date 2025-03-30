import patientModel from "../../shared/models/patientModel.js";
import { SetPatientsDetails } from "../PatientSocket.js";

//receiving from fleet
const addOtherDetails = async(req,res) =>
{
    const {emergencyId , patient, paramedicID} = req.body;    
    SetPatientsDetails(paramedicID,patient)
     res.json(patient)
}

//updating parameters
const  updateDetails = async(req,res) =>
{
    const {id,pulse,bloodPressure,temperature,} = req.body
    
        if(isNaN(temperature) || NaN(pulse))
        {
            throw Error("Parameters must be numeric")
        }
    
    try {
        const updatePatient = await patientModel.findByIdAndUpdate(id, {
                $set: {
                    bloodPressure : bloodPressure,
                    pulse: pulse,
                    temperature:temperature
                }
        },{ new: true })
        
    } catch (error) {
        console.error(error)
    }

    res.json(updatePatient)
}

export { addOtherDetails, updateDetails };