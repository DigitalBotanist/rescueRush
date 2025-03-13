
import { Router } from 'express'

import requireAuth from '../../shared/middleware/requireAuth.js'
import requireCreateEmergencyPermission from '../middleware/requireCreateEmergencyPermission.js'
import { makeNewEmergency } from '../controllers/emergency.js'

const router = Router()

router.get('/', (req, res) => {
    res.json({messg: "fleet"})
})


router.post('/create_emergency', requireAuth, requireCreateEmergencyPermission, makeNewEmergency)

export default router