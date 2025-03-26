import mongoose from 'mongoose'
import DoctorDetails from '../models/doctorDetail_Models.js'

//get all the elemnets 

export const get_doctor_Details = async (req,res)=>{

    const getDoctordetails = await DoctorDetails.find({})

    res.status(200).json(getDoctordetails)
}


//Insert Detail

export const createDoctotDetails = async (req,res)=>{
    const {hospital_name,fname,lname,special,time} =req.body

    try{

        const doctorDetails = await DoctorDetails.createNew (hospital_name,fname,lname,special,time)
        res.status(200).json(doctorDetails)
    }catch(error){
        res.status(400).json(error)
    }
}

//delete details

export const deleteDoctorDetails = async(req,res)=>{

    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400).json({msg: "No details in db"})
    }

    const details = await DoctorDetails.findOneAndDelete({_id:id})

    if(!details){
        res.status(404).json({msg :"No details"})
    }

    res.status(200).json(details)

}