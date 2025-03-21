import {Router} from 'express'

//import controller
import {loginUser} from '../controllers/hospitalUser_controller.js'

const router = Router()

//login route
router.post ('/login',loginUser)


export default router