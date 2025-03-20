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
        require:true,
        default: 0
    },
    special_facilities: {
        type:Boolean,
        require:true,
        default: false
    }
},{timestamps:true})


hospitalSchema.statics.createNew = async function(location,name,Bed,special_facilities){
    // validation
    if(!location|| !name|| !Bed|| !special_facilities){
        throw Error ('All field must be fill');
    }

    //Check the data type of bed
    if(Number.isInteger(Bed)&& Bed>0){
        console.log("Valid data type")
    }else{
        console.log("Invalid data type")
    }

    //check the data type of special_facilities
    if (typeof special_facilities === 'boolean') {
        console.log("Valid data type");
    } else {
        console.log("Invalid data type");
    }
   
    const hospital = await this.create({location,name,Bed,special_facilities})
    return hospital
}

export default mongoose.model("Hospital", hospitalSchema)