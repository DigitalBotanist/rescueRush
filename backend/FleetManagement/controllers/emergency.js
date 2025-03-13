const Patient = require('../../shared/models/patientModel')
const Emergency = require('../../shared/models/emergencyModel')
const Vehicle = require('../../VehicleManagement/models/vehicleModel')

const makeNewEmergency = async (req, res) => {
    // make a new emergency

    const user = req.user
    const { emergencyType, location, patients: patientsData, caller} = req.body

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
        let emergency = await Emergency.createNew(caller, emergencyType, user._id, patients, location)
        emergency = await emergency.populate([
            { path: 'patients', model: 'Patient', select: 'name age emergencyType details'},   
            { path: 'callOp', model: 'User', select: 'firstName lastName email' }         
        ]);

        // send request to nearest vehicle
        const lat = emergency.location.coordinates[1];
        const lng = emergency.location.coordinates[0];
        const vehicleList = await Vehicle.getNearestVehicles(lng, lat) 

        if (!vehicleList) {
            // if there are no active vehilces send error message 
            return res.status(200).json({message: "No active vehicles"})
        }

        for (const vehicle of vehicleList.slice(0, 5)) {
            sendEmergencyRequest(vehicle._id, emergency)

             
        }

        res.status(200).json(emergency)
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}


module.exports = {
    makeNewEmergency, 
}