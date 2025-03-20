import patientModel from "../../shared/models/patientModel";

let id = null

//getting the id using get
const addOtherDetails = async(req,res) =>
{
    const {emergencyId , patient} = req.body;

     const id = patient._id;

    res.json({id})
}

//updating parameters
const  updateDetails = async(req,res) =>
{
    const {id,pulse,bloodPressure,guardianContact,temperature,} = req.body

    if(isNaN(guardianContact) || guardianContact.length != 10)
        {
            throw Error("Guardian Contact must be numeric")
        }
    
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
        })
        
    } catch (error) {
        console.error(error)
    }

    res.json(updatePatient)
}

module.exports = {addOtherDetails,updateDetails,id};