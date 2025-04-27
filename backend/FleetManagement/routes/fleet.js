
import { Router } from 'express'

import requireAuth from '../../shared/middleware/requireAuth.js'
import requireCreateEmergencyPermission from '../middleware/requireCreateEmergencyPermission.js'
import { handlePatientHospitalSelection, makeNewEmergency } from '../controllers/emergency.js'
import { paramedicLogin } from '../controllers/fleetController.js'
import requireParamedic from '../../shared/middleware/requireParamedic.js'
import requireVehicle from '../../VehicleManagement/middleware/requireVehicle.js'

const router = Router()

router.get('/', (req, res) => {
    res.json({messg: "fleet"})
})


// create a new emergency
router.post('/create_emergency', requireAuth, requireCreateEmergencyPermission, makeNewEmergency)

// when a paramedic logs into the patient management update the fleet management
router.post('/paramedic_login', requireAuth, requireParamedic, paramedicLogin)

// patient management system send a hospital details for a patient 
router.post('/patient_hospital', requireAuth, requireParamedic, requireVehicle, handlePatientHospitalSelection)

export default router