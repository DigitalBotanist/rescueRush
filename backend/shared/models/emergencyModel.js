import mongoose from "mongoose";

const Schema = mongoose.Schema

const emergencySchema = new Schema ({
    location: {
        type: {
            type: String,
            enum: ['Point'],  
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    emergencyType: {
        type: String, 
        required: true, 
        trim: true,
        enum: [
            "Heart Attack",
            "Stroke",
            "Severe Allergic Reaction (Anaphylaxis)",
            "Choking",
            "Unconsciousness",
            "Severe Bleeding",
            "Respiratory Distress",
            "Trauma",
            "Heat Stroke",
            "Seizures"
          ],
    },
    caller: {
        number: {
            type: Number, 
            required: true,
        }, 
        name: {
            type: String, 
        },
    },
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient', 
        required: true,
    }], 
    callOp: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    }, 
}, {timestamps: true})

emergencySchema.index({ location: "2dsphere" });

emergencySchema.statics.createNew = async function(caller, emergencyType, callOp, patients, location) {

    console.log(patients)
    //validation
    if (!callOp || !caller || !caller.number || !patients || !location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        throw Error('emergency All field must be filled ')
    }
    const [longitude, latitude] = location.coordinates;
    if (isNaN(longitude) || isNaN(latitude)) {
        throw Error('Longitude and Latitude must be numeric');
    }


    const types = [
        "Heart Attack",
            "Stroke",
            "Severe Allergic Reaction (Anaphylaxis)",
            "Choking",
            "Unconsciousness",
            "Severe Bleeding",
            "Respiratory Distress",
            "Trauma",
            "Heat Stroke",
            "Seizures"
    ] 
    if (!types.includes(emergencyType)) {
        throw Error("emergency type doesn't exitst")
    }


    // Ensure location is in GeoJSON format
    const geoLocation = {
        type: "Point", 
        coordinates: [longitude, latitude] 
    };


    // if vehicle doesn't exist create new vehicle 
    const emergency = await this.create({ location: geoLocation,  caller, patients, callOp, emergencyType})
    return emergency
}


export default mongoose.model("Emergency", emergencySchema)