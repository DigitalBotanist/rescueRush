import mongoose from "mongoose"

const Schema = mongoose.Schema

const doctorDetailsSchema = Schema({
    hospital_name:{
        type:String,
        required:true
    },
   
    fname:{
         type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true,
    },
    
    special:{
        type:String,
        required:true,
    },

    time:{
       
        type:Number,
        required:true
        
    },

})

doctorDetailsSchema.statics.createNew = async function(hospital_name,fname,lname,special,time){

    //validation

    if(!hospital_name || !fname || !lname || !special || !time){
        throw Error ('All field must be fill');
    }

    const doctorDetails = await this.create({hospital_name,fname,lname,special,time})
    return doctorDetails
}

export default mongoose.model("DoctorDetails", doctorDetailsSchema)