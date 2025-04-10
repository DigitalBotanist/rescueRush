import Patient from '../../shared/models/patientModel.js'
import Emergency from '../../shared/models/emergencyModel.js'
import Vehicle from '../../VehicleManagement/models/vehicleModel.js'

import FleetManager from '../FleetManager.js'



export const makeNewEmergency = async (req, res) => {
    const fleetManager = FleetManager.getInstance()
    // make a new emergency

    const user = req.user
    const { emergencyType, location, patients: patientsData, caller, details} = req.body

    // validate patient data 
    if (!patientsData) {
        return res.status(400).json({error: "Must include patient details"})
    }

    try {
        // add each patient data to the database 
        let patients = []
        for await (const data of patientsData) {
            const patient = await Patient.createNew(data.name, data.age, data.emergencyType, data.details)
            patients.push(patient._id)
        }
        
        // create a new emergency in the database 
        let emergency = await Emergency.createNew(caller, emergencyType, user._id, patients, location, details)
        emergency = await emergency.populate([
            { path: 'patients', model: 'Patient'},   
            { path: 'callOp', model: 'User', select: 'firstName lastName email' }         
        ]);

        await fleetManager.addEmergency(emergency)  // add to emergency to the fleetmanager
        res.status(200).json(emergency)
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

