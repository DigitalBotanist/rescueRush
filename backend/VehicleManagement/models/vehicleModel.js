import mongoose from 'mongoose'
import validator from 'validator'

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
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
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

// Ensure geospatial indexing
vehicleSchema.index({ location: "2dsphere" });

// static signup method
vehicleSchema.statics.registerVehicle = async function(vin, location, status="offline") {

    //validation
    if (!vin || !location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        throw Error('All field must be filled ')
    }
    const [longitude, latitude] = location.coordinates;
    if (isNaN(longitude) || isNaN(latitude)) {
        throw Error('Longitude and Latitude must be numeric');
    }

    // check for valide status 
    const statuses = ["working", "active", "offline", "broken"]
    if (!statuses.includes(status)) {
        throw Error("status type doesn't exitst")
    }

    // Ensure location is in GeoJSON format
    const geoLocation = {
        type: "Point", 
        coordinates: [longitude, latitude] 
    };

    // if vehicle exist update the status
    // if vehicle currently active throw an error 
    const exists = await this.findOne({ vin })
    if (exists && ["offline", "broken"].includes(exists.status)) {
        const vehicle = await this.updateOne(
            {vin}, 
            {$set: {status, location: geoLocation}}
        )
        return vehicle
    } else if ( exists && (exists.status === 'active' || exists.status === 'working')) {
        throw Error('vehicle is active with the current vin number')
    }

    // if vehicle doesn't exist create new vehicle 
    const vehicle = await this.create({ vin, location: geoLocation, status, driver: null})
    return vehicle
}


vehicleSchema.statics.getNearestVehicles = async function (longitude, latitude) {
    return await this.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "distance",
                spherical: true,
                key: "location"
            }
        },
        {
            $match: {
                status: "active"
            }
        }
    ]);
};


// vehicleSchema.statics.checkVehicle = async function(vin) {
//     if (!vin) {
//         throw Error('All field must be filled ')
//     }

//     const vehicle = await this.findOne({ vin })

//     return 
// }

export default mongoose.model("Vehicle", vehicleSchema)