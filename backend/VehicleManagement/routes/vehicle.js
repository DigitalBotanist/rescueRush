import { Router } from 'express'
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireMaintainer from '../middleware/requireMaintainer.js'
import requireDriver from '../middleware/requireDriver.js'
import requireVehicle from '../middleware/requireVehicle.js'
import { maintainerLogin, registerVehicle } from '../controllers/maintainer.js'
import { driverLogin, driverLogout } from '../controllers/driver.js'

const router = Router()

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

export default router