import mongoose from "mongoose"

const Schema = mongoose.Schema

const patientSchema = new Schema ({
    name : {
        type: String, 
        trim: true,
    },
    age: {
        type: Number,
    }, 
    status: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        enum: ["pending", "assigned", "picked", "onway", "done"],
        default: "pending"
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
    details: {
        type: String, 
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Vehicle'
    },
    hospital: {
        type: Schema.Types.ObjectId, 
        ref: 'Hospital', 
        default: null,
    },

    bloodPressure: {
        
          type: String,
          default: null
  
      },

    pulse: {
        
        type: Number,
        default: null
    },

    temperature: {
        
        type: Number,
        default: null
    },

    guardianContact:
    {
        type: Number,
        default: null,
    }
}, {timestamps: true})

// create a new patient method 
patientSchema.statics.createNew = async function(name, age, emergencyType, details=null) {

    //validation
    if (!name || !age || !emergencyType) {
        throw Error('All patient field must be filled ')
    }

    if (isNaN(age)) {
        throw Error('patient age must be numeric');
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
        throw Error("patient emergency type doesn't exitst")
    }

    const patient = await this.create({ name, age, emergencyType, details, status: "pending"})

    return patient
}

// update the vehicle id 
patientSchema.statics.updateVehicle = async function (patientId, vehicleId) {
    if (!patientId || !vehicleId) {
        throw Error("Patient ID and Vehicle ID are required");
    }

    // Update the vehicle ID field only
    const updatedPatient = await this.findByIdAndUpdate(
        patientId,
        { $set: { vehicle: vehicleId, status: "assigned" } }, 
        { new: true, runValidators: true } 
    );

    // Check if the patient exists
    if (!updatedPatient) {
        throw Error("Patient not found");
    }

    return updatedPatient;
};

patientSchema.statics.updateStatus = async function (patientId, status) {
    if (!patientId) {
        throw Error("Patient ID is required");
    }

    const updatedPatient = await this.findByIdAndUpdate(
        patientId,
        { $set: { status } }, 
        { new: true, runValidators: true } 
    );

    return updatedPatient
}

export default mongoose.model("Patient", patientSchema)