import User from '../../shared/models/userModel.js'
import Vehicle from '../../VehicleManagement/models/vehicleModel.js'
import jwt from 'jsonwebtoken'

// create a jwt for admin
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '6h'})
}

export const maintainerLogin = async(req, res) => {
    const { email, password } = req.body

    try { 
        const user = await User.login(email, password)
        console.log(user.role)
        if (user.role !== 'admin' && user.role !== 'maintainer') {
            return res.status(403).json({error: "Permission denied"})
        }

        // create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const registerVehicle = async(req, res) => {
    const {vin, status, location} = req.body 

    try { 
        const vehicle = await Vehicle.registerVehicle(vin, location, status)

        res.status(200).json({msg: "vehicle is registered"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}
