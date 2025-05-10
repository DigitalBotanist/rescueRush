import mongoose from "mongoose"

const Schema = mongoose.Schema

const hospital_patient_report = Schema({
    fname:{
        type:String,
       required:true,
   },
   lname:{
       type:String,
       required:true,
   },
   guardian:{
    type:String,
    required:true,
   },
   DoctorName:{
    type:String,
    required:true,
   },
   AmbulanceID:{
    type:String,
    required:true,
   },
   FirstAid:{
    type:String,
    required:true,
   },
   Disease :{
    type:String,
    required:true,
   },
   Symptoms:{
    type:String,
    required:true,
   }

})

hospital_patient_report.statics.createNew= async function (fname,lname,guardian,DoctorName,AmbulanceID,FirstAid,Disease,Symptoms) {
    if(!fname|| !lname|| !guardian|| !DoctorName|| !AmbulanceID|| !FirstAid|| !Disease|| !Symptoms){
        throw Error ('All field must be fill');
    }

     return await this.create({fname,lname,guardian,DoctorName,AmbulanceID,FirstAid,Disease,Symptoms})
}

export default mongoose.model("HospitalPatientDetailsReport",hospital_patient_report)