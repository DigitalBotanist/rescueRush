import jwt from 'jsonwebtoken'
import User from '../../shared/models/userModel.js'

// create a jwt for admin
export const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '6h'})
}

// admin creates a new user
export const createNewUser = async(req, res) => {
    const {first, last, email, password, role} = req.body

    try {
        const user = await User.createNew(first, last, email, password, role) 

        res.status(200).json({msg: "new account is created", user})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// login as a admin
export const adminLogin = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        if (user.role !== 'admin') {
            return res.status(403).json({error: "Permission denied"})
        }
        // create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}