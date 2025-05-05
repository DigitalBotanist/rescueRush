import patientModel from "../../shared/models/patientModel.js";
import { SetPatientsDetails } from "../PatientSocket.js";

let Eid = null;

//receiving from fleet
const addOtherDetails = async(req,res) =>
{
    const {emergencyId , patient, paramedicID} = req.body;    
    SetPatientsDetails(paramedicID,patient)
    Eid = emergencyId;
     res.json(patient)
}

//updating parameters
const  updateDetails = async(req,res) =>
{
    const {id,pulse,bloodPressure,temperature,} = req.body
    
        if(isNaN(temperature) || isNaN(pulse))
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

        res.json(updatePatient)
        
    } catch (error) {
        console.error(error)
    }
    
}

//update patient hospital
const updatePatientHospital = async(req,res) =>
{
    const {Patientid , hospitalid,vin,Token,paramedicId} = req.body
    try {
        const updatedPatient= await patientModel.findByIdAndUpdate(Patientid, {
                $set: {
                    hospital: hospitalid
                }
        },{ new: true })

                //sending patient details to the driver
                console.log("Sent details to driver788788")
                try{
                    const response = await fetch(`http://localhost:${process.env.PORT}/api/fleet/patient_hospital`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Token}`,
                    },
                    body: JSON.stringify({Patientid,Eid,hospitalid,vin})
                });
                if(!response.ok)
                {
                    console.log("Unsuccessful")
                }
                }catch (error) {
                    console.error(error)
                }
                
                //sending patient details to the driver
                try{
                    const response = await fetch(`http://localhost:${process.env.PORT}/api/unknown`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Token}`,
                    },
                    body: JSON.stringify(paramedicId)
                });
                if(!response.ok)
                {
                    console.log("Could not send details to the selected hospital")
                }
                }catch (error) {
                    console.error(error)
                }

        res.json(updatedPatient)
        
    } catch (error) {
        console.error(error)
    }
}

export { addOtherDetails, updateDetails ,updatePatientHospital , Eid };