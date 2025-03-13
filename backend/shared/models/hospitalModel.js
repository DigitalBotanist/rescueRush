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
    }
})

export default model("Hospital", hospitalSchema)