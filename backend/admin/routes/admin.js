
import { Router,urlencoded,json } from 'express'
import requireAuth from '../../shared/middleware/requireAuth.js'
import upload from '../../shared/middleware/upload.js'
import requireAdmin from '../middleware/requireAdmin.js'
import { createNewUser, adminLogin, getUsers, deleteUser, updateUserPicture } from '../controllers/admin.js'

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

router.use(urlencoded({ extended: true }));
// admin functions
router.post('/create_user', upload.single("profileImage"), createNewUser)
router.post('/user/:userId/upload-image', upload.single("profileImage"), updateUserPicture)
router.use(json());

router.get('/users', getUsers)
router.delete("/user/:id", deleteUser)

export default router