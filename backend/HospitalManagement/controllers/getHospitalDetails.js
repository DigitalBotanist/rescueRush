import mongoose from 'mongoose' 
import Hospitaldetails from '../../shared/models/hospitalModel.js'

//get details

export const getHospitalDetails= async (req,res)=>{

    const {id} = req.body


    try{
        //Get matching details from hospitalModel
        const hospitaldetails = await Hospitaldetails.findOne({user_id:id})


        res.status(200).json(hospitaldetails)
    }catch(error){
        res.status(400).json({ error: error.message });
    }
    
}