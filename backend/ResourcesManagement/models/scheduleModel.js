import mongoose from "mongoose"
const Schema = mongoose.Schema

const scheduleSchema = new Schema({

    date:  {
        type : Date,
        required : true,
    },

    shift : {
        type : String,
        required : true,
        enum:  ['day', 'night']
    },

    location : {
        type : String,
        required : true,
        enum : ['kandy', 'galle', 'trinco', 'matara']
    },

    vehicle: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Vehicle'
    },

    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    }]

})

const schedule = mongoose.model('schedule', scheduleSchema);

export default schedule
