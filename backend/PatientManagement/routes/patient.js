import { Router } from 'express'
import {addOtherDetails,updateDetails} from '../controllers/PatientMangControllers.js' 
import { paramedicLogin, paramedicLogout } from '../controllers/paramedic.js'
import requireVehicle from '../../VehicleManagement/middleware/requireVehicle.js'
import { getHopsitals } from '../controllers/getHospitals.js'

const router = Router()


//login
router.post('/paramedic_login/',requireVehicle, paramedicLogin)

//logout



//tasks
router.post('/new_patient/',addOtherDetails)
router.post('/patientDetails/',updateDetails)
router.post('/suggestHospitals/',getHopsitals)

export default router
