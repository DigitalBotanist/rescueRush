const User = require('../../shared/models/userModel')
const Vehicle = require('../models/vehicleModel')
const jwt = require('jsonwebtoken')


// create a jwt for admin
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '6h'})
}

const driverLogin = async(req, res) => {
    const { email, password} = req.body
    const vehicle = req.vehicle 

    try { 
        // check if the vehicle is offline or not 
        if (vehicle.status === 'active') {
            return res.status(403).json({error: "Vehicle is in active state"})
        }
        // driver login
        const user = await User.login(email, password)
        if (user.role !== 'admin' && user.role !== 'driver') {
            return res.status(403).json({error: "Permission denied"})
        }

        // assign driver to the vehicle
        await Vehicle.updateOne({vin: vehicle.vin}, {$set: { status: "active", driver: user._id}})

        // create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const driverLogout = async(req, res) => {
    const vehicle = req.vehicle
    const user = req.user

    if (!user._id.equals(vehicle.driver)) {
        return res.status(401).json({error: "not authorized"})
    }

    try{ 
       // assign driver to the vehicle
       await Vehicle.updateOne({vin: vehicle.vin}, {$set: { status: "offline", driver: null}}) 
       res.status(200).json({msg: "logout successful"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    driverLogin, 
    driverLogout 
}