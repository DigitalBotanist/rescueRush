import mongoose from 'mongoose'
import HospitalPatientDetailsReport from '../models/hospital_patient_report_Model.js';

export const get_hospital_patient_report = async(req,res)=>{
    try {
            const HospitalPatientDetails = await HospitalPatientDetailsReport.find({});
            console.log(HospitalPatientDetails)
            res.status(200).json(HospitalPatientDetails);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}

export const get_hospital_patient_reportBYId = async(req,res)=>{
        const userID =req.user._id;
        const{id}=req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({ ërror: "No such Report" });
        }

        const detail = await HospitalPatientDetailsReport.findById(id);

        if (!detail) {
            return res.status(400).json({ ërror: "No such Report" });
        }

        return res.status(200).json(detail);
}

export const createreport = async(req,res)=>{
    const{fname,lname,guardian,DoctorName,AmbulanceID,FirstAid,Disease,Symptoms}= req.body;
    try{
        const report = await HospitalPatientDetailsReport.createNew(fname,lname,guardian,DoctorName,AmbulanceID,FirstAid,Disease,Symptoms);
        res.status(200).json(report);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

export const deleteReport = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "No details in db" });
    }
  
    const details = await HospitalPatientDetailsReport.findOneAndDelete({ _id: id });
  
    if (!details) {
      return res.status(404).json({ msg: "No Reports" });
    }
  
    return res.status(200).json(details);
  };
  