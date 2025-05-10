
import { Router } from 'express'

const router = Router();
import {
    getdetails,
    createDetails,
    deleteDetails,
    upadateDetails,
    getdetailsbyid
} from '../controllers/hospitalController.js' 

import {
    get_doctor_Details,
    createDoctotDetails,
    deleteDoctorDetails
} from '../controllers/doctoreDetails.js' 

import { loginUser } from '../controllers/hospitalUser_controller.js';

import requireAuth from '../../shared/middleware/requireAuth.js'

import requireHospitalStaff from '../middleware/requireHospitalStaff.js';

import {getHospitalDetails} from '../controllers/getHospitalDetails.js'

import{
    get_hospital_patient_report,
    get_hospital_patient_reportBYId,
    createreport,
    deleteReport
}from '../controllers/hospital_patient_report.js'

import { sendRequestToDoctor } from '../sendRequestToDoctor.js';


//login route
router.post ('/login',loginUser)


//require auth for all routes
router.use(requireAuth)


router.use(requireHospitalStaff)



                        //DOCTOR DETAILS

//Doctor Details route
router.post('/doctor_details',createDoctotDetails)

//get doctor all details
router.get('/doctor_details',get_doctor_Details)

//delete doctor details
router.delete('/doctor_details/:id',deleteDoctorDetails)

//Request to Doctor
router.post('/request-doctor',sendRequestToDoctor)

                    //Hospital Patient Report

router.get('/hospitalRepoet',get_hospital_patient_report)
router.get('/hospitalRepoet/:id',get_hospital_patient_reportBYId)
router.post('/hospitalRepoet',createreport)
router.delete('/hospitalRepoet/:id',deleteReport)

                    

//Get all details
router.get('/',getdetails)

//Get a single details
router.get('/:id',getdetailsbyid)

//Post details
router.post('/',createDetails)

//Delete details
router.delete('/:id',deleteDetails)

//Update details
router.patch('/',upadateDetails)


//get the hospital details for user
router.post('/hospital_details',getHospitalDetails)




 export default  router;









/*import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "hospital"})
})

export default router*/

