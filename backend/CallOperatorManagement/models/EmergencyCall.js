// backend/models/EmergencyCall.js
const mongoose = require('mongoose');

const emergencyCallSchema = new mongoose.Schema({
  callerName: String,
  callerPhoneNumber: String,
  location: String,
  patientName: String,
  emergencyType: String,
  age: Number,
  patientDetails: String,
  vehicleAssigned: String,
  currentDetails: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyCall', emergencyCallSchema);