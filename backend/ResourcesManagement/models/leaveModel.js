import mongoose from "mongoose"
const Schema = mongoose.Schema

const leaveSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    email: { 
        type: String, 
        required: true 
    },

    type: 
    { type: String, 
      enum: ['Sick Leave', 'Short Leave', 'Other'], 
        required: true 
    }, 
    
    startDate: 
    { type: Date, 
        required: true 
    },

    endDate: { 
        type: Date, 
        required: true 
    },

    submittedAt: { 
        type: Date, 
        default: Date.now 
    },

    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
  });
  
  export default mongoose.model('leave', leaveSchema);

