import mongoose from "mongoose"


const Schema = mongoose.Schema

const hospitalSchema = new Schema ({
    location: {
        lat: {
            type: Number, 
            required: true, 
        },
        long: {
            type: Number,
            required: true, 
        }
    },
    name: {
        type: String, 
        required: true
    },
    Bed:{
        type:Number,
        required:true,
        default: 0
    },
    ICU: {
        type:Boolean,
        required: true,
        default: false
    },
    Emergency_Unit:{
        type:Boolean,
        required: true,
        default:false
    },
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        default:null
    }, 

},{timestamps:true})


hospitalSchema.statics.createNew = async function(location,name,Bed,ICU,Emergency_Unit,user_id){
    // validation
    if(!location|| !name|| !Bed|| !ICU || !Emergency_Unit || !user_id){
        throw Error ('All field must be fill');
    }

    //Check the data type of bed
    if(Number.isInteger(Bed)&& Bed>0){
        console.log("Valid data type")
    }else{
        console.log("Invalid data type")
    }

    //check the data type of ICU
    if (typeof ICU === 'boolean') {
        console.log("Valid data type");
    } else {
        console.log("Invalid data type");
    }

    //check the data type of Emergency_Unit
    if (typeof Emergency_Unit === 'boolean') {
        console.log("Valid data type");
    } else {
        console.log("Invalid data type");
    }
   
    const hospital = await this.create({location,name,Bed,ICU,Emergency_Unit,user_id})
    return hospital
}

export default mongoose.model("Hospital", hospitalSchema)