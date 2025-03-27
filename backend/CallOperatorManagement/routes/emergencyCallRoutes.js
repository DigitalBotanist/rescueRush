// backend/routes/emergencyCallRoutes.js
const express = require('express');
const router = express.Router();
const { createEmergencyCall, getEmergencyCalls, updateEmergencyCall, deleteEmergencyCall } = require('../controllers/emergencyCallController');

router.post('/', createEmergencyCall);
router.get('/', getEmergencyCalls);
router.put('/:id', updateEmergencyCall);
router.delete('/:id', deleteEmergencyCall);

module.exports = router;