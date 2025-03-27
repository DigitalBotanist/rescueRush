// backend/controllers/emergencyCallController.js
const EmergencyCall = require('../models/EmergencyCall');

// Create a new emergency call
exports.createEmergencyCall = async (req, res) => {
  try {
    const newCall = new EmergencyCall(req.body);
    await newCall.save();
    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all emergency calls
exports.getEmergencyCalls = async (req, res) => {
  try {
    const calls = await EmergencyCall.find();
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an emergency call
exports.updateEmergencyCall = async (req, res) => {
  try {
    const call = await EmergencyCall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an emergency call
exports.deleteEmergencyCall = async (req, res) => {
  try {
    await EmergencyCall.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Emergency call deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};