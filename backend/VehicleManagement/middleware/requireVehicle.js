import Vehicle from "../models/vehicleModel.js"

// check if the logged user is an admin
const requireVehicle = async (req, res, next) => {
    const {vin} = req.body
    if (!vin) {
        return res.status(400).json({error: "vin is empty"})

    }

    try {
        const vehicle = await Vehicle.findOne({ vin })

        if (!vehicle) {
            return res.status(400).json({error: "vehicle is not registered"})
        } 

        req.vehicle = vehicle 
        next()
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export default requireVehicle