
import { Router } from 'express'

const router = Router();
import {
    getdetails,
    createDetails,
    deleteDetails,
    upadateDetails
} from '../controllers/hospitalController.js' 
import { loginUser } from '../controllers/hospitalUser_controller.js';


//Get all details
router.get('/',getdetails)

//Get a single details
router.get('/:id',(req,res)=>{
    res.json({mssg:"Get a single workouts"})
})

//Post details
router.post('/',createDetails)

//Delete details
router.delete('/:id',deleteDetails)

//Update details
router.patch('/:id',upadateDetails)

//login route
router.post ('/login',loginUser)


 export default  router;









/*import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "hospital"})
})

export default router*/

