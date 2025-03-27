
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

import { requireAuth } from '../middleware/requireAuth.js';


//login route
router.post ('/login',loginUser)


//require auth for all routes
router.use(requireAuth)

//Get all details
router.get('/',getdetails)

//Get a single details
router.get('/:id',getdetailsbyid)

//Post details
router.post('/',createDetails)

//Delete details
router.delete('/:id',deleteDetails)

//Update details
router.patch('/:id',upadateDetails)





                        //DOCTOR DETAILS

//Doctor Details route
router.post('/doctor_details',createDoctotDetails)

//get doctor all details
router.get('/doctor_details',get_doctor_Details)

//delete doctor details
router.delete('/doctor_details/:id',deleteDoctorDetails)



 export default  router;









/*import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "hospital"})
})

export default router*/

