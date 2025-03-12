const mongoose = require('mongoose')

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

module.exports = mongoose.model("Hospital", hospitalSchema)