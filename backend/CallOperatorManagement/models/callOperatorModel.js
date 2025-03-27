import mongoose from 'mongoose';

const callOperatorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "CallOperator" }
});

export default mongoose.model('CallOperator', callOperatorSchema);
