
const express = require('express')
const requireAuth = require('../../shared/middleware/requireAuth')
const requireAdmin = require('../middleware/requireAdmin')
const { createNewUser, adminLogin } = require('../controllers/admin')

const router = express.Router()

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


module.exports = router