import { Router } from 'express'
import {addOtherDetails,updateDetails} from '../controllers/PatientMangControllers.js' 
import { paramedicLogin, paramedicLogout } from '../controllers/paramedic.js'
import requireVehicle from '../../VehicleManagement/middleware/requireVehicle.js'

const router = Router()


//login
router.post('/paramedic_login/',paramedicLogin)

//logout



//tasks
router.post('/new_patient/',addOtherDetails)
router.post('/patientDetails/',updateDetails)


export default router
