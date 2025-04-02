import mongoose from "mongoose"

const resourceSchema = new mongoose.Schema ( {
    medId: {
        type: Number, 
        required: true
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
        default: 0
    },

    remainingAmount: {
        type : Number,
        default: null,
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
