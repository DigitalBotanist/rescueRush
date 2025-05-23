import User from '../../shared/models/userModel.js'
import Vehicle from '../../VehicleManagement/models/vehicleModel.js'
import jwt from 'jsonwebtoken'


// create a jwt for Paramedic
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '6h'})
}


export const paramedicLogin = async(req,res) => { 

    const { email, password , vin} = req.body
    try{
        const user = await User.login(email,password) //function which validates the credentials and returns the found user object for DB
        const Token = createToken(user._id)

        //update vehicle duty in vehivle document
        await Vehicle.updateOne({vin:vin}, {$set: { paramedic: user._id}})

        //send login details to fleet 
        try{
            const response = await fetch(`http://localhost:${process.env.PORT}/api/fleet/paramedic_login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify({email, password , vin})
        });
        if(!response.ok)
        {
            console.log("Unsuccessful")
        }
        }catch (error) {
            console.error(error)
        }

        const safeUser = user.toObject()
        delete safeUser.password
        res.status(200).json({...safeUser,Token})

    }catch (err)
    {
        res.status(400).json({errror : err.message})
    }


}

export const paramedicLogout = async(req, res) => {
    const vehicle = req.vehicle
    const user = req.user

    if (!user._id.equals(vehicle.paramedic)) {
        return res.status(401).json({error: "not authorized"})
    }

    try{ 
       // clear duty of the paramedic
       await Vehicle.updateOne({vin: vehicle.vin}, {$set: { paramedic: null}}) 
       res.status(200).json({msg: "logout successful"})
       
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
