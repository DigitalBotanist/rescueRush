const express = require('express')
const requireAuth = require('../../shared/middleware/requireAuth')
const requireMaintainer = require('../middleware/requireMaintainer')
const requireDriver = require('../middleware/requireDriver')
const requireVehicle = require('../middleware/requireVehicle')
const { maintainerLogin, registerVehicle } = require('../controllers/maintainer')
const { driverLogin, driverLogout } = require('../controllers/driver')

const router = express.Router()

// test
router.get('/', (req, res) => {
    return res.json({messg: "ambulance"})
})
router.post('/', (req, res) => {
    return res.json({messg: "ambulance"})
})

router.post('/maintainer_login', maintainerLogin)
router.post('/driver_login', requireVehicle, driverLogin)
router.post('/driver_logout', requireVehicle, requireAuth, requireDriver, driverLogout)

router.use(requireAuth)

router.post('/register_vehicle', requireMaintainer, registerVehicle)

router.use(requireDriver)

module.exports = router