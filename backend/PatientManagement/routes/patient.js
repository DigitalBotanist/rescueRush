import { Router } from 'express'
import {addOtherDetails,updateDetails} from '../controllers/PatientMangControllers.js' 

const router = Router()

router.get('/', (req, res) => {
    res.json({messg: "patient"})
})

router.post('/new_patient/',addOtherDetails)

router.post('/patientDetails/',updateDetails)


export default router
