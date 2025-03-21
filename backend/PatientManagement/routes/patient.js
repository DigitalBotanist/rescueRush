import { Router } from 'express'
import {addOtherDetails,updateDetails,id} from '../controllers/PatientMangControllers.js' 

const router = Router()

router.get('/', (req, res) => {
    res.json({messg: "patient"})
})

router.get('/api/PatientDetails/',addOtherDetails)

router.post('/api/PatientDetails/',updateDetails)


export default router
