const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema ({
    name : {
        type: String, 
        trim: true,
    },
    age: {
        type: Number,
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
})

// static signup method
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

    const patient = await this.create({ name, age, emergencyType, details })

    return patient
}

module.exports = mongoose.model("Patient", patientSchema)