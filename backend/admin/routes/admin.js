
import { Router } from 'express'
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireAdmin from '../middleware/requireAdmin.js'
import { createNewUser, adminLogin } from '../controllers/admin.js'

const router = Router()

// test
router.get('/', (req, res) => {
    res.json({messg: "admin"})
})

// admin login 
router.post('/login', adminLogin)

// check if admin is logged in 
router.use(requireAuth)
router.use(requireAdmin)

// admin functions
router.post('/create_user', createNewUser)


export default router