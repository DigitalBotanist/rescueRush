import jwt from 'jsonwebtoken'
import  User  from '../models/userModel.js'

const requireAuth = async (req, res, next) => {
    // verify authenticaion 
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: "authorization token required"})
    }
    const token = authorization.split(' ')[1]
    console.log(token)
    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({ _id }).select('_id role')
        req.token = token
        next()

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export default requireAuth