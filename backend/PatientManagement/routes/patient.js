
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "patient"})
})

module.exports = router