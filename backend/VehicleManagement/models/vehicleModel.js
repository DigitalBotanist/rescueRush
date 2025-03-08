const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const vehicleSchema = new Schema ({
    vin: {
        type: String, 
        required: true, 
        trim: true,
        lowercase: true,
        unique: true
    },
    location: {
        lat: {
            type: Number, 
        },
        long: {
            type: Number,
        }
    },
    status: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        enum: ["active", "offline", "broken"]
    }, 
    driver: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
})


// static signup method
vehicleSchema.statics.registerVehicle = async function(vin, location, status="offline") {

    //validation
    if (!vin || !location.long || !location.lat) {
        throw Error('All field must be filled ')
    }
    if (isNaN(location.long)) {
        throw Error('Longitude must be numeric')
    }
    if (isNaN(location.lat)) {
        throw Error('Latitude must be numeric')
    }

    // check for valide status 
    const statuses = ["active", "offline", "broken"]
    if (!statuses.includes(status)) {
        throw Error("status type doesn't exitst")
    }

    // if vehicle exist update the status
    // if vehilce currently active throw an error 
    const exists = await this.findOne({ vin })
    if (exists && ["offline", "broken"].includes(exists.status)) {
        const vehicle = this.updateOne({vin}, {$set: {status, location}})
        return vehicle
    } else if ( exists && exists.status === 'active') {
        throw Error('vehicle is active with the current vin number')
    }

    // if vehicle doesn't exist create new vehicle 
    const driver = undefined
    const vehicle = await this.create({ vin, location, status, driver: null})
    return vehicle
}

// vehicleSchema.statics.checkVehicle = async function(vin) {
//     if (!vin) {
//         throw Error('All field must be filled ')
//     }

//     const vehicle = await this.findOne({ vin })

//     return 
// }

module.exports = mongoose.model("Vehicle", vehicleSchema)