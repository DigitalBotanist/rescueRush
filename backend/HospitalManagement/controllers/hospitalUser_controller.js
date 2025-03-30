import userModel from '../../shared/models/userModel.js'
import jwt from 'jsonwebtoken'


const create_Token =(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3h'})
}
//login
export const loginUser = async( req, res )=>{
    const {email,password} =req.body

    try{
        const user=await userModel.login(email,password)

        //create new token
        const token =create_Token(user._id)

        const safeUser = user.toObject()
        delete safeUser.password

        res.status(200).json({...safeUser, token})

    }catch(error){
        res.status(400).json({error:error.message})
    }


   

   /* const {email,password} =req.body

    try{
        const user=await userModel.login(email,password)

        res.status(200).json({email,user})

    }catch(error){
        res.status(400).json({error:error.message})
    }
*/
    
}