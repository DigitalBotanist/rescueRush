
const express = require('express')

const requireAuth = require('../../shared/middleware/requireAuth')
const requireCreateEmergencyPermission = require('../middleware/requireCreateEmergencyPermission')
const {makeNewEmergency} = require('../controllers/emergency')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "fleet"})
})


router.post('/create_emergency', requireAuth, requireCreateEmergencyPermission, makeNewEmergency)

module.exports = router