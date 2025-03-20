import User from '../../shared/models/userModel.js'
import Vehicle from '../../VehicleManagement/models/vehicleModel.js'
import jwt from 'jsonwebtoken'


// create a jwt for admin
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '6h'})
}

export const driverLogin = async(req, res) => {
    const { email, password} = req.body
    const vehicle = req.vehicle 

    try { 
        // check if the vehicle is offline or not 
        if (vehicle.status === 'active') {
            return res.status(403).json({error: "Vehicle is in active state"})
        }

        // check if its a driver or admin 
        const user = await User.login(email, password)
        if (user.role !== 'admin' && user.role !== 'driver') {
            return res.status(403).json({error: "Permission denied"})
        }

        //check if another driver already assinged to vehicle 
        if (vehicle.driver != null || (vehicle.driver != null && vehicle.driver != user._id)) {
            return res.status(403).json({error: "Vehicle already has a driver"})
        }


        // assign driver to the vehicle
        await Vehicle.updateOne({vin: vehicle.vin}, {$set: { driver: user._id}})

        // create token
        const token = createToken(user._id)

        const safeUser = user.toObject()
        delete safeUser.password

        res.status(200).json({...safeUser, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const driverLogout = async(req, res) => {
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
