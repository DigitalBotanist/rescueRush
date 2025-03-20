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

// returns vehicles id list orderby the distance to the give longitude and latitude 
vehicleSchema.statics.getNearestVehicleIds = async function (longitude, latitude) {
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
        }, 
        {
            $project: {_id: 1}
        }
    ]);
};

// update all vehicles status: offline and driver: null 
vehicleSchema.statics.setAllVehiclesOffline = async function () {
    const result = await this.updateMany({}, { status: "offline", driver: null });
    return result.modifiedCount; 
};

// update all vehicles status: offline and driver: null 
vehicleSchema.statics.setVehicleOffline = async function(_id) {
    const result = await this.updateOne({_id}, { status: "offline" });
    return result.modifiedCount; 
}

vehicleSchema.statics.updateLocation = async function(_id, location) {
    if (!_id) {
        throw Error('id must be included');
    }
    const [longitude, latitude] = location.coordinates;
    if (isNaN(longitude) || isNaN(latitude)) {
        throw Error('Longitude and Latitude must be numeric');
    }

    // Ensure location is in GeoJSON format
    const geoLocation = {
        type: "Point", 
        coordinates: [longitude, latitude] 
    };

    const updatedVehicle = await this.findByIdAndUpdate(
        _id, 
        {$set: { location: geoLocation }}, 
        { new: true} 
    )

    return updatedVehicle
} 


export default mongoose.model("Vehicle", vehicleSchema)