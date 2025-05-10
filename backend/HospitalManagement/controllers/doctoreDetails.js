import mongoose from 'mongoose'
import DoctorDetails from '../models/doctorDetail_Models.js'

//get all the elemnets 

export const get_doctor_Details = async (req, res) => {
    try {
        const doctorDetails = await DoctorDetails.find({});
        console.log(doctorDetails)
        res.status(200).json(doctorDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get detail by userID
export const get_doctor_detailsById=async (req,res)=>{
    const User_id = req.user._id;
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ ërror: "No such doctordetail" });
        }
    
        const detail = await Hospital.findById(id);
    
        if (!detail) {
            return res.status(400).json({ ërror: "No such doctordetail" });
        }
    
        return res.status(200).json(detail);
}


//Insert Detail

export const createDoctotDetails = async (req,res)=>{
    const {fname,lname,special,email,time,hospital_id} =req.body
    console.log(fname)
    console.log(fname,lname,special,email,time,hospital_id)

    try{

        const doctorDetails = await DoctorDetails.createNew(fname,lname,special,email,time,hospital_id)
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