import mongoose from "mongoose"

const resourceSchema = new mongoose.Schema ( {

    Medicalresources: {
        type : String,
        required : true,
    },

    medName: {
        type : String,
        required : true,
    },

    quantity: {
        type : Number,
        required : true,
        min : 200,
    },

    allocatedAmount: {
        type : Number,
        required : true,
    },

    remainingAmount: {
        type : Number,
        required : true,
    },

    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

resourceSchema.pre("save", function (next) {
    this.remainingAmount = this.quantity - this.allocatedAmount;
    next();
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource
