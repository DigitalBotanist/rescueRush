import mongoose from "mongoose"
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({

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

    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },

    paramedic: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    }

})

const Schedule = mongoose.model('Schedule', ScheduleSchema);

export default Schedule