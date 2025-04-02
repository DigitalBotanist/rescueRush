import mongoose from "mongoose"

const Schema = mongoose.Schema

const doctorDetailsSchema = Schema({
    /*hospital_name:{
        type:String,
        required:true
    },*/
   
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
       
        type:String,
        required:true
        
    },
    hospital_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Hospital', 
        default: null,
    }
})

doctorDetailsSchema.statics.createNew = async function(fname,lname,special,time,hospital_id){

    //validation

    if( !fname || !lname || !special || !time || !hospital_id){
        throw Error ('All field must be fill');
    }

    return await this.create({ fname, lname, special, time,hospital_id });
}

export default mongoose.model("DoctorDetails", doctorDetailsSchema)